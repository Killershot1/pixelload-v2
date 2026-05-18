import * as FileSystem from "expo-file-system";

import {
  DownloadJob,
  MediaMetadata,
  MediaQuality,
  MediaSource,
} from "../types/media";

export function detectMediaSource(url: string): MediaSource {
  const lower = url.toLowerCase();

  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  if (lower.includes("tiktok.com")) return "tiktok";
  if (lower.includes("instagram.com")) return "instagram";
  if (lower.includes("facebook.com") || lower.includes("fb.watch")) return "facebook";

  return "unknown";
}

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function getThumbnail(url: string): string | null {
  const source = detectMediaSource(url);

  if (source === "youtube") {
    const videoId = extractYouTubeId(url);
    if (!videoId) return null;

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  return null;
}

export async function analyzeMediaUrl(url: string): Promise<MediaMetadata> {
  const source = detectMediaSource(url);
  const thumbnail = getThumbnail(url);

  return {
    id: Date.now().toString(),
    url,
    source,
    title: buildFallbackTitle(url, source),
    thumbnail,
    durationLabel: null,
    author: source === "unknown" ? null : source.toUpperCase(),
    createdAt: new Date().toISOString(),
  };
}

export function createDownloadJob(
  metadata: MediaMetadata,
  quality: MediaQuality = "720p"
): DownloadJob {
  return {
    id: Date.now().toString(),
    url: metadata.url,
    source: metadata.source,
    title: metadata.title,
    thumbnail: metadata.thumbnail,
    quality,
    status: "queued",
    progress: 0,
    fileUri: null,
    error: null,
    createdAt: new Date().toISOString(),
  };
}

export async function simulateDownload(
  job: DownloadJob,
  onProgress?: (progress: number) => void
): Promise<DownloadJob> {
  let progress = 0;

  while (progress < 100) {
    await wait(250);
    progress += 10;
    onProgress?.(progress);
  }

  const safeName = job.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  const documentDirectory =
    FileSystem.Paths?.document?.uri || "file://pixelload/";

  const fileUri = `${documentDirectory}${safeName}_${job.quality}.mp4`;

  return {
    ...job,
    status: "completed",
    progress: 100,
    fileUri,
  };
}

function buildFallbackTitle(url: string, source: MediaSource) {
  if (source === "youtube") return "YouTube Media";
  if (source === "tiktok") return "TikTok Media";
  if (source === "instagram") return "Instagram Media";
  if (source === "facebook") return "Facebook Media";
  return "Saved Media";
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}