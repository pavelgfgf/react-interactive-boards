import { Bell, BookOpen, CheckCircle2, Coffee, Hourglass } from 'lucide-react';
import { type FC } from 'react';
import { parseTime } from '../utils/time';

interface BellScheduleItem {
  num: number;
  start: string;
  end: string;
}

interface BellInfoProps {
  activeIdx: number;
  nextIdx: number;
  now: Date;
  schedule: BellScheduleItem[];
}

const formatDiff = (minutes: number) => {
  if (minutes <= 0) return 'меньше минуты';
  return `${minutes} мин`;
};

export const BellInfo: FC<BellInfoProps> = ({ activeIdx, nextIdx, now, schedule }) => {
  const curMin = now.getHours() * 60 + now.getMinutes();
  const nextLessonIdx = schedule.findIndex((bell) => parseTime(bell.start) > curMin);
  const fallbackNextIdx = nextIdx !== -1 ? nextIdx : nextLessonIdx;

  if (activeIdx !== -1 && schedule[activeIdx]) {
    const bell = schedule[activeIdx];
    const minutesLeft = parseTime(bell.end) - curMin;

    return (
      <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
        <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-2 rounded-lg text-base font-semibold text-slate-600 dark:text-slate-300">
          <Bell size={20} className="text-slate-500 dark:text-slate-400" />
          <span>Звонок с урока: {bell.end}</span>
        </div>
        <div className="inline-flex items-center gap-2 bg-[#E8F4F1] dark:bg-[#449284]/20 border border-[#449284] text-[#449284] dark:text-[#5fb5a8] px-6 py-2 rounded-lg text-base font-semibold">
          <BookOpen size={20} />
          <span>Урок №{bell.num} · {bell.start} - {bell.end} · осталось {formatDiff(minutesLeft)}</span>
        </div>
      </div>
    );
  }

  if (fallbackNextIdx !== -1 && schedule[fallbackNextIdx]) {
    const nextBell = schedule[fallbackNextIdx];
    const prevBell = schedule[fallbackNextIdx - 1];
    const minutesLeft = parseTime(nextBell.start) - curMin;
    const isBreak = Boolean(prevBell) && curMin >= parseTime(prevBell.end);

    if (isBreak) {
      return (
        <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
          <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-500 text-amber-700 dark:text-amber-300 px-6 py-2 rounded-lg text-base font-semibold">
            <Coffee size={20} />
            <span>Перемена · {prevBell.end} - {nextBell.start}</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-2 rounded-lg text-base font-semibold text-slate-600 dark:text-slate-300">
            <Hourglass size={20} className="text-slate-500 dark:text-slate-400" />
            <span>Урок №{nextBell.num} начнется через {formatDiff(minutesLeft)}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
        <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-2 rounded-lg text-base font-semibold text-slate-600 dark:text-slate-300">
          <Bell size={20} className="text-slate-500 dark:text-slate-400" />
          <span>Первый звонок: {nextBell.start}</span>
        </div>
        <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-2 rounded-lg text-base font-semibold text-slate-600 dark:text-slate-300">
          <Hourglass size={20} className="text-slate-500 dark:text-slate-400" />
          <span>Урок №{nextBell.num} · {nextBell.start} - {nextBell.end} · через {formatDiff(minutesLeft)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center justify-center gap-2 mt-3 text-slate-400 font-medium text-center">
      <CheckCircle2 size={20} />
      <span>Занятия на сегодня завершены</span>
    </div>
  );
};

export default BellInfo;
