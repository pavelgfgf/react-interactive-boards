// src/components/BellTable.tsx
import { type FC } from 'react';
// import type { BellSlot } from '../../data/types'; // Можно переиспользовать тип или создать новый
import { parseTime } from '../../utils/time';

// Определяем тип для элемента расписания, если он отличается от BellSlot
// Для простоты предположим, что структура похожа: { num: number, start: string, end: string }
interface BellScheduleItem {
  num: number;
  start: string;
  end: string;
}

interface BellTableProps {
  now: Date;
  schedule: BellScheduleItem[]; // <-- Принимаем расписание как пропс
}

export const BellTable: FC<BellTableProps> = ({ now, schedule }) => {
  const curMin = now.getHours() * 60 + now.getMinutes();

  let activeNum = -1;
  for (let i = 0; i < schedule.length; i++) {
    const s = parseTime(schedule[i].start);
    const e = parseTime(schedule[i].end);
    if (curMin >= s && curMin < e) { activeNum = schedule[i].num; break; }
  }

  return (
    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Расписание звонков</div>
      <div className="grid grid-cols-9 gap-1 text-center">
        {schedule.map((b: BellScheduleItem, i: number) => {
          const isNow = activeNum === b.num;
          const isPast = parseTime(b.end) < curMin;
          return (
            <div key={i} className="flex flex-col items-center">
              <span className={`w-6 h-6 flex items-center justify-center rounded-md text-[10px] font-bold mb-1 ${isNow ? 'bg-blue-500 text-white' : isPast ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                {b.num}
              </span>
              <span className={`text-[11px] font-medium ${isNow ? 'text-blue-600 dark:text-blue-400 font-bold' : isPast ? 'text-slate-400 dark:text-slate-600' : 'text-slate-600 dark:text-slate-300'}`}>
                {b.start}<br />
                {b.end}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BellTable;