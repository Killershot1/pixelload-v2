import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

import {
  Sparkles,
  Download,
  BrainCircuit,
  Archive,
  Rocket,
} from "lucide-react-native";

import GlassCard from "../components/GlassCard";
import GlowButton from "../components/GlowButton";
import Shimmer from "../components/Shimmer";
import { colors } from "../constants/theme";
import { markOnboardingSeen } from "../storage/onboarding";

const { width } = Dimensions.get("window");

const slides = [
  {
    icon: <BrainCircuit color={colors.cyan} size={42} />,
    title: "Understand the media universe.",
    body: "PixelLoad uses Visionco AI to help you search, summarize and organize videos smarter.",
  },
  {
    icon: <Archive color={colors.cyan} size={42} />,
    title: "Build your media vault.",
    body: "Save links, thumbnails, quality choices and download queues in one cinematic workspace.",
  },
  {
    icon: <Download color={colors.cyan} size={42} />,
    title: "Prepare for offline power.",
    body: "PixelLoad is being built for real downloads, progress tracking and offline access.",
  },
];

export default function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndex(nextIndex);
  }

  async function finish() {
    await markOnboardingSeen();
    onDone();
  }

  function next() {
    if (index < slides.length - 1) {
      scrollRef.current?.scrollTo({
        x: width * (index + 1),
        animated: true,
      });
      return;
    }

    finish();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>PixelLoad</Text>
        <Text style={styles.brand}>Visionco AI • Cosmic Media Engine</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, slideIndex) => (
          <View key={slideIndex} style={styles.slide}>
            <GlassCard style={styles.card}>
              <Shimmer />

              <View style={styles.iconWrap}>{slide.icon}</View>

              <Text style={styles.title}>{slide.title}</Text>

              <Text style={styles.body}>{slide.body}</Text>

              <View style={styles.featurePill}>
                <Sparkles color={colors.cyan} size={15} />
                <Text style={styles.featureText}>POWERED BY VISIONCO AI</Text>
              </View>
            </GlassCard>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {slides.map((_, dotIndex) => (
          <View
            key={dotIndex}
            style={[
              styles.dot,
              index === dotIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <GlowButton
          title={index === slides.length - 1 ? "Enter PixelLoad" : "Continue"}
          onPress={next}
          icon={<Rocket color="#020617" size={18} />}
        />

        <TouchableOpacity onPress={finish} activeOpacity={0.8}>
          <Text style={styles.skip}>Skip intro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles: any = {
  container: {
    flex: 1,
    paddingTop: 30,
  },

  header: {
    paddingHorizontal: 20,
    marginBottom: 22,
  },

  logo: {
    color: colors.text,
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: -1.6,
  },

  brand: {
    color: colors.cyan,
    marginTop: 6,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },

  slide: {
    width,
    paddingHorizontal: 20,
    justifyContent: "center",
  },

  card: {
    minHeight: 470,
    padding: 28,
    justifyContent: "center",
  },

  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 30,
    backgroundColor: colors.cyanSoft,
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  title: {
    color: colors.text,
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 44,
    letterSpacing: -1.8,
    marginBottom: 18,
  },

  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 24,
  },

  featurePill: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.22)",
    backgroundColor: "rgba(0,229,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  featureText: {
    color: colors.cyan,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
    marginBottom: 18,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(148,163,184,0.35)",
  },

  dotActive: {
    width: 26,
    backgroundColor: colors.cyan,
  },

  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 14,
  },

  skip: {
    color: colors.muted,
    textAlign: "center",
    fontWeight: "800",
  },
};