// src/components/ClassTabs.tsx
import { type FC } from 'react';
import { SCHEDULE_DATA } from '../../data/data';

interface ClassTabsProps {
  current: string;
  onSelect: (cls: string) => void;
}

export const ClassTabs: FC<ClassTabsProps> = ({ current, onSelect }) => (
  <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-slate-100 dark:border-slate-700/50">
    {Object.keys(SCHEDULE_DATA).map((cls: string) => (
      <button
        key={cls}
        onClick={() => onSelect(cls)}
        className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${
          current === cls
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
            : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
      >
        {cls}
      </button>
    ))}
  </div>
);

export default ClassTabs;