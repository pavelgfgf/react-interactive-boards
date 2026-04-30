// src/App.tsx
import React, { useCallback, useMemo, useState } from 'react';

// Types
import type { Lesson, SearchMatchItem, ThemeType } from './data/types';

// Data
import { BELL_SCHEDULE, SCHEDULE_DATA } from './data/schedule';

// Utils
import { getDayFull, getDayKey, parseTime } from './utils/time';

// Hooks
import { useTime } from './hook/useTime';

// Components
import {
  BellInfo,
  BellTable,
  ClassTabs,
  ClockSection,
  DayTabs,
  LessonItem,
  PhotoGallery,
  Progress,
  SearchBar,
} from './components';

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const [selectedClass, setSelectedClass] = useState<string>("11А");
  const [selectedDay, setSelectedDay] = useState<string>(getDayKey(new Date()));
  const [search, setSearch] = useState<string>("");

  const now = useTime();
  const curMin = now.getHours() * 60 + now.getMinutes();
  const todayKey = getDayKey(now);

  // Вычисление активного и следующего урока
  const { activeIdx, nextIdx } = useMemo(() => {
    let active = -1;
    let next = -1;
    for (let i = 0; i < BELL_SCHEDULE.length; i++) {
      const s = parseTime(BELL_SCHEDULE[i].start);
      const e = parseTime(BELL_SCHEDULE[i].end);
      if (curMin >= s && curMin < e) { active = i; break; }
      if (curMin < s && next === -1) next = i;
    }
    return { activeIdx: active, nextIdx: next };
  }, [curMin]);

  // Глобальный поиск по всем классам и дням
  const searchResults: SearchMatchItem[] = useMemo(() => {
    if (!search) return [];
    const q = search.toLowerCase();
    const results: SearchMatchItem[] = [];
    Object.entries(SCHEDULE_DATA).forEach(([group, days]) => {
      Object.entries(days).forEach(([day, lessons]) => {
        lessons.forEach((lesson, idx) => {
          if (lesson.teacher.toLowerCase().includes(q) || lesson.subject.toLowerCase().includes(q)) {
            results.push({
              ...lesson,
              group,
              day,
              num: idx + 1,
              start: BELL_SCHEDULE[idx].start,
              end: BELL_SCHEDULE[idx].end,
            });
          }
        });
      });
    });
    return results;
  }, [search]);

  const currentLessons: Lesson[] = SCHEDULE_DATA[selectedClass]?.[selectedDay] || [];

  const getLessonState = useCallback((index: number) => {
    if (selectedDay === todayKey) {
      if (activeIdx === index) return 'active';
      if (nextIdx === index) return 'next';
      if (parseTime(BELL_SCHEDULE[index].end) < curMin) return 'past';
    }
    return 'normal';
  }, [selectedDay, todayKey, activeIdx, nextIdx, curMin]);

  const toggleTheme = useCallback(() => setTheme(prev => prev === 'light' ? 'dark' : 'light'), []);
  const handleSelectClass = useCallback((cls: string) => { setSelectedClass(cls); setSearch(""); }, []);
  const handleSelectDay = useCallback((day: string) => { setSelectedDay(day); setSearch(""); }, []);

  const selectedDayFull = getDayFull(selectedDay);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col items-center py-6 px-4 font-sans transition-colors duration-300">

        {/* 🔝 HEADER */}
       <header className="w-full px-8 lg:px-12 flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30">
      🎓
    </div>
    <div>
      <h1 className="text-xl font-black tracking-tight leading-tight">ГАПОУ КК "Ленинградский социально-педагогический колледж"</h1>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Интерактивная панель</p>
    </div>
  </div>
  <button
    onClick={toggleTheme}
    className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg hover:scale-105 transition-all shadow-sm"
  >
    {theme === 'light' ? '🌙' : '☀️'}
  </button>
</header>

        {/*  ЧАСЫ И ИНФО О ЗВОНКЕ */}
        <div className="w-full max-w-[1200px] flex flex-col items-center mb-6">
          <ClockSection now={now} />
          <BellInfo activeIdx={activeIdx} nextIdx={nextIdx} now={now} />
        </div>

        {/* 🖼 ОСНОВНАЯ СЕТКА (Фиксированная высота для прямоугольных блоков) */}
        <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-6 h-[480px]">

          {/* 📸 ЛЕВЫЙ БЛОК: ФОТОГАЛЕРЕЯ */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col relative">
            <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-bold shadow-sm">
              📷 Фотогалерея
            </div>
            <PhotoGallery />
          </div>

          {/* 📋 ПРАВЫЙ БЛОК: РАСПИСАНИЕ */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col">
            
            {/* Заголовок блока */}
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-bold text-sm flex items-center gap-2">📋 Расписание</h3>
              <span className="text-[10px] font-black text-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-md uppercase">
                {selectedClass} • {selectedDayFull}
              </span>
            </div>

            {/* Контент с прокруткой внутри блока */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <BellTable now={now} />
              
              {/* ✅ Используем импортированные компоненты вместо инлайн-кнопок */}
              <ClassTabs current={selectedClass} onSelect={handleSelectClass} />
              <DayTabs current={selectedDay} today={todayKey} onSelect={handleSelectDay} />
              <SearchBar value={search} onChange={setSearch} onClear={() => setSearch("")} />

              {/* Список уроков */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/30 dark:bg-slate-900/20">
                {search && searchResults.length > 0 && (
                  <div className="px-2 py-1 text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Найдено {searchResults.length}
                  </div>
                )}

                {search ? (
                  searchResults.length > 0 ? (
                    searchResults.map((item, i) => (
                      <LessonItem key={i} num={item.num} item={item} searchMatch={true} clsName={`${item.group} • ${item.day}`} state="normal" />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <span className="text-2xl mb-2">🔍</span>
                      <p className="text-sm">Ничего не найдено</p>
                    </div>
                  )
                ) : currentLessons.length > 0 ? (
                  currentLessons.map((item, i) => (
                    <LessonItem key={i} num={i + 1} item={item} state={getLessonState(i)} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <span className="text-2xl mb-2">😴</span>
                    <p className="text-sm font-medium">Нет уроков в этот день</p>
                  </div>
                )}
              </div>
            </div>

            {/* Прогресс-бар (только для сегодняшнего дня) */}
            {selectedDay === todayKey && currentLessons.length > 0 && (
              <Progress activeIdx={activeIdx} now={now} schedule={currentLessons} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;