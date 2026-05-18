export type AdPlacement =
  | "home_featured"
  | "ai_results"
  | "downloads_queue"
  | "profile_upgrade";

export type AdConfig = {
  enabled: boolean;
  testMode: boolean;
  placements: Record<AdPlacement, boolean>;
};

export const ADS_CONFIG: AdConfig = {
  enabled: false,
  testMode: true,
  placements: {
    home_featured: true,
    ai_results: true,
    downloads_queue: true,
    profile_upgrade: true,
  },
};

export function shouldShowAd(placement: AdPlacement, isProUser = false) {
  if (isProUser) return false;
  if (!ADS_CONFIG.enabled) return false;

  return ADS_CONFIG.placements[placement];
}