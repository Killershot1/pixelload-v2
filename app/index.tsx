import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import MainNavigator from "../navigation/MainNavigator";
import OnboardingScreen from "../screens/OnboardingScreen";

import { hasSeenOnboarding } from "../storage/onboarding";
import { colors } from "../constants/theme";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    try {
      const seen = await hasSeenOnboarding();
      setShowOnboarding(!seen);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.cyan} />
      </View>
    );
  }

  if (showOnboarding) {
    return <OnboardingScreen onDone={() => setShowOnboarding(false)} />;
  }

  return <MainNavigator />;
}

const styles: any = {
  loader: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
};