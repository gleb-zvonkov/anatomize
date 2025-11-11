// SummaryScreen.tsx
// This screen displays the anatomical summary for a selected body region.
// It fetches the `region` parameter from the route.
// It retrieves the regions markdown-formatted text from `data/summaries`, and renders it inside a scrollable view.

import React from "react";
import { Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; //for routing
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context"; //safe area and insets so we dont overlap notch area
import Markdown from "react-native-markdown-display"; //renders text in markdown
import { summaries } from "../../data/summaries"; // the summaries we will print
import { Region } from "../../types"; //region types for typescript

export default function SummaryScreen() {
  const router = useRouter(); //router
  const insets = useSafeAreaInsets(); //contains space from the top notch
  const { region } = useLocalSearchParams(); //get the current region

  return (
    // Ensures content stays within safe screen boundaries (avoids notch or home indicator)
    <SafeAreaView style={styles.container}>
      {/* Back button — positioned using top inset so it sits below status bar */}
      <TouchableOpacity
        onPress={() => router.back()} // Navigate back to home screen
        style={[styles.backButton, { top: insets.top }]} //place it as high as possible but not in the notch area
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {/* Scrollable area for long text content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Renders markdown-formatted summary text*/}
        <Markdown style={{ body: { fontSize: 18 } }}>
          {summaries[region as Region] ?? "No summary available."}
        </Markdown>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    left: 20,
    zIndex: 10, // so its above everything
  },
  backArrow: { fontSize: 24 },
  content: {
    marginTop: 40, // space below back button
    paddingHorizontal: 20,
    alignItems: "flex-start", // left align
  },
  summary: {
    fontSize: 18,
    color: "#555",
    lineHeight: 24, //so theres space between lines
  },
});
