import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

export default function CosmicBackground({ children }: { children: React.ReactNode }) {
  const orb1 = useSharedValue(0);
  const orb2 = useSharedValue(0);
  const orb3 = useSharedValue(0);

  useEffect(() => {
    orb1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 7000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    orb2.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 9000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    orb3.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 11000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 11000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const orb1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb1.value * -26 },
      { translateY: orb1.value * 34 },
      { scale: 1 + orb1.value * 0.08 },
    ],
    opacity: 0.65 + orb1.value * 0.25,
  }));

  const orb2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb2.value * 38 },
      { translateY: orb2.value * -28 },
      { scale: 1 + orb2.value * 0.1 },
    ],
    opacity: 0.45 + orb2.value * 0.3,
  }));

  const orb3Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb3.value * 18 },
      { translateY: orb3.value * 22 },
      { scale: 1 + orb3.value * 0.12 },
    ],
    opacity: 0.2 + orb3.value * 0.35,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: "#03040A", overflow: "hidden" }}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 390,
            height: 390,
            borderRadius: 999,
            backgroundColor: "rgba(0, 229, 255, 0.18)",
            top: -150,
            right: -160,
          },
          orb1Style,
        ]}
      />

      <Animated.View
        style={[
          {
            position: "absolute",
            width: 340,
            height: 340,
            borderRadius: 999,
            backgroundColor: "rgba(124, 58, 237, 0.18)",
            bottom: 70,
            left: -170,
          },
          orb2Style,
        ]}
      />

      <Animated.View
        style={[
          {
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.055)",
            top: 260,
            left: 35,
          },
          orb3Style,
        ]}
      />

      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(3,4,10,0.45)",
        }}
      />

      {children}
    </View>
  );
}