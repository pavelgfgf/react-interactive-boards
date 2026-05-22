import React, { useCallback, useState } from 'react';

// Types
import type { ThemeType } from './data/types';

// Utils
import { useTime } from './hooks/useTime';
import { useBellSchedule } from './hooks/useBellSchedule';

// Components
import {
  BellInfo,
  ClockSection,
} from './components';

// Импортируем NewsSlider
import { NewsSlider } from './components/News/NewsSlider';

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeType>('light');
  
  // Состояния
  const now = useTime();

  // --- ЗАГРУЗКА ДАННЫХ ИЗ POCKETBASE ---
  // Оставляем загрузку расписания звонков, если BellInfo использует эти данные
  const { schedule: bellSchedule, loading: isBellLoading, error: bellError } = useBellSchedule();

  // --- ОБРАБОТЧИКИ ---
  const toggleTheme = useCallback(() => setTheme(prev => prev === 'light' ? 'dark' : 'light'), []);

  // --- ЭКРАН ЗАГРУЗКИ И ОШИБОК ---
  if (isBellLoading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
              <div className="text-2xl font-bold mb-4 animate-pulse">Загрузка данных...</div>
              <div className="text-sm text-slate-500">Подключение к PocketBase</div>
          </div>
      );
  }

  if (bellError) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-red-500 p-4 text-center">
              <h2 className="text-2xl font-bold mb-2">Ошибка загрузки данных</h2>
              <p>{bellError}</p>
              <p className="mt-4 text-slate-500 text-sm">
                  Проверьте консоль браузера и настройки PocketBase (API Rules).
              </p>
          </div>
      );
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col items-center py-4 px-2 font-sans transition-colors duration-300">

        {/* 🔝 HEADER */}
        <header className="w-full max-w-[1600px] px-4 lg:px-6 flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
              🎓
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-tight">ГАПОУ КК "Ленинградский социально-педагогический колледж"</h1>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Интерактивная панель</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm hover:scale-105 transition-all shadow-sm"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </header>

        {/* 📐 ОСНОВНОЙ КОНТЕНТ */}
        <div className="w-full max-w-[1600px] flex flex-col lg:flex-row gap-6 justify-center">
            
            {/* 🕐 БЛОК ЧАСОВ И ИНФО */}
            <div className="w-full lg:w-auto flex flex-col items-center">
              <div className="w-full max-w-[500px]">
                <ClockSection now={now} />
                {/* BellInfo отображает информацию о текущем/следующем звонке */}
                <BellInfo activeIdx={-1} nextIdx={-1} now={now} schedule={bellSchedule} />
              </div>
            </div>

        </div>

        {/* 📰 БЛОК НОВОСТЕЙ */}
        <div className="w-full max-w-[1600px] px-4 mt-6">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col relative group">
              <div className="w-full h-[750px]">
                <NewsSlider />
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default App;