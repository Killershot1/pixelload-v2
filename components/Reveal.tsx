import React, { useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

export default function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(22);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 650,
      easing: Easing.out(Easing.cubic),
    });

    translateY.value = withTiming(0, {
      duration: 650,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}