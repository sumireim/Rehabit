import AsyncStorage from "@react-native-async-storage/async-storage";

const CHALLENGE_META_KEY = "challenge_meta_v1";

export type ChallengeMeta = {
  startedAt: string; // "YYYY-MM-DD"
};

export const challengeMetaRepository = {
  async get(): Promise<ChallengeMeta | null> {
    const json = await AsyncStorage.getItem(CHALLENGE_META_KEY);
    if (!json) return null;

    try {
      return JSON.parse(json) as ChallengeMeta;
    } catch (e) {
      console.warn("Failed to parse challenge meta:", e);
      return null;
    }
  },

  async initIfNeeded(today: string): Promise<ChallengeMeta> {
    const existing = await this.get();
    if (existing) return existing;

    const meta: ChallengeMeta = { startedAt: today };
    await AsyncStorage.setItem(CHALLENGE_META_KEY, JSON.stringify(meta));
    return meta;
  },

  async setStartedAt(date: string): Promise<void> {
    const meta: ChallengeMeta = { startedAt: date };
    await AsyncStorage.setItem(CHALLENGE_META_KEY, JSON.stringify(meta));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(CHALLENGE_META_KEY);
  },
};
