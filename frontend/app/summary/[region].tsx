import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { summaries } from "../../data/summaries";
import Markdown from "react-native-markdown-display";

export default function SummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { region } = useLocalSearchParams();

  const labels: Record<string, string> = {
    back: "Back",
    thorax: "Thorax",
    abdomen: "Abdomen",
    pelvis: "Pelvis",
    perineum: "Perineum",
    upperLimb: "Upper Limb",
    lowerLimb: "Lower Limb",
    neck: "Neck",
    head: "Head",
  };


  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backButton, { top: insets.top }]}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        {/* <Text style={styles.title}>
          {labels[region as string] || "Unknown Region"}
        </Text> */}

        <Markdown
          style={{ body: { fontSize: 18 } }}
        >
          {summaries[region as string] || "No summary available."}
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
    zIndex: 10,
  },
  backArrow: { fontSize: 24 },
  content: {
    marginTop: 40, // space below back button
    paddingHorizontal: 20,
    alignItems: "flex-start", // left align
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 10,
  },
  summary: {
    fontSize: 18,
    color: "#555",
    lineHeight: 24,
  },
});
