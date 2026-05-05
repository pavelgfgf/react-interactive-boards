// src/components/BellTable.tsx
import { type FC } from 'react';
import { BELL_SCHEDULE } from '../../data/data';
import type { BellSlot } from '../../data/types';
import { parseTime } from '../../utils/time';

interface BellTableProps {
  now: Date;
}

export const BellTable: FC<BellTableProps> = ({ now }) => {
  const curMin = now.getHours() * 60 + now.getMinutes();

  let activeNum = -1;
  for (let i = 0; i < BELL_SCHEDULE.length; i++) {
    const s = parseTime(BELL_SCHEDULE[i].start);
    const e = parseTime(BELL_SCHEDULE[i].end);
    if (curMin >= s && curMin < e) { activeNum = i + 1; break; }
  }

  return (
    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Расписание звонков</div>
      <div className="grid grid-cols-9 gap-1 text-center">
        {BELL_SCHEDULE.map((b: BellSlot, i: number) => {
          const isNow = activeNum === i + 1;
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