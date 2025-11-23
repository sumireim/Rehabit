import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator, 
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";
import { Theme } from "../styles/theme";
import { useChallenge } from "../components/ChallengeContext";
import {
  challengeLogRepository,
  DailyChallengeLog,
} from "../storage/challengeLogRepository";

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

function calcChallengeDay(todayISO: string, startISO: string): number {
  const today = new Date(todayISO);
  const start = new Date(startISO);

  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const day = diffDays + 1; // 1日目スタート
  if (day < 1) return 0;
  return day;
}

// 固定のチャレンジ習慣（あとでカスタマイズ画面を作ってもOK）
const CHALLENGE_HABITS: Habit[] = [
  {
    id: "early",
    title: "いつもより30分早く起きる",
    description: "平日・休日どちらもOK",
    category: "life",
  },
  {
    id: "water",
    title: "水をコップ2杯以上飲む",
    description: "起床後〜午前中を意識",
    category: "body",
  },
  {
    id: "focus",
    title: "集中タイム25分を1セット",
    description: "勉強・仕事どちらでも可",
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
  const { startDate } = useChallenge();
  const dayOfChallenge = calcChallengeDay(today, startDate);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [habitStates, setHabitStates] = useState<HabitState[]>(
    CHALLENGE_HABITS.map((h) => ({ ...h, done: false }))
  );
  const [loading, setLoading] = useState(true);

  // マウント時に「今日のチャレンジ進捗」を読み込む
  useEffect(() => {
    let mounted = true;
    (async () => {
      const existing = await challengeLogRepository.getByDate(today);
      if (!mounted) return;

      if (existing) {
        setHabitStates(
          CHALLENGE_HABITS.map((h) => ({
            ...h,
            done: !!existing.done[h.id],
          }))
        );
      } else {
        setHabitStates(
          CHALLENGE_HABITS.map((h) => ({
            ...h,
            done: false,
          }))
        );
      }
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [today]);

  const completedCount = useMemo(
    () => habitStates.filter((h) => h.done).length,
    [habitStates]
  );
  const totalCount = habitStates.length;
  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const saveChallengeLog = async (nextStates: HabitState[]) => {
    const doneMap: DailyChallengeLog["done"] = {};
    nextStates.forEach((h) => {
      doneMap[h.id] = h.done;
    });

    await challengeLogRepository.upsert({
      date: today,
      done: doneMap,
    });
  };

  const toggleHabit = async (id: string) => {
    const nextStates = habitStates.map((h) =>
      h.id === id ? { ...h, done: !h.done } : h
    );
    setHabitStates(nextStates);
    await saveChallengeLog(nextStates);
  };

  const handleInfo = () => {
    Alert.alert(
      "チャレンジについて",
      "ここでのチェック状況は端末内に保存され、履歴画面にも反映されます。"
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={styles.subtext}>読み込み中...</Text>
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
        <Text style={styles.title}>90日チャレンジ</Text>
        <Text style={styles.subtitle}>
          選んだ習慣を、90日間コツコツ積み上げていくモードです。
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
            <TouchableOpacity
              onPress={handleInfo}
              style={{ marginLeft: "auto" }}
            >
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={theme.colors.subtext}
              />
            </TouchableOpacity>
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
    center: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    subtext: {
      color: theme.colors.subtext,
      marginTop: 8,
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
  });
