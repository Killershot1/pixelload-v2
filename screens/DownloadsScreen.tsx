import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  View,
  Image,
  Linking,
} from "react-native";

import {
  Download,
  ExternalLink,
  Trash2,
  Archive,
  Sparkles,
  Clock3,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Music2,
  Globe2,
  Video,
  Camera,
  Radio,
  Lock,
} from "lucide-react-native";

import {
  getDownloads,
  saveDownload,
  clearDownloads,
  SavedDownload,
} from "../storage/downloads";

import {
  analyzeMediaUrl,
  createDownloadJob,
  simulateDownload,
} from "../services/mediaEngine";

import {
  analyzeDownloadUrl,
  startDownloadJob,
  getDownloadProgress,
} from "../services/downloadApi";

import { DownloadJob, MediaQuality, MediaSource } from "../types/media";

import GlassCard from "../components/GlassCard";
import GlowButton from "../components/GlowButton";
import AppTextInput from "../components/AppTextInput";
import Shimmer from "../components/Shimmer";
import Reveal from "../components/Reveal";
import AdSlot from "../components/AdSlot";

import { colors } from "../constants/theme";
import { isFeatureEnabled } from "../config/features";

import {
  canUseFeature,
  getUsage,
  incrementUsage,
  UsageState,
} from "../storage/usage";

import { isProUser } from "../storage/subscription";

const QUALITIES: MediaQuality[] = ["audio", "360p", "480p", "720p", "1080p"];

export default function DownloadsScreen() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState<MediaQuality>("720p");
  const [downloads, setDownloads] = useState<SavedDownload[]>([]);
  const [jobs, setJobs] = useState<DownloadJob[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [usage, setUsage] = useState<UsageState | null>(null);
  const [pro, setPro] = useState(false);

  const realDownloaderEnabled = isFeatureEnabled("realDownloaderApi");

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    await Promise.all([loadDownloads(), refreshUsage()]);
  }

  async function refreshUsage() {
    const [usageState, proState] = await Promise.all([getUsage(), isProUser()]);
    setUsage(usageState);
    setPro(proState);
  }

  async function loadDownloads() {
    const data = await getDownloads();
    setDownloads(data);
  }

  async function handleSave() {
    if (!url.trim()) return Alert.alert("Paste a video URL first");

    const permission = await canUseFeature("download", pro);

    if (!permission.allowed) {
      return Alert.alert(
        "Free limit reached",
        "You have used all free download preparations for today. Upgrade to Pro will unlock unlimited downloads."
      );
    }

    try {
      setIsAnalyzing(true);

      const metadata = realDownloaderEnabled
        ? (await analyzeDownloadUrl(url.trim())).metadata
        : await analyzeMediaUrl(url.trim());

      if (!metadata) {
        throw new Error("Could not analyze media");
      }

      const job = createDownloadJob(metadata, quality);

      await saveDownload(url.trim());
      await incrementUsage("download");
      await Promise.all([loadDownloads(), refreshUsage()]);

      setJobs((prev) => [{ ...job, status: "ready", progress: 0 }, ...prev]);
      setUrl("");

      Alert.alert(
        "Ready",
        realDownloaderEnabled
          ? "Media analyzed using the real downloader API."
          : "Media analyzed in simulated downloader mode."
      );
    } catch {
      Alert.alert("Error", "Could not analyze this media link");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleStartDownload(job: DownloadJob) {
    if (realDownloaderEnabled) {
      await handleRealDownload(job);
      return;
    }

    await handleSimulatedDownload(job);
  }

  async function handleSimulatedDownload(job: DownloadJob) {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id ? { ...j, status: "downloading", progress: 0 } : j
      )
    );

    try {
      const completed = await simulateDownload(
        { ...job, status: "downloading", progress: 0 },
        (progress) => {
          setJobs((prev) =>
            prev.map((j) => (j.id === job.id ? { ...j, progress } : j))
          );
        }
      );

      setJobs((prev) => prev.map((j) => (j.id === job.id ? completed : j)));
    } catch {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? { ...j, status: "failed", error: "Download failed" }
            : j
        )
      );
    }
  }

  async function handleRealDownload(job: DownloadJob) {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id ? { ...j, status: "downloading", progress: 0 } : j
      )
    );

    const started = await startDownloadJob(job.url, job.quality);

    if (!started.success || !started.job) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? {
                ...j,
                status: "failed",
                error: started.error || "Could not start real download",
              }
            : j
        )
      );
      return;
    }

    const apiJob = started.job;

    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...apiJob, status: "downloading" } : j))
    );

    for (let i = 0; i < 30; i++) {
      await wait(1200);

      const progress = await getDownloadProgress(apiJob.id);

      if (!progress.success) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === apiJob.id
              ? {
                  ...j,
                  status: "failed",
                  error: progress.error || "Progress check failed",
                }
              : j
          )
        );
        return;
      }

      setJobs((prev) =>
        prev.map((j) =>
          j.id === apiJob.id
            ? {
                ...j,
                progress: progress.progress,
                status: progress.status,
                fileUri: progress.fileUri,
                error: progress.error,
              }
            : j
        )
      );

      if (progress.status === "completed" || progress.status === "failed") {
        return;
      }
    }
  }

  async function handleClear() {
    Alert.alert("Clear Vault", "Delete all saved media history and queue?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearDownloads();
          await loadDownloads();
          setJobs([]);
        },
      },
    ]);
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Reveal>
        <GlassCard style={styles.hero}>
          <Shimmer />

          <View style={styles.heroIcon}>
            <Archive color={colors.cyan} size={30} />
          </View>

          <Text style={styles.title}>Media Vault</Text>

          <Text style={styles.subtitle}>
            Analyze links, choose quality, build a download queue and prepare media for offline access.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statNumber}>{downloads.length}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>

            <View style={styles.statPill}>
              <Text style={styles.statNumber}>{jobs.length}</Text>
              <Text style={styles.statLabel}>Queue</Text>
            </View>
          </View>

          <View style={styles.modePill}>
            <Text style={styles.modeText}>
              {realDownloaderEnabled ? "REAL API MODE" : "SIMULATION MODE"}
            </Text>
          </View>
        </GlassCard>
      </Reveal>

      <Reveal delay={80}>
        <GlassCard style={styles.usageCard}>
          <View style={styles.usageHeader}>
            <View style={styles.usageIcon}>
              {pro ? <Sparkles color={colors.cyan} size={20} /> : <Lock color={colors.cyan} size={20} />}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.usageTitle}>
                {pro ? "Pro download access active" : "Daily download usage"}
              </Text>

              <Text style={styles.usageSub}>
                {pro
                  ? "Unlimited download preparation is active in mock Pro mode."
                  : "Free users can prepare limited downloads per day while Pro is being prepared."}
              </Text>
            </View>
          </View>

          <View style={styles.usageGrid}>
            <UsagePill label="Downloads" used={usage?.download || 0} limit={pro ? "∞" : 5} />
            <UsagePill label="Plan" used={pro ? 1 : 0} limit={pro ? "PRO" : "FREE"} />
          </View>
        </GlassCard>
      </Reveal>

      <AdSlot placement="downloads_queue" isProUser={pro} />

      <Reveal delay={120}>
        <Text style={styles.sectionTitle}>Add media</Text>

        <AppTextInput
          value={url}
          onChangeText={setUrl}
          placeholder="Paste YouTube/TikTok/Instagram URL..."
          style={{ marginBottom: 14 }}
        />

        <Text style={styles.qualityLabel}>Choose quality</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.qualityRail}
        >
          {QUALITIES.map((item) => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.85}
              style={[styles.qualityPill, quality === item && styles.qualityPillActive]}
              onPress={() => setQuality(item)}
            >
              <Text style={[styles.qualityText, quality === item && styles.qualityTextActive]}>
                {item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <GlowButton
          title={isAnalyzing ? "Analyzing..." : "Analyze & Save"}
          onPress={handleSave}
          icon={<Download color="#020617" size={18} />}
        />

        {(downloads.length > 0 || jobs.length > 0) && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Trash2 color="#F87171" size={16} />
            <Text style={styles.clearText}>Clear Vault</Text>
          </TouchableOpacity>
        )}
      </Reveal>

      <Reveal delay={180}>
        <Text style={styles.sectionTitle}>Download queue</Text>
      </Reveal>

      {jobs.length === 0 ? (
        <Reveal>
          <GlassCard style={styles.emptyCard}>
            <Sparkles color={colors.cyan} size={28} />
            <Text style={styles.emptyTitle}>Queue is empty</Text>
            <Text style={styles.emptyText}>
              Paste a media link above and PixelLoad will prepare it for download.
            </Text>
          </GlassCard>
        </Reveal>
      ) : (
        jobs.map((job, index) => (
          <Reveal key={job.id} delay={index * 70}>
            <GlassCard style={styles.mediaCard}>
              <Shimmer />

              {job.thumbnail ? (
                <Image source={{ uri: job.thumbnail }} style={styles.thumbnail} />
              ) : (
                <View style={styles.noThumb}>
                  <PlatformIcon source={job.source} size={38} muted />
                  <Text style={styles.noThumbText}>No thumbnail detected</Text>
                </View>
              )}

              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIcon}>
                    {job.status === "completed" ? (
                      <CheckCircle2 color={colors.cyan} size={22} />
                    ) : job.status === "failed" ? (
                      <AlertTriangle color="#F87171" size={22} />
                    ) : (
                      <Activity color={colors.cyan} size={22} />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.platformRow}>
                      <PlatformBadge source={job.source} />
                      <Text style={styles.badge}>{job.status.toUpperCase()}</Text>
                    </View>

                    <Text style={styles.cardTitle}>{job.title}</Text>
                  </View>
                </View>

                <Text style={styles.cardUrl} numberOfLines={2}>
                  {job.url}
                </Text>

                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${job.progress}%` }]} />
                </View>

                <View style={styles.queueMeta}>
                  <Text style={styles.metaText}>QUALITY: {job.quality.toUpperCase()}</Text>
                  <Text style={styles.metaText}>{job.progress}%</Text>
                </View>

                {job.status === "ready" && (
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => handleStartDownload(job)}
                    activeOpacity={0.85}
                  >
                    <Download color={colors.cyan} size={16} />
                    <Text style={styles.linkText}>Start Download</Text>
                  </TouchableOpacity>
                )}

                {job.status === "completed" && (
                  <View style={styles.completedBox}>
                    <Text style={styles.completedText}>
                      Saved locally: {job.fileUri}
                    </Text>
                  </View>
                )}

                {job.status === "failed" && (
                  <View style={styles.failedBox}>
                    <Text style={styles.failedText}>
                      {job.error || "Download failed"}
                    </Text>
                  </View>
                )}
              </View>
            </GlassCard>
          </Reveal>
        ))
      )}

      <Reveal delay={260}>
        <Text style={styles.sectionTitle}>Saved history</Text>
      </Reveal>

      {downloads.map((item, index) => (
        <Reveal key={item.id} delay={index * 70}>
          <GlassCard style={styles.historyCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Clock3 color={colors.cyan} size={20} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.badge}>{item.status.toUpperCase()}</Text>
                <Text style={styles.cardTitle}>Saved Media</Text>
              </View>
            </View>

            <Text style={styles.cardUrl} numberOfLines={2}>
              {item.url}
            </Text>

            <Text style={styles.cardDate}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL(item.url)}
              activeOpacity={0.85}
            >
              <ExternalLink color={colors.cyan} size={16} />
              <Text style={styles.linkText}>Open Source</Text>
            </TouchableOpacity>
          </GlassCard>
        </Reveal>
      ))}
    </ScrollView>
  );
}

function PlatformBadge({ source }: { source: MediaSource }) {
  return (
    <View style={styles.platformBadge}>
      <PlatformIcon source={source} size={13} />
      <Text style={styles.platformText}>{source.toUpperCase()}</Text>
    </View>
  );
}

function PlatformIcon({
  source,
  size = 18,
  muted = false,
}: {
  source: MediaSource;
  size?: number;
  muted?: boolean;
}) {
  const color = muted ? colors.dim : colors.cyan;

  if (source === "youtube") return <Video color={color} size={size} />;
  if (source === "instagram") return <Camera color={color} size={size} />;
  if (source === "facebook") return <Radio color={color} size={size} />;
  if (source === "tiktok") return <Music2 color={color} size={size} />;

  return <Globe2 color={color} size={size} />;
}

function UsagePill({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number | string;
}) {
  return (
    <View style={styles.usagePill}>
      <Text style={styles.usagePillValue}>
        {used}/{limit}
      </Text>
      <Text style={styles.usagePillLabel}>{label}</Text>
    </View>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const styles: any = {
  hero: { padding: 22, marginBottom: 16 },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
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
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 23, marginBottom: 18 },
  statsRow: { flexDirection: "row", gap: 10 },
  statPill: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.18)",
    backgroundColor: "rgba(0,229,255,0.07)",
    borderRadius: 18,
    padding: 14,
  },
  statNumber: { color: colors.text, fontSize: 18, fontWeight: "900", marginBottom: 4 },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  modePill: {
    alignSelf: "flex-start",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.22)",
    backgroundColor: "rgba(0,229,255,0.08)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modeText: {
    color: colors.cyan,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  usageCard: { padding: 16, marginBottom: 16 },
  usageHeader: { flexDirection: "row", gap: 12, alignItems: "center", marginBottom: 14 },
  usageIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: colors.cyanSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.18)",
  },
  usageTitle: { color: colors.text, fontSize: 16, fontWeight: "900", marginBottom: 3 },
  usageSub: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  usageGrid: { flexDirection: "row", gap: 10 },
  usagePill: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.18)",
    backgroundColor: "rgba(0,229,255,0.07)",
    borderRadius: 16,
    padding: 12,
  },
  usagePillValue: { color: colors.text, fontSize: 17, fontWeight: "900", marginBottom: 4 },
  usagePillLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  qualityLabel: {
    color: colors.muted,
    fontWeight: "900",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 10,
  },
  qualityRail: { gap: 10, paddingRight: 20, marginBottom: 16 },
  qualityPill: {
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    backgroundColor: "rgba(148,163,184,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  qualityPillActive: {
    borderColor: "rgba(0,229,255,0.55)",
    backgroundColor: "rgba(0,229,255,0.14)",
  },
  qualityText: { color: colors.dim, fontSize: 12, fontWeight: "900", letterSpacing: 0.8 },
  qualityTextActive: { color: colors.cyan },
  clearButton: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.35)",
    backgroundColor: "rgba(248,113,113,0.08)",
    borderRadius: 16,
    paddingVertical: 13,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  clearText: { color: "#F87171", fontWeight: "900" },
  emptyCard: { alignItems: "center", padding: 24, marginBottom: 30 },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 14,
    marginBottom: 8,
  },
  emptyText: { color: colors.muted, textAlign: "center", lineHeight: 22 },
  mediaCard: { marginBottom: 18, padding: 0 },
  historyCard: { marginBottom: 14, padding: 18 },
  thumbnail: { width: "100%", height: 190, backgroundColor: "#020617" },
  noThumb: {
    height: 170,
    backgroundColor: "rgba(2,6,23,0.72)",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  noThumbText: { color: colors.dim, fontWeight: "700" },
  cardContent: { padding: 18 },
  cardHeader: { flexDirection: "row", gap: 12, alignItems: "center", marginBottom: 12 },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.cyanSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.18)",
  },
  platformRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 5,
    flexWrap: "wrap",
  },
  platformBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.22)",
    backgroundColor: "rgba(0,229,255,0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  platformText: { color: colors.cyan, fontSize: 9, fontWeight: "900", letterSpacing: 0.8 },
  badge: { color: colors.cyan, fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: "900", letterSpacing: -0.4 },
  cardUrl: { color: colors.muted, lineHeight: 21 },
  cardDate: { color: colors.dim, fontSize: 12, fontWeight: "700", marginTop: 10 },
  progressTrack: {
    height: 9,
    borderRadius: 999,
    backgroundColor: "rgba(148,163,184,0.14)",
    marginTop: 16,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 999, backgroundColor: colors.cyan },
  queueMeta: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  metaText: { color: colors.dim, fontSize: 12, fontWeight: "800" },
  linkButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.45)",
    backgroundColor: "rgba(0,229,255,0.08)",
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  linkText: { color: colors.cyan, fontWeight: "900" },
  completedBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(0,229,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.2)",
  },
  completedText: { color: colors.cyan, fontSize: 12, fontWeight: "800" },
  failedBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(248,113,113,0.08)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.25)",
  },
  failedText: { color: "#F87171", fontSize: 12, fontWeight: "800" },
};