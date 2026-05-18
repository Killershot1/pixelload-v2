import { MediaMetadata, MediaSource } from "../types/media";
import {
  detectMediaSource,
  extractYouTubeId,
  getThumbnail,
} from "./mediaEngine";

export type ProviderAnalysisResult = {
  success: boolean;
  metadata: MediaMetadata | null;
  error: string | null;
};

export async function analyzeVideoProvider(url: string): Promise<ProviderAnalysisResult> {
  const source = detectMediaSource(url);

  if (!url.trim()) {
    return {
      success: false,
      metadata: null,
      error: "No URL provided",
    };
  }

  if (source === "youtube") {
    return analyzeYouTube(url);
  }

  if (source === "tiktok") {
    return analyzeGenericSocial(url, "tiktok");
  }

  if (source === "instagram") {
    return analyzeGenericSocial(url, "instagram");
  }

  if (source === "facebook") {
    return analyzeGenericSocial(url, "facebook");
  }

  return analyzeUnknown(url);
}

async function analyzeYouTube(url: string): Promise<ProviderAnalysisResult> {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return {
      success: false,
      metadata: null,
      error: "Invalid YouTube URL",
    };
  }

  const metadata: MediaMetadata = {
    id: videoId,
    url,
    source: "youtube",
    title: "YouTube Video",
    thumbnail: getThumbnail(url),
    durationLabel: null,
    author: "YouTube",
    createdAt: new Date().toISOString(),
  };

  return {
    success: true,
    metadata,
    error: null,
  };
}

async function analyzeGenericSocial(
  url: string,
  source: MediaSource
): Promise<ProviderAnalysisResult> {
  const metadata: MediaMetadata = {
    id: Date.now().toString(),
    url,
    source,
    title: buildSourceTitle(source),
    thumbnail: null,
    durationLabel: null,
    author: source.toUpperCase(),
    createdAt: new Date().toISOString(),
  };

  return {
    success: true,
    metadata,
    error: null,
  };
}

async function analyzeUnknown(url: string): Promise<ProviderAnalysisResult> {
  const metadata: MediaMetadata = {
    id: Date.now().toString(),
    url,
    source: "unknown",
    title: "Unknown Media",
    thumbnail: null,
    durationLabel: null,
    author: null,
    createdAt: new Date().toISOString(),
  };

  return {
    success: true,
    metadata,
    error: null,
  };
}

function buildSourceTitle(source: MediaSource) {
  if (source === "tiktok") return "TikTok Video";
  if (source === "instagram") return "Instagram Media";
  if (source === "facebook") return "Facebook Video";
  if (source === "youtube") return "YouTube Video";
  return "Unknown Media";
}