import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "pixelload_downloads";

export async function saveDownload(url: string) {
  const existing = await getDownloads();

  const updated = [
    {
      id: Date.now().toString(),
      url,
      createdAt: new Date().toISOString(),
    },
    ...existing,
  ];

  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}

export async function getDownloads() {
  const data = await AsyncStorage.getItem(KEY);

  if (!data) return [];

  return JSON.parse(data);
}