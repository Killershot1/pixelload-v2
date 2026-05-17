import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function Shimmer() {
  const anim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 2400,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = anim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-320, 320],
  });

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          top: -40,
          bottom: -40,
          width: 90,
          backgroundColor: "rgba(255,255,255,0.06)",
          transform: [
            { translateX },
            { rotate: "14deg" },
          ],
        }}
      />
    </View>
  );
}