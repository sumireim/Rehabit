import React, { useState } from "react";
import { StatusBar, View, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TodayLogScreen } from "./src/screens/TodayLogScreen";
import { TodoScreen } from "./src/screens/TodoScreen";
import { HistoryScreen } from "./src/screens/HistoryScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { ThemeProvider, useTheme } from "./src/styles/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
//import { ThemeKey } from "./src/styles/theme";
import { BottomTabBar, TabId } from "./src/components/BottomTabBar";

export default function App() {
  return (
    <ThemeProvider>
      <RootApp />
    </ThemeProvider>
  );
}

const RootApp: React.FC = () => {
  const [tab, setTab] = useState<TabId>("today");
  const { theme, themeKey } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <StatusBar
        barStyle={
          themeKey === "morning" ? "dark-content" : "light-content"
        }
      />

      {/* メイン画面 */}
      {/*{tab === "today" ? <TodayLogScreen /> : <HistoryScreen />}*/}
      <View style={{ flex: 1 }}>
        {tab === "today" && <TodayLogScreen />}
        {tab === "todo" && <TodoScreen />}   
        {tab === "history" && <HistoryScreen />}
        {tab === "settings" && <SettingsScreen />}          
      </View>

      {/* ボトムバー */}
      <BottomTabBar activeTab={tab} onChangeTab={setTab} />
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
