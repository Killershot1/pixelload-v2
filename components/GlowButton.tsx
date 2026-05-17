import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { colors, radius } from "../constants/theme";

export default function GlowButton({ title, onPress, icon }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: colors.cyan,
        borderRadius: radius.md,
        paddingVertical: 16,
        paddingHorizontal: 18,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 9,
        shadowColor: colors.cyan,
        shadowOpacity: 0.45,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 0 },
        elevation: 8,
      }}
    >
      {icon ? <View>{icon}</View> : null}
      <Text style={{ color: "#020617", fontWeight: "900", fontSize: 15 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}