import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity, //a pressable component that fades on press
  FlatList, //scrollable list for rendering many items
  Image, //for the images of each region
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; //ensure content goes past notch
import { useRouter } from "expo-router";




type RegionName =
  | "back"
  | "thorax"
  | "abdomen"
  | "pelvis"
  | "perineum"
  | "upperLimb"
  | "lowerLimb"
  | "neck"
  | "head";

// Array of region identifiers
const regions = [
  { key: "back", label: "Back" },
  { key: "thorax", label: "Thorax" },
  { key: "abdomen", label: "Abdomen" },
  { key: "pelvis", label: "Pelvis" },
  { key: "perineum", label: "Perineum" },
  { key: "upperLimb", label: "Upper Limb" },
  { key: "lowerLimb", label: "Lower Limb" },
  { key: "neck", label: "Neck" },
  { key: "head", label: "Head" },
];

// Image mapping for each region
const regionImages: Record<RegionName, any> = {
  back: require("../region_images/back.png"),
  thorax: require("../region_images/thorax.png"),
  abdomen: require("../region_images/abdomen.png"),
  pelvis: require("../region_images/pelvis.png"),
  perineum: require("../region_images/perineum.png"),
  upperLimb: require("../region_images/upper_limb.png"),
  lowerLimb: require("../region_images/lower_limb.png"),
  neck: require("../region_images/neck.png"),
  head: require("../region_images/head.png"),
};

const summaryIcon = require("../screen_images/summary.png");
const chatIcon = require("../screen_images/chat.png");
const quizIcon = require("../screen_images/quiz.png");


export default function Index() {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Edges top gets rid of the bottom area */}
      {/*Touchable Opacity nested inside of toubable opacity, this may cause an issue, so far seems fine*/}
      <FlatList
        data={regions}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={1} 
            style={styles.item}
            onPress={() => setSelectedRegion(item.key)}
          >
            <View style={styles.row}>
              <Image
                source={regionImages[item.key as RegionName]}
                style={styles.icon}
              />
              <Text style={styles.label}>{item.label}</Text>
            </View>

            {selectedRegion === item.key && (
              <View style={styles.iconRow}>
                <TouchableOpacity
                  onPress={() => router.push(`/summary/${item.key}`)}
                  style={styles.buttonCard}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={summaryIcon} style={styles.smallIcon} />
                    <Text>Summary</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push(`/chat/${item.key}`)}
                  style={styles.buttonCard}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={chatIcon} style={styles.smallIcon} />
                    <Text>Chat</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push(`/quiz/${item.key}`)}
                  style={styles.buttonCard}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={quizIcon} style={styles.smallIcon} />
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





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  item: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center", // centers vertically
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 15,
    resizeMode: "contain",
  },
  label: {
    fontSize: 20,
    fontWeight: "500",
  },
  smallIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 8,
    resizeMode: "contain",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonCard: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingRight: 10,
    paddingLeft: 2,
    borderRadius: 10,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // Android shadow
    flexDirection: "row",
    alignItems: "center",
  },
});

