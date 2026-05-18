export type AppSystemStatus = "online" | "offline" | "pending";

export type AppStatus = {
  api: AppSystemStatus;
  ai: AppSystemStatus;
  storage: AppSystemStatus;
  ads: AppSystemStatus;
  payments: AppSystemStatus;
};

export function getLocalAppStatus(): AppStatus {
  return {
    api: "online",
    ai: "online",
    storage: "online",
    ads: "pending",
    payments: "pending",
  };
}

export function statusLabel(status: AppSystemStatus) {
  if (status === "online") return "Online";
  if (status === "offline") return "Offline";
  return "Pending";
}