import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";


export default function ChatScreen() {
  const router = useRouter();
    const insets = useSafeAreaInsets();
    const { region } = useLocalSearchParams();

  return (
    <SafeAreaView style={[styles.container]}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backButton, { top: insets.top }]} // add small padding if needed
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {/* Chat messages area */}
      <View style={styles.messagesContainer}>
        <Text style={styles.gptMessage}>
          {`You're now chatting about the ${region} region. We will contact the GPT api so that you can ask questions related to ${region}.`}
        </Text>

        <Text style={styles.userMessage}>
          {`Youre response would be here.`}
        </Text>
        <Text style={styles.gptMessage}>{`GPT's response would be here.`}</Text>
              
        <Text style={styles.userMessage}>
          {`Youre response...`}
        </Text>

        {/* Future messages will go here */}
      </View>

      {/* Simplified input area */}
      <View style={styles.inputWrapper}>
        <TextInput placeholder="Type a message..." style={styles.textInput} />

        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendText}>↑</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: { position: "absolute", left: 20, zIndex: 10 },
  backArrow: { fontSize: 24 },
  messagesContainer: {
    flex: 1,
    marginTop: 30,
    padding: 10,
    backgroundColor: "#fff",
  },
  gptMessage: {
    fontSize: 20,
    color: "#555",
    textAlign: "left",
      marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
  },
  userMessage: {
    fontSize: 16,
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
    alignItems: "center",
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
