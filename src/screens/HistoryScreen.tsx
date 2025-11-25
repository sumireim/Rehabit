import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { dailyLogRepository } from "../storage/dailyLogRepository";
import { DailyLog } from "../types/dailyLog";
import { useTheme } from "../styles/ThemeContext";
import { Theme } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useChallenge } from "../components/ChallengeContext";
import {
  challengeLogRepository,
  DailyChallengeLog,
} from "../storage/challengeLogRepository";

function getTodayISODate() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function calcChallengeDay(logDateISO: string, startISO: string): number {
  const logDate = new Date(logDateISO);
  const start = new Date(startISO);

  const diffMs = logDate.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const day = diffDays + 1; // 1日目スタート
  if (day < 1) return 0; // チャレンジ開始前
  return day;
}

// 直近7日分の平均を計算
function calcRecentAverages(logs: DailyLog[], days = 7) {
  if (logs.length === 0) {
    return { moodAvg: 0, sleepAvg: 0, focusAvg: 0 };
  }
  const recent = logs.slice(0, days); // logs は新しい順にソート済み

  let moodSum = 0;
  let sleepSum = 0;
  let focusSum = 0;

  for (const log of recent) {
    moodSum += log.mood;
    sleepSum += log.sleepHours;
    focusSum += log.focus;
  }

  const n = recent.length;
  return {
    moodAvg: moodSum / n,
    sleepAvg: sleepSum / n,
    focusAvg: focusSum / n,
  };
}

export const HistoryScreen: React.FC = () => {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [challengeMap, setChallengeMap] = useState<
    Record<string, DailyChallengeLog>
  >({});
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme();
  const { startDate } = useChallenge();
  const styles = createStyles(theme);

  useEffect(() => {
    (async () => {
      const [allLogs, challengeLogs] = await Promise.all([
        dailyLogRepository.getAll(),
        challengeLogRepository.getAll(),
      ]);

      const sorted = [...allLogs].sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0
      );

      const map: Record<string, DailyChallengeLog> = {};
      for (const ch of challengeLogs) {
        map[ch.date] = ch;
      }

      setLogs(sorted);
      setChallengeMap(map);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={[styles.subtext, { marginTop: 8 }]}>
          読み込み中...
        </Text>
      </View>
    );
  }
  if (!startDate) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={[styles.subtext, { marginTop: 8 }]}>読み込み中...</Text>
      </View>
    );
  }

  if (logs.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="time-outline"
          size={32}
          color={theme.colors.subtext}
        />
        <Text style={[styles.subtext, { marginTop: 8 }]}>
          まだ記録がありません。
        </Text>
      </View>
    );
  }

  // 直近7日の平均
  const { moodAvg, sleepAvg, focusAvg } = calcRecentAverages(logs, 7);

  // グラフ用に 0〜100 に正規化（ざっくり）
  const moodNorm = Math.max(0, Math.min(100, ((moodAvg - 1) / 4) * 100)); // mood: 1〜5
  const focusNorm = Math.max(0, Math.min(100, ((focusAvg - 1) / 4) * 100)); // focus: 1〜5
  // 睡眠は 4〜10h をざっくり 0〜100 にマップ
  const sleepClamped = Math.max(4, Math.min(10, sleepAvg || 0));
  const sleepNorm = ((sleepClamped - 4) / 6) * 100;

  const todayDay =
    startDate ? calcChallengeDay(getTodayISODate(), startDate) : 0;


  return (
    <View style={styles.root}>
      <Text style={styles.title}>履歴</Text>
      <Text style={styles.subtitle}>これまでの「整い」とチャレンジの軌跡。</Text>

      {/* 直近7日の平均グラフカード */}
      <View style={[styles.card, { marginBottom: 12 }]}>
        <View style={styles.cardHeader}>
          <Ionicons
            name="analytics-outline"
            size={18}
            color={theme.colors.primary}
          />
          <Text style={styles.date}>直近7日の平均</Text>
        </View>
        <Text style={styles.cardDescription}>
          気分・睡眠・集中の平均値を、ざっくり比較できるグラフです。
        </Text>

        <View style={styles.barChartContainer}>
          {/* 気分 */}
          <View style={styles.barColumn}>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFillMood,
                  { height: (moodNorm / 100) * 100 },
                ]}
              />
            </View>
            <Text style={styles.barLabel}>気分</Text>
            <Text style={styles.barValue}>
              {moodAvg ? moodAvg.toFixed(1) : "-"}
            </Text>
          </View>

          {/* 睡眠 */}
          <View style={styles.barColumn}>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFillSleep,
                  { height: (sleepNorm / 100) * 100 },
                ]}
              />
            </View>
            <Text style={styles.barLabel}>睡眠 (h)</Text>
            <Text style={styles.barValue}>
              {sleepAvg ? sleepAvg.toFixed(1) : "-"}
            </Text>
          </View>

          {/* 集中 */}
          <View style={styles.barColumn}>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFillFocus,
                  { height: (focusNorm / 100) * 100 },
                ]}
              />
            </View>
            <Text style={styles.barLabel}>集中</Text>
            <Text style={styles.barValue}>
              {focusAvg ? focusAvg.toFixed(1) : "-"}
            </Text>
          </View>
        </View>
      </View>

      {/* 90日チャレンジ概要カード */}
      <View style={[styles.card, { marginBottom: 16 }]}>
        <View style={styles.cardHeader}>
          <Ionicons
            name="flag-outline"
            size={18}
            color={theme.colors.primary}
          />
          <Text style={styles.date}>90日チャレンジ</Text>
        </View>
        <Text style={styles.cardDescription}>
          チャレンジ開始日と、今日が何日目かの目安です。
        </Text>

        <View style={styles.challengeInfoRow}>
          <View>
            <Text style={styles.challengeLabel}>開始日</Text>
            <Text style={styles.challengeValue}>{startDate}</Text>
          </View>
          <View>
            <Text style={styles.challengeLabel}>今日の Day</Text>
            <Text style={styles.challengeValue}>
              {todayDay > 0 ? `${todayDay} / 90` : "まだ開始前"}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.date}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => {
          const dayOfChallenge = calcChallengeDay(item.date, startDate);
          const challenge = challengeMap[item.date];

          let challengeValue = "";
          if (challenge) {
            const values = Object.values(challenge.done);
            const total = values.length;
            const doneCount = values.filter(Boolean).length;
            challengeValue = `${doneCount}/${total}`;
          }

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={theme.colors.primary}
                />
                <Text style={styles.date}>{item.date}</Text>
              </View>

              <View style={[styles.row, { marginBottom: 4 }]}>
                {/* Day ピル */}
                {dayOfChallenge > 0 && dayOfChallenge <= 90 && (
                  <InfoPill
                    icon="flag-outline"
                    label="Day"
                    value={`${dayOfChallenge} / 90`}
                    theme={theme}
                  />
                )}
                {/* チャレンジ達成数ピル */}
                {challenge && (
                  <InfoPill
                    icon="checkmark-done-outline"
                    label="チャレンジ"
                    value={challengeValue}
                    theme={theme}
                  />
                )}
              </View>

              <View style={styles.row}>
                <InfoPill
                  icon="happy-outline"
                  label="気分"
                  value={String(item.mood)}
                  theme={theme}
                />
                <InfoPill
                  icon="moon-outline"
                  label="睡眠"
                  value={`${item.sleepHours}h`}
                  theme={theme}
                />
                <InfoPill
                  icon="flash-outline"
                  label="集中"
                  value={String(item.focus)}
                  theme={theme}
                />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

type InfoPillProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  theme: Theme;
};

const InfoPill: React.FC<InfoPillProps> = ({
  icon,
  label,
  value,
  theme,
}) => (
  <View
    style={{
      backgroundColor: theme.colors.cardSoft,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginRight: 8,
      marginBottom: 6,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Ionicons
        name={icon}
        size={14}
        color={theme.colors.subtext}
      />
      <Text
        style={{
          fontSize: 11,
          color: theme.colors.subtext,
        }}
      >
        {label}
      </Text>
    </View>
    <Text
      style={{
        fontSize: 14,
        color: theme.colors.text,
        fontWeight: "600",
        marginTop: 2,
      }}
    >
      {value}
    </Text>
  </View>
);

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: 32,
      paddingHorizontal: 20,
    },
    center: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
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
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 10,
    },
    date: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.text,
    },
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
    },
    subtext: {
      color: theme.colors.subtext,
    },
    cardDescription: {
      fontSize: 12,
      color: theme.colors.subtext,
      marginBottom: 8,
    },
    challengeInfoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 4,
    },
    challengeLabel: {
      fontSize: 11,
      color: theme.colors.subtext,
      marginBottom: 2,
    },
    challengeValue: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    // グラフ用
    barChartContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      height: 120,
      marginTop: 4,
      marginBottom: 4,
    },
    barColumn: {
      flex: 1,
      alignItems: "center",
    },
    barBackground: {
      width: 20,
      height: 100,
      borderRadius: 999,
      backgroundColor: theme.colors.cardSoft,
      overflow: "hidden",
      justifyContent: "flex-end",
    },
    barFillMood: {
      width: "100%",
      backgroundColor: "#FBBF24", // mood: yellow-ish
      borderRadius: 999,
    },
    barFillSleep: {
      width: "100%",
      backgroundColor: "#3B82F6", // sleep: blue-ish
      borderRadius: 999,
    },
    barFillFocus: {
      width: "100%",
      backgroundColor: "#10B981", // focus: green-ish
      borderRadius: 999,
    },
    barLabel: {
      fontSize: 11,
      color: theme.colors.subtext,
      marginTop: 4,
    },
    barValue: {
      fontSize: 12,
      color: theme.colors.text,
      fontWeight: "600",
    },
  });
