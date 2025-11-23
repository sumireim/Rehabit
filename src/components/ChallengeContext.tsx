import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

function getTodayISODate() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

type ChallengeContextValue = {
  startDate: string;               // "YYYY-MM-DD"
  setStartDate: (iso: string) => void;
};

const ChallengeContext = createContext<ChallengeContextValue | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export const ChallengeProvider: React.FC<Props> = ({ children }) => {
  // ★ 初期値：とりあえず「今日」スタート
  const [startDate, setStartDate] = useState<string>(getTodayISODate());

  const value = useMemo(
    () => ({
      startDate,
      setStartDate,
    }),
    [startDate]
  );

  return (
    <ChallengeContext.Provider value={value}>
      {children}
    </ChallengeContext.Provider>
  );
};

export function useChallenge() {
  const ctx = useContext(ChallengeContext);
  if (!ctx) {
    throw new Error("useChallenge must be used within ChallengeProvider");
  }
  return ctx;
}
