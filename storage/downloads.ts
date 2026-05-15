import AsyncStorage from "@react-native-async-storage/async-storage";
import { getYouTubeThumbnail } from "../services/media";

const KEY = "pixelload_downloads";

export type SavedDownload = {
  id: string;
  url: string;
  thumbnail: string | null;
  createdAt: string;
  status: "saved" | "ready" | "failed";
};

export async function saveDownload(url: string) {
  const existing = await getDownloads();

  const updated: SavedDownload[] = [
    {
      id: Date.now().toString(),
      url,
      thumbnail: getYouTubeThumbnail(url),
      createdAt: new Date().toISOString(),
      status: "saved",
    },
    ...existing,
  ];

  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}

export async function getDownloads(): Promise<SavedDownload[]> {
  const data = await AsyncStorage.getItem(KEY);

  if (!data) return [];

  return JSON.parse(data);
}

export async function clearDownloads() {
  await AsyncStorage.removeItem(KEY);
}