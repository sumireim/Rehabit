import { useEffect, useState } from "react";
import { DailyLog } from "../types/dailyLog";
import { dailyLogRepository } from "../storage/dailyLogRepository";

export function useDailyLog(date: string) {
  const [log, setLog] = useState<DailyLog>({
    date,
    mood: 3,
    sleepHours: 0,
    focus: 3,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const all = await dailyLogRepository.getAll();
      const existing = all.find((l) => l.date === date);
      if (existing) {
        setLog(existing);
      }
      setLoading(false);
    })();
  }, [date]);

  const update = (partial: Partial<DailyLog>) => {
    setLog((prev) => ({ ...prev, ...partial }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await dailyLogRepository.upsert(log);
    } finally {
      setSaving(false);
    }
  };

  return { log, loading, saving, update, save };
}
