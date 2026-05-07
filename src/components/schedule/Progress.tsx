// src/components/Progress.tsx
import { type FC } from 'react';
import type { Lesson } from '../../data/types';
import { parseTime } from '../../utils/time';

interface BellScheduleItem {
  num: number;
  start: string;
  end: string;
}

interface ProgressProps {
  activeIdx: number;
  now: Date;
  schedule: Lesson[]; // Это расписание уроков (предметы)
  bellSchedule: BellScheduleItem[]; // <-- Добавляем расписание звонков
}

export const Progress: FC<ProgressProps> = ({ activeIdx, now, schedule, bellSchedule }) => {
  const curMin = now.getHours() * 60 + now.getMinutes();

  if (activeIdx !== -1 && bellSchedule[activeIdx]) {
    const bell = bellSchedule[activeIdx];
    const s = parseTime(bell.start);
    const e = parseTime(bell.end);
    
    // Избегаем деления на ноль, если начало и конец совпадают
    const duration = e - s;
    const elapsed = curMin - s;
    const pct = duration > 0 ? Math.min(100, (elapsed / duration) * 100) : 0;

    return (
      <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1.5">
          <span>{schedule[activeIdx]?.subject || 'Урок'}</span>
          <span>{elapsed} / {duration} мин</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }}></div>
        </div>
      </div>
    );
  }

  // Логика для перемены
  const nextIdx = bellSchedule.findIndex((b: BellScheduleItem) => parseTime(b.start) > curMin);
  if (activeIdx === -1 && now.getHours() >= 8 && nextIdx !== -1) {
    const diff = parseTime(bellSchedule[nextIdx].start) - curMin;
    return (
      <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1.5">
          <span>Перемена</span>
          <span>До урока {diff} мин</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full" style={{ width: '0%' }}></div>
        </div>
      </div>
    );
  }
};

export default Progress;