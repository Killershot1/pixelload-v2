export type AiClientResult<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
};

const API_BASE_URL =
  process.env.VISIONCO_API_URL ||
  process.env.EXPO_PUBLIC_VISIONCO_API_URL ||
  "https://api.visionpixels.autos";

const API_KEY =
  process.env.VISIONCO_API_KEY ||
  process.env.EXPO_PUBLIC_VISIONCO_API_KEY ||
  "";

export async function postAiRequest<T>(
  path: string,
  body: Record<string, unknown>
): Promise<AiClientResult<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    let json: any = null;

    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }

    if (!res.ok) {
      return {
        success: false,
        data: null,
        error:
          json?.error ||
          json?.message ||
          `AI request failed with status ${res.status}`,
      };
    }

    return {
      success: true,
      data: json as T,
      error: null,
    };
  } catch {
    return {
      success: false,
      data: null,
      error: "Could not reach Visionco AI",
    };
  }
}