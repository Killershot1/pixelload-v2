import { DownloadJob, MediaMetadata, MediaQuality } from "../types/media";

export type DownloadApiAnalyzeResponse = {
  success: boolean;
  metadata: MediaMetadata | null;
  error: string | null;
};

export type DownloadApiStartResponse = {
  success: boolean;
  job: DownloadJob | null;
  error: string | null;
};

export type DownloadApiProgressResponse = {
  success: boolean;
  jobId: string;
  progress: number;
  status: DownloadJob["status"];
  fileUri: string | null;
  error: string | null;
};

const API_BASE_URL =
  process.env.EXPO_PUBLIC_DOWNLOAD_API_URL ||
  process.env.VISIONCO_API_URL ||
  "https://api.visionpixels.autos";

export async function analyzeDownloadUrl(
  url: string
): Promise<DownloadApiAnalyzeResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/download/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      return {
        success: false,
        metadata: null,
        error: `Analyze failed with status ${res.status}`,
      };
    }

    return await res.json();
  } catch {
    return {
      success: false,
      metadata: null,
      error: "Could not reach download analyze API",
    };
  }
}

export async function startDownloadJob(
  url: string,
  quality: MediaQuality
): Promise<DownloadApiStartResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/download/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, quality }),
    });

    if (!res.ok) {
      return {
        success: false,
        job: null,
        error: `Download start failed with status ${res.status}`,
      };
    }

    return await res.json();
  } catch {
    return {
      success: false,
      job: null,
      error: "Could not reach download start API",
    };
  }
}

export async function getDownloadProgress(
  jobId: string
): Promise<DownloadApiProgressResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/download/progress/${jobId}`);

    if (!res.ok) {
      return {
        success: false,
        jobId,
        progress: 0,
        status: "failed",
        fileUri: null,
        error: `Progress check failed with status ${res.status}`,
      };
    }

    return await res.json();
  } catch {
    return {
      success: false,
      jobId,
      progress: 0,
      status: "failed",
      fileUri: null,
      error: "Could not reach progress API",
    };
  }
}