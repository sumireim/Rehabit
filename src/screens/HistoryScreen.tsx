// src/screens/HistoryScreen.tsx
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

export const HistoryScreen: React.FC = () => {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    (async () => {
      const all = await dailyLogRepository.getAll();
      const sorted = [...all].sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0
      );
      setLogs(sorted);
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

  return (
    <View style={styles.root}>
      <Text style={styles.title}>履歴</Text>
      <Text style={styles.subtitle}>これまでの「整い」の軌跡。</Text>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.date}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color={theme.colors.primary}
              />
              <Text style={styles.date}>{item.date}</Text>
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
        )}
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
  });
