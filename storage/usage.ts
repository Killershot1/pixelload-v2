import AsyncStorage from "@react-native-async-storage/async-storage";

export type UsageFeature = "ai_search" | "ai_summary" | "download";

export type UsageState = {
  date: string;
  ai_search: number;
  ai_summary: number;
  download: number;
};

const KEY = "pixelload_daily_usage";

export const FREE_LIMITS: Record<UsageFeature, number> = {
  ai_search: 5,
  ai_summary: 3,
  download: 5,
};

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function getUsage(): Promise<UsageState> {
  const today = getTodayKey();
  const raw = await AsyncStorage.getItem(KEY);

  if (!raw) {
    return createEmptyUsage(today);
  }

  const parsed = JSON.parse(raw) as UsageState;

  if (parsed.date !== today) {
    return createEmptyUsage(today);
  }

  return parsed;
}

export async function incrementUsage(feature: UsageFeature): Promise<UsageState> {
  const usage = await getUsage();

  const updated: UsageState = {
    ...usage,
    [feature]: usage[feature] + 1,
  };

  await AsyncStorage.setItem(KEY, JSON.stringify(updated));

  return updated;
}

export async function canUseFeature(feature: UsageFeature, isProUser = false) {
  if (isProUser) {
    return {
      allowed: true,
      remaining: Infinity,
      limit: Infinity,
      used: 0,
    };
  }

  const usage = await getUsage();
  const limit = FREE_LIMITS[feature];
  const used = usage[feature];

  return {
    allowed: used < limit,
    remaining: Math.max(limit - used, 0),
    limit,
    used,
  };
}

export async function resetUsage() {
  await AsyncStorage.removeItem(KEY);
}

function createEmptyUsage(date: string): UsageState {
  return {
    date,
    ai_search: 0,
    ai_summary: 0,
    download: 0,
  };
}