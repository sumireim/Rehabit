import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "../styles/ThemeContext";
import { Theme, ThemeKey } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useChallenge } from "../components/ChallengeContext";

function getTodayISODate() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export const SettingsScreen: React.FC = () => {
  const { theme, themeKey, setThemeKey } = useTheme();
  const styles = createStyles(theme);

  const handleChangeTheme = (key: ThemeKey) => {
    setThemeKey(key);
  };

  const { startDate, setStartDate } = useChallenge();
  const [editingDate, setEditingDate] = useState(startDate);

  // startDate が読み込まれたら、編集用の値にも反映
  useEffect(() => {
    if (startDate) {
      setEditingDate(startDate);
    }
  }, [startDate]);

  const handleSetToday = async () => {
    const today = getTodayISODate();
    setEditingDate(today);
    await setStartDate(today);
    Alert.alert(
      "更新しました",
      `チャレンジ開始日を今日（${today}）に変更しました。`
    );
  };

  const handleSave = async () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(editingDate)) {
      Alert.alert(
        "形式エラー",
        "YYYY-MM-DD 形式で入力してください（例: 2025-02-20）。"
      );
      return;
    }
    const d = new Date(editingDate);
    if (Number.isNaN(d.getTime())) {
      Alert.alert("日付エラー", "存在しない日付が入力されています。");
      return;
    }

    await setStartDate(editingDate);
    Alert.alert(
      "更新しました",
      `チャレンジ開始日を ${editingDate} に変更しました。`
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>設定</Text>
        <Text style={styles.subtitle}>
          テーマやチャレンジ開始日をカスタマイズできます。
        </Text>

        {/* テーマ設定 */}
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
              color={themeKey === "night" ? theme.colors.primary : "#4B5563"}
              onPress={() => handleChangeTheme("night")}
            />
            <ThemeChip
              label="Morning"
              description="明るく爽やかな"
              active={themeKey === "morning"}
              color={themeKey === "morning" ? "#F97316" : "#9CA3AF"}
              onPress={() => handleChangeTheme("morning")}
            />
            <ThemeChip
              label="Forest"
              description="森の中にいるような"
              active={themeKey === "forest"}
              color={themeKey === "forest" ? "#10B981" : "#6EE7B7"}
              onPress={() => handleChangeTheme("forest")}
            />
          </View>
        </View>

        {/* 90日チャレンジ開始日 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="flag-outline"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.cardTitle}>90日チャレンジ開始日</Text>
          </View>
          <Text style={styles.cardDescription}>
            「90日チャレンジ」をいつから始めたかを設定できます。
            ToDo 画面の Day / 90 表示に反映されます。
          </Text>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>開始日（YYYY-MM-DD）</Text>
              <TextInput
                style={styles.input}
                value={editingDate}
                onChangeText={setEditingDate}
                placeholder="2025-02-20"
                placeholderTextColor={theme.colors.subtext}
              />
            </View>
          </View>

          <View style={[styles.row, { marginTop: 12 }]}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleSetToday}
            >
              <Ionicons
                name="today-outline"
                size={16}
                color={theme.colors.primary}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.secondaryButtonText}>今日から始める</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSave}
            >
              <Ionicons
                name="save-outline"
                size={16}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.primaryButtonText}>開始日を更新</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.currentText}>
            現在の開始日：
            <Text style={{ fontWeight: "600" }}>{startDate}</Text>
          </Text>
        </View>
      </ScrollView>
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
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{
          borderRadius: 16,
          borderWidth: active ? 0 : 1,
          borderColor: "#4B5563",
          backgroundColor: active ? color : "transparent",
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <Text
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
          style={{
            color: active ? "#F9FAFB" : "#9CA3AF",
            fontSize: 11,
          }}
        >
          {description}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingTop: 32,
      paddingHorizontal: 20,
      paddingBottom: 32,
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
    label: {
      fontSize: 12,
      color: theme.colors.subtext,
      marginBottom: 4,
    },
    input: {
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 14,
      backgroundColor: theme.colors.cardSoft,
      color: theme.colors.text,
    },
    button: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      borderRadius: 999,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
    },
    primaryButtonText: {
      color: "#fff",
      fontSize: 13,
      fontWeight: "600",
    },
    secondaryButton: {
      backgroundColor: theme.colors.cardSoft,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    secondaryButtonText: {
      color: theme.colors.primary,
      fontSize: 13,
      fontWeight: "500",
    },
    currentText: {
      marginTop: 10,
      fontSize: 12,
      color: theme.colors.subtext,
    },
  });
