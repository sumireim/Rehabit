// src/styles/theme.ts

export type Theme = {
  colors: {
    background: string;
    card: string;
    cardSoft: string;
    primary: string;
    primarySoft: string;
    text: string;
    subtext: string;
    border: string;
    accent: string;
  };
};

export type ThemeKey = "night" | "morning" | "forest";

export const THEMES: Record<ThemeKey, Theme> = {
  night: {
    colors: {
      background: "#0F172A",
      card: "#111827",
      cardSoft: "#1F2937",
      primary: "#6366F1",
      primarySoft: "#4F46E5",
      text: "#E5E7EB",
      subtext: "#9CA3AF",
      border: "#1F2937",
      accent: "#22C55E",
    },
  },
  morning: {
    colors: {
      background: "#F9FAFB",
      card: "#FFFFFF",
      cardSoft: "#F3F4F6",
      primary: "#F97316", // オレンジ
      primarySoft: "#FDBA74",
      text: "#111827",
      subtext: "#6B7280",
      border: "#E5E7EB",
      accent: "#22C55E",
    },
  },
  forest: {
    colors: {
      background: "#022C22",
      card: "#064E3B",
      cardSoft: "#065F46",
      primary: "#10B981", // 緑
      primarySoft: "#34D399",
      text: "#ECFDF5",
      subtext: "#A7F3D0",
      border: "#047857",
      accent: "#FACC15",
    },
  },
};

export const defaultThemeKey: ThemeKey = "night";
