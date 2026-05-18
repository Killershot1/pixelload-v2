import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Image,
  Linking,
} from "react-native";

import {
  ExternalLink,
  Sparkles,
  Search,
  BrainCircuit,
  WandSparkles,
  PlayCircle,
} from "lucide-react-native";

import { aiSearch, summarizeVideo } from "../services/api";
import AppTextInput from "../components/AppTextInput";
import GlassCard from "../components/GlassCard";
import GlowButton from "../components/GlowButton";
import Shimmer from "../components/Shimmer";
import Reveal from "../components/Reveal";
import { colors } from "../constants/theme";

export default function AIScreen() {
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  async function handleSearch() {
    if (!query.trim()) return Alert.alert("Enter a search query");

    try {
      setLoading(true);
      setResults([]);
      setSummary(null);

      const data = await aiSearch(query);
      setResults(data.results || []);
    } catch {
      Alert.alert("Error", "Could not connect to Visionco AI");
    } finally {
      setLoading(false);
    }
  }

  async function handleSummary() {
    if (!url.trim()) return Alert.alert("Paste a video URL");

    try {
      setLoading(true);
      setSummary(null);
      setResults([]);

      const data = await summarizeVideo(url);
      setSummary(data);
    } catch {
      Alert.alert("Error", "Could not summarize video");
    } finally {
      setLoading(false);
    }
  }

  function openUrl(link: string) {
    if (!link) return;
    Linking.openURL(link);
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Reveal>
        <GlassCard style={styles.heroConsole}>
          <Shimmer />

          <View style={styles.heroIcon}>
            <BrainCircuit color={colors.cyan} size={30} />
          </View>

          <Text style={styles.title}>Visionco AI</Text>

          <Text style={styles.subtitle}>
            A cosmic intelligence console for discovering, understanding and organizing media.
          </Text>

          <View style={styles.statusRow}>
            <View style={styles.liveDot} />
            <Text style={styles.statusText}>LIVE BACKEND ONLINE</Text>
          </View>
        </GlassCard>
      </Reveal>

      <Reveal delay={100}>
        <Text style={styles.sectionTitle}>Ask the media universe</Text>

        <AppTextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search videos, ideas, trends..."
          style={{ marginBottom: 14 }}
        />

        <GlowButton
          title="Run AI Search"
          onPress={handleSearch}
          icon={<Search color="#020617" size={18} />}
        />
      </Reveal>

      <Reveal delay={180}>
        <View style={{ height: 20 }} />

        <Text style={styles.sectionTitle}>Summarize any video</Text>

        <AppTextInput
          value={url}
          onChangeText={setUrl}
          placeholder="Paste YouTube or video URL..."
          style={{ marginBottom: 14 }}
        />

        <GlowButton
          title="Summarize With AI"
          onPress={handleSummary}
          icon={<WandSparkles color="#020617" size={18} />}
        />
      </Reveal>

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.cyan} />
          <Text style={styles.loadingText}>Visionco AI is thinking...</Text>
        </View>
      )}

      {summary && (
        <Reveal>
          <GlassCard style={styles.summaryCard}>
            <Shimmer />

            <View style={styles.resultHeader}>
              <View style={styles.resultIcon}>
                <WandSparkles color={colors.cyan} size={22} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.cardBadge}>AI SUMMARY</Text>
                <Text style={styles.cardTitle}>Video Intelligence Report</Text>
              </View>
            </View>

            <Text style={styles.cardBody}>
              {summary.summary || "No summary available"}
            </Text>

            {(summary.keyPoints || []).map((point: string, index: number) => (
              <Text key={index} style={styles.point}>
                • {point}
              </Text>
            ))}

            <View style={styles.metaPill}>
              <Text style={styles.metaText}>
                Sentiment: {summary.sentiment || "neutral"}
              </Text>
            </View>
          </GlassCard>
        </Reveal>
      )}

      {results.length > 0 && (
        <Reveal>
          <Text style={styles.resultsTitle}>AI Recommended Results</Text>
        </Reveal>
      )}

      {results.map((item, index) => (
        <Reveal key={index} delay={index * 80}>
          <GlassCard style={styles.resultCard}>
            <Shimmer />

            {!!item.thumbnail && (
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            )}

            <View style={styles.resultContent}>
              <View style={styles.resultHeader}>
                <View style={styles.resultIcon}>
                  <PlayCircle color={colors.cyan} size={22} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardBadge}>VISIONCO AI PICK</Text>
                  <Text style={styles.cardTitle}>
                    {item.title || "Untitled"}
                  </Text>
                </View>
              </View>

              <Text style={styles.cardBody}>
                {item.reason || "No AI reasoning available."}
              </Text>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => openUrl(item.url)}
                activeOpacity={0.85}
              >
                <ExternalLink color={colors.cyan} size={16} />
                <Text style={styles.linkText}>Open Source</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </Reveal>
      ))}
    </ScrollView>
  );
}

const styles: any = {
  heroConsole: {
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

  statusRow: {
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

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.cyan,
  },

  statusText: {
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

  loadingBox: {
    marginTop: 24,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  loadingText: {
    color: colors.muted,
    fontWeight: "700",
  },

  summaryCard: {
    marginTop: 24,
    marginBottom: 22,
    padding: 18,
  },

  resultsTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 24,
    marginBottom: 16,
    letterSpacing: -0.6,
  },

  resultCard: {
    marginBottom: 16,
    padding: 0,
  },

  thumbnail: {
    width: "100%",
    height: 185,
    backgroundColor: "#020617",
  },

  resultContent: {
    padding: 18,
  },

  resultHeader: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  resultIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.cyanSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.18)",
  },

  cardBadge: {
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

  cardBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },

  point: {
    color: "#D1D5DB",
    marginTop: 10,
    lineHeight: 21,
  },

  metaPill: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.22)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 16,
    backgroundColor: "rgba(0,229,255,0.08)",
  },

  metaText: {
    color: colors.cyan,
    fontWeight: "800",
    fontSize: 12,
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