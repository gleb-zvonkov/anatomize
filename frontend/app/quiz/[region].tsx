import React, { useState, useRef, useEffect, useCallback } from "react";
import ConfettiCannon from "react-native-confetti-cannon";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { quizData } from "../../data/quiz_questions";
import { Region } from "../../types/types";
import { useAppState } from "../../context/AppStateContext";

// Backend fetch
async function fetchBackendQuiz(region: string) {
  try {
    const res = await fetch("http://localhost:3000/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ region }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    console.log("Fetched quiz question:", data);
    return data;
  } catch {
    return null;
  }
}

// Local fallback random question
function getRandomLocalQuestion(questions: any[]) {
  const idx = Math.floor(Math.random() * questions.length);
  console.log("Using local question", idx);
  console.log("Question length", questions.length);
  return questions[idx];
}

export default function QuizScreen() {
  const router = useRouter();
  const { region } = useLocalSearchParams();
  const regionParam = Array.isArray(region) ? region[0] : region;
  const regionKey = (regionParam ?? "back") as Region;

  const insets = useSafeAreaInsets();
  const questions = quizData[regionKey] || [];

  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [nextQuestion, setNextQuestion] = useState<any>(null); // ← NEW
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const { state, dispatch } = useAppState();
  const regionProgress = state.progress[regionKey];

  const fadeAnim = useRef(new Animated.Value(1)).current;

  // ----------------------------------------------------
  // 1. Load initial question AND preload the next one
  // ----------------------------------------------------
  useEffect(() => {
    let isActive = true;

    async function load() {
      const firstQ =
        (await fetchBackendQuiz(regionKey)) ??
        getRandomLocalQuestion(questions);

      if (!isActive) return;
      setCurrentQuestion(firstQ);

      const preload =
        (await fetchBackendQuiz(regionKey)) ??
        getRandomLocalQuestion(questions);

      if (!isActive) return;
      setNextQuestion(preload);
    }

    load();
    return () => {
      isActive = false;
    };
  }, [regionKey, questions]);

  // ----------------------------------------------------
  // Fade helpers
  // ----------------------------------------------------
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = (onComplete: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      onComplete();
      fadeIn();
    });
  };

  // ----------------------------------------------------
  // 2. Next question logic with PRELOADING
  // ----------------------------------------------------
  const advanceQuestion = useCallback(async () => {
    if (!nextQuestion) return;

    // Use preloaded next question immediately
    setCurrentQuestion(nextQuestion);

    // Clear selection
    setSelectedAnswer(null);

    // Start preloading the FOLLOWING question
    const preload =
      (await fetchBackendQuiz(regionKey)) ?? getRandomLocalQuestion(questions);

    setNextQuestion(preload);
  }, [nextQuestion, questions, regionKey]);

  //confetti effect when quiz is mastered
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (regionProgress?.quizComplete) {
      // Trigger confetti without interfering with question render cycle
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 1500);
      return () => clearTimeout(t);
    }
  }, [regionProgress?.quizComplete]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backButton, { top: insets.top }]}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {/* Question block, fade it in  */}
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Display the current quiz question */}
        <Text style={styles.question}>{currentQuestion?.text}</Text>

        {/* Render each answer option as a selectable button */}
        {currentQuestion?.options.map((opt: string) => {
          const isCorrect = opt === currentQuestion.answer; // check if this option is the correct answer
          const isSelected = selectedAnswer === opt; //check if user selected it

          let backgroundColor = "#f0f0f0"; // Default background color for unselected options
          if (selectedAnswer) {
            if (isCorrect) backgroundColor = "#4CAF50"; // green for correct
            else if (isSelected) backgroundColor = "#FF3B30"; // red for incorrect
          }

          return (
            //return one answer option button
            <TouchableOpacity
              key={opt}
              style={[styles.option, { backgroundColor }]} //unique background colour
              disabled={!!selectedAnswer} //disable input after selection
              onPress={() => {
                setSelectedAnswer(opt); //select the option
                if (!selectedAnswer && isCorrect) {
                  dispatch({
                    type: "INCREMENT_QUIZ_CORRECT",
                    region: regionKey,
                    questionId: currentQuestion.text,
                  });
                }
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  // Make text white and bold if correct answer
                  selectedAnswer &&
                    isCorrect && { color: "#fff", fontWeight: "600" },
                  // Make text white if wrong selection
                  selectedAnswer &&
                    isSelected &&
                    !isCorrect && { color: "#fff" },
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Once an answer is selected show the explanation */}
        {selectedAnswer && (
          <>
            {/* Show feedback text, "Correct" or "Incorrect" plus explanation */}
            <Text style={styles.explanation}>
              {selectedAnswer === currentQuestion.answer
                ? `Correct. ${currentQuestion.explanation} Current score: ${
                    regionProgress?.quizCorrectCount ?? 0
                  }/3.`
                : `Incorrect. ${currentQuestion.explanation} Current score: ${
                    regionProgress?.quizCorrectCount ?? 0
                  }/3.`}
            </Text>

            {/* Button to load a new random question */}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => {
                fadeOut(() => {
                  setSelectedAnswer(null);
                  advanceQuestion();
                });
              }}
            >
              <Text style={styles.nextText}>Next Question</Text>
            </TouchableOpacity>
          </>
        )}
        {selectedAnswer && (
          <View style={styles.progressRow}>
            {regionProgress?.quizComplete && (
              <Text style={styles.progressComplete}>Quiz mastered ✓</Text>
            )}
          </View>
        )}
      </Animated.View>

      {showConfetti && (
        <ConfettiCannon
          count={100}
          origin={{ x: 200, y: -10 }}
          fadeOut={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20, //padding from left and righ
    paddingTop: 30, // more balanced spacing from top
  },

  backButton: {
    position: "absolute",
    left: 20,
    zIndex: 10, // keep it above other components
  },

  backArrow: {
    fontSize: 26,
    color: "#000",
  },

  question: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
    marginBottom: 20,
    marginTop: 10,
    lineHeight: 26,
  },

  option: {
    //each answer option
    backgroundColor: "#f0f0f0",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginVertical: 8, //so there is space between them
  },

  optionText: {
    fontSize: 18,
    color: "#000",
  },

  explanation: {
    marginTop: 20,
    fontSize: 16,
    color: "#444",
    lineHeight: 22, // so its spaced out
  },

  nextButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25, //circular
    alignSelf: "center",
    marginTop: 28,
  },

  nextText: {
    //"Next Question"
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  progressRow: {
    marginTop: 16,
    alignItems: "center",
  },
  progressText: {
    fontSize: 16,
    color: "#333",
  },
  progressComplete: {
    marginTop: 4,
    fontSize: 16,
    color: "#2d8a34",
    fontWeight: "600",
  },
});
