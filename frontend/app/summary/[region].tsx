// SummaryScreen.tsx
// This screen displays the anatomical summary for a selected body region.
// It fetches the `region` parameter from the route.
// It retrieves the regions markdown-formatted text from `data/summaries`, and renders it inside a scrollable view.

import React, { useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; //for routing
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context"; //safe area and insets so we dont overlap notch area
import Markdown from "react-native-markdown-display"; //renders text in markdown
import { summaries } from "../../data/summaries"; // the summaries we will print
import { Region } from "../../types/types"; //region types for typescript
import { useAppState } from "../../context/AppStateContext";  //app state context for progress tracking

export default function SummaryScreen() {
  const router = useRouter(); //router
  const insets = useSafeAreaInsets(); //contains space from the top notch
  const { region } = useLocalSearchParams(); //get the current region
  const regionParam = Array.isArray(region) ? region[0] : region; //handle case where region param is an array
  const regionKey = (regionParam ?? "back") as Region; //default to back region if none provided
  const { dispatch, state } = useAppState(); //get app state and dispatch function
  const summaryComplete = state.progress[regionKey]?.summaryRead; //check if summary has been read for this region

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (summaryComplete) return; // If the user has already completed this summary, do nothing.
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent; // Extract scroll-related measurements from the event.
      const isAtBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - 40; // Check if the user has scrolled to the bottom:
      if (isAtBottom) {
        // If the user reached the bottom, mark this region’s summary as “read”.
        dispatch({ type: "MARK_SUMMARY_READ", region: regionKey });
      }
    },
    // Recreate the function only when dispatch, regionKey, or summaryComplete changes
    [dispatch, regionKey, summaryComplete]
  );

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
      <ScrollView
        contentContainerStyle={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Renders markdown-formatted summary text*/}
        <Markdown style={{ body: { fontSize: 18 } }}>
          {summaries[regionKey] ?? "No summary available."}
        </Markdown>
        {summaryComplete && (
          <Text style={styles.completionText}>Summary completed ✓</Text>
        )}
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
  completionText: {
    marginTop: 20,
    fontSize: 16,
    color: "#2d8a34",
    fontWeight: "600",
  },
});
