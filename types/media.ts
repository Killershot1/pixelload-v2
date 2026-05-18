export type MediaSource = "youtube" | "tiktok" | "instagram" | "facebook" | "unknown";

export type MediaQuality = "audio" | "360p" | "480p" | "720p" | "1080p";

export type MediaMetadata = {
  id: string;
  url: string;
  source: MediaSource;
  title: string;
  thumbnail: string | null;
  durationLabel: string | null;
  author: string | null;
  createdAt: string;
};

export type DownloadStatus =
  | "queued"
  | "analyzing"
  | "ready"
  | "downloading"
  | "completed"
  | "failed";

export type DownloadJob = {
  id: string;
  url: string;
  source: MediaSource;
  title: string;
  thumbnail: string | null;
  quality: MediaQuality;
  status: DownloadStatus;
  progress: number;
  fileUri: string | null;
  error: string | null;
  createdAt: string;
};