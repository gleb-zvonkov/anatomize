import React, { useState, useRef, useEffect, useCallback } from "react";
import ConfettiCannon from "react-native-confetti-cannon";   //confetti effect for mastery of quiz
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";  //for back button and getting region param
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";  //so we dont overlap notch area
import { quizData } from "../../data/quiz_questions";   //get data questions
import { Region } from "../../types/types";   //region types for typescript
import { useAppState } from "../../context/AppStateContext";  //access global app state
import { API_BASE_URL } from "../../utils/api";   // resolved backend URL

// Fetch quiz question from backend
async function fetchBackendQuiz(region: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/quiz`, {
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

// Fetch a random question from the local quiz data
function getRandomLocalQuestion(questions: any[]) {
  const idx = Math.floor(Math.random() * questions.length);
  return questions[idx];
}

// Main QuizScreen component
export default function QuizScreen() {
  const router = useRouter(); //for back button
  const { region } = useLocalSearchParams(); //get the current region
  const insets = useSafeAreaInsets(); //contains space from the top notch

  const regionParam = Array.isArray(region) ? region[0] : region; //becauase params can be arrays
  const regionKey = (regionParam ?? "back") as Region; //default to back region if none provided
  const questions = quizData[regionKey] || []; //get local questions for this region

  const [currentQuestion, setCurrentQuestion] = useState<any>(null); // Current quiz question being displayed
  const [nextQuestion, setNextQuestion] = useState<any>(null); // Preloaded next quiz question
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null); // User's selected answer

  const { state, dispatch } = useAppState(); //acceess global state, and add to it using dispatch
  const regionProgress = state.progress[regionKey]; //progress for this region, an example below
  /*
  progress: {
    back: {
      summaryRead: false,
      quizCorrectCount: 0,
      quizComplete: false,
      correctQuestionIds: [],
      chatCount: 0,
      chatComplete: false
    },
    ... 
  } 
  */

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [showConfetti, setShowConfetti] = useState(false); //use state for confeeti

  /***Load initial question AND preload the next one***/
  useEffect(() => {
    let isActive = true; //state flag to prevent state updates after unmouting

    async function load() {
      //async function to load questions
      const firstQ =
        (await fetchBackendQuiz(regionKey)) ??
        getRandomLocalQuestion(questions); //try fetch from backend, else get local function

      //we will check unmounted state after each async operation
      if (!isActive) return; //prevent state updates if component unmounted
      setCurrentQuestion(firstQ);

      const preload =
        (await fetchBackendQuiz(regionKey)) ??
        getRandomLocalQuestion(questions); //preload next question

      //we will check unmounted state after each async operation
      if (!isActive) return; //only update state if still mounted
      setNextQuestion(preload);
    }

    load(); //execute the async loader on mount or dependency change.
    return () => {
      //When the component unmounts, mark isActive = false
      isActive = false;
    };
  }, [regionKey, questions]);

  /* Below is logic to set the next question along with preloading the next question*/
  const advanceQuestion = useCallback(async () => {
    if (!nextQuestion) return;

    // Use preloaded next question immediately
    setCurrentQuestion(nextQuestion);

    // Clear selection
    setSelectedAnswer(null);

    // Start preloading the next question
    const preload =
      (await fetchBackendQuiz(regionKey)) ?? getRandomLocalQuestion(questions);

    setNextQuestion(preload); // Set the preloaded question for next time
  }, [nextQuestion, regionKey]); //dependencies for useCallback
  //if nextQuestion changes → advanceQuestion must update the UI with the new preloaded question
  //if Regiokey to generate new quqesiton when region changes

  /*Fade in and out functions for transitioning between quiz screens*/
  const fadeIn = () => {
    //fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = (onComplete: () => void) => {
    //fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      onComplete();
      fadeIn();
    });
  };


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
                  const prev = regionProgress.quizCorrectCount; //number of correct answers before tap
                  const next = prev + 1; //number of correct answers after tap

                  dispatch({
                    type: "INCREMENT_QUIZ_CORRECT",
                    region: regionKey,
                    questionId: currentQuestion.text,
                  });

                  if (prev < 3 && next === 3) {
                    //if user just reached mastery (3 correct answers)
                    setShowConfetti(true); //show confetti
                  }
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
                setShowConfetti(false); //reset confetti in if it ran we down want it running again
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
          // Only show progress status AFTER the user selects an answer
          <View style={styles.progressRow}>
            {regionProgress?.quizComplete && (
              // If the user has reached 3 correct answers → show mastery badge
              <Text style={styles.progressComplete}>Quiz mastered ✓</Text>
            )}
          </View>
        )}
      </Animated.View>
      
      {/* Confetti effect when user masters the quiz */}
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
    marginBottom: 20, // spacing below the question
    marginTop: 10, // spacing above the question
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
    fontSize: 18, // size for answer text
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
    // text inside the next button
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
    color: "#2d8a34", // green color for success indicator
    fontWeight: "600",
  },
});
