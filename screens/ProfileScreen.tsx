import React from "react";
import { View, Text } from "react-native";

export default function ProfileScreen() {
  return (
    <View>
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "900" }}>
        Profile
      </Text>
      <Text style={{ color: "#A1A1AA", marginTop: 10 }}>
        Free plan now. Pro plan will come after APK testing.
      </Text>
    </View>
  );
}