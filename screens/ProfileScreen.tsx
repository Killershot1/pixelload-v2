import React from "react";
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";

import {
  User,
  Crown,
  Sparkles,
  ShieldCheck,
  Zap,
  Info,
  Rocket,
  Server,
} from "lucide-react-native";

import GlassCard from "../components/GlassCard";
import GlowButton from "../components/GlowButton";
import Shimmer from "../components/Shimmer";
import Reveal from "../components/Reveal";
import { colors } from "../constants/theme";

export default function ProfileScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Reveal>
        <GlassCard style={styles.hero}>
          <Shimmer />

          <View style={styles.avatar}>
            <User color={colors.cyan} size={34} />
          </View>

          <Text style={styles.title}>Command Center</Text>

          <Text style={styles.subtitle}>
            Manage your PixelLoad experience, Visionco AI access and future Pro tools.
          </Text>

          <View style={styles.planBadge}>
            <Crown color={colors.cyan} size={16} />
            <Text style={styles.planText}>FREE PLAN ACTIVE</Text>
          </View>
        </GlassCard>
      </Reveal>

      <Reveal delay={100}>
        <Text style={styles.sectionTitle}>Account status</Text>

        <View style={styles.grid}>
          <MiniStat icon={<Sparkles color={colors.cyan} size={22} />} label="AI Engine" value="Online" />
          <MiniStat icon={<Server color={colors.cyan} size={22} />} label="Backend" value="Live" />
          <MiniStat icon={<ShieldCheck color={colors.cyan} size={22} />} label="Security" value="HTTPS" />
          <MiniStat icon={<Zap color={colors.cyan} size={22} />} label="Mode" value="V2 Beta" />
        </View>
      </Reveal>

      <Reveal delay={180}>
        <Text style={styles.sectionTitle}>Upgrade path</Text>

        <GlassCard style={styles.proCard}>
          <Shimmer />

          <View style={styles.proIcon}>
            <Rocket color={colors.cyan} size={28} />
          </View>

          <Text style={styles.proTitle}>PixelLoad Pro</Text>

          <Text style={styles.proText}>
            Pro will unlock faster AI limits, real downloader queues, offline vault tools,
            cloud sync and premium automation.
          </Text>

          <GlowButton
            title="Preview Pro Upgrade"
            onPress={() =>
              Alert.alert(
                "PixelLoad Pro",
                "Payments will be activated after downloader testing and Play Store readiness."
              )
            }
            icon={<Crown color="#020617" size={18} />}
          />
        </GlassCard>
      </Reveal>

      <Reveal delay={260}>
        <Text style={styles.sectionTitle}>Product info</Text>

        <InfoRow title="App" value="PixelLoad V2" />
        <InfoRow title="Creator" value="Vision Pixels" />
        <InfoRow title="AI System" value="Visionco AI" />
        <InfoRow title="API" value="api.visionpixels.autos" />
        <InfoRow title="Build Target" value="Android APK Preview" />
      </Reveal>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function MiniStat({ icon, label, value }: any) {
  return (
    <GlassCard style={styles.miniStat}>
      <View style={styles.miniIcon}>{icon}</View>
      <Text style={styles.miniValue}>{value}</Text>
      <Text style={styles.miniLabel}>{label}</Text>
    </GlassCard>
  );
}

function InfoRow({ title, value }: { title: string; value: string }) {
  return (
    <GlassCard style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Info color={colors.cyan} size={18} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </GlassCard>
  );
}

const styles: any = {
  hero: {
    padding: 22,
    marginBottom: 28,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 26,
    backgroundColor: colors.cyanSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.22)",
  },

  title: {
    color: colors.text,
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: -1.4,
    marginBottom: 10,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 18,
  },

  planBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.22)",
    backgroundColor: "rgba(0,229,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },

  planText: {
    color: colors.cyan,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 26,
  },

  miniStat: {
    width: "47.8%",
    padding: 16,
  },

  miniIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: colors.cyanSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.18)",
  },

  miniValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4,
  },

  miniLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  proCard: {
    padding: 20,
    marginBottom: 26,
  },

  proIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.cyanSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.22)",
  },

  proTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.6,
    marginBottom: 8,
  },

  proText: {
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 18,
  },

  infoRow: {
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.cyanSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  infoTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 3,
  },

  infoValue: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },
};