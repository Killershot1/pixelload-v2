import React, { useState } from "react";
import { SafeAreaView, View, ScrollView, TouchableOpacity, Text } from "react-native";
import { Home, Sparkles, Download, User } from "lucide-react-native";

import HomeScreen from "../screens/HomeScreen";
import AIScreen from "../screens/AIScreen";
import DownloadsScreen from "../screens/DownloadsScreen";
import ProfileScreen from "../screens/ProfileScreen";

type Tab = "home" | "ai" | "downloads" | "profile";

export default function App() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#080A12" }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
          <Text style={{ color: "#fff", fontSize: 34, fontWeight: "900" }}>
            PixelLoad
          </Text>
          <Text style={{ color: "#00E5FF", marginTop: 4, marginBottom: 28 }}>
            by Vision Pixels • Visionco AI
          </Text>

          {tab === "home" && <HomeScreen />}
          {tab === "ai" && <AIScreen />}
          {tab === "downloads" && <DownloadsScreen />}
          {tab === "profile" && <ProfileScreen />}
        </ScrollView>

        <View style={styles.nav}>
          <NavItem active={tab === "home"} label="Home" Icon={Home} onPress={() => setTab("home")} />
          <NavItem active={tab === "ai"} label="AI" Icon={Sparkles} onPress={() => setTab("ai")} />
          <NavItem active={tab === "downloads"} label="Downloads" Icon={Download} onPress={() => setTab("downloads")} />
          <NavItem active={tab === "profile"} label="Profile" Icon={User} onPress={() => setTab("profile")} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function NavItem({ active, label, Icon, onPress }: any) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Icon color={active ? "#00E5FF" : "#6B7280"} size={22} />
      <Text style={{ color: active ? "#00E5FF" : "#6B7280", fontSize: 11, fontWeight: "700" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles: any = {
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0B0F19",
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 18,
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
};