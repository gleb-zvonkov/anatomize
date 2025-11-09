import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Anatomy Regions" }} />
      <Stack.Screen name="chat" options={{ title: "Chat" }} />
      <Stack.Screen name="summary" options={{ title: "Summary" }} />
      <Stack.Screen name="quiz" options={{ title: "Quiz" }} />
    </Stack>
  );
}
