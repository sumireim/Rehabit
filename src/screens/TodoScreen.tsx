import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";
import { Theme } from "../styles/theme";

type HabitCategory = "mind" | "body" | "life";

type Habit = {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
};

type HabitState = Habit & {
  done: boolean;
};

function getTodayISODate() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// ひとまず固定のミニ習慣
const DEFAULT_HABITS: Habit[] = [
  {
    id: "early",
    title: "いつもより少し早く起きる",
    description: "+30分だけでもOK",
    category: "life",
  },
  {
    id: "water",
    title: "水をコップ2杯以上飲む",
    description: "起床後〜午前中に",
    category: "body",
  },
  {
    id: "focus",
    title: "集中タイムを1セット取る",
    description: "25分でも可",
    category: "mind",
  },
  {
    id: "move",
    title: "軽い運動をする",
    description: "散歩・ストレッチなど",
    category: "body",
  },
];

export const TodoScreen: React.FC = () => {
  const today = getTodayISODate();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // TODO: 後で日付ごとに保存するようにする（AsyncStorage / DB と連携）
  const [habitStates, setHabitStates] = useState<HabitState[]>(
    DEFAULT_HABITS.map((h) => ({ ...h, done: false }))
  );

  const completedCount = useMemo(
    () => habitStates.filter((h) => h.done).length,
    [habitStates]
  );
  const totalCount = habitStates.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const toggleHabit = (id: string) => {
    setHabitStates((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              done: !h.done,
            }
          : h
      )
    );
  };

  // 将来的にストレージ読み込みを入れる
  const loading = false;

  const handleTempSave = () => {
    // 後で保存処理に差し替え
    Alert.alert(
      "チェック状況を保存（ダミー）",
      "このボタンは MVP ではUI確認用です。後でストレージと連携させよう。"
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={[styles.subtext, { marginTop: 8 }]}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ヘッダー */}
        <Text style={styles.title}>To Do</Text>
        <Text style={styles.subtitle}>
          今日やる「ミニ習慣」をチェックしよう。
        </Text>

        <View style={styles.dateBadge}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={theme.colors.subtext}
          />
          <Text style={styles.dateText}>{today}</Text>
        </View>

        {/* 今日の進捗カード */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="flame-outline"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.cardTitle}>今日の進捗</Text>
          </View>
          <Text style={styles.cardDescription}>
            まずは「全部でなくていいから、1つだけでもやる」を目標にしよう。
          </Text>

          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              達成 {completedCount} / {totalCount}
            </Text>
            <Text style={styles.progressPercent}>{progress}%</Text>
          </View>

          {/* 簡易プログレスバー */}
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
        </View>

        {/* 習慣リストカード */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="checkmark-done-outline"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.cardTitle}>今日のミニ習慣</Text>
          </View>
          <Text style={styles.cardDescription}>
            今日、できそうなところから1つずつチェックしていこう。
          </Text>

          {habitStates.map((habit) => (
            <TouchableOpacity
              key={habit.id}
              style={styles.habitRow}
              onPress={() => toggleHabit(habit.id)}
              activeOpacity={0.7}
            >
              <View style={styles.habitIconWrapper}>
                <Ionicons
                  name={
                    habit.done ? "checkmark-circle" : "ellipse-outline"
                  }
                  size={24}
                  color={
                    habit.done
                      ? theme.colors.primary
                      : theme.colors.subtext
                  }
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.habitTitle,
                    habit.done && styles.habitTitleDone,
                  ]}
                >
                  {habit.title}
                </Text>
                {habit.description ? (
                  <Text
                    style={[
                      styles.habitDescription,
                      habit.done && styles.habitDescriptionDone,
                    ]}
                  >
                    {habit.description}
                  </Text>
                ) : null}
                <View style={styles.habitMetaRow}>
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryText}>
                      {habit.category === "mind"
                        ? "Mind"
                        : habit.category === "body"
                        ? "Body"
                        : "Life"}
                    </Text>
                  </View>
                  {habit.done && (
                    <Text style={styles.habitDoneLabel}>Done 🎉</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 保存 or 後で本番用に差し替えるボタン */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleTempSave}
        >
          <Ionicons
            name="save-outline"
            size={18}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.saveButtonText}>チェック状況を一時保存（仮）</Text>
        </TouchableOpacity>
      </ScrollView>
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
    center: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.subtext,
      marginTop: 4,
      marginBottom: 12,
    },
    dateBadge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: theme.colors.cardSoft,
      marginBottom: 20,
    },
    dateText: {
      color: theme.colors.subtext,
      fontSize: 12,
      marginLeft: 6,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
      gap: 8,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    cardDescription: {
      fontSize: 13,
      color: theme.colors.subtext,
      marginBottom: 12,
    },
    subtext: {
      color: theme.colors.subtext,
    },
    // 進捗部分
    progressRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 6,
    },
    progressText: {
      fontSize: 14,
      color: theme.colors.subtext,
    },
    progressPercent: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text,
    },
    progressBarBackground: {
      height: 8,
      borderRadius: 999,
      backgroundColor: theme.colors.cardSoft,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      borderRadius: 999,
      backgroundColor: theme.colors.primary,
    },
    // 習慣リスト
    habitRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingVertical: 10,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    habitIconWrapper: {
      paddingTop: 2,
    },
    habitTitle: {
      fontSize: 15,
      fontWeight: "500",
      color: theme.colors.text,
    },
    habitTitleDone: {
      textDecorationLine: "line-through",
      color: theme.colors.subtext,
    },
    habitDescription: {
      fontSize: 12,
      color: theme.colors.subtext,
      marginTop: 2,
    },
    habitDescriptionDone: {
      color: theme.colors.subtext,
    },
    habitMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
      gap: 8,
    },
    categoryPill: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: theme.colors.cardSoft,
    },
    categoryText: {
      fontSize: 11,
      color: theme.colors.subtext,
    },
    habitDoneLabel: {
      fontSize: 11,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    // 保存ボタン
    saveButton: {
      marginTop: 8,
      paddingVertical: 12,
      borderRadius: 999,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    saveButtonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
    },
  });
