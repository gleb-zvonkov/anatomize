import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function QuizScreen() {
  const router = useRouter();
  const { region } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
    const [selected, setSelected] = useState<string | null>(null);
    
    type Region =
      | "back"
      | "thorax"
      | "abdomen"
      | "pelvis"
      | "perineum"
      | "head"
      | "neck"
      | "upperlimb"
      | "lowerlimb";

    const quizData: Record<
      Region,
      { text: string; options: string[]; answer: string }
    > = {
      back: {
        text: "Which structure protects the spinal cord?",
        options: ["Vertebral column", "Ribs", "Skull", "Scapula"],
        answer: "Vertebral column",
      },
      thorax: {
        text: "Which organ is responsible for gas exchange?",
        options: ["Heart", "Lungs", "Liver", "Stomach"],
        answer: "Lungs",
      },
      abdomen: {
        text: "Which organ produces bile?",
        options: ["Stomach", "Pancreas", "Liver", "Spleen"],
        answer: "Liver",
      },
      pelvis: {
        text: "Which bone forms part of the pelvic girdle?",
        options: ["Femur", "Ilium", "Tibia", "Sacrum"],
        answer: "Ilium",
      },
      perineum: {
        text: "The perineum is located between which two structures?",
        options: [
          "Anus and genitals",
          "Liver and stomach",
          "Heart and lungs",
          "Spine and ribs",
        ],
        answer: "Anus and genitals",
      },
      head: {
        text: "Which bone protects the brain?",
        options: ["Femur", "Humerus", "Skull", "Pelvis"],
        answer: "Skull",
      },
      neck: {
        text: "Which structure passes through the neck?",
        options: ["Spinal cord", "Femoral artery", "Pancreas", "Lungs"],
        answer: "Spinal cord",
      },
      upperlimb: {
        text: "Which bone is in the upper limb?",
        options: ["Femur", "Humerus", "Tibia", "Fibula"],
        answer: "Humerus",
      },
      lowerlimb: {
        text: "Which muscle is primarily used for walking?",
        options: [
          "Biceps brachii",
          "Quadriceps femoris",
          "Deltoid",
          "Trapezius",
        ],
        answer: "Quadriceps femoris",
      },
    };

    const question = quizData[(region as Region) || "back"] || {
      text: "No quiz available for this region.",
      options: [],
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
      {/* <Text style={styles.header}>{region} Quiz</Text> */}

      {/* Question */}
      <Text style={styles.question}>{question.text}</Text>

      {/* Options */}
      {question.options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.option, selected === opt && styles.selectedOption]}
          onPress={() => {
            setSelected(opt);
            if (opt === question.answer) {
              alert("✅ Correct!");
            } else {
              alert(`❌ Incorrect. The correct answer is ${question.answer}.`);
            }
          }}
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
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 30,
    textTransform: "capitalize",
  },
  question: {
    paddingTop: 20,
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
