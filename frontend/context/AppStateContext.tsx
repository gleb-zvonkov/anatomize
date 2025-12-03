import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  ReactNode,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Region } from "../types/types";
import { ALL_REGIONS } from "../constants/regions";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const STORAGE_KEY = "ANATOMIZE_APP_STATE_V1";
const QUIZ_TARGET = 3;
const CHAT_TARGET = 3;

export type RegionProgress = {
  summaryRead: boolean;
  quizCorrectCount: number;
  quizComplete: boolean;
  correctQuestionIds: string[];
  chatCount: number;
  chatComplete: boolean;
};

export type AppState = {
  notificationsGranted: boolean;
  progress: Record<Region, RegionProgress>;
};

type Action =
  | { type: "HYDRATE"; payload: AppState }
  | { type: "MARK_SUMMARY_READ"; region: Region }
  | { type: "RESET_SUMMARY"; region: Region }
  | { type: "INCREMENT_QUIZ_CORRECT"; region: Region; questionId: string }
  | { type: "RESET_QUIZ"; region: Region }
  | { type: "INCREMENT_CHAT"; region: Region }
  | { type: "SET_NOTIFICATIONS_GRANTED"; value: boolean };

const createDefaultProgress = (): Record<Region, RegionProgress> => {
  return ALL_REGIONS.reduce((acc, region) => {
    acc[region] = {
      summaryRead: false,
      quizCorrectCount: 0,
      quizComplete: false,
      correctQuestionIds: [],
      chatCount: 0,
      chatComplete: false,
    };
    return acc;
  }, {} as Record<Region, RegionProgress>);
};

const initialState: AppState = {
  notificationsGranted: false,
  progress: createDefaultProgress(),
};

const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  isHydrated: boolean;
} | null>(null);

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "HYDRATE": {
      const mergedProgress = createDefaultProgress();
      const incomingProgress = action.payload.progress || {};
      ALL_REGIONS.forEach((region) => {
        if (incomingProgress[region]) {
          mergedProgress[region] = {
            ...mergedProgress[region],
            ...incomingProgress[region],
          };
        }
      });
      return {
        ...state,
        ...action.payload,
        progress: mergedProgress,
      };
    }
    case "MARK_SUMMARY_READ": {
      const current = state.progress[action.region];
      if (current.summaryRead) return state;
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.region]: { ...current, summaryRead: true },
        },
      };
    }
    case "RESET_SUMMARY": {
      const current = state.progress[action.region];
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.region]: { ...current, summaryRead: false },
        },
      };
    }
    case "INCREMENT_QUIZ_CORRECT": {
      const prev = state.progress[action.region].quizCorrectCount;

      const newCount = prev + 1;

      return {
        ...state,
        progress: {
          ...state.progress,
          [action.region]: {
            ...state.progress[action.region],
            quizCorrectCount: newCount,
            quizComplete: newCount >= 3, // FIX: compute using newCount
          },
        },
      };
    }
    case "INCREMENT_CHAT": {
      const current = state.progress[action.region];
      if (current.chatComplete) return state;
      const nextCount = Math.min(current.chatCount + 1, CHAT_TARGET);
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.region]: {
            ...current,
            chatCount: nextCount,
            chatComplete: nextCount >= CHAT_TARGET,
          },
        },
      };
    }
    case "RESET_QUIZ": {
      const current = state.progress[action.region];
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.region]: {
            ...current,
            quizCorrectCount: 0,
            quizComplete: false,
            correctQuestionIds: [],
          },
        },
      };
    }
    case "SET_NOTIFICATIONS_GRANTED": {
      if (state.notificationsGranted === action.value) return state;
      return {
        ...state,
        notificationsGranted: action.value,
      };
    }
    default:
      return state;
  }
};

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as AppState;
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      } catch (error) {
        console.warn("Failed to load saved progress", error);
      } finally {
        setIsHydrated(true);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((error) =>
      console.warn("Failed to persist app state", error)
    );
  }, [state, isHydrated]);

  useEffect(() => {
    const configureNotifications = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }

      const permissions = await Notifications.getPermissionsAsync();
      let granted = permissions.granted;
      if (!granted) {
        const request = await Notifications.requestPermissionsAsync();
        granted = request.granted;
      }
      dispatch({ type: "SET_NOTIFICATIONS_GRANTED", value: granted });
    };

    configureNotifications();
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      isHydrated,
    }),
    [state, isHydrated]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
};
