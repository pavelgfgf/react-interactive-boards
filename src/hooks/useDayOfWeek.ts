// src/hooks/useDaysOfWeek.ts
import { useState, useEffect } from 'react';
import { getDaysOfWeek, type DayOfWeek } from '../utils/pocketbase';
import { ClientResponseError } from 'pocketbase';

export const useDaysOfWeek = () => {
  const [days, setDays] = useState<DayOfWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDays = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDaysOfWeek();
        
        if (!isMounted) return;

        setDays(data);
      } catch (err: unknown) { // <-- Используем unknown
        if (!isMounted) return;
        
        if (err instanceof ClientResponseError) {
             if (err.status === 400 && err.message.includes('sort')) {
                setError("Ошибка сортировки. Проверьте поле 'order_num' в коллекции days_of_week.");
             } else if (err.status === 403) {
                setError("Ошибка доступа (403). Проверьте API Rules.");
             } else {
                setError(`Ошибка PocketBase: ${err.message}`);
             }
        } else if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Произошла неизвестная ошибка.");
        }

        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDays();

    return () => {
      isMounted = false;
    };
  }, []);

  return { days, loading, error };
};