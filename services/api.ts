const API_URL = "https://api.visionpixels.autos";

export async function aiSearch(query: string) {
  const res = await fetch(`${API_URL}/v1/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      clientId: "pixelload-user",
      limit: 6,
    }),
  });

  return await res.json();
}

export async function summarizeVideo(url: string) {
  const res = await fetch(`${API_URL}/v1/summarize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      clientId: "pixelload-user",
    }),
  });

  return await res.json();
}