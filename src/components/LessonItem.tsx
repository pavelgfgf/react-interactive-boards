// src/components/LessonItem.tsx
import { type FC } from 'react';
import type { Lesson, LessonState } from '../data/types';

interface LessonItemProps {
  num: number;
  item: Lesson;
  state: LessonState;
  searchMatch?: boolean;
  clsName?: string;
}

export const LessonItem: FC<LessonItemProps> = ({ num, item, state, searchMatch = false, clsName }) => {
  const getClasses = (): string => {
    const base = "flex items-center gap-3 p-2 rounded-lg mb-1 transition-all ";
    if (searchMatch) return base + "border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10";
    if (state === 'active') return base + "bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700";
    if (state === 'next') return base + "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/10";
    if (state === 'past') return base + "opacity-40";
    return base + "hover:bg-slate-50 dark:hover:bg-slate-700/50";
  };

  const getNumClass = (): string => {
    if (searchMatch) return "bg-orange-500 text-white";
    if (state === 'active') return "bg-blue-500 text-white";
    if (state === 'next') return "bg-green-500 text-white";
    return "bg-slate-100 dark:bg-slate-700 text-blue-500 dark:text-blue-400";
  };

  return (
    <div className={getClasses()}>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-black ${getNumClass()}`}>
          {num}
        </div>
        <div className={`w-1.5 h-1.5 rounded-sm ${state === 'active' ? 'bg-blue-500 animate-pulse' : state === 'next' ? 'bg-green-500' : searchMatch ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{item.subject}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
          👤 {item.teacher}
          {clsName && <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm ml-1 font-bold">{clsName}</span>}
        </div>
      </div>
      <div className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md flex-shrink-0">
        {item.room}
      </div>
    </div>
  );
};

export default LessonItem;