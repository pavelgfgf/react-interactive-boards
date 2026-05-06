// src/App.tsx
import React, { useCallback, useMemo, useState } from 'react';

// Types
import type { Lesson, SearchMatchItem, ThemeType } from './data/types';

// Data (SCHEDULE_DATA пока оставляем, если расписание уроков тоже не в PB)
import { SCHEDULE_DATA } from './data/data';

// Utils
import { getDayFull, getDayKey, parseTime } from './utils/time';

// Hooks
import { useTime } from './hooks/useTime';
import { useBellSchedule } from './hooks/useBellSchedule'; // <-- Импортируем новый хук

// Components
import {
  BellInfo,
  BellTable,
  ClassTabs,
  ClockSection,
  DayTabs,
  LessonItem,
  Progress,
  SearchBar,
} from './components';
import { NewsSlider } from './components/News/NewsSlider';

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const [selectedClass, setSelectedClass] = useState<string>("11А");
  const [selectedDay, setSelectedDay] = useState<string>(getDayKey(new Date()));
  const [search, setSearch] = useState<string>("");

  const now = useTime();
  const curMin = now.getHours() * 60 + now.getMinutes();
  const todayKey = getDayKey(now);

  // <-- ЗАГРУЖАЕМ РАСПИСАНИЕ ЗВОНКОВ ИЗ POCKETBASE
  const { schedule: bellSchedule, loading: isScheduleLoading, error: scheduleError } = useBellSchedule();

  // Вычисление активного и следующего урока ТЕПЕРЬ ЗАВИСИТ ОТ bellSchedule
  const { activeIdx, nextIdx } = useMemo(() => {
    let active = -1;
    let next = -1;
    
    // Если расписание еще не загрузилось или пусто, ничего не делаем
    if (!bellSchedule || bellSchedule.length === 0) {
        return { activeIdx: -1, nextIdx: -1 };
    }

    for (let i = 0; i < bellSchedule.length; i++) {
      const s = parseTime(bellSchedule[i].start);
      const e = parseTime(bellSchedule[i].end);
      if (curMin >= s && curMin < e) { 
          active = i; 
          break; 
      }
      if (curMin < s && next === -1) {
          next = i;
      }
    }
    return { activeIdx: active, nextIdx: next };
  }, [curMin, bellSchedule]); // <-- Добавляем bellSchedule в зависимости

  // Глобальный поиск по всем классам и дням
  const searchResults: SearchMatchItem[] = useMemo(() => {
    if (!search) return [];
    const q = search.toLowerCase();
    const results: SearchMatchItem[] = [];
    
    // Используем bellSchedule для получения времени начала/конца в поиске
    Object.entries(SCHEDULE_DATA).forEach(([group, days]) => {
      Object.entries(days).forEach(([day, lessons]) => {
        lessons.forEach((lesson, idx) => {
          if (lesson.teacher.toLowerCase().includes(q) || lesson.subject.toLowerCase().includes(q)) {
            // Берем время из нашего динамического расписания, если индекс существует
            const bell = bellSchedule[idx];
            results.push({
              ...lesson,
              group,
              day,
              num: idx + 1,
              start: bell ? bell.start : '--:--',
              end: bell ? bell.end : '--:--',
            });
          }
        });
      });
    });
    return results;
  }, [search, bellSchedule]); // <-- Добавляем bellSchedule в зависимости

  const currentLessons: Lesson[] = SCHEDULE_DATA[selectedClass]?.[selectedDay] || [];

  const getLessonState = useCallback((index: number) => {
    if (selectedDay === todayKey) {
      if (activeIdx === index) return 'active';
      if (nextIdx === index) return 'next';
      
      // Проверяем, закончился ли урок, используя динамическое расписание
      if (bellSchedule[index] && parseTime(bellSchedule[index].end) < curMin) {
          return 'past';
      }
    }
    return 'normal';
  }, [selectedDay, todayKey, activeIdx, nextIdx, curMin, bellSchedule]); // <-- Добавляем bellSchedule в зависимости

  const toggleTheme = useCallback(() => setTheme(prev => prev === 'light' ? 'dark' : 'light'), []);
  const handleSelectClass = useCallback((cls: string) => { setSelectedClass(cls); setSearch(""); }, []);
  const handleSelectDay = useCallback((day: string) => { setSelectedDay(day); setSearch(""); }, []);

  const selectedDayFull = getDayFull(selectedDay);

  // Показываем загрузку, пока не получим расписание звонков
  if (isScheduleLoading) {
      return <div className="min-h-screen flex items-center justify-center">Загрузка расписания...</div>;
  }

  if (scheduleError) {
      return <div className="min-h-screen flex items-center justify-center text-red-500">{scheduleError}</div>;
  }

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
          {/* Передаем bellSchedule в BellInfo, если он его использует напрямую, 
              но сейчас он получает activeIdx/nextIdx, которые уже вычислены на основе bellSchedule */}
          <BellInfo activeIdx={activeIdx} nextIdx={nextIdx} now={now} schedule={bellSchedule} />
        </div>
            
        {/* 🖼 ОСНОВНАЯ СЕТКА */}
        <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 h-[85vh]">

          {/* 📸 ЛЕВЫЙ БЛОК: НОВОСТИ */}
          <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col relative group">
            <div className="w-full h-full">
                <NewsSlider />
            </div>
          </div>

          {/* 📋 ПРАВЫЙ БЛОК: РАСПИСАНИЕ */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col">
            
            {/* Заголовок блока */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-bold text-lg flex items-center gap-2">📋 Расписание</h3>
              <span className="text-xs font-black text-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-lg uppercase tracking-wide">
                {selectedClass} • {selectedDayFull}
              </span>
            </div>

            {/* Контент с прокруткой внутри блока */}
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Передаем bellSchedule в BellTable */}
              <BellTable now={now} schedule={bellSchedule} />
              
              <ClassTabs current={selectedClass} onSelect={handleSelectClass} />
              <DayTabs current={selectedDay} today={todayKey} onSelect={handleSelectDay} />
              <SearchBar value={search} onChange={setSearch} onClear={() => setSearch("")} />

              {/* Список уроков */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 dark:bg-slate-900/20">
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
                      <span className="text-4xl mb-4">🔍</span>
                      <p className="text-base">Ничего не найдено</p>
                    </div>
                  )
                ) : currentLessons.length > 0 ? (
                  currentLessons.map((item, i) => (
                    <LessonItem key={i} num={i + 1} item={item} state={getLessonState(i)} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <span className="text-4xl mb-4">😴</span>
                    <p className="text-base font-medium">Нет уроков в этот день</p>
                  </div>
                )}
              </div>
            </div>

            {/* Прогресс-бар */}
            {/* Передаем bellSchedule в Progress */}
            {selectedDay === todayKey && currentLessons.length > 0 && (
              <Progress activeIdx={activeIdx} now={now} schedule={currentLessons} bellSchedule={bellSchedule} />
            )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default App;