import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";
import { Theme } from "../styles/theme";

export type TabId = "today" | "todo" | "history" | "settings"; 

type Props = {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
};

const TABS: { id: TabId; label: string; icon: keyof typeof Ionicons.glyphMap }[] =
  [
    { id: "today", label: "今日", icon: "today-outline" },
    { id: "todo", label: "タスク", icon: "checkmark-done-outline" },
    { id: "history", label: "履歴", icon: "time-outline" },
    { id: "settings", label: "設定", icon: "settings-outline" }, 
  ];

export const BottomTabBar: React.FC<Props> = ({
  activeTab,
  onChangeTab,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onChangeTab(tab.id)}
            style={[
              styles.tabItem,
              isActive && styles.tabItemActive,
            ]}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={
                isActive ? "#fff" : theme.colors.subtext
              }
            />
            <Text
              style={[
                styles.tabLabel,
                isActive && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginBottom: 16, 
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      flexDirection: "row",
      justifyContent: "space-around", 
      alignItems: "center",
      backgroundColor: theme.colors.card,
    },
    tabItem: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 999,
    },
    tabItemActive: {
      backgroundColor: theme.colors.primarySoft,
    },
    tabLabel: {
      marginTop: 2,
      color: theme.colors.subtext,
      fontSize: 11,
    },
    tabLabelActive: {
      color: "#fff",
      fontWeight: "600",
    },
  });
