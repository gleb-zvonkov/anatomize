// RootLayout component for Expo Router navigation
// Dynamic segments like [region] allow region-specific routes (e.g., /chat/thorax).
// The header is hidden globally, headerShown: false
import React from "react";
import { Stack } from "expo-router";
import { AppStateProvider } from "../context/AppStateContext";

export default function RootLayout() {
  return (
    <AppStateProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="chat/[region]" />
        <Stack.Screen name="summary/[region]" />
        <Stack.Screen name="quiz/[region]" />
      </Stack>
    </AppStateProvider>
  );
}
