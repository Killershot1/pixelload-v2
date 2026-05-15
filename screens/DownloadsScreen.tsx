import React, { useEffect, useState } from "react";
import {
  View,
 Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import { Download } from "lucide-react-native";
import { getDownloads, saveDownload } from "../storage/downloads";

export default function DownloadsScreen() {
  const [url, setUrl] = useState("");
  const [downloads, setDownloads] = useState<any[]>([]);

  useEffect(() => {
    loadDownloads();
  }, []);

  async function loadDownloads() {
    const data = await getDownloads();
    setDownloads(data);
  }

  async function handleSave() {
    if (!url.trim()) {
      return Alert.alert("Paste a video URL first");
    }

    await saveDownload(url);

    setUrl("");
    loadDownloads();

    Alert.alert("Saved", "Download added successfully");
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Downloads</Text>

      <Text style={styles.subtitle}>
        Save and manage download history locally.
      </Text>

      <TextInput
        value={url}
        onChangeText={setUrl}
        placeholder="Paste video URL..."
        placeholderTextColor="#6B7280"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Download color="#080A12" size={18} />
        <Text style={styles.buttonText}>Save Download</Text>
      </TouchableOpacity>

      {downloads.length === 0 ? (
        <Text style={styles.empty}>No saved downloads yet.</Text>
      ) : (
        downloads.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>Saved Download</Text>

            <Text style={styles.cardUrl}>{item.url}</Text>

            <Text style={styles.cardDate}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        ))
      )}
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
  empty: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 30,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#1F2937",
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },
  cardUrl: {
    color: "#00E5FF",
    lineHeight: 20,
  },
  cardDate: {
    color: "#6B7280",
    marginTop: 12,
    fontSize: 12,
  },
};