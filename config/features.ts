const REAL_DOWNLOADER =
  process.env.EXPO_PUBLIC_REAL_DOWNLOADER === "true";

const ADS_ENABLED =
  process.env.EXPO_PUBLIC_ADS_ENABLED === "true";

const PAYMENTS_ENABLED =
  process.env.EXPO_PUBLIC_PAYMENTS_ENABLED === "true";

export const FEATURES = {
  realDownloaderApi: REAL_DOWNLOADER,
  adsEnabled: ADS_ENABLED,
  paymentsEnabled: PAYMENTS_ENABLED,
  cloudSyncEnabled: false,
  debugControlsEnabled: true,
};

export function isFeatureEnabled(
  feature: keyof typeof FEATURES
) {
  return FEATURES[feature];
}