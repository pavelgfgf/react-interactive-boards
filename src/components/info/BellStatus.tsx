// src/components/BellInfo.tsx
import { type FC } from 'react';
import { parseTime } from '../../utils/time';

interface BellScheduleItem {
  num: number;
  start: string;
  end: string;
}

interface BellInfoProps {
  activeIdx: number;
  nextIdx: number;
  now: Date;
  schedule: BellScheduleItem[]; // <-- Принимаем расписание
}

export const BellInfo: FC<BellInfoProps> = ({ activeIdx, nextIdx, now, schedule }) => {
  const curMin = now.getHours() * 60 + now.getMinutes();

  // Если активный урок найден
  if (activeIdx !== -1 && schedule[activeIdx]) {
    const bell = schedule[activeIdx];
    const nextBell = schedule[nextIdx];
    return (
      <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
        <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-2 rounded-lg text-base font-semibold text-slate-600 dark:text-slate-300">
          <span className="text-xl animate-ring">🔔</span>
          <span>Следующий звонок: {nextBell?.end || '—'}</span>
        </div>
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-500 text-blue-600 dark:text-blue-400 px-6 py-2 rounded-lg text-base font-semibold">
          <span className="text-xl">📖</span>
          <span>Урок №{bell.num} · {bell.start} — {bell.end}</span>
        </div>
      </div>
    );
  } else if (nextIdx !== -1 && schedule[nextIdx]) {
    // Если активного нет, но есть следующий
    const bell = schedule[nextIdx];
    const diff = parseTime(bell.start) - curMin;
    return (
      <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
        <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-2 rounded-lg text-base font-semibold text-slate-600 dark:text-slate-300">
          <span className="text-xl animate-ring">🔔</span>
          <span>Звонок: {bell.end}</span>
        </div>
        <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-2 rounded-lg text-base font-semibold text-slate-600 dark:text-slate-300">
          <span className="text-xl">⏳</span>
          <span>Урок №{bell.num} · {bell.start} — {bell.end} (через {diff} мин)</span>
        </div>
      </div>
    );
  }
  return <div className="mt-3 text-slate-400 font-medium">Занятия на сегодня завершены</div>;
};

export default BellInfo;