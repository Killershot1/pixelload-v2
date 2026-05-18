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
  PlayCircle,
  Sparkles,
  Clock3,
  Activity,
  CheckCircle2,
  AlertTriangle,
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

import { DownloadJob } from "../types/media";

import GlassCard from "../components/GlassCard";
import GlowButton from "../components/GlowButton";
import AppTextInput from "../components/AppTextInput";
import Shimmer from "../components/Shimmer";
import Reveal from "../components/Reveal";
import { colors } from "../constants/theme";

export default function DownloadsScreen() {
  const [url, setUrl] = useState("");
  const [downloads, setDownloads] = useState<SavedDownload[]>([]);
  const [jobs, setJobs] = useState<DownloadJob[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadDownloads();
  }, []);

  async function loadDownloads() {
    const data = await getDownloads();
    setDownloads(data);
  }

  async function handleSave() {
    if (!url.trim()) return Alert.alert("Paste a video URL first");

    try {
      setIsAnalyzing(true);

      const metadata = await analyzeMediaUrl(url.trim());
      const job = createDownloadJob(metadata, "720p");

      await saveDownload(url.trim());
      await loadDownloads();

      setJobs((prev) => [
        {
          ...job,
          status: "ready",
          progress: 0,
        },
        ...prev,
      ]);

      setUrl("");
      Alert.alert("Ready", "Media analyzed and added to your download queue");
    } catch {
      Alert.alert("Error", "Could not analyze this media link");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleStartDownload(job: DownloadJob) {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id
          ? { ...j, status: "downloading", progress: 0 }
          : j
      )
    );

    try {
      const completed = await simulateDownload(
        {
          ...job,
          status: "downloading",
          progress: 0,
        },
        (progress) => {
          setJobs((prev) =>
            prev.map((j) =>
              j.id === job.id ? { ...j, progress } : j
            )
          );
        }
      );

      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id ? completed : j
        )
      );
    } catch {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? {
                ...j,
                status: "failed",
                error: "Download failed",
              }
            : j
        )
      );
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
            Analyze links, build a download queue and prepare media for offline access.
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
        </GlassCard>
      </Reveal>

      <Reveal delay={100}>
        <Text style={styles.sectionTitle}>Add media</Text>

        <AppTextInput
          value={url}
          onChangeText={setUrl}
          placeholder="Paste YouTube/video URL..."
          style={{ marginBottom: 14 }}
        />

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
                  <PlayCircle color={colors.dim} size={36} />
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
                    <Text style={styles.badge}>{job.status.toUpperCase()}</Text>
                    <Text style={styles.cardTitle}>{job.title}</Text>
                  </View>
                </View>

                <Text style={styles.cardUrl} numberOfLines={2}>
                  {job.url}
                </Text>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${job.progress}%`,
                      },
                    ]}
                  />
                </View>

                <View style={styles.queueMeta}>
                  <Text style={styles.metaText}>{job.quality}</Text>
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

const styles: any = {
  hero: {
    padding: 22,
    marginBottom: 28,
  },

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

  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 18,
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
  },

  statPill: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.18)",
    backgroundColor: "rgba(0,229,255,0.07)",
    borderRadius: 18,
    padding: 14,
  },

  statNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4,
  },

  statLabel: {
    color: colors.muted,
    fontSize: 12,
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

  clearText: {
    color: "#F87171",
    fontWeight: "900",
  },

  emptyCard: {
    alignItems: "center",
    padding: 24,
    marginBottom: 30,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 14,
    marginBottom: 8,
  },

  emptyText: {
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
  },

  mediaCard: {
    marginBottom: 18,
    padding: 0,
  },

  historyCard: {
    marginBottom: 14,
    padding: 18,
  },

  thumbnail: {
    width: "100%",
    height: 190,
    backgroundColor: "#020617",
  },

  noThumb: {
    height: 170,
    backgroundColor: "rgba(2,6,23,0.72)",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  noThumbText: {
    color: colors.dim,
    fontWeight: "700",
  },

  cardContent: {
    padding: 18,
  },

  cardHeader: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
  },

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

  badge: {
    color: colors.cyan,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.1,
    marginBottom: 4,
  },

  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  cardUrl: {
    color: colors.muted,
    lineHeight: 21,
  },

  cardDate: {
    color: colors.dim,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 10,
  },

  progressTrack: {
    height: 9,
    borderRadius: 999,
    backgroundColor: "rgba(148,163,184,0.14)",
    marginTop: 16,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.cyan,
  },

  queueMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  metaText: {
    color: colors.dim,
    fontSize: 12,
    fontWeight: "800",
  },

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

  linkText: {
    color: colors.cyan,
    fontWeight: "900",
  },

  completedBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(0,229,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.2)",
  },

  completedText: {
    color: colors.cyan,
    fontSize: 12,
    fontWeight: "800",
  },
};