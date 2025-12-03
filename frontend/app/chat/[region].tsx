// ChatScreen.tsx
// This screen provides an interactive chat interface between the user and a GPT-powered anatomy tutor.
// It persists chat history per region, sends user input to the backend (`/chat` endpoint) for processing,
// and raises a local notification when new tutor replies arrive.

import React, { useState, useRef, useEffect, useCallback } from "react"; //hooks we will use
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  AppState,
  AppStateStatus,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; //for navigation
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context"; //so doesnt touch notch
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Region } from "../../types/types";
import { useAppState } from "../../context/AppStateContext";

const CHAT_STORAGE_PREFIX = "CHAT_HISTORY_";
const DEFAULT_API_PORT = process.env.EXPO_PUBLIC_API_PORT ?? "3000";

const getApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.expoGoConfig?.debuggerHost ??
    Constants.expoGoConfig?.hostUri;

  if (hostUri) {
    const withoutProtocol = hostUri.replace(/^(https?:\/\/|exp:\/\/)/, "");
    const host = withoutProtocol.split(":")[0];
    if (host) {
      return `http://${host}:${DEFAULT_API_PORT}`;
    }
  }

  if (Platform.OS === "android") {
    return `http://10.0.2.2:${DEFAULT_API_PORT}`;
  }

  return `http://localhost:${DEFAULT_API_PORT}`;
};

const API_BASE_URL = getApiBaseUrl(); // resolves to LAN IP while in Expo Go/dev client

export type Message = {
  type: "user" | "gpt";
  text: string;
};

export default function ChatScreen() {
  const router = useRouter(); //for navigation
  const insets = useSafeAreaInsets(); //for the back button
  const { region } = useLocalSearchParams(); //the current region
  const regionParam = Array.isArray(region) ? region[0] : region;
  const regionKey = (regionParam ?? "back") as Region;
  const storageKey = `${CHAT_STORAGE_PREFIX}${regionKey}`;
  const scrollViewRef = useRef<ScrollView>(null); //scroll view reference, so we can scroll as GPT responds
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingReplyRef = useRef<string | null>(null);
  const pendingRequestRef = useRef<{ message: string; region: Region } | null>(
    null
  );
  const retryOnResumeRef = useRef(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const [isSending, setIsSending] = useState(false); //flag for sending so user cant send multiple queries at once
  const [inputText, setInputText] = useState(""); //Tracks what the user is typing in the TextInput
  const [messages, setMessages] = useState<Message[]>([]); //Keeps a running list of all messages (both user and GPT)
  const messagesRef = useRef<Message[]>([]);
  const [inputHeight, setInputHeight] = useState(40); // dynamic height for textInput, so textInput expands as user types multi line
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const { state, dispatch } = useAppState();
  const notificationsEnabled = state.notificationsGranted;
  const isScreenActiveRef = useRef(true);
  const topContentPadding = 0;

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true }); //everyitme a message is added scroll to the end
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored && isMounted) {
          const parsed = JSON.parse(stored) as Message[];
          messagesRef.current = parsed;
          setMessages(parsed);
        } else if (isMounted) {
          const initial: Message[] = [
            {
              type: "gpt",
              text: `You're now chatting about the ${regionKey} region. Ask a question.`,
            },
          ];
          messagesRef.current = initial;
          setMessages(initial);
        }
      } catch (error) {
        console.warn("Failed to load chat history", error);
      } finally {
        if (isMounted) {
          setIsLoadingHistory(false);
        }
      }
    };

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [regionKey, storageKey]);

  useEffect(() => {
    if (isLoadingHistory) return;
    AsyncStorage.setItem(storageKey, JSON.stringify(messages)).catch((error) =>
      console.warn("Failed to persist chat history", error)
    );
  }, [messages, storageKey, isLoadingHistory]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const persistMessages = useCallback(
    async (nextMessages: Message[]) => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(nextMessages));
      } catch (error) {
        console.warn("Failed to persist chat history immediately", error);
      }
    },
    [storageKey]
  );

  const applyMessages = useCallback(
    (updater: (prev: Message[]) => Message[]) => {
      if (isScreenActiveRef.current) {
        setMessages((prev) => {
          const next = updater(prev);
          messagesRef.current = next;
          return next;
        });
      } else {
        const next = updater(messagesRef.current);
        messagesRef.current = next;
        persistMessages(next);
      }
    },
    [persistMessages]
  );

  const fetchReply = useCallback(
    async (prompt: string) => {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region: regionKey, inputText: prompt }),
      });
      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
      }
      const data = await response.json();
      return data.reply || "No reply received.";
    },
    [regionKey]
  );

  const sendNotification = useCallback(
    async (body: string, force = false) => {
      if (!notificationsEnabled) return;
      if (
        !force &&
        appStateRef.current === "active" &&
        isScreenActiveRef.current
      )
        return;
      const trimmed =
        body.length > 120 ? `${body.slice(0, 117).trimEnd()}…` : body;
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `New ${regionKey} tutor reply`,
            body: trimmed || "Your anatomy tutor replied.",
          },
          trigger: null,
        });
      } catch (error) {
        console.warn("Failed to schedule notification", error);
      }
    },
    [notificationsEnabled, regionKey]
  );

  const stopTypingInterval = useCallback(() => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  }, []);

  const finalizeReply = useCallback(
    (fullReply: string, forceNotify = false) => {
      stopTypingInterval();
      applyMessages((prev) => {
        if (!prev.length) return [{ type: "gpt", text: fullReply }];
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]?.type === "gpt") {
          updated[lastIndex] = { ...updated[lastIndex], text: fullReply };
        } else {
          updated.push({ type: "gpt", text: fullReply });
        }
        return updated;
      });
      pendingReplyRef.current = null;
      const shouldNotify =
        forceNotify ||
        !isScreenActiveRef.current ||
        appStateRef.current !== "active";
      if (shouldNotify) {
        sendNotification(fullReply, true);
      }
      if (isScreenActiveRef.current) {
        setIsSending(false);
      }
    },
    [applyMessages, sendNotification, stopTypingInterval]
  );

  const startTypewriter = useCallback(
    (reply: string) => {
      if (!isScreenActiveRef.current) {
        finalizeReply(reply, true);
        return;
      }
      pendingReplyRef.current = reply;
      applyMessages((prev) => [...prev, { type: "gpt", text: "" }]);
      const words = reply.split(" ");
      let index = 0;
      typingIntervalRef.current = setInterval(() => {
        applyMessages((prev) => {
          if (!prev.length) return prev;
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          const nextText = words
            .slice(0, Math.min(index + 1, words.length))
            .join(" ");
          updated[lastIndex] = { ...updated[lastIndex], text: nextText };
          return updated;
        });
        index += 1;
        if (index >= words.length) {
          finalizeReply(reply);
        }
      }, 50);
    },
    [applyMessages, finalizeReply]
  );

  const sendPendingRequest = useCallback(async () => {
    if (!pendingRequestRef.current) return;
    try {
      const reply = await fetchReply(pendingRequestRef.current.message);
      dispatch({ type: "INCREMENT_CHAT", region: regionKey });
      pendingRequestRef.current = null;
      stopTypingInterval();
      startTypewriter(reply);
      retryOnResumeRef.current = false;
    } catch (error) {
      console.error("Retry chat request failed:", error);
      if (appStateRef.current !== "active") {
        retryOnResumeRef.current = true;
        return;
      }
      stopTypingInterval();
      pendingRequestRef.current = null;
      applyMessages((prev) => [
        ...prev,
        { type: "gpt", text: "Error contacting backend." },
      ]);
      setIsSending(false);
    }
  }, [
    applyMessages,
    dispatch,
    fetchReply,
    regionKey,
    startTypewriter,
    stopTypingInterval,
  ]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      appStateRef.current = nextState;
      if (nextState === "active" && retryOnResumeRef.current) {
        sendPendingRequest();
      } else if (nextState !== "active" && pendingReplyRef.current) {
        finalizeReply(pendingReplyRef.current, true);
      }
    });
    return () => subscription.remove();
  }, [finalizeReply, sendPendingRequest]);

  useEffect(() => {
    return () => {
      isScreenActiveRef.current = false;
      stopTypingInterval();
      if (pendingReplyRef.current) {
        finalizeReply(pendingReplyRef.current, true);
      }
      if (pendingRequestRef.current) {
        retryOnResumeRef.current = true;
      }
    };
  }, [finalizeReply, stopTypingInterval]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      appStateRef.current = nextState;
      if (nextState !== "active" && pendingReplyRef.current) {
        finalizeReply(pendingReplyRef.current);
      }
    });
    return () => subscription.remove();
  }, [finalizeReply]);

  const handleSend = async () => {
    const message = inputText.trim(); //trim the input message
    if (!message || isSending || isLoadingHistory) return; //ensure valid input and not already sending

    setIsSending(true); //set the flag to true so we dont send multiple messages
    setInputText(""); //clear what the user has typed
    applyMessages((prev) => [...prev, { type: "user", text: message }]); //add the user message to the message list
    pendingRequestRef.current = { message, region: regionKey };

    try {
      const reply = await fetchReply(message);
      dispatch({ type: "INCREMENT_CHAT", region: regionKey });
      pendingRequestRef.current = null;
      stopTypingInterval();
      startTypewriter(reply);
    } catch (err) {
      console.error("Error fetching GPT reply:", err);
      if (appStateRef.current !== "active") {
        retryOnResumeRef.current = true;
        return;
      }
      stopTypingInterval();
      pendingReplyRef.current = null;
      pendingRequestRef.current = null;
      applyMessages((prev) => [
        ...prev,
        { type: "gpt", text: "Error contacting backend." },
      ]);
      setIsSending(false); //set flag to false so user can send a new message
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={insets.top}
      >
        {/* Back button at very top */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backButton, { top: insets.top }]}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Chat messages below the back button */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingTop: insets.top + 40 }, // space for back button
          ]}
          keyboardShouldPersistTaps="handled"
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {isLoadingHistory ? (
            <Text style={styles.loadingText}>Loading previous chats…</Text>
          ) : (
            messages.map((msg, index) => (
              <Text
                key={index}
                style={
                  msg.type === "user" ? styles.userMessage : styles.gptMessage
                }
              >
                {msg.text}
              </Text>
            ))
          )}
        </ScrollView>

        {/* Input row */}
        <View style={styles.inputContainer}>
          <View
            style={[styles.inputRow, { height: Math.max(50, inputHeight) }]}
          >
            <TextInput
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              onContentSizeChange={(e) =>
                setInputHeight(Math.min(e.nativeEvent.contentSize.height, 300))
              }
              style={styles.textInput}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (isSending || isLoadingHistory) && { opacity: 0.4 },
              ]}
              onPress={handleSend}
              disabled={isSending || isLoadingHistory}
            >
              <Text style={styles.sendText}>↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },

  backButton: {
    position: "absolute",
    left: 20,
    zIndex: 100,
  },

  backArrow: {
    fontSize: 28,
  },

  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },

  messagesContent: {
    paddingBottom: 30,
  },

  gptMessage: {
    fontSize: 18,
    color: "#444",
    textAlign: "left",
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "white",
    borderRadius: 16,
    alignSelf: "flex-start",
  },

  userMessage: {
    fontSize: 18,
    color: "#000",
    alignSelf: "flex-end",
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
  },

  loadingText: {
    fontSize: 16,
    color: "#888",
    alignSelf: "center",
    marginTop: 20,
  },

  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  textInput: {
    flex: 1,
    fontSize: 18,
    paddingHorizontal: 16,
  },

  sendButton: {
    backgroundColor: "#000",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  sendText: {
    color: "#fff",
    fontSize: 22,
  },
});
