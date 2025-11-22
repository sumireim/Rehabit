import React, { useState } from "react";
import { StatusBar, View, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TodayLogScreen } from "./src/screens/TodayLogScreen";
import { HistoryScreen } from "./src/screens/HistoryScreen";
import { ThemeProvider, useTheme } from "./src/styles/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
//import { ThemeKey } from "./src/styles/theme";

type Tab = "today" | "history";

export default function App() {
  return (
    <ThemeProvider>
      <RootApp />
    </ThemeProvider>
  );
}

const RootApp: React.FC = () => {
  const [tab, setTab] = useState<Tab>("today");
  const { theme, themeKey, setThemeKey } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <StatusBar
        barStyle={
          themeKey === "morning" ? "dark-content" : "light-content"
        }
      />

      {/* テーマ切り替え（右上あたりに小さく） */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingHorizontal: 16,
          paddingTop: 4,
          gap: 8,
        }}
      >
        <ThemeChip
          label="Night"
          color={themeKey === "night" ? theme.colors.primary : "#4B5563"}
          active={themeKey === "night"}
          onPress={() => setThemeKey("night")}
        />
        <ThemeChip
          label="Morning"
          color={themeKey === "morning" ? "#F97316" : "#9CA3AF"}
          active={themeKey === "morning"}
          onPress={() => setThemeKey("morning")}
        />
        <ThemeChip
          label="Forest"
          color={themeKey === "forest" ? "#10B981" : "#6EE7B7"}
          active={themeKey === "forest"}
          onPress={() => setThemeKey("forest")}
        />
      </View>

      {/* メイン画面 */}
      {tab === "today" ? <TodayLogScreen /> : <HistoryScreen />}

      {/* タブバー */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          paddingTop: 8,
          gap: 8,
        }}
      >
        <TabButton
          icon="today-outline"
          label="今日"
          active={tab === "today"}
          onPress={() => setTab("today")}
        />
        <TabButton
          icon="time-outline"
          label="履歴"
          active={tab === "history"}
          onPress={() => setTab("history")}
        />
      </View>
    </SafeAreaView>
  );
};

type TabButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
};

const TabButton: React.FC<TabButtonProps> = ({
  icon,
  label,
  active,
  onPress,
}) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: active
          ? theme.colors.primary
          : theme.colors.cardSoft,
      }}
    >
      <Ionicons
        name={icon}
        size={16}
        color={active ? "#fff" : theme.colors.subtext}
        style={{ marginRight: 6 }}
      />
      <Text
        style={{
          color: active ? "#fff" : theme.colors.subtext,
          fontWeight: "500",
          fontSize: 13,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

type ThemeChipProps = {
  label: string;
  color: string;
  active: boolean;
  onPress: () => void;
};

const ThemeChip: React.FC<ThemeChipProps> = ({
  label,
  color,
  active,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 999,
      borderWidth: active ? 0 : 1,
      borderColor: "#4B5563",
      backgroundColor: active ? color : "transparent",
    }}
  >
    <View
      style={{
        width: 8,
        height: 8,
        borderRadius: 999,
        backgroundColor: active ? "#fff" : color,
        marginRight: 6,
      }}
    />
    <Text
      style={{
        color: active ? "#fff" : "#D1D5DB",
        fontSize: 11,
        fontWeight: active ? "600" : "400",
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);
