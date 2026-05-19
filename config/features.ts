export const FEATURES = {
  realDownloaderApi: false,
  adsEnabled: false,
  paymentsEnabled: false,
  cloudSyncEnabled: false,
  debugControlsEnabled: true,
};

export function isFeatureEnabled(feature: keyof typeof FEATURES) {
  return FEATURES[feature];
}