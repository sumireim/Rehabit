import React, { createContext, useContext, useEffect, useState } from "react";
import { challengeMetaRepository } from "../storage/challengeMetaRepository";

function getTodayISODate() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

type ChallengeContextType = {
  startDate: string;
  setStartDate: (d: string) => Promise<void>;
};

const ChallengeContext = createContext<ChallengeContextType>({
  startDate: getTodayISODate(),
  setStartDate: async () => {},
});

export const ChallengeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [startDate, setStartDateState] = useState(getTodayISODate());

  useEffect(() => {
    (async () => {
      const today = getTodayISODate();
      const meta = await challengeMetaRepository.initIfNeeded(today);
      setStartDateState(meta.startedAt);
    })();
  }, []);

  const setStartDate = async (date: string) => {
    await challengeMetaRepository.setStartedAt(date);
    setStartDateState(date);
  };

  return (
    <ChallengeContext.Provider value={{ startDate, setStartDate }}>
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenge = () => useContext(ChallengeContext);
