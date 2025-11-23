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

// チャレンジ開始日決定
const CHALLENGE_START_DATE = "2025-02-01"; // YYYY-MM-DD

function calcChallengeDay(todayISO: string, startISO: string): number {
  const today = new Date(todayISO);
  const start = new Date(startISO);

  // 時差ズレ対策でUTCに寄せるならここ調整してもOK
  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const day = diffDays + 1; // 1日目スタート
  if (day < 1) return 0; // まだチャレンジ開始前
  return day;
}

// 90日チャレンジ用の固定習慣リスト
const CHALLENGE_HABITS: Habit[] = [
  {
    id: "early",
    title: "6 a.m.に起きる",
    description: "平日・休日どちらもOK",
    category: "life",
  },
  {
    id: "water",
    title: "水を1.5L飲む",
    description: "起床後〜午前中を意識",
    category: "body",
  },
  {
    id: "focus",
    title: "勉強する",
    description: "集中",
    category: "mind",
  },
  {
    id: "move",
    title: "5分以上のストレッチ or 散歩",
    description: "寝る前でもOK",
    category: "body",
  },
];

export const TodoScreen: React.FC = () => {
  const today = getTodayISODate();
  const dayOfChallenge = calcChallengeDay(today, CHALLENGE_START_DATE);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // TODO: 後で日付ごとに保存するようにする（AsyncStorage / DB と連携）
  const [habitStates, setHabitStates] = useState<HabitState[]>(
    CHALLENGE_HABITS.map((h) => ({ ...h, done: false }))
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
    // ★ ひとまず見た目確認用。あとで永続化処理に差し替える
    Alert.alert(
      "チェック状況（フロントのみ）",
      "今はアプリ起動中だけ保持されます。\nバックエンド or ストレージ連携はあとで追加しよう。"
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ヘッダー */}
        <Text style={styles.title}>90日チャレンジ</Text>
        <Text style={styles.subtitle}>
          選んだ習慣を、90日間コツコツ続けていくモードです。
        </Text>

        <View style={styles.dateBadge}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={theme.colors.subtext}
          />
          <Text style={styles.dateText}>{today}</Text>
        </View>

        {/* 進捗カード */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="flame-outline"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.cardTitle}>チャレンジの進捗</Text>
          </View>

          <Text style={styles.cardDescription}>
            まずは「毎日なにか1つは続ける」ことを目標にしてみましょう。
          </Text>

          <View style={styles.challengeInfoRow}>
            <View>
              <Text style={styles.challengeLabel}>Day</Text>
              <Text style={styles.challengeDayText}>
                {dayOfChallenge > 0 && dayOfChallenge <= 90
                  ? dayOfChallenge
                  : dayOfChallenge <= 0
                  ? "まだ開始前"
                  : "完走！"}
                {dayOfChallenge > 0 && dayOfChallenge <= 90 && (
                  <Text style={styles.challengeDaySmall}> / 90</Text>
                )}
              </Text>
            </View>
            <View>
              <Text style={styles.challengeLabel}>今日の達成</Text>
              <Text style={styles.challengeDayText}>
                {completedCount} / {totalCount}
              </Text>
            </View>
            <View>
              <Text style={styles.challengeLabel}>達成率</Text>
              <Text style={styles.challengeDayText}>{progress}%</Text>
            </View>
          </View>

          {/* プログレスバー */}
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
        </View>

        {/* 習慣リスト */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="checkmark-done-outline"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.cardTitle}>今日のチェック</Text>
          </View>
          <Text style={styles.cardDescription}>
            90日間、同じ習慣セットを積み上げていきます。できたものにチェックをつけましょう。
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

        {/* 一時保存ボタン（将来ここを本物の保存処理に） */}
        <TouchableOpacity style={styles.saveButton} onPress={handleTempSave}>
          <Ionicons
            name="save-outline"
            size={18}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.saveButtonText}>
            今日のチェックを確認（フロントのみ）
          </Text>
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
    // 進捗まわり
    challengeInfoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    challengeLabel: {
      fontSize: 11,
      color: theme.colors.subtext,
      marginBottom: 2,
    },
    challengeDayText: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text,
    },
    challengeDaySmall: {
      fontSize: 14,
      color: theme.colors.subtext,
      fontWeight: "400",
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
    // ボタン
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