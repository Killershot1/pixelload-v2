import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { Sparkles } from "lucide-react-native";

import CosmicBackground from "./CosmicBackground";
import { colors } from "../constants/theme";

export default function BootScreen() {
  const pulse = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 650,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1300,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.85],
  });

  return (
    <CosmicBackground>
      <Animated.View style={[styles.wrap, { opacity: fade }]}>
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowOpacity,
              transform: [{ scale }],
            },
          ]}
        />

        <Animated.View style={[styles.logoOrb, { transform: [{ scale }] }]}>
          <Sparkles color={colors.cyan} size={42} />
        </Animated.View>

        <Text style={styles.logo}>PixelLoad</Text>

        <Text style={styles.tagline}>
          Visionco AI • Cosmic Media Engine
        </Text>

        <View style={styles.loadingTrack}>
          <Animated.View
            style={[
              styles.loadingFill,
              {
                opacity: glowOpacity,
              },
            ]}
          />
        </View>
      </Animated.View>
    </CosmicBackground>
  );
}

const styles: any = {
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  glow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(0,229,255,0.14)",
  },

  logoOrb: {
    width: 104,
    height: 104,
    borderRadius: 36,
    backgroundColor: colors.cyanSoft,
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.32)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  logo: {
    color: colors.text,
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: -1.8,
  },

  tagline: {
    color: colors.cyan,
    marginTop: 8,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },

  loadingTrack: {
    marginTop: 34,
    width: 180,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(148,163,184,0.16)",
    overflow: "hidden",
  },

  loadingFill: {
    width: "62%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.cyan,
  },
};