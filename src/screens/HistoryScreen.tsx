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

  const todayDay = calcChallengeDay(getTodayISODate(), startDate);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>履歴</Text>
      <Text style={styles.subtitle}>これまでの「整い」とチャレンジの軌跡。</Text>

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
  });
