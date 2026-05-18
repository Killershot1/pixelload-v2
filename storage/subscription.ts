import AsyncStorage from "@react-native-async-storage/async-storage";

export type SubscriptionPlan = "free" | "pro";

export type SubscriptionState = {
  plan: SubscriptionPlan;
  activatedAt: string | null;
};

const KEY = "pixelload_subscription";

export async function getSubscription(): Promise<SubscriptionState> {
  const raw = await AsyncStorage.getItem(KEY);

  if (!raw) {
    return {
      plan: "free",
      activatedAt: null,
    };
  }

  return JSON.parse(raw) as SubscriptionState;
}

export async function isProUser() {
  const subscription = await getSubscription();
  return subscription.plan === "pro";
}

export async function activateMockPro() {
  const state: SubscriptionState = {
    plan: "pro",
    activatedAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(KEY, JSON.stringify(state));
  return state;
}

export async function resetToFreePlan() {
  const state: SubscriptionState = {
    plan: "free",
    activatedAt: null,
  };

  await AsyncStorage.setItem(KEY, JSON.stringify(state));
  return state;
}