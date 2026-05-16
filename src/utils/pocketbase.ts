// src/lib/pocketbase.ts
import PocketBase from 'pocketbase';

// 1. Инициализация клиента
// Используем переменную окружения для гибкости, или хардкодим для разработки
const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';
export const pb = new PocketBase(PB_URL);

// 2. Типы данных (Интерфейсы)

// Расписание звонков
export interface BellScheduleItem {
  id: string;
  num: number;      // Номер урока/звонка
  start: string;    // Время начала (например, "08:00")
  end: string;      // Время конца (например, "08:45")
}

// Дни недели
export interface DayOfWeek {
  id: string;
  key: string;      // Короткое название, например "Пн"
  full: string; // Полное название, например "Понедельник"
  order_num: number; // Порядок сортировки (1, 2, 3...)
}


export interface ClassScheduleRecord {
  id: string;
  group: string; 
  data: {    // ИСПРАВЛЕНО: было schedule_data, стало data (как в вашей БД)
    [dayKey: string]: Array<{
      subject: string;
      teacher: string;
      room: string;
    }>;
  };
}

/**
 * Получает расписание для ВСЕХ групп из коллекции lesson_schedule.
 */
export const getAllClassSchedules = async (): Promise<ClassScheduleRecord[]> => {
  try {
    const records = await pb.collection('lesson_schedule').getFullList({
      sort: 'group', 
    });
    return records as unknown as ClassScheduleRecord[];
  } catch (error: any) {
    // Добавлена защита от ошибки сортировки, если поле group отсутствует или недоступно
    if (error.status === 400 && error.message.includes('sort')) {
       console.warn(`Поле сортировки 'group' не найдено. Загрузка без сортировки.`);
       const records = await pb.collection('lesson_schedule').getFullList();
       return records as unknown as ClassScheduleRecord[];
    }
    console.error('Ошибка загрузки расписаний групп:', error);
    throw error;
  }
};

// 3. Функции для получения данных

/**
 * Получает полное расписание звонков, отсортированное по номеру урока.
 */
export const getBellSchedule = async (): Promise<BellScheduleItem[]> => {
  try {
    const records = await pb.collection('bell_schedule').getFullList({
      sort: 'num', 
    });
    return records as unknown as BellScheduleItem[];
  } catch (error) {
    console.error('Ошибка загрузки расписания звонков из PocketBase:', error);
    throw error; // Пробрасываем ошибку, чтобы обработать её в хуке
  }
};

/**
 * Получает список дней недели, отсортированный по порядку.
 */
export const getDaysOfWeek = async (): Promise<DayOfWeek[]> => {
  try {
    const records = await pb.collection('days_of_week').getFullList({
      sort: 'order_num',
    });
    return records as unknown as DayOfWeek[];
  } catch (error) {
    console.error('Ошибка загрузки дней недели из PocketBase:', error);
    throw error;
  }
};

// Сюда можно добавлять новые функции для других коллекций, например:
// export const getNews = async () => { ... }
// export const getScheduleForClass = async (className: string) => { ... }