export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function getYouTubeThumbnail(url: string): string | null {
  const videoId = extractYouTubeId(url);

  if (!videoId) return null;

  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}