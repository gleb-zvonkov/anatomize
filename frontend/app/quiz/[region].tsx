import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; //for easy routing
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context"; //so doesn't touch notch
import { quizData } from "../../data/quiz_questions"; //quiz questions
import { Region } from "../../types"; //region type

export default function QuizScreen() {
  const router = useRouter();
  const { region } = useLocalSearchParams(); //current region
  const insets = useSafeAreaInsets();
  const questions = quizData[region as Region] || []; //get quiz questions for the current region
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    questions.length > 0 ? Math.floor(Math.random() * questions.length) : 0 // random first question
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null); // the answer the user selects
  const question = questions[currentQuestionIndex] || {
    //the current question and a default one incase of issue
    text: "No quiz available for this region.",
    options: [],
    answer: "",
    explanation: "",
  };

  const fadeAnim = useRef(new Animated.Value(1)).current; // fade animation value

  // fade in/out animations
  //smoothly animates opacity from its current value to 1 over 300 ms, making the view fade in
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  //fades the view out (opacity → 0) over 200 ms
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

  // helper to get next question randomly 
  const getRandomIndex = () => {
    if (questions.length <= 1) return 0;  
    let next = currentQuestionIndex;
    while (next === currentQuestionIndex) {    //repeaddly get a random one until its not the same as current
      next = Math.floor(Math.random() * questions.length);
    }
    return next;
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
        <Text style={styles.question}>{question.text}</Text>

        {/* Render each answer option as a selectable button */}
        {question.options.map((opt) => {
          const isCorrect = opt === question.answer; // check if this option is the correct answer
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
              onPress={() => setSelectedAnswer(opt)} //select the option
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
              {selectedAnswer === question.answer
                ? `Correct. ${question.explanation}`
                : `Incorrect. ${question.explanation}`}
            </Text>

            {/* Button to load a new random question */}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => {
                fadeOut(() => {
                  setSelectedAnswer(null);
                  setCurrentQuestionIndex(getRandomIndex());
                });
              }}
            >
              <Text style={styles.nextText}>Next Question</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,  //padding from left and righ
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

  option: {   //each answer option
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
    borderRadius: 25,  //circular 
    alignSelf: "center",
    marginTop: 28,  
  },

  nextText: {    //"Next Question"
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
