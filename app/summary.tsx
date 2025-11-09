import React from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SummaryScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
  return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          
          <TouchableOpacity
                  onPress={() => router.back()}
                  style={{
                    position: "absolute",
                    top: insets.top, // just below the time/signal area
                    left: 20,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>←</Text>
          </TouchableOpacity>
          
          <Text>Summary Screen</Text>
          
    </View>
  );
}
