// src/components/DayTabs.tsx
import { type FC } from 'react';
import type { DayOfWeek } from '../../utils/pocketbase'; // Импортируем тип

interface DayTabsProps {
  current: string;
  today: string;
  onSelect: (day: string) => void;
  days: DayOfWeek[]; // <-- Принимаем дни как пропс
}

export const DayTabs: FC<DayTabsProps> = ({ current, today, onSelect, days }) => {
  // Если дни еще загружаются, показываем заглушку или ничего
  if (days.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30">
      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-2 flex items-center self-center">
        📅 День:
      </div>
      {days.map((day) => (
        <button
          key={day.key}
          onClick={() => onSelect(day.key)}
          className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${
            current === day.key
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
              : day.key === today
              ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
              : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          {day.key}
          {day.key === today && (
            <span className="ml-1 text-[9px] font-bold bg-emerald-500 text-white px-1 rounded-sm">Сегодня</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default DayTabs;