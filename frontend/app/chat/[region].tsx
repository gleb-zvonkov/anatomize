//TO DO: Store chat history by region using AsyncStorage 
// ChatScreen.tsx
// This screen provides an interactive chat interface between the user and a GPT-powered anatomy tutor.
// It displays the chat history, sends user input to the backend (`/chat` endpoint) for processing, and shows the GPT response.


import React, { useState, useRef, useEffect } from "react"; //hooks we will use 
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native"; 
import { useRouter, useLocalSearchParams } from "expo-router";   //for navigation 
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";  //so doesnt touch notch 


export default function ChatScreen() {

  const router = useRouter(); //for navigation 
  const insets = useSafeAreaInsets(); //for the back button
  const { region } = useLocalSearchParams();   //the current region
  const scrollViewRef = useRef<ScrollView>(null);  //scroll view refrence, so we can scroll as GPT responds
  const [isSending, setIsSending] = useState(false);   //flag for sending so user cant send multiple queries at once
  

  
  const [inputText, setInputText] = useState(""); //Tracks what the user is typing in the TextInput
  const [messages, setMessages] = useState([
    { type: "gpt", text: `You're now chatting about the ${region} region. Ask a question.` },
  ]); //Keeps a running list of all messages (both user and GPT).
    const [inputHeight, setInputHeight] = useState(40);   // Dynamic height for TextInput

    useEffect(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

  const handleSend = async () => {
    
      if (!inputText.trim() || isSending) return;
      setIsSending(true);

    const userMessage = { type: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Call your GPT API
    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region, // e.g. "abdomen"
          inputText, // user message
        }),
      });

      const data = await response.json();
      const reply = data.reply ?? "No reply";

      // Add GPT reply to messages
      setMessages((prev) => [...prev, { type: "gpt", text: "" }]);

      // Reveal the reply word by word
      let words = reply.split(" ");
      let index = 0;
      let revealInterval = setInterval(() => {
        if (index < words.length) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].text = words
              .slice(0, index + 1)
              .join(" ");
            return updated;
          });
          index++;
        } else {
          clearInterval(revealInterval);
          setIsSending(false);
        }
      }, 100);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { type: "gpt", text: "Error contacting backend." },
      ]);
      setIsSending(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backButton, { top: insets.top }]}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {/* Loop through all messages and display them.*/}
        {messages.map((msg, index) => (
          <Text
            key={index}
            style={msg.type === "user" ? styles.userMessage : styles.gptMessage}
          >
            {msg.text}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View
          style={[styles.inputWrapper, { height: Math.max(50, inputHeight) }]}
        >
          <TextInput
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            onContentSizeChange={(e) =>
              setInputHeight(Math.min(e.nativeEvent.contentSize.height, 300))
            }
            style={styles.textInput}
          />
          <TouchableOpacity
            style={[styles.sendButton, isSending && { opacity: 0.4 }]}
            onPress={handleSend}
            disabled={isSending}
          >
            <Text style={styles.sendText}>↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: { position: "absolute", left: 20, zIndex: 10 },
  backArrow: { fontSize: 24 },
  footer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  messagesContainer: {
    flex: 1,
    marginTop: 30,
    padding: 10,
    backgroundColor: "#fff",
  },
  gptMessage: {
    fontSize: 19,
    color: "#555",
    textAlign: "left",
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
  },
  userMessage: {
    fontSize: 18,
    color: "#000",
    alignSelf: "flex-end", // right-align like a user message
    backgroundColor: "#f0f0f0",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 10,
    marginRight: 10,
    maxWidth: "75%", // limits width on long messages
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 25,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  sendButton: {
    backgroundColor: "black",
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginLeft: 8,
  },
  sendText: {
    color: "#fff",
    fontWeight: "600",
  },
});
