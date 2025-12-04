// Utility for determining the correct backend API URL in all environments.
// Order of resolution:
// 1. If a production API URL is explicitly provided, use it.
// 2. Otherwise try to infer the LAN IP from Expo runtime metadata (best for real devices).
// 3. On Android emulators, use 10.0.2.2 to reach the host machine.
// 4. Fallback to localhost for iOS simulator or web.
// This ensures the frontend always talks to the correct backend regardless of platform.

import { Platform } from "react-native";
import Constants from "expo-constants";

const DEFAULT_API_PORT = process.env.EXPO_PUBLIC_API_PORT ?? "3000";

export const getApiBaseUrl = () => {
  // Priority 1 — explicit production URL
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Priority 2 — detect Expo LAN host
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.expoGoConfig?.debuggerHost ??
    Constants.expoGoConfig?.hostUri;

  if (hostUri) {
    const withoutProtocol = hostUri.replace(/^(https?:\/\/|exp:\/\/)/, "");
    const host = withoutProtocol.split(":")[0];
    return `http://${host}:${DEFAULT_API_PORT}`;
  }

  // Priority 3 — Android special behaviour
  if (Platform.OS === "android") {
    return `http://10.0.2.2:${DEFAULT_API_PORT}`;
  }

  // Priority 4 — iOS simulator or web
  return `http://localhost:${DEFAULT_API_PORT}`;
};

export const API_BASE_URL = getApiBaseUrl();
