import React, { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from "react-native";

import {
  Search,
  Download,
  Play,
  Sparkles,
  Star,
  Flame,
} from "lucide-react-native";

import GlassCard from "../components/GlassCard";
import GlowButton from "../components/GlowButton";
import Shimmer from "../components/Shimmer";
import AdSlot from "../components/AdSlot";

import { colors } from "../constants/theme";

const trending = [
  {
    title: "AI Creator Tools",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900",
    rating: "9.2",
  },
  {
    title: "Football Skills",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900",
    rating: "8.7",
  },
  {
    title: "Tech Unboxing",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900",
    rating: "8.9",
  },
];

const aiPicks = [
  {
    title: "Business Growth",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900",
    rating: "9.0",
  },
  {
    title: "Music Videos",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900",
    rating: "8.4",
  },
  {
    title: "Gaming Clips",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900",
    rating: "8.8",
  },
];

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const heroTranslate = scrollY.interpolate({
    inputRange: [0, 260],
    outputRange: [0, -42],
    extrapolate: "clamp",
  });

  const heroScale = scrollY.interpolate({
    inputRange: [-120, 0, 260],
    outputRange: [1.12, 1, 0.94],
    extrapolate: "clamp",
  });

  const heroOpacity = scrollY.interpolate({
    inputRange: [0, 260],
    outputRange: [1, 0.72],
    extrapolate: "clamp",
  });

  return (
    <Animated.ScrollView
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      decelerationRate="fast"
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
    >
      <View style={styles.searchWrap}>
        <Search color={colors.muted} size={20} />

        <TextInput
          placeholder="Search videos, links, ideas..."
          placeholderTextColor={colors.dim}
          style={styles.searchInput}
        />

        <Sparkles color={colors.cyan} size={20} />
      </View>

      <Animated.View
        style={[
          styles.hero,
          {
            opacity: heroOpacity,
            transform: [{ translateY: heroTranslate }, { scale: heroScale }],
          },
        ]}
      >
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200",
          }}
          style={styles.heroImage}
          imageStyle={{ borderRadius: 34 }}
        >
          <Shimmer />

          <View style={styles.heroOverlay}>
            <View style={styles.badge}>
              <Sparkles color={colors.cyan} size={14} />
              <Text style={styles.badgeText}>VISIONCO AI ENGINE</Text>
            </View>

            <Text style={styles.heroTitle}>
              Understand the media universe.
            </Text>

            <Text style={styles.heroSub}>
              Search, summarize, save and download smarter with PixelLoad.
            </Text>

            <GlowButton
              title="Start Exploring"
              icon={<Play color="#020617" size={18} />}
              onPress={() => {}}
            />
          </View>
        </ImageBackground>
      </Animated.View>

      <Animated.View
        style={{
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [0, 260],
                outputRange: [0, -14],
                extrapolate: "clamp",
              }),
            },
          ],
        }}
      >
        <SectionHeader
          icon={<Flame color="#FB923C" size={18} />}
          label="Trending Now"
        />

        <HorizontalRail data={trending} />

        <TouchableOpacity style={styles.fullListButton} activeOpacity={0.85}>
          <Text style={styles.fullListText}>Check Full List</Text>
        </TouchableOpacity>

        <AdSlot placement="home_featured" />

        <SectionHeader
          icon={<Star color="#FACC15" size={18} />}
          label="AI Picks For You"
        />

        <HorizontalRail data={aiPicks} />

        <GlassCard style={{ marginTop: 8, marginBottom: 30, padding: 18 }}>
          <Shimmer />

          <View style={styles.aiBox}>
            <View style={styles.aiIcon}>
              <Sparkles color={colors.cyan} size={24} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.aiTitle}>Visionco AI is online</Text>

              <Text style={styles.aiSub}>
                Your live backend is connected and ready to power search,
                summaries and recommendations.
              </Text>
            </View>
          </View>
        </GlassCard>
      </Animated.View>
    </Animated.ScrollView>
  );
}

function SectionHeader({ icon, label }: any) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>{icon}</View>
      <Text style={styles.sectionTitle}>{label}</Text>
    </View>
  );
}

function HorizontalRail({ data }: any) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      contentContainerStyle={{
        gap: 14,
        paddingRight: 20,
      }}
    >
      {data.map((item: any, index: number) => (
        <PosterCard item={item} key={index} />
      ))}
    </ScrollView>
  );
}

function PosterCard({ item }: any) {
  const scale = useRef(new Animated.Value(1)).current;

  function pressIn() {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  }

  function pressOut() {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.92}
        style={styles.posterCard}
        onPressIn={pressIn}
        onPressOut={pressOut}
      >
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.posterImage}
          imageStyle={{ borderRadius: 22 }}
        >
          <Shimmer />

          <View style={styles.posterShade}>
            <View style={styles.downloadMini}>
              <Download color="#FFFFFF" size={16} />
            </View>

            <View style={styles.rating}>
              <Star color="#FACC15" size={13} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </ImageBackground>

        <Text style={styles.posterTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles: any = {
  searchWrap: {
    height: 58,
    borderRadius: 20,
    backgroundColor: "rgba(148, 163, 184, 0.13)",
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },

  hero: {
    marginBottom: 28,
  },

  heroImage: {
    height: 390,
    justifyContent: "flex-end",
    overflow: "hidden",
  },

  heroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 22,
    borderRadius: 34,
    backgroundColor: "rgba(0,0,0,0.38)",
  },

  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.45)",
    backgroundColor: "rgba(0,229,255,0.12)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    marginBottom: 14,
  },

  badgeText: {
    color: colors.cyan,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  heroTitle: {
    color: colors.text,
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 44,
    letterSpacing: -1.6,
    marginBottom: 12,
  },

  heroSub: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    marginTop: 6,
  },

  sectionIcon: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: 6,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  posterCard: {
    width: 150,
    marginBottom: 18,
  },

  posterImage: {
    height: 215,
    justifyContent: "flex-end",
    overflow: "hidden",
  },

  posterShade: {
    flex: 1,
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.12)",
    borderRadius: 22,
  },

  downloadMini: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.48)",
    borderRadius: 999,
    padding: 7,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  rating: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.58)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  ratingText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },

  posterTitle: {
    color: colors.text,
    marginTop: 9,
    fontSize: 15,
    fontWeight: "800",
  },

  fullListButton: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  fullListText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },

  aiBox: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },

  aiIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.cyanSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  aiTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 5,
  },

  aiSub: {
    color: colors.muted,
    lineHeight: 20,
  },
};