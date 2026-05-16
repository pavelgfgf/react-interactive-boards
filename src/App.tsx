import React, { useCallback, useMemo, useState } from 'react';

// Types
import type { SearchMatchItem, ThemeType } from './data/types';

// Utils
import { getDayFull, getDayKey, parseTime } from './utils/time';

// Hooks
import { useTime } from './hooks/useTime';
import { useBellSchedule } from './hooks/useBellSchedule';
import { useDaysOfWeek } from './hooks/useDayOfWeek';
import { useFullSchedule } from './hooks/useLesson';

// Components
import {
  BellInfo,
  BellTable,
  ClockSection,
  DayTabs,
  LessonItem,
  Progress,
  SearchBar,
} from './components';

// Импортируем NewsSlider
import { NewsSlider } from './components/News/NewsSlider';

// --- ВСТРОЕННЫЙ КОМПОНЕНТ ClassTabs ---
// Мы определяем его прямо здесь, чтобы гарантировать совпадение типов
interface ClassTabsProps {
  current: string;
  onSelect: (cls: string) => void;
  classes: string[];
}

const ClassTabs: React.FC<ClassTabsProps> = ({ current, onSelect, classes }) => {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30 overflow-x-auto">
      {classes.map((cls) => (
        <button
          key={cls}
          onClick={() => onSelect(cls)}
          className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
            current === cls
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-300 dark:border-blue-700 shadow-sm'
              : 'bg-white text-slate-600 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
          }`}
        >
          {cls}
        </button>
      ))}
    </div>
  );
};

// Тип для урока из PocketBase (соответствует структуре JSON)
interface LessonData {
  subject: string;
  teacher: string;
  room: string;
}

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeType>('light');
  
  // Состояния выбора
  const [selectedClass, setSelectedClass] = useState<string>(""); 
  const [selectedDay, setSelectedDay] = useState<string>(getDayKey(new Date()));
  const [search, setSearch] = useState<string>("");
  const [isScheduleFullscreen, setIsScheduleFullscreen] = useState(false);

  const now = useTime();
  const curMin = now.getHours() * 60 + now.getMinutes();
  const todayKey = getDayKey(now);

  // --- ЗАГРУЗКА ДАННЫХ ИЗ POCKETBASE ---
  const { schedule: bellSchedule, loading: isBellLoading, error: bellError } = useBellSchedule();
  const { days: daysOfWeek, loading: isDaysLoading, error: daysError } = useDaysOfWeek();
  const { schedule: fullSchedule, loading: isScheduleLoading, error: scheduleError } = useFullSchedule();

  // --- ЛОГИКА ВЫБОРА КЛАССА ---
  const availableClasses = useMemo(() => {
    if (!fullSchedule) return [];
    // Сортируем классы: сначала по длине (чтобы 5А был перед 10А), потом по алфавиту
    return Object.keys(fullSchedule).sort((a, b) => {
      if (a.length !== b.length) return a.length - b.length;
      return a.localeCompare(b);
    });
  }, [fullSchedule]);

  // Автоматический выбор первого класса при загрузке данных
  if (!selectedClass && availableClasses.length > 0) {
      setSelectedClass(availableClasses[0]);
  }

  // --- ЛОГИКА ОПРЕДЕЛЕНИЯ АКТИВНОГО УРОКА ---
  const { activeIdx, nextIdx } = useMemo(() => {
    let active = -1;
    let next = -1;
    
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
  }, [curMin, bellSchedule]);

  // --- ПОЛУЧЕНИЕ ТЕКУЩИХ УРОКОВ ---
  const currentLessons: LessonData[] = useMemo(() => {
    if (!fullSchedule || !selectedClass || !selectedDay) return [];
    return fullSchedule[selectedClass]?.[selectedDay] || [];
  }, [fullSchedule, selectedClass, selectedDay]);

  // --- ПОИСК ---
  const searchResults: SearchMatchItem[] = useMemo(() => {
    if (!search || !fullSchedule) return [];
    const q = search.toLowerCase();
    const results: SearchMatchItem[] = [];
    
    Object.entries(fullSchedule).forEach(([group, days]) => {
      Object.entries(days).forEach(([day, lessons]) => {
        lessons.forEach((lesson: LessonData, idx: number) => {
          if (lesson.teacher.toLowerCase().includes(q) || lesson.subject.toLowerCase().includes(q)) {
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
  }, [search, fullSchedule, bellSchedule]);

  // --- ЛОГИКА СОСТОЯНИЯ УРОКА ---
  const getLessonState = useCallback((index: number) => {
    if (selectedDay === todayKey) {
      if (activeIdx === index) return 'active';
      if (nextIdx === index) return 'next';
      
      if (bellSchedule[index] && parseTime(bellSchedule[index].end) < curMin) {
          return 'past';
      }
    }
    return 'normal';
  }, [selectedDay, todayKey, activeIdx, nextIdx, curMin, bellSchedule]);

  // --- ОБРАБОТЧИКИ ---
  const toggleTheme = useCallback(() => setTheme(prev => prev === 'light' ? 'dark' : 'light'), []);
  
  const handleSelectClass = useCallback((cls: string) => { 
      setSelectedClass(cls); 
      setSearch(""); 
  }, []);
  
  const handleSelectDay = useCallback((day: string) => { 
      setSelectedDay(day); 
      setSearch(""); 
  }, []);

  const toggleScheduleFullscreen = useCallback(() => setIsScheduleFullscreen(prev => !prev), []);

  const selectedDayFull = getDayFull(selectedDay);

  // --- ЭКРАН ЗАГРУЗКИ И ОШИБОК ---
  if (isBellLoading || isDaysLoading || isScheduleLoading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
              <div className="text-2xl font-bold mb-4 animate-pulse">Загрузка данных...</div>
              <div className="text-sm text-slate-500">Подключение к PocketBase</div>
          </div>
      );
  }

  if (bellError || daysError || scheduleError) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-red-500 p-4 text-center">
              <h2 className="text-2xl font-bold mb-2">Ошибка загрузки данных</h2>
              <p>{bellError || daysError || scheduleError}</p>
              <p className="mt-4 text-slate-500 text-sm">
                  Проверьте консоль браузера и настройки PocketBase (API Rules).
              </p>
          </div>
      );
  }

  if (availableClasses.length === 0) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
              <div className="text-2xl font-bold mb-4">Нет данных</div>
              <p className="text-slate-500">Добавьте расписание в коллекцию full_schedule в PocketBase.</p>
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
        {!isScheduleFullscreen ? (
          <div className="w-full max-w-[1600px] flex flex-col lg:flex-row gap-6">
            {/* 🕐 ЛЕВАЯ КОЛОНКА: ЧАСЫ + BellInfo */}
            <div className="w-full lg:w-[35%] flex flex-col items-center">
              <div className="w-full max-w-[500px]">
                <ClockSection now={now} />
                <BellInfo activeIdx={activeIdx} nextIdx={nextIdx} now={now} schedule={bellSchedule} />
              </div>
            </div>

            {/* 📋 ПРАВАЯ КОЛОНКА: РАСПИСАНИЕ */}
            <div className="w-full lg:w-[65%] bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col relative">
              {/* Кнопка полноэкранного режима */}
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={toggleScheduleFullscreen}
                  className="w-7 h-7 rounded bg-white/80 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all shadow-sm"
                  title="Развернуть расписание"
                >
                  📐
                </button>
              </div>

              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 pl-4 pr-10">
                <h3 className="font-bold text-base flex items-center gap-1">📋 Расписание</h3>
                <span className="text-[10px] font-black text-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded uppercase tracking-wide">
                  {selectedClass} • {selectedDayFull}
                </span>
              </div>

              <div className="flex flex-col">
                <BellTable now={now} schedule={bellSchedule} />
                
                {/* Используем наш встроенный ClassTabs с правильными пропами */}
                <ClassTabs 
                    current={selectedClass} 
                    onSelect={handleSelectClass} 
                    classes={availableClasses} 
                />
                
                <DayTabs 
                    current={selectedDay} 
                    today={todayKey} 
                    onSelect={handleSelectDay} 
                    days={daysOfWeek} 
                />
                
                <SearchBar value={search} onChange={setSearch} onClear={() => setSearch("")} />
              </div>

              {selectedDay === todayKey && currentLessons.length > 0 && (
                <Progress activeIdx={activeIdx} now={now} schedule={currentLessons} bellSchedule={bellSchedule} />
              )}
            </div>
          </div>
        ) : (
          // 📋 ПОЛНОЭКРАННОЕ РАСПИСАНИЕ
          <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="font-bold text-base flex items-center gap-1">📋 Расписание</h2>
              <button
                onClick={toggleScheduleFullscreen}
                className="w-7 h-7 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs hover:scale-105 transition-all shadow-sm"
                title="Свернуть"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="font-bold text-base flex items-center gap-1">📋 Расписание</h3>
                  <span className="text-[10px] font-black text-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded uppercase tracking-wide">
                    {selectedClass} • {selectedDayFull}
                  </span>
                </div>

                <div className="flex flex-col flex-1 overflow-hidden">
                  <BellTable now={now} schedule={bellSchedule} />
                  
                  <ClassTabs 
                      current={selectedClass} 
                      onSelect={handleSelectClass} 
                      classes={availableClasses} 
                  />
                  
                  <DayTabs 
                      current={selectedDay} 
                      today={todayKey} 
                      onSelect={handleSelectDay} 
                      days={daysOfWeek} 
                  />
                  
                  <SearchBar value={search} onChange={setSearch} onClear={() => setSearch("")} />

                  {search && searchResults.length > 0 && (
                    <div className="px-3 py-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      Найдено {searchResults.length}
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-3 bg-slate-50/30 dark:bg-slate-900/20 space-y-2">
                    {search ? (
                      searchResults.length > 0 ? (
                        searchResults.map((item, i) => (
                          <LessonItem key={i} num={item.num} item={item} searchMatch={true} clsName={`${item.group} • ${item.day}`} state="normal" />
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
                          <span>🔍</span>
                          <span>Ничего не найдено</span>
                        </div>
                      )
                    ) : currentLessons.length > 0 ? (
                      currentLessons.map((item, i) => (
                        <LessonItem key={i} num={i + 1} item={item} state={getLessonState(i)} />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
                        <span>😴</span>
                        <span>Нет уроков в этот день</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedDay === todayKey && currentLessons.length > 0 && (
                  <Progress activeIdx={activeIdx} now={now} schedule={currentLessons} bellSchedule={bellSchedule} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* 📰 БЛОК НОВОСТЕЙ */}
        {!isScheduleFullscreen && (
          <div className="w-full max-w-[1600px] px-4 mt-6">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col relative group">
              <div className="w-full h-[750px]">
                <NewsSlider />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;