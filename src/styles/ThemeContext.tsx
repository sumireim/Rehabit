import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { THEMES, defaultThemeKey, Theme, ThemeKey } from "./theme";

type ThemeContextValue = {
  theme: Theme;
  themeKey: ThemeKey;
  setThemeKey: (key: ThemeKey) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [themeKey, setThemeKey] = useState<ThemeKey>(defaultThemeKey);
  const value: ThemeContextValue = {
    theme: THEMES[themeKey],
    themeKey,
    setThemeKey,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};
