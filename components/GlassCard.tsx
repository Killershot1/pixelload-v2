import React from "react";
import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { colors, radius } from "../constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function GlassCard({ children, style, onPress }: any) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        {
          backgroundColor: "rgba(15, 23, 42, 0.72)",
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.lg,
          overflow: "hidden",
          shadowColor: colors.cyan,
          shadowOpacity: 0.12,
          shadowRadius: 20,
          elevation: 6,
        },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}