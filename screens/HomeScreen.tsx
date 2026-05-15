import React from "react";
import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View>
      <Text style={{ color: "#fff", fontSize: 38, fontWeight: "900" }}>
        Download smarter.
      </Text>
      <Text style={{ color: "#A1A1AA", marginTop: 10, lineHeight: 22 }}>
        PixelLoad helps you discover, summarize and organize video content with Visionco AI.
      </Text>
    </View>
  );
}