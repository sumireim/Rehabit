import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useDailyLog } from "../hooks/useDailyLog";
import { useTheme } from "../styles/ThemeContext";
import { Theme } from "../styles/theme";

import { Ionicons } from "@expo/vector-icons";

function getTodayISODate() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export const TodayLogScreen: React.FC = () => {
  const today = getTodayISODate();
  const { log, loading, saving, update, save } = useDailyLog(today);
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const handleSave = async () => {
    await save();
    Alert.alert("保存しました", "今日の記録が保存されました。");
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
        <Text style={styles.title}>今日</Text>
        <Text style={styles.subtitle}>今日の「整い」を記録しよう。</Text>

        <View style={styles.dateBadge}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={theme.colors.subtext}
          />
          <Text style={styles.dateText}>{today}</Text>
        </View>

        {/* 気分 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="happy-outline"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.cardTitle}>気分（1〜5）</Text>
          </View>
          <Text style={styles.cardDescription}>
            今日一日の気分をざっくり教えてください。
          </Text>
          <View style={styles.row}>
            {[1, 2, 3, 4, 5].map((v) => (
              <TouchableOpacity
                key={v}
                style={[
                  styles.chip,
                  log.mood === v && styles.chipActive,
                ]}
                onPress={() => update({ mood: v })}
              >
                <Text
                  style={[
                    styles.chipText,
                    log.mood === v && styles.chipTextActive,
                  ]}
                >
                  {v}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 睡眠 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="moon-outline"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.cardTitle}>睡眠時間（時間）</Text>
          </View>
          <Text style={styles.cardDescription}>
            昨日寝てから今日起きるまでの合計睡眠時間です。
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={log.sleepHours === 0 ? "" : String(log.sleepHours)}
              onChangeText={(text) => {
                const num = Number(text);
                if (isNaN(num)) return;
                update({ sleepHours: num });
              }}
              placeholder="例: 6.5"
              placeholderTextColor={theme.colors.subtext}
            />
            <Text style={styles.inputUnit}>時間</Text>
          </View>
        </View>

        {/* 集中度 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="flash-outline"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.cardTitle}>集中度（1〜5）</Text>
          </View>
          <Text style={styles.cardDescription}>
            勉強や仕事にどれくらい集中できたかを教えてください。
          </Text>
          <View style={styles.row}>
            {[1, 2, 3, 4, 5].map((v) => (
              <TouchableOpacity
                key={v}
                style={[
                  styles.chip,
                  log.focus === v && styles.chipActive,
                ]}
                onPress={() => update({ focus: v })}
              >
                <Text
                  style={[
                    styles.chipText,
                    log.focus === v && styles.chipTextActive,
                  ]}
                >
                  {v}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 保存ボタン */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && { opacity: 0.7 },
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          <Ionicons
            name="save-outline"
            size={18}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.saveButtonText}>
            {saving ? "保存中..." : "保存する"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// ★ これを末尾に置く
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
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: theme.colors.cardSoft,
    },
    chipActive: {
      backgroundColor: theme.colors.primary,
    },
    chipText: {
      fontSize: 14,
      color: theme.colors.subtext,
    },
    chipTextActive: {
      color: "#fff",
      fontWeight: "600",
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    input: {
      flex: 1,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 16,
      backgroundColor: theme.colors.cardSoft,
      color: theme.colors.text,
    },
    inputUnit: {
      color: theme.colors.subtext,
      fontSize: 14,
    },
    subtext: {
      color: theme.colors.subtext,
    },
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
      fontSize: 16,
      fontWeight: "600",
    },
  });
