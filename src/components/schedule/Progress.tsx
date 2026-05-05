// src/components/Progress.tsx
import { type FC } from 'react';
import { BELL_SCHEDULE } from '../../data/data';
import type { BellSlot, Lesson } from '../../data/types';
import { parseTime } from '../../utils/time';

interface ProgressProps {
  activeIdx: number;
  now: Date;
  schedule: Lesson[];
}

export const Progress: FC<ProgressProps> = ({ activeIdx, now, schedule }) => {
  const curMin = now.getHours() * 60 + now.getMinutes();

  if (activeIdx !== -1) {
    const bell: BellSlot = BELL_SCHEDULE[activeIdx];
    const s = parseTime(bell.start);
    const e = parseTime(bell.end);
    const pct = Math.min(100, ((curMin - s) / (e - s)) * 100);

    return (
      <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1.5">
          <span>{schedule[activeIdx]?.subject || 'Урок'}</span>
          <span>{curMin - s} / {e - s} мин</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }}></div>
        </div>
      </div>
    );
  }

  const nextIdx = BELL_SCHEDULE.findIndex((b: BellSlot) => parseTime(b.start) > curMin);
  if (activeIdx === -1 && now.getHours() >= 8 && nextIdx !== -1) {
    const diff = parseTime(BELL_SCHEDULE[nextIdx].start) - curMin;
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

  return <div className="h-12"></div>;
};

export default Progress