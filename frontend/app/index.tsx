/*
 Anatomize App - Home Screen
 This screen displays a list of all body regions (Back, Thorax, Abdomen...)
 Each list item is a card witth an image and lablel for the region.
 When a region card is tapped, it expands to show three buttons:
  1. Summary - navigates to the summary screen for that region
  2. Chat - navigates to the chat screen for that region
  3. Quiz - navigates to the quiz screen for that region
*/

import React from "react";
import {
  Text,
  StyleSheet, // for styling component
  TouchableOpacity, //a pressable component that fades on press
  FlatList, //scrollable list for rendering many items
  Image, //for the images of each region
  View,
} from "react-native";
import { useState } from "react"; //useState for managing selected region state
import { SafeAreaView } from "react-native-safe-area-context"; //ensure content doesnt goes past notch
import { useRouter } from "expo-router"; //for navigation between screens
import { Region } from "../types/types"; // Define the type of regions, tells TypeScript that valid values are only those specific strings
import { REGION_ITEMS, regionImages } from "../constants/regions";
import { useAppState } from "../context/AppStateContext";

// Icons for summary, chat, and quiz buttons
const summaryIcon = require("../screen_images/summary.png");
const chatIcon = require("../screen_images/chat.png");
const quizIcon = require("../screen_images/quiz.png");

// HomeScreen component
export default function HomeScreen() {
  const router = useRouter(); //for navigating to different screens
  const { state, isHydrated } = useAppState();

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null); // tracks which region is currently expanded

  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading progress…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Edges top gets rid of the bottom safe area */}
      <FlatList
        data={REGION_ITEMS} // each flatlist item is a region
        keyExtractor={(item) => item.key} //unique key for each item
        renderItem={(
          { item } // For each region render:
        ) => (
          <TouchableOpacity // a gray card for each region
            activeOpacity={1} // no fade effect on press
            style={styles.card} // styling for the card
            onPress={() => setSelectedRegion(item.key)} //set selected region on press
          >
            <View style={styles.row}>
              {/* row with region image and label */}
              <View style={styles.leftGroup}>
                <Image
                  source={regionImages[item.key as Region]} //region image
                  style={styles.regionImage} //styling for the image
                />
                <Text style={styles.regionLabel}>{item.label}</Text>
              </View>

              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusBadge,
                    state.progress[item.key as Region].summaryRead &&
                      styles.statusBadgeComplete,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      state.progress[item.key as Region].summaryRead &&
                        styles.statusBadgeTextComplete,
                    ]}
                  >
                    {state.progress[item.key as Region].summaryRead ? "✓" : ""}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    state.progress[item.key as Region].quizComplete &&
                      styles.statusBadgeComplete,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      state.progress[item.key as Region].quizComplete &&
                        styles.statusBadgeTextComplete,
                    ]}
                  >
                    {state.progress[item.key as Region].quizComplete ? "✓" : ""}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    state.progress[item.key as Region].chatComplete &&
                      styles.statusBadgeComplete,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      state.progress[item.key as Region].chatComplete &&
                        styles.statusBadgeTextComplete,
                    ]}
                  >
                    {state.progress[item.key as Region].chatComplete ? "✓" : ""}
                  </Text>
                </View>
              </View>
              {/* region label */}
            </View>

            {selectedRegion === item.key && ( // if this region is selected, show the summary, chat, quiz buttons
              <View style={styles.hiddenRow}>
                <TouchableOpacity
                  onPress={() => router.push(`/summary/${item.key}`)} //navigate to summary screen for this region
                  style={styles.activityButton}
                >
                  {/* Inner layout for icon + text alignment */}
                  <View style={styles.innerActivityButton}>
                    <Image
                      source={summaryIcon} // icon for summary
                      style={styles.activityIcon} //styling for the icon
                    />
                    <Text>Summary</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push(`/chat/${item.key}`)} //navigate to chat screen for this region
                  style={styles.activityButton}
                >
                  <View style={styles.innerActivityButton}>
                    <Image source={chatIcon} style={styles.activityIcon} />
                    <Text>Chat</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push(`/quiz/${item.key}`)} //navigate to quiz screen for this region
                  style={styles.activityButton}
                >
                  <View style={styles.innerActivityButton}>
                    <Image source={quizIcon} style={styles.activityIcon} />
                    <Text>Quiz</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

//styling for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    //styling for each region card
    marginVertical: 8, // vertical margin between cards
    marginHorizontal: 16, // so there is space on left and right
    backgroundColor: "#e0e0e0",
    borderRadius: 15, // rounded corners
    padding: 20, // padding inside the card
  },
  row: {
    //row inside each region card
    flexDirection: "row",
    alignItems: "center", // centers vertically
    justifyContent: "space-between",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#b0b0b0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    marginRight: 8,
  },
  statusBadgeComplete: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  statusBadgeTextComplete: {
    color: "#fff",
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  regionImage: {
    //styling for region images
    width: 50,
    height: 50,
    marginRight: 15,
  },
  regionLabel: {
    //styling for region labels
    fontSize: 20,
    fontWeight: "500",
  },
  hiddenRow: {
    //styling for the row that contains summary, chat, quiz buttons
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  activityButton: {
    //styling for each of the summary, chat, quiz buttons
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingRight: 10,
    paddingLeft: 2,
    borderRadius: 10, //round corners
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, //add a shdaown effect
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  innerActivityButton: {
    // inner layout for icon + text alignment
    flexDirection: "row",
    alignItems: "center",
  },
  activityIcon: {
    //styling for summary, chat, quiz icons
    width: 30,
    height: 30,
    marginHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    fontSize: 16,
    color: "#444",
  },
});
