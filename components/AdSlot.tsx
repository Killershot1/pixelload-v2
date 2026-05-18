import React from "react";
import { Text, View } from "react-native";

import GlassCard from "./GlassCard";
import { colors } from "../constants/theme";
import { AdPlacement, shouldShowAd } from "../monetization/ads";

export default function AdSlot({
  placement,
  isProUser = false,
}: {
  placement: AdPlacement;
  isProUser?: boolean;
}) {
  const visible = shouldShowAd(placement, isProUser);

  if (!visible) return null;

  return (
    <GlassCard style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>AD</Text>
      </View>

      <Text style={styles.title}>Sponsored space</Text>

      <Text style={styles.text}>
        This placement is reserved for future AdMob integration.
      </Text>
    </GlassCard>
  );
}

const styles: any = {
  card: {
    padding: 16,
    marginBottom: 16,
  },

  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.22)",
    backgroundColor: "rgba(0,229,255,0.08)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },

  badgeText: {
    color: colors.cyan,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },

  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 5,
  },

  text: {
    color: colors.muted,
    lineHeight: 20,
    fontSize: 13,
  },
};