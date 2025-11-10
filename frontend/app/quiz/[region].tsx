import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { quizData, Region } from "../../data/quiz_questions";

export default function QuizScreen() {
  const router = useRouter();
  const { region } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const questions = quizData[region as Region] || [];
  const [currentIndex, setCurrentIndex] = useState(
    questions.length > 0 ? Math.floor(Math.random() * questions.length) : 0
  );
  const [selected, setSelected] = useState<string | null>(null);

  const question = questions[currentIndex] || {
    text: "No quiz available for this region.",
    options: [],
    answer: "",
    explanation: "",
  };

  // fade animation value
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // fade in/out function
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = (onComplete: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onComplete();
      fadeIn();
    });
  };

  // helper to get next random question
  const getRandomIndex = () => {
    if (questions.length <= 1) return 0;
    let next = currentIndex;
    while (next === currentIndex) {
      next = Math.floor(Math.random() * questions.length);
    }
    return next;
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

      {/* Animated question block */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.question}>{question.text}</Text>

        {/* Options */}
        {question.options.map((opt) => {
          const isCorrect = opt === question.answer;
          const isSelected = selected === opt;

          let backgroundColor = "#f0f0f0";
          if (selected) {
            if (isCorrect) backgroundColor = "#4CAF50";
            else if (isSelected) backgroundColor = "#FF3B30";
          }

          return (
            <TouchableOpacity
              key={opt}
              style={[styles.option, { backgroundColor }]}
              disabled={!!selected}
              onPress={() => setSelected(opt)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected && isCorrect && { color: "#fff", fontWeight: "600" },
                  selected && isSelected && !isCorrect && { color: "#fff" },
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Explanation + Next */}
        {selected && (
          <>
            <Text style={styles.explanation}>
              {selected === question.answer
                ? `Correct. ${question.explanation}`
                : `Incorrect. ${question.explanation}`}
            </Text>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => {
                fadeOut(() => {
                  setSelected(null);
                  setCurrentIndex(getRandomIndex());
                });
              }}
            >
              <Text style={styles.nextText}>Next Question</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
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
  optionText: {
    fontSize: 18,
    color: "#000",
  },
  explanation: {
    marginTop: 20,
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  nextButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 25,
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
