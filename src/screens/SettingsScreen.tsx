import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../styles/ThemeContext";
import { Theme, ThemeKey } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";

export const SettingsScreen: React.FC = () => {
  const { theme, themeKey, setThemeKey } = useTheme();
  const styles = createStyles(theme);

  const handleChangeTheme = (key: ThemeKey) => {
    setThemeKey(key);
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>設定</Text>
      <Text style={styles.subtitle}>テーマを選んで、あなたの好みにカスタマイズしよう。</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons
            name="color-palette-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.cardTitle}>テーマ</Text>
        </View>
        <Text style={styles.cardDescription}>
          3つのモードから、好きな雰囲気を選べます。
        </Text>

        <View style={styles.row}>
          <ThemeChip
            label="Night"
            description="ダークで落ち着いた"
            active={themeKey === "night"}
            color={theme.colors.primary}
            onPress={() => handleChangeTheme("night")}
          />
          <ThemeChip
            label="Morning"
            description="明るく爽やかな"
            active={themeKey === "morning"}
            color="#F97316"
            onPress={() => handleChangeTheme("morning")}
          />
          <ThemeChip
            label="Forest"
            description="森の中にいるような"
            active={themeKey === "forest"}
            color="#10B981"
            onPress={() => handleChangeTheme("forest")}
          />
        </View>
      </View>
    </View>
  );
};

type ThemeChipProps = {
  label: string;
  description: string;
  active: boolean;
  color: string;
  onPress: () => void;
};

const ThemeChip: React.FC<ThemeChipProps> = ({
  label,
  description,
  active,
  color,
  onPress,
}) => {
  return (
    <View
      style={{
        flex: 1,
        minWidth: 0,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <View
        style={{
          borderRadius: 16,
          borderWidth: active ? 0 : 1,
          borderColor: "#4B5563",
          backgroundColor: active ? color : "transparent",
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
        // TouchableOpacity の代わりに、Card 全体をタップにしてもOK
      >
        <Text
          onPress={onPress}
          style={{
            color: active ? "#fff" : "#E5E7EB",
            fontWeight: "600",
            fontSize: 14,
            marginBottom: 4,
          }}
        >
          {label}
        </Text>
        <Text
          onPress={onPress}
          style={{
            color: active ? "#F9FAFB" : "#9CA3AF",
            fontSize: 11,
          }}
        >
          {description}
        </Text>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: 32,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 13,
      color: theme.colors.subtext,
      marginBottom: 16,
      marginTop: 4,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 6,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    cardDescription: {
      fontSize: 12,
      color: theme.colors.subtext,
      marginBottom: 12,
    },
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
  });
