import AsyncStorage from "@react-native-async-storage/async-storage";

export type DailyChallengeLog = {
  date: string;                     // "YYYY-MM-DD"
  done: Record<string, boolean>;    // habitId -> 完了しているか
};

const STORAGE_KEY = "challenge_logs_v1";

export const challengeLogRepository = {
  async getAll(): Promise<DailyChallengeLog[]> {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    try {
      return JSON.parse(json) as DailyChallengeLog[];
    } catch (e) {
      console.warn("Failed to parse challenge logs:", e);
      return [];
    }
  },

  async getByDate(date: string): Promise<DailyChallengeLog | null> {
    const all = await this.getAll();
    const found = all.find((l) => l.date === date);
    return found ?? null;
  },

  async upsert(log: DailyChallengeLog): Promise<void> {
    const all = await this.getAll();
    const filtered = all.filter((l) => l.date !== log.date);
    const next = [...filtered, log];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },
};
