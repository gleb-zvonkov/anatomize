import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function SummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { region } = useLocalSearchParams();

  const labels: Record<string, string> = {
    back: "Back",
    thorax: "Thorax",
    abdomen: "Abdomen",
    pelvis: "Pelvis",
    perineum: "Perineum",
    upperLimb: "Upper Limb",
    lowerLimb: "Lower Limb",
    neck: "Neck",
    head: "Head",
  };

  const summaries: Record<string, string> = {
    back: "The back forms the central support structure of the body, housing the vertebral column, spinal cord, and associated muscles. It provides both strength and flexibility, allowing bending, twisting, and maintaining upright posture. The vertebrae protect the spinal cord while supporting the weight of the head and trunk.",
    thorax:
      "The thorax, or chest, is enclosed by the rib cage, sternum, and thoracic vertebrae. It contains the lungs, heart, and major blood vessels that sustain respiration and circulation. The diaphragm separates it from the abdomen and plays a key role in breathing movements.",
    abdomen:
      "The abdomen is the region between the thorax and pelvis that contains the digestive organs such as the stomach, intestines, liver, and pancreas. It is a dynamic cavity that supports digestion, absorption, and metabolic regulation. Its wall muscles also assist in posture and protection of internal organs.",
    pelvis:
      "The pelvis connects the trunk to the lower limbs and provides strong support for the body’s weight during standing and movement. It houses parts of the digestive, urinary, and reproductive systems. Structurally, it protects these organs and transmits forces from the spine to the legs.",
    perineum:
      "The perineum is the diamond-shaped region forming the pelvic outlet, located between the thighs. It contains muscles and fascia that support the pelvic organs and control urination and defecation. In both sexes, it plays an essential role in reproductive and sexual function.",
    upperLimb:
      "The upper limb includes the shoulder, arm, forearm, and hand, designed for mobility and precision. It allows grasping, lifting, and manipulation of objects through a wide range of motion. Its muscular and skeletal structure enables fine motor control and sensory feedback for skilled tasks.",
    lowerLimb:
      "The lower limb includes the hip, thigh, leg, and foot, providing stability and locomotion. It supports the entire body weight during standing and movement. The strong bones, ligaments, and muscles work together to enable walking, running, and balance on uneven surfaces.",
    neck: "The neck is the narrow region connecting the head and trunk, containing vital structures such as the trachea, esophagus, and major blood vessels. It supports the head’s mobility and provides passage for nerves and vessels to and from the brain. Muscles of the neck also assist in breathing and posture.",
    head: "The head houses the brain, sensory organs, and the openings for the respiratory and digestive tracts. It contains the eyes, ears, nose, and mouth, which mediate sensory perception and communication. The skull protects the brain while providing attachment points for facial and chewing muscles.",
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backButton, { top: insets.top }]}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>
          {labels[region as string] || "Unknown Region"}
        </Text>
        <Text style={styles.summary}>
          {summaries[region as string] || "No summary available."}
        </Text>
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
  backArrow: { fontSize: 24 },
  content: {
    marginTop: 40, // space below back button
    paddingHorizontal: 20,
    alignItems: "flex-start", // left align
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 10,
  },
  summary: {
    fontSize: 18,
    color: "#555",
    lineHeight: 24,
  },
});
