// src/hooks/useFullSchedule.ts
import { useState, useEffect } from 'react';
import { getAllClassSchedules } from '../utils/pocketbase';

// Тип для итогового объекта, который ожидает App.tsx
export type FullScheduleData = {
  [group: string]: {
    [dayKey: string]: Array<{
      subject: string;
      teacher: string;
      room: string;
    }>;
  };
};

export const useFullSchedule = () => {
  const [schedule, setSchedule] = useState<FullScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSchedule = async () => {
      setLoading(true);
      setError(null);
      try {
        // Загружаем массив всех записей
        const records = await getAllClassSchedules();
        
        if (!isMounted) return;

        // Преобразуем массив записей в один объект { "И4А": {...}, "И4Б": {...} }
        const transformedData: FullScheduleData = {};
        records.forEach(record => {
          transformedData[record.group] = record.data;
        });

        setSchedule(transformedData);
      } catch (err: any) {
        if (!isMounted) return;
        if (err.name !== 'AbortError') {
            setError(err.message);
            console.error(err);
        }
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