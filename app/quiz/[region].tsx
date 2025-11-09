import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function QuizScreen() {
  const router = useRouter();
  const { region } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | null>(null);

  const question = {
    text: "Which organ is primarily responsible for pumping blood through the body?",
    options: ["Lungs", "Heart", "Liver", "Kidneys"],
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backButton, { top: insets.top }]}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>{region} Quiz</Text>

      {/* Question */}
      <Text style={styles.question}>{question.text}</Text>

      {/* Options */}
      {question.options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.option, selected === opt && styles.selectedOption]}
          onPress={() => setSelected(opt)}
        >
          <Text
            style={[styles.optionText, selected === opt && styles.selectedText]}
          >
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  backButton: { position: "absolute", left: 20, zIndex: 10 },
  backArrow: { fontSize: 24 },
    header: {
      paddingTop:20,
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 30,
    textTransform: "capitalize",
  },
  question: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 20,
  },
  option: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 6,
  },
  selectedOption: {
    backgroundColor: "#007AFF",
  },
  optionText: {
    fontSize: 18,
    color: "#000",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "600",
  },
});
