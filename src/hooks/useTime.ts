// src/hooks/useTime.ts
import { useState, useEffect } from 'react';

export const useTime = (): Date => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return now;
};