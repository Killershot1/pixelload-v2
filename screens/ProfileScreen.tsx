import React, { useEffect, useState } from "react";
import { Text, ScrollView, View, TouchableOpacity, Alert } from "react-native";

import {
  User,
  Crown,
  Sparkles,
  ShieldCheck,
  Zap,
  Info,
  Rocket,
  Server,
  RotateCcw,
  Lock,
  Unlock,
  Trash2,
  Gauge,
  Cloud,
  HardDriveDownload,
} from "lucide-react-native";

import GlassCard from "../components/GlassCard";
import GlowButton from "../components/GlowButton";
import Shimmer from "../components/Shimmer";
import Reveal from "../components/Reveal";
import AdSlot from "../components/AdSlot";

import { resetOnboarding } from "../storage/onboarding";
import {
  activateMockPro,
  getSubscription,
  resetToFreePlan,
  SubscriptionState,
} from "../storage/subscription";
import { getUsage, resetUsage, UsageState } from "../storage/usage";
import { getLocalAppStatus, statusLabel } from "../services/appStatus";
import { isFeatureEnabled } from "../config/features";

import { colors } from "../constants/theme";

export default function ProfileScreen() {
  const [subscription, setSubscription] = useState<SubscriptionState | null>(null);
  const [usage, setUsage] = useState<UsageState | null>(null);

  const realDownloaderEnabled = isFeatureEnabled("realDownloaderApi");

  useEffect(() => {
    refreshState();
  }, []);

  async function refreshState() {
    const [subscriptionState, usageState] = await Promise.all([
      getSubscription(),
      getUsage(),
    ]);

    setSubscription(subscriptionState);
    setUsage(usageState);
  }

  async function handleResetIntro() {
    await resetOnboarding();
    Alert.alert("Intro reset", "The onboarding intro will show again after you restart the app.");
  }

  async function handleActivatePro() {
    await activateMockPro();
    await refreshState();
    Alert.alert("Mock Pro activated", "PixelLoad Pro mode is now active locally for development testing.");
  }

  async function handleResetFree() {
    await resetToFreePlan();
    await refreshState();
    Alert.alert("Free plan restored", "The app is now back on the Free plan locally.");
  }

  async function handleResetUsage() {
    await resetUsage();
    await refreshState();
    Alert.alert("Usage reset", "Daily AI and download usage counters have been reset.");
  }

  const isPro = subscription?.plan === "pro";
  const systems = getLocalAppStatus();

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
            Manage your PixelLoad experience, Visionco AI access, daily limits and future Pro tools.
          </Text>

          <View style={styles.planBadge}>
            {isPro ? <Unlock color={colors.cyan} size={16} /> : <Lock color={colors.cyan} size={16} />}
            <Text style={styles.planText}>{isPro ? "PRO PLAN ACTIVE" : "FREE PLAN ACTIVE"}</Text>
          </View>
        </GlassCard>
      </Reveal>

      <Reveal delay={100}>
        <Text style={styles.sectionTitle}>System status</Text>

        <View style={styles.grid}>
          <MiniStat icon={<Sparkles color={colors.cyan} size={22} />} label="AI Engine" value={statusLabel(systems.ai)} />
          <MiniStat icon={<Server color={colors.cyan} size={22} />} label="Backend" value={statusLabel(systems.api)} />
          <MiniStat icon={<ShieldCheck color={colors.cyan} size={22} />} label="Storage" value={statusLabel(systems.storage)} />
          <MiniStat icon={<Zap color={colors.cyan} size={22} />} label="Ads" value={statusLabel(systems.ads)} />
        </View>
      </Reveal>

      <Reveal delay={140}>
        <Text style={styles.sectionTitle}>Downloader mode</Text>

        <GlassCard style={styles.backendCard}>
          <Shimmer />

          <View style={styles.backendIcon}>
            {realDownloaderEnabled ? (
              <Cloud color={colors.cyan} size={28} />
            ) : (
              <HardDriveDownload color={colors.cyan} size={28} />
            )}
          </View>

          <Text style={styles.backendTitle}>
            {realDownloaderEnabled ? "Real backend enabled" : "Simulation mode active"}
          </Text>

          <Text style={styles.backendText}>
            {realDownloaderEnabled
              ? "PixelLoad will send download analysis and progress requests to the real Vision Pixels downloader API."
              : "PixelLoad is currently using the safe local simulation engine. This keeps testing stable until the backend downloader is fully ready."}
          </Text>

          <View style={styles.backendPill}>
            <Text style={styles.backendPillText}>
              {realDownloaderEnabled ? "REAL API MODE" : "SAFE SIMULATION"}
            </Text>
          </View>
        </GlassCard>
      </Reveal>

      <Reveal delay={180}>
        <Text style={styles.sectionTitle}>Daily usage</Text>

        <GlassCard style={styles.usageCard}>
          <Shimmer />

          <View style={styles.usageHeader}>
            <View style={styles.usageIcon}>
              <Gauge color={colors.cyan} size={22} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.usageTitle}>{isPro ? "Unlimited Pro usage" : "Free daily limits"}</Text>
              <Text style={styles.usageSub}>
                {isPro
                  ? "Mock Pro mode removes local free usage limits for testing."
                  : "Free mode tracks daily AI searches, summaries and download preparations."}
              </Text>
            </View>
          </View>

          <View style={styles.usageGrid}>
            <UsageStat label="AI Searches" value={`${usage?.ai_search || 0}/5`} />
            <UsageStat label="Summaries" value={`${usage?.ai_summary || 0}/3`} />
            <UsageStat label="Downloads" value={`${usage?.download || 0}/5`} />
          </View>
        </GlassCard>
      </Reveal>

      <Reveal delay={240}>
        <Text style={styles.sectionTitle}>Upgrade path</Text>

        <GlassCard style={styles.proCard}>
          <Shimmer />

          <View style={styles.proIcon}>
            <Rocket color={colors.cyan} size={28} />
          </View>

          <Text style={styles.proTitle}>PixelLoad Pro</Text>

          <Text style={styles.proText}>
            Pro will unlock unlimited AI usage, real download queues, offline vault tools,
            cloud sync, priority processing and premium automation.
          </Text>

          <GlowButton
            title={isPro ? "Pro Mode Active" : "Preview Pro Upgrade"}
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

      <AdSlot placement="profile_upgrade" isProUser={isPro} />

      <Reveal delay={300}>
        <Text style={styles.sectionTitle}>Developer controls</Text>

        <GlassCard style={styles.devCard}>
          <TouchableOpacity style={styles.devButton} onPress={handleActivatePro} activeOpacity={0.85}>
            <Unlock color={colors.cyan} size={18} />
            <Text style={styles.devButtonText}>Activate mock Pro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.devButton} onPress={handleResetFree} activeOpacity={0.85}>
            <Lock color={colors.cyan} size={18} />
            <Text style={styles.devButtonText}>Return to Free plan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.devButton} onPress={handleResetUsage} activeOpacity={0.85}>
            <Trash2 color={colors.cyan} size={18} />
            <Text style={styles.devButtonText}>Reset daily usage</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.devButton} onPress={handleResetIntro} activeOpacity={0.85}>
            <RotateCcw color={colors.cyan} size={18} />
            <Text style={styles.devButtonText}>Reset onboarding intro</Text>
          </TouchableOpacity>
        </GlassCard>
      </Reveal>

      <Reveal delay={360}>
        <Text style={styles.sectionTitle}>Product info</Text>

        <InfoRow title="App" value="PixelLoad V2" />
        <InfoRow title="Creator" value="Vision Pixels" />
        <InfoRow title="AI System" value="Visionco AI" />
        <InfoRow title="API" value="api.visionpixels.autos" />
        <InfoRow title="Package" value="com.visionpixels.pixelload" />
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

function UsageStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.usageStat}>
      <Text style={styles.usageValue}>{value}</Text>
      <Text style={styles.usageLabel}>{label}</Text>
    </View>
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
  backendCard: {
    padding: 20,
    marginBottom: 26,
  },
  backendIcon: {
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
  backendTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  backendText: {
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 14,
  },
  backendPill: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.22)",
    backgroundColor: "rgba(0,229,255,0.08)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backendPillText: {
    color: colors.cyan,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  usageCard: {
    padding: 18,
    marginBottom: 26,
  },
  usageHeader: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  usageIcon: {
    width: 46,
    height: 46,
    borderRadius: 17,
    backgroundColor: colors.cyanSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.18)",
  },
  usageTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 4,
  },
  usageSub: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  usageGrid: {
    flexDirection: "row",
    gap: 10,
  },
  usageStat: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.18)",
    backgroundColor: "rgba(0,229,255,0.07)",
    borderRadius: 16,
    padding: 12,
  },
  usageValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },
  usageLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
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
  devCard: {
    padding: 12,
    marginBottom: 26,
    gap: 10,
  },
  devButton: {
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.28)",
    backgroundColor: "rgba(0,229,255,0.07)",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  devButtonText: {
    color: colors.cyan,
    fontSize: 14,
    fontWeight: "900",
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