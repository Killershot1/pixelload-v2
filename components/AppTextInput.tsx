import React from "react";
import { TextInput } from "react-native";
import { colors, radius } from "../constants/theme";

export default function AppTextInput(props: any) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.dim}
      style={[
        {
          backgroundColor: "rgba(15, 23, 42, 0.7)",
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.md,
          paddingHorizontal: 16,
          paddingVertical: 15,
          color: colors.text,
          fontSize: 15,
        },
        props.style,
      ]}
    />
  );
}