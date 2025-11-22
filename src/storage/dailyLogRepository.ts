import AsyncStorage from "@react-native-async-storage/async-storage";
import { DailyLog } from "../types/dailyLog";

const STORAGE_KEY = "daily_logs_v1";

export const dailyLogRepository = {
  async getAll(): Promise<DailyLog[]> {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    try {
      return JSON.parse(json) as DailyLog[];
    } catch (e) {
      console.warn("Failed to parse daily logs:", e);
      return [];
    }
  },

  async upsert(log: DailyLog): Promise<void> {
    const all = await this.getAll();
    const filtered = all.filter((l) => l.date !== log.date);
    const next = [...filtered, log];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },
};
