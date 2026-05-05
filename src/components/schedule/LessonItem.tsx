import React from 'react';
import type { Lesson, LessonState } from '../../data/types';
import { Badge } from '../ui/Badge';

interface LessonItemProps {
  num: number;
  item: Lesson;
  state: LessonState;
  searchMatch?: boolean;
  clsName?: string;
}

export const LessonItem: React.FC<LessonItemProps> = ({ num, item, state, searchMatch = false, clsName }) => {
  // Стили в зависимости от состояния
  const getContainerClass = () => {
    const base = "flex items-center gap-3 p-3 rounded-xl mb-2 transition-all border ";
    if (searchMatch) return base + "border-orange-300 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-700";
    if (state === 'active') return base + "border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700 shadow-sm";
    if (state === 'next') return base + "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 border-slate-200 dark:border-slate-700";
    if (state === 'past') return base + "opacity-50 border-transparent hover:opacity-100";
    return base + "border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50";
  };

  const getNumBadgeVariant = () => {
    if (searchMatch) return 'warning';
    if (state === 'active') return 'info'; // Синий
    if (state === 'next') return 'success'; // Зеленый
    return 'default';
  };

  return (
    <div className={getContainerClass()}>
      {/* Номер урока */}
      <div className="flex flex-col items-center justify-center w-10 flex-shrink-0">
        <Badge variant={getNumBadgeVariant()} className="w-8 h-8 flex items-center justify-center text-sm rounded-lg">
          {num}
        </Badge>
        {/* Точка статуса */}
        <div className={`w-1.5 h-1.5 rounded-full mt-1 ${
          state === 'active' ? 'bg-blue-500 animate-pulse' : 
          state === 'next' ? 'bg-emerald-500' : 
          searchMatch ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
        }`} />
      </div>

      {/* Информация об уроке */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
          {item.subject}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
          <span>👤 {item.teacher}</span>
          {clsName && (
            <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-medium">
              {clsName}
            </span>
          )}
        </div>
      </div>

      {/* Кабинет */}
      <div className="flex-shrink-0">
        <Badge variant="default" className="px-3 py-1">
          {item.room}
        </Badge>
      </div>
    </div>
  );
};

export default LessonItem;