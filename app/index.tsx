import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Animated,
  Platform,
} from "react-native";

import { BlurView } from "expo-blur";

import {
  Home,
  Sparkles,
  Download,
  User,
} from "lucide-react-native";

import CosmicBackground from "../components/CosmicBackground";
import Reveal from "../components/Reveal";

import HomeScreen from "../screens/HomeScreen";
import AIScreen from "../screens/AIScreen";
import DownloadsScreen from "../screens/DownloadsScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { colors } from "../constants/theme";

type Tab = "home" | "ai" | "downloads" | "profile";

export default function App() {
  const [tab, setTab] = useState<Tab>("home");

  const glowAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    screenFade.setValue(0);

    Animated.timing(screenFade, {
      toValue: 1,
      duration: 360,
      useNativeDriver: true,
    }).start();
  }, [tab]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.7],
  });

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -16],
  });

  return (
    <CosmicBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Animated.View
            style={{
              position: "absolute",
              top: 70,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: 999,
              backgroundColor: "rgba(0,229,255,0.14)",
              opacity: glowOpacity,
              transform: [{ translateY: floatY }],
            }}
          />

          <Animated.View
            style={{
              position: "absolute",
              bottom: 180,
              left: -60,
              width: 220,
              height: 220,
              borderRadius: 999,
              backgroundColor: "rgba(124,58,237,0.16)",
              opacity: glowOpacity,
              transform: [{ translateY: floatY }],
            }}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 130,
            }}
          >
            <Reveal>
              <View style={{ marginBottom: 34 }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 42,
                    fontWeight: "900",
                    letterSpacing: -1.6,
                  }}
                >
                  PixelLoad
                </Text>

                <Text
                  style={{
                    color: colors.cyan,
                    marginTop: 6,
                    fontSize: 13,
                    fontWeight: "800",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  Visionco AI • Cosmic Media Engine
                </Text>
              </View>
            </Reveal>

            <Animated.View style={{ opacity: screenFade }}>
              {tab === "home" && <HomeScreen />}
              {tab === "ai" && <AIScreen />}
              {tab === "downloads" && <DownloadsScreen />}
              {tab === "profile" && <ProfileScreen />}
            </Animated.View>
          </ScrollView>

          <View style={styles.navWrap}>
            <Animated.View
              style={[
                styles.navShadow,
                {
                  shadowOpacity: glowOpacity,
                },
              ]}
            >
              <BlurView
                intensity={55}
                tint="dark"
                style={styles.blurNav}
              >
                <View style={styles.navInner}>
                  <NavItem
                    active={tab === "home"}
                    label="Home"
                    Icon={Home}
                    onPress={() => setTab("home")}
                  />

                  <NavItem
                    active={tab === "ai"}
                    label="AI"
                    Icon={Sparkles}
                    onPress={() => setTab("ai")}
                  />

                  <NavItem
                    active={tab === "downloads"}
                    label="Downloads"
                    Icon={Download}
                    onPress={() => setTab("downloads")}
                  />

                  <NavItem
                    active={tab === "profile"}
                    label="Profile"
                    Icon={User}
                    onPress={() => setTab("profile")}
                  />
                </View>
              </BlurView>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </CosmicBackground>
  );
}

function NavItem({ active, label, Icon, onPress }: any) {
  const scale = useRef(new Animated.Value(1)).current;

  function pressIn() {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  }

  function pressOut() {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
      }}
    >
      <TouchableOpacity
        style={styles.navItem}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={0.9}
      >
        <View
          style={{
            width: 50,
            height: 38,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: active
              ? "rgba(0,229,255,0.16)"
              : "transparent",

            borderWidth: active ? 1 : 0,
            borderColor: "rgba(0,229,255,0.22)",
          }}
        >
          <Icon
            color={active ? colors.cyan : colors.dim}
            size={21}
          />
        </View>

        <Text
          style={{
            color: active ? colors.cyan : colors.dim,
            fontSize: 11,
            fontWeight: "800",
            marginTop: 3,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles: any = {
  navWrap: {
    position: "absolute",
    bottom: 18,
    left: 16,
    right: 16,
  },

  navShadow: {
    borderRadius: 34,
    overflow: "hidden",

    shadowColor: colors.cyan,
    shadowRadius: 28,
    elevation: 18,
  },

  blurNav: {
    borderRadius: 34,
    overflow: "hidden",
  },

  navInner: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,

    backgroundColor:
      Platform.OS === "android"
        ? "rgba(2,6,23,0.72)"
        : "rgba(2,6,23,0.52)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
};