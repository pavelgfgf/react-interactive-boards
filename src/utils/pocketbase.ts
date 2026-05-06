// src/services/pocketbase.ts
import PocketBase from 'pocketbase';

// URL вашего локального сервера PocketBase
// Если вы развернете его на сервере, замените этот URL
const pb = new PocketBase('http://127.0.0.1:8090');

// Тип данных для звонка (соответствует полям в PocketBase: num, start, end)
export interface BellScheduleItem {
  id: string;
  num: number;      // Номер урока/звонка
  start: string;    // Время начала (например, "08:00")
  end: string;      // Время конца (например, "08:45")
}

// Функция для получения всего расписания звонков
export const getBellSchedule = async (): Promise<BellScheduleItem[]> => {
  try {
    // Получаем все записи из коллекции 'bell_schedule'
    // Сортируем по полю 'num', чтобы уроки шли по порядку
    const records = await pb.collection('bell_schedule').getFullList({
      sort: 'num', 
    });
    
    // Приводим тип данных к нашему интерфейсу
    return records as unknown as BellScheduleItem[];
  } catch (error) {
    console.error('Ошибка загрузки расписания звонков из PocketBase:', error);
    // В случае ошибки возвращаем пустой массив, чтобы приложение не ломалось
    return [];
  }
};