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

import { Download, ExternalLink, Trash2 } from "lucide-react-native";
import { getDownloads, saveDownload, clearDownloads, SavedDownload } from "../storage/downloads";

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

    Alert.alert("Saved", "Video saved to your download history");
  }

  async function handleClear() {
    await clearDownloads();
    await loadDownloads();
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Downloads</Text>
      <Text style={styles.subtitle}>Save links, thumbnails and download history locally.</Text>

      <TextInput
        value={url}
        onChangeText={setUrl}
        placeholder="Paste YouTube/video URL..."
        placeholderTextColor="#6B7280"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Download color="#080A12" size={18} />
        <Text style={styles.buttonText}>Save Download</Text>
      </TouchableOpacity>

      {downloads.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Trash2 color="#F87171" size={16} />
          <Text style={styles.clearText}>Clear History</Text>
        </TouchableOpacity>
      )}

      {downloads.length === 0 ? (
        <Text style={styles.empty}>No saved downloads yet.</Text>
      ) : (
        downloads.map((item) => (
          <View key={item.id} style={styles.card}>
            {item.thumbnail ? (
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            ) : (
              <View style={styles.noThumb}>
                <Text style={styles.noThumbText}>No thumbnail</Text>
              </View>
            )}

            <View style={{ padding: 16 }}>
              <Text style={styles.badge}>{item.status.toUpperCase()}</Text>
              <Text style={styles.cardTitle}>Saved Video</Text>
              <Text style={styles.cardUrl} numberOfLines={2}>{item.url}</Text>
              <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleString()}</Text>

              <TouchableOpacity style={styles.linkButton} onPress={() => Linking.openURL(item.url)}>
                <ExternalLink color="#00E5FF" size={16} />
                <Text style={styles.linkText}>Open Link</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles: any = {
  title: { color: "#FFFFFF", fontSize: 34, fontWeight: "900", marginBottom: 6 },
  subtitle: { color: "#A1A1AA", fontSize: 15, lineHeight: 22, marginBottom: 26 },
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
    marginBottom: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  buttonText: { color: "#080A12", fontWeight: "900", fontSize: 15 },
  clearButton: {
    borderWidth: 1,
    borderColor: "#7F1D1D",
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  clearText: { color: "#F87171", fontWeight: "800" },
  empty: { color: "#6B7280", textAlign: "center", marginTop: 30 },
  card: {
    backgroundColor: "#111827",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1F2937",
    marginBottom: 16,
    overflow: "hidden",
  },
  thumbnail: { width: "100%", height: 180, backgroundColor: "#0B0F19" },
  noThumb: {
    height: 150,
    backgroundColor: "#0B0F19",
    alignItems: "center",
    justifyContent: "center",
  },
  noThumbText: { color: "#6B7280" },
  badge: { color: "#00E5FF", fontSize: 11, fontWeight: "900", letterSpacing: 1, marginBottom: 8 },
  cardTitle: { color: "#FFFFFF", fontSize: 17, fontWeight: "900", marginBottom: 8 },
  cardUrl: { color: "#A1A1AA", lineHeight: 20 },
  cardDate: { color: "#6B7280", marginTop: 10, fontSize: 12 },
  linkButton: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#00E5FF",
    borderRadius: 14,
    paddingVertical: 11,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  linkText: { color: "#00E5FF", fontWeight: "800" },
};