// hooks/useTimeZone.ts
import { useState, useEffect } from "react";

export type TimeZone = "morning" | "day" | "evening" | "night";

export function useTimeZone() {
  const [timeZone, setTimeZone] = useState<TimeZone>("day");

  useEffect(() => {
    const updateTimeZone = () => {
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 10) setTimeZone("morning");
      else if (hour >= 10 && hour < 16) setTimeZone("day");
      else if (hour >= 16 && hour < 19) setTimeZone("evening");
      else setTimeZone("night");
    };

    updateTimeZone();
    const interval = setInterval(updateTimeZone, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return timeZone;
}
