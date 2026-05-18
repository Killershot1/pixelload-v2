import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "pixelload_onboarding_seen";

export async function hasSeenOnboarding() {
  const value = await AsyncStorage.getItem(KEY);
  return value === "true";
}

export async function markOnboardingSeen() {
  await AsyncStorage.setItem(KEY, "true");
}

export async function resetOnboarding() {
  await AsyncStorage.removeItem(KEY);
}