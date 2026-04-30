// src/utils/time.ts

export const parseTime = (t: string): number => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export const getDayKey = (date: Date): string => {
  const DAYS_MAP = [
    { key: 'Пн', full: 'Понедельник' },
    { key: 'Вт', full: 'Вторник' },
    { key: 'Ср', full: 'Среда' },
    { key: 'Чт', full: 'Четверг' },
    { key: 'Пт', full: 'Пятница' },
    { key: 'Сб', full: 'Суббота' },
  ];
  const dayIndex: number = date.getDay();
  if (dayIndex === 0) return 'Сб'; // Воскресенье → Суббота (по логике проекта)
  return DAYS_MAP[dayIndex - 1].key;
};

export const getDayFull = (key: string): string => {
  const DAYS_MAP = [
    { key: 'Пн', full: 'Понедельник' },
    { key: 'Вт', full: 'Вторник' },
    { key: 'Ср', full: 'Среда' },
    { key: 'Чт', full: 'Четверг' },
    { key: 'Пт', full: 'Пятница' },
    { key: 'Сб', full: 'Суббота' },
  ];
  return DAYS_MAP.find(d => d.key === key)?.full || key;
};