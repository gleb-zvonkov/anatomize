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
  StyleSheet,      // for styling component
  TouchableOpacity, //a pressable component that fades on press
  FlatList, //scrollable list for rendering many items
  Image, //for the images of each region
  View
} from "react-native";
import { useState } from "react"; //useState for managing selected region state 
import { SafeAreaView } from "react-native-safe-area-context"; //ensure content doesnt goes past notch
import { useRouter } from "expo-router";  //for navigation between screens
import { Region } from "../types"; // Define the type of regions, tells TypeScript that valid values are only those specific strings

// Array of region identifiers and labels that will be displayed 
const regions: { key: Region; label: string }[] = [
  { key: "back", label: "Back" },
  { key: "thorax", label: "Thorax" },
  { key: "abdomen", label: "Abdomen" },
  { key: "pelvis", label: "Pelvis" },
  { key: "perineum", label: "Perineum" },
  { key: "upperlimb", label: "Upper Limb" },
  { key: "lowerlimb", label: "Lower Limb" },
  { key: "neck", label: "Neck" },
  { key: "head", label: "Head" },
];

// Images for each region 
const regionImages: Record<Region, any> = {
  back: require("../region_images/back.png"),
  thorax: require("../region_images/thorax.png"),
  abdomen: require("../region_images/abdomen.png"),
  pelvis: require("../region_images/pelvis.png"),
  perineum: require("../region_images/perineum.png"),
  upperlimb: require("../region_images/upper_limb.png"),
  lowerlimb: require("../region_images/lower_limb.png"),
  neck: require("../region_images/neck.png"),
  head: require("../region_images/head.png"),
};

// Icons for summary, chat, and quiz buttons
const summaryIcon = require("../screen_images/summary.png");
const chatIcon = require("../screen_images/chat.png");
const quizIcon = require("../screen_images/quiz.png");

// HomeScreen component
export default function HomeScreen() {
  const router = useRouter(); //for navigating to different screens

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null); // tracks which region is currently expanded

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Edges top gets rid of the bottom safe area */}
      <FlatList
        data={regions} // each flatlist item is a region
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
              <Image
                source={regionImages[item.key as Region]} //region image
                style={styles.regionImage} //styling for the image
              />
              <Text style={styles.regionLabel}>{item.label}</Text>
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
  card: {    //styling for each region card
    marginVertical: 8,  // vertical margin between cards
    marginHorizontal: 16,  // so there is space on left and right
    backgroundColor: "#e0e0e0",   
    borderRadius: 15,  // rounded corners
    padding: 20,  // padding inside the card
  },
  row: {  //row inside each region card 
    flexDirection: "row",
    alignItems: "center", // centers vertically
  },
  regionImage: {  //styling for region images
    width: 50,
    height: 50,
    marginRight: 15,   
  },
  regionLabel: {   //styling for region labels
    fontSize: 20,
    fontWeight: "500",   
  },
  hiddenRow: {   //styling for the row that contains summary, chat, quiz buttons
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  activityButton: {  //styling for each of the summary, chat, quiz buttons
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingRight: 10,
    paddingLeft: 2,
    borderRadius: 10,   //round corners
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },  //add a shdaown effect 
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  innerActivityButton: { // inner layout for icon + text alignment
    flexDirection: "row",
    alignItems: "center",
  },
  activityIcon: {  //styling for summary, chat, quiz icons  
    width: 30,
    height: 30,
    marginHorizontal: 8,
  },
});

