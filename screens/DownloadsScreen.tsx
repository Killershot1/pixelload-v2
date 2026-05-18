import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
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
} from "lucide-react-native";

import {
  getDownloads,
  saveDownload,
  clearDownloads,
  SavedDownload,
} from "../storage/downloads";

import GlassCard from "../components/GlassCard";
import GlowButton from "../components/GlowButton";
import AppTextInput from "../components/AppTextInput";
import Shimmer from "../components/Shimmer";
import Reveal from "../components/Reveal";
import { colors } from "../constants/theme";

export default function DownloadsScreen() {
  const [url, setUrl] = useState("");
  const [downloads, setDownloads] = useState<SavedDownload[]>([]);

  useEffect(() => {
    loadDownloads();
  }, []);

  async function loadDownloads() {
    const data = await getDownloads();
    setDownloads(data);
  }

  async function handleSave() {
    if (!url.trim()) return Alert.alert("Paste a video URL first");

    await saveDownload(url.trim());
    setUrl("");
    await loadDownloads();

    Alert.alert("Saved", "Media added to your vault");
  }

  async function handleClear() {
    Alert.alert("Clear Vault", "Delete all saved media history?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearDownloads();
          await loadDownloads();
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
            Save media links, preview thumbnails and prepare downloads for offline access.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statNumber}>{downloads.length}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>

            <View style={styles.statPill}>
              <Text style={styles.statNumber}>Local</Text>
              <Text style={styles.statLabel}>Storage</Text>
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
          title="Save To Vault"
          onPress={handleSave}
          icon={<Download color="#020617" size={18} />}
        />

        {downloads.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Trash2 color="#F87171" size={16} />
            <Text style={styles.clearText}>Clear Vault</Text>
          </TouchableOpacity>
        )}
      </Reveal>

      <Reveal delay={180}>
        <Text style={styles.sectionTitle}>Saved media</Text>
      </Reveal>

      {downloads.length === 0 ? (
        <Reveal>
          <GlassCard style={styles.emptyCard}>
            <Sparkles color={colors.cyan} size={28} />
            <Text style={styles.emptyTitle}>Your vault is empty</Text>
            <Text style={styles.emptyText}>
              Paste a media link above and PixelLoad will save it here with thumbnail memory.
            </Text>
          </GlassCard>
        </Reveal>
      ) : (
        downloads.map((item, index) => (
          <Reveal key={item.id} delay={index * 70}>
            <GlassCard style={styles.mediaCard}>
              <Shimmer />

              {item.thumbnail ? (
                <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              ) : (
                <View style={styles.noThumb}>
                  <PlayCircle color={colors.dim} size={36} />
                  <Text style={styles.noThumbText}>No thumbnail detected</Text>
                </View>
              )}

              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIcon}>
                    <PlayCircle color={colors.cyan} size={22} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.badge}>{item.status.toUpperCase()}</Text>
                    <Text style={styles.cardTitle}>Saved Media</Text>
                  </View>
                </View>

                <Text style={styles.cardUrl} numberOfLines={2}>
                  {item.url}
                </Text>

                <View style={styles.timeRow}>
                  <Clock3 color={colors.dim} size={14} />
                  <Text style={styles.cardDate}>
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => Linking.openURL(item.url)}
                  activeOpacity={0.85}
                >
                  <ExternalLink color={colors.cyan} size={16} />
                  <Text style={styles.linkText}>Open Source</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </Reveal>
        ))
      )}
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

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },

  cardDate: {
    color: colors.dim,
    fontSize: 12,
    fontWeight: "700",
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
};