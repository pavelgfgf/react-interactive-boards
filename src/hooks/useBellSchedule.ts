// src/hooks/useBellSchedule.ts
import { useState, useEffect } from 'react';
import { getBellSchedule, type BellScheduleItem } from '../utils/pocketbase';

export const useBellSchedule = () => {
  const [schedule, setSchedule] = useState<BellScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Флаг для предотвращения обновления состояния после размонтирования

    const fetchSchedule = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Начинаем загрузку расписания...');
        // Небольшая задержка, чтобы убедиться, что сервер готов
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const data = await getBellSchedule();
        
        if (!isMounted) return;

        if (data.length === 0) {
            setError("Расписание звонков пусто. Добавьте данные в PocketBase.");
            console.warn("Расписание пусто");
        } else {
            console.log('Расписание загружено:', data);
            setSchedule(data);
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (!isMounted) return;
        
        // Более подробная обработка ошибок
        if (err.status === 403) {
            setError("Ошибка доступа (403). Проверьте API Rules в PocketBase (должно быть true или пусто).");
        } else if (err.status === 0 || err.message.includes('aborted')) {
            setError("Соединение с PocketBase прервано. Убедитесь, что сервер запущен и CORS настроен (--origins='*').");
        } else {
            setError(`Ошибка: ${err.message}`);
        }
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSchedule();

    // Функция очистки эффекта
    return () => {
      isMounted = false;
    };
  }, []);

  return { schedule, loading, error };
};