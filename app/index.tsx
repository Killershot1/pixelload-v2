import React, { useEffect, useState } from "react";

import MainNavigator from "../navigation/MainNavigator";
import OnboardingScreen from "../screens/OnboardingScreen";
import BootScreen from "../components/BootScreen";

import { hasSeenOnboarding } from "../storage/onboarding";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    try {
      await wait(1200);

      const seen = await hasSeenOnboarding();
      setShowOnboarding(!seen);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <BootScreen />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onDone={() => setShowOnboarding(false)} />;
  }

  return <MainNavigator />;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}