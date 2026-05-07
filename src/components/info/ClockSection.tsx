// src/components/ClockSection.tsx
import {type FC} from 'react';

interface ClockSectionProps {
  now: Date;
}

export const ClockSection: FC<ClockSectionProps> = ({ now }) => {
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <section className="text-center py-4">
      <div className="inline-block border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-16 py-6 bg-slate-50 dark:bg-slate-800 shadow-xl shadow-blue-500/10 backdrop-blur-sm relative">
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="text-8xl font-black tracking-widest leading-none text-slate-800 dark:text-slate-100 font-mono tabular-nums">
          {hours}<span className="animate-blink opacity-60">:</span>{minutes}
        </div>
        <div className="text-lg text-slate-500 dark:text-slate-400 mt-3 font-medium tracking-wider uppercase">
          {dateStr}
        </div>
      </div>
    </section>
  );
};

export default ClockSection;