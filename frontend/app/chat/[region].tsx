// TO DO: Store chat history by region using AsyncStorage 
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
  const { region } = useLocalSearchParams(); //the current region
  const scrollViewRef = useRef<ScrollView>(null); //scroll view refrence, so we can scroll as GPT responds
  const [isSending, setIsSending] = useState(false); //flag for sending so user cant send multiple queries at once
  const [inputText, setInputText] = useState(""); //Tracks what the user is typing in the TextInput
  const initialMessages = [
    {
      type: "gpt",
      text: `You're now chatting about the ${region} region. Ask a question.`, //initial message from GPT
    },
  ];
  const [messages, setMessages] = useState(initialMessages); //Keeps a running list of all messages (both user and GPT), start with the intiale message
  const [inputHeight, setInputHeight] = useState(40); // dynamic height for textInput, so textInput expands as user types multi line

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true }); //everyitme a message is added scroll to the end
  }, [messages]); 

  const handleSend = async () => {

    const message = inputText.trim();   //trim the input message 
    if (!message || isSending) return;    //ensure the message actually contains something and ensure a message is not currently being processed (sent)

    setIsSending(true); //set the flag to true so we dont send multiple messages
    setInputText("");  //clear what the user has typed 
    setMessages((prev) => [...prev, { type: "user", text: message }]);   //add the user message to the message list 

    try {
      const response = await fetch("http://localhost:3000/chat", {
        //contact the local backend server, will need to later change this hardcorded link
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, inputText: message }), //send the message and the region we are discussiing
      });

      const data = await response.json(); // get the response
      const reply = data.reply || "No reply received."; //extract the reply
      const words = reply.split(" "); //split it by words for dynamic output

      setMessages((prev) => [...prev, { type: "gpt", text: "" }]); // Add empty GPT message first since we will reveal it word by word

      // Reveal reply word-by-word
      let index = 0;
      const interval = setInterval(() => {
        setMessages((prev) => {
          const updated = [...prev]; //get all the previous onens
          updated[updated.length - 1].text = words //update the last one
            .slice(0, index + 1) // take all words up to current index
            .join(" "); // join them into a string
          return updated;
        });
        if (++index >= words.length) {
          // Move to the next word
          clearInterval(interval);  //stop the interval loop 
          setIsSending(false); //set flag to false so user can send a new message
        }
      }, 50); // Run this block every 50ms
    } catch (err) {  //when there is an error 
      console.error("Error fetching GPT reply:", err);
      setMessages((prev) => [
        ...prev,
        { type: "gpt", text: "Error contacting backend." },
      ]);
      setIsSending(false);   //set flag to false so user can send a new message 
    }
  };


  return (
    //keep layout within safe area, avoid notch
    <SafeAreaView style={styles.container}>
      {/* Back button to return to home screen */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backButton, { top: insets.top }]}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {/* Scrollable area for chat messages */}
      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={
          () => scrollViewRef.current?.scrollToEnd({ animated: true }) // scroll to bottom when new message added
        }
      >
        {/* Loop through all messages and display them.*/}
        {messages.map((msg, index) => (
          <Text
            key={index}
            style={msg.type === "user" ? styles.userMessage : styles.gptMessage} //user messaged on the right, gpt on the left
          >
            {msg.text}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        {/* Input box dynamically resizes based on input height */}
        <View style={[styles.inputRow, { height: Math.max(50, inputHeight) }]}>
          <TextInput
            placeholder="Type a message..." // hint text before typing
            value={inputText}
            onChangeText={setInputText} // updates state as user types
            multiline // allows multiple line
            onContentSizeChange={
              (e) =>
                setInputHeight(Math.min(e.nativeEvent.contentSize.height, 300)) //set the height of the input box
            }
            style={styles.textInput}
          />
          <TouchableOpacity
            style={[styles.sendButton, isSending && { opacity: 0.4 }]} //fades when disabled
            onPress={handleSend}
            disabled={isSending} //prevent double sending
          >
            <Text style={styles.sendText}>↑</Text>
          </TouchableOpacity>
        </View>
      </View>
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

  backArrow: {
    fontSize: 24,
  },

  messagesContainer: {
    flex: 1,
    paddingTop: 20, // space for back button
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },

  gptMessage: {
    fontSize: 18,
    color: "#444",
    textAlign: "left",
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "white",
    borderRadius: 16,
    alignSelf: "flex-start",
  },

  userMessage: {
    fontSize: 18,
    color: "#000",
    alignSelf: "flex-end",
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
  },

  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  textInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },

  sendButton: {
    backgroundColor: "#000",
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  sendText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
