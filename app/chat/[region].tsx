import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { OPENAI_API_KEY } from "@env"; 

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { region } = useLocalSearchParams();

  const [inputText, setInputText] = useState(""); //Tracks what the user is typing in the TextInput
  const [messages, setMessages] = useState([
    { type: "gpt", text: `You're now chatting about the ${region} region.` },
  ]); //Keeps a running list of all messages (both user and GPT).
    const [inputHeight, setInputHeight] = useState(40);   // Dynamic height for TextInput


  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = { type: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Call your GPT API
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "You are a helpful anatomy tutor." },
              { role: "user", content: inputText },
            ],
          }),
        }
      );

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content ?? "No reply";

      // Add GPT reply to messages     
      setMessages((prev) => [...prev, { type: "gpt", text: "" }]);
      // Reveal the reply word by word
      let words = reply.split(" ");
      let index = 0;
      let revealInterval = setInterval(() => {
        if (index < words.length) {
          setMessages((prev) => {
            const updated = [...prev];
            // Update the last GPT message incrementally
            updated[updated.length - 1].text = words
              .slice(0, index + 1)
              .join(" ");
            return updated;
          });
          index++;
        } else {
          clearInterval(revealInterval);
        }
      }, 100);
          
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "gpt", text: "Error contacting API." },
      ]);
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

      <ScrollView style={styles.messagesContainer}>
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
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
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
