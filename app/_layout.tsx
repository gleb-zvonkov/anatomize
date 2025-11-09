import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="chat/[region]" />
      <Stack.Screen name="summary/[region]" />
      <Stack.Screen name="quiz/[region]" />
    </Stack>
  );
}
