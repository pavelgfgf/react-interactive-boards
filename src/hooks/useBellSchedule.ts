// src/hooks/useBellSchedule.ts
import { useState, useEffect } from 'react';
import { getBellSchedule, type BellScheduleItem } from '../utils/pocketbase';
import { ClientResponseError } from 'pocketbase'; // Импортируем тип ошибки

export const useBellSchedule = () => {
  const [schedule, setSchedule] = useState<BellScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSchedule = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBellSchedule();
        
        if (!isMounted) return;

        setSchedule(data);
      } catch (err: unknown) { // <-- Используем unknown вместо any
        if (!isMounted) return;
        
        // Проверяем, является ли ошибка ошибкой PocketBase
        if (err instanceof ClientResponseError) {
            if (err.status === 403) {
                setError("Ошибка доступа (403). Проверьте API Rules в PocketBase.");
            } else if (err.status === 0 || err.message.includes('aborted')) {
                setError("Соединение прервано. Проверьте запуск сервера с --origins='*'.");
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

    fetchSchedule();

    return () => {
      isMounted = false;
    };
  }, []);

  return { schedule, loading, error };
};