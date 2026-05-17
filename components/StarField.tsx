import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
};

function StarDot({ star }: { star: Star }) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: star.duration,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: star.duration,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: star.opacity + pulse.value * 0.55,
    transform: [
      {
        scale: 1 + pulse.value * 0.9,
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: star.size,
          height: star.size,
          borderRadius: 999,
          backgroundColor: "rgba(255,255,255,0.9)",
        },
        style,
      ]}
    />
  );
}

export default function StarField() {
  const stars = useMemo<Star[]>(
    () => [
      { id: 1, x: 8, y: 12, size: 2, opacity: 0.14, duration: 1600 },
      { id: 2, x: 18, y: 28, size: 1.5, opacity: 0.12, duration: 2100 },
      { id: 3, x: 31, y: 9, size: 2.5, opacity: 0.18, duration: 1900 },
      { id: 4, x: 46, y: 20, size: 1.3, opacity: 0.1, duration: 2500 },
      { id: 5, x: 59, y: 7, size: 2, opacity: 0.16, duration: 1700 },
      { id: 6, x: 72, y: 31, size: 1.5, opacity: 0.12, duration: 2200 },
      { id: 7, x: 87, y: 15, size: 2.3, opacity: 0.18, duration: 1800 },
      { id: 8, x: 12, y: 48, size: 1.5, opacity: 0.1, duration: 2300 },
      { id: 9, x: 27, y: 62, size: 2, opacity: 0.13, duration: 2600 },
      { id: 10, x: 39, y: 43, size: 1.4, opacity: 0.1, duration: 2000 },
      { id: 11, x: 54, y: 58, size: 2.2, opacity: 0.17, duration: 1750 },
      { id: 12, x: 68, y: 49, size: 1.4, opacity: 0.12, duration: 2450 },
      { id: 13, x: 82, y: 66, size: 2, opacity: 0.13, duration: 2150 },
      { id: 14, x: 91, y: 41, size: 1.5, opacity: 0.11, duration: 2350 },
      { id: 15, x: 6, y: 79, size: 2, opacity: 0.14, duration: 1850 },
      { id: 16, x: 22, y: 88, size: 1.4, opacity: 0.1, duration: 2550 },
      { id: 17, x: 37, y: 76, size: 2.4, opacity: 0.18, duration: 1950 },
      { id: 18, x: 61, y: 84, size: 1.5, opacity: 0.11, duration: 2250 },
      { id: 19, x: 74, y: 74, size: 2, opacity: 0.15, duration: 2050 },
      { id: 20, x: 93, y: 88, size: 1.4, opacity: 0.12, duration: 2400 },
    ],
    []
  );

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      {stars.map((star) => (
        <StarDot key={star.id} star={star} />
      ))}
    </View>
  );
}