import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Image,
  Linking,
} from "react-native";

import { ExternalLink, Sparkles } from "lucide-react-native";
import { aiSearch, summarizeVideo } from "../services/api";

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
      <Text style={styles.title}>Visionco AI ⚡</Text>
      <Text style={styles.subtitle}>
        Search, summarize and discover videos with AI.
      </Text>

      <Text style={styles.label}>AI Search</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search videos..."
        placeholderTextColor="#6B7280"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Sparkles color="#080A12" size={18} />
        <Text style={styles.buttonText}>Search with AI</Text>
      </TouchableOpacity>

      <Text style={styles.label}>AI Summary</Text>
      <TextInput
        value={url}
        onChangeText={setUrl}
        placeholder="Paste YouTube URL..."
        placeholderTextColor="#6B7280"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSummary}>
        <Sparkles color="#080A12" size={18} />
        <Text style={styles.buttonText}>Summarize Video</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#00E5FF"
          style={{ marginTop: 20, marginBottom: 20 }}
        />
      )}

      {summary && (
        <View style={styles.summaryCard}>
          <Text style={styles.cardBadge}>AI SUMMARY</Text>
          <Text style={styles.cardTitle}>Video Summary</Text>
          <Text style={styles.cardBody}>
            {summary.summary || "No summary available"}
          </Text>

          {(summary.keyPoints || []).map((point: string, index: number) => (
            <Text key={index} style={styles.point}>
              • {point}
            </Text>
          ))}

          <Text style={styles.sentiment}>
            Sentiment: {summary.sentiment || "neutral"}
          </Text>
        </View>
      )}

      {results.length > 0 && (
        <Text style={styles.resultsTitle}>Recommended Results</Text>
      )}

      {results.map((item, index) => (
        <View key={index} style={styles.resultCard}>
          {!!item.thumbnail && (
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          )}

          <View style={{ padding: 16 }}>
            <Text style={styles.cardBadge}>VISIONCO AI PICK</Text>
            <Text style={styles.cardTitle}>{item.title || "Untitled"}</Text>

            <Text style={styles.cardBody}>
              {item.reason || "No AI reasoning available."}
            </Text>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => openUrl(item.url)}
            >
              <ExternalLink color="#00E5FF" size={16} />
              <Text style={styles.linkText}>Open YouTube</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles: any = {
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 6,
  },
  subtitle: {
    color: "#A1A1AA",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 26,
  },
  label: {
    color: "#FFFFFF",
    fontWeight: "800",
    marginBottom: 10,
    fontSize: 15,
  },
  input: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: "#FFFFFF",
    marginBottom: 14,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#00E5FF",
    borderRadius: 18,
    paddingVertical: 16,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  buttonText: {
    color: "#080A12",
    fontWeight: "900",
    fontSize: 15,
  },
  resultsTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
    marginBottom: 14,
  },
  resultCard: {
    backgroundColor: "#111827",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1F2937",
    marginBottom: 16,
    overflow: "hidden",
  },
  summaryCard: {
    backgroundColor: "#111827",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1F2937",
    padding: 18,
    marginBottom: 22,
  },
  thumbnail: {
    width: "100%",
    height: 180,
    backgroundColor: "#0B0F19",
  },
  cardBadge: {
    color: "#00E5FF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 8,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  cardBody: {
    color: "#A1A1AA",
    fontSize: 14,
    lineHeight: 21,
  },
  point: {
    color: "#D1D5DB",
    marginTop: 8,
    lineHeight: 20,
  },
  sentiment: {
    color: "#00E5FF",
    marginTop: 14,
    fontWeight: "800",
  },
  linkButton: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#00E5FF",
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  linkText: {
    color: "#00E5FF",
    fontWeight: "800",
  },
};