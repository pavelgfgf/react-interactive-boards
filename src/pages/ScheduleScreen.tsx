// src/pages/ScheduleScreen.tsx
import { useState } from 'react';
import BackButton from './BackButton'; // Проверьте путь

// --- ДАННЫЕ (как у вас были) ---
const groups = {
  'У': ['У1А', 'У1Б', 'У1ВК', 'У1Г', 'У2А', 'У2Б', 'У2ВК', 'У2Г', 'У3А', 'У3Б', 'У3ВК', 'У4А', 'У4Б', 'У4ВК', 'У11А', 'У11БК', 'У12А', 'У12БК', 'У13А', 'У13БК'],
  'Д': ['Д1А', 'Д1Б', 'Д1ВК', 'Д1Г', 'Д1Д', 'Д2А', 'Д2Б', 'Д2ВК', 'Д2Г', 'Д3А', 'Д3Б', 'Д3ВК', 'Д4А', 'Д4Б', 'Д4ВК'],
  'И': ['И1А', 'И1Б', 'И2А', 'И2Б', 'И3А', 'И3Б', 'И3ВК', 'И4А', 'И4Б'],
  'С': ['С1', 'С2', 'С3', 'С4'],
  'Г': ['Г1А', 'Г1Б', 'Г2А', 'Г2Б', 'Г3А', 'Г3Б', 'Г4А', 'Г4Б']
};

const groupNames = {
  'У': 'Учитель начальных классов',
  'Д': 'Дошкольное образование',
  'И': 'Информационные системы',
  'С': 'Социальная работа',
  'Г': 'Гостиничное дело'
};

// Пример данных (оставил только У1А для краткости, добавьте остальные по аналогии)
const schedule: Record<string, Record<string, any[]>> = {
  'У1А': {
    'ПН': [
      { time: '08:00–09:35', subject: 'Физика', teacher: 'Бойко', room: '216', type: 'general' },
      { time: '09:45–11:20', subject: 'Физика', teacher: 'Бойко', room: '216', type: 'general' },
      { time: '11:40–13:15', subject: 'Русский язык', teacher: 'ГВОЗДЕВА', room: '140', type: 'general' },
      { time: '13:25–15:00', subject: 'Русский язык', teacher: 'ГВОЗДЕВА', room: '140', type: 'general' },
      { time: '15:10–16:45', subject: 'История', teacher: 'Асеева', room: '117', type: 'general' },
      { time: '16:55–18:30', subject: 'История', teacher: 'Асеева', room: '117', type: 'general' }
    ],
    'ВТ': [
      { time: '08:00–09:35', subject: 'Информатика', teacher: 'Харченко', room: '120', type: 'professional' },
      { time: '09:45–11:20', subject: 'Информатика', teacher: 'Харченко', room: '120', type: 'professional' },
      { time: '11:40–13:15', subject: 'Физическая культура', teacher: 'Фирса О', room: '401', type: 'general' },
      { time: '13:25–15:00', subject: 'Физическая культура', teacher: 'Фирса О', room: '401', type: 'general' },
      { time: '15:10–16:45', subject: 'Биология', teacher: 'Архипенко', room: '219', type: 'general' },
      { time: '16:55–18:30', subject: 'Биология', teacher: 'Архипенко', room: '219', type: 'general' }
    ],
    'СР': [
      { time: '08:00–09:35', subject: 'Введение в специальность', teacher: 'Фуфлыгина', room: '217', type: 'professional' },
      { time: '09:45–11:20', subject: 'Введение в специальность', teacher: 'Фуфлыгина', room: '217', type: 'professional' },
      { time: '11:40–13:15', subject: 'Математика', teacher: 'КОНОВАЛЬЧИК', room: '122', type: 'general' },
      { time: '13:25–15:00', subject: 'Математика', teacher: 'КОНОВАЛЬЧИК', room: '122', type: 'general' },
      { time: '15:10–16:45', subject: 'Обществознание', teacher: 'Шкода', room: '122', type: 'general' },
      { time: '16:55–18:30', subject: 'Обществознание', teacher: 'Шкода', room: '122', type: 'general' }
    ],
    'ЧТ': [
      { time: '08:00–09:35', subject: 'Иностранный язык', teacher: 'ШИТИВА', room: '148', type: 'general' },
      { time: '09:45–11:20', subject: 'Иностранный язык', teacher: 'ШИТИВА', room: '148', type: 'general' },
      { time: '11:40–13:15', subject: 'Литература', teacher: 'ГВОЗДЕВА', room: '139', type: 'general' },
      { time: '13:25–15:00', subject: 'Литература', teacher: 'ГВОЗДЕВА', room: '139', type: 'general' },
      { time: '15:10–16:45', subject: 'Математика', teacher: 'КОНОВАЛЬЧИК', room: '201', type: 'general' },
      { time: '16:55–18:30', subject: 'Математика', teacher: 'КОНОВАЛЬЧИК', room: '201', type: 'general' }
    ],
    'ПТ': [
      { time: '08:00–09:35', subject: 'География', teacher: 'НОВИКОВ', room: '217', type: 'general' },
      { time: '09:45–11:20', subject: 'География', teacher: 'НОВИКОВ', room: '217', type: 'general' },
      { time: '11:40–13:15', subject: 'Основы безопасности', teacher: 'Пейсахович', room: '402', type: 'general' },
      { time: '13:25–15:00', subject: 'Основы безопасности', teacher: 'Пейсахович', room: '402', type: 'general' }
    ],
    'СБ': []
  }
  // ... сюда нужно добавить данные для остальных групп из вашего старого проекта
};

const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

// --- КОМПОНЕНТ CLASS TABS ---
interface ClassTabsProps {
  current: string;
  onSelect: (cls: string) => void;
}

const ClassTabs: React.FC<ClassTabsProps> = ({ current, onSelect }) => {
  return (
    <div className="w-full pb-2 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Object.entries(groups).map(([prefix, classList]) => (
          <div key={prefix} className="flex flex-col gap-2 min-w-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
              {groupNames[prefix as keyof typeof groupNames]}
            </span>
            <div className="flex flex-wrap gap-2">
              {classList.map((cls) => (
                <button
                  key={cls}
                  onClick={() => onSelect(cls)}
                  className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all border ${
                    current === cls
                      ? 'bg-[#0D69AF] text-white border-[#0D69AF] shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ScheduleScreen() {
  const [selectedGroup, setSelectedGroup] = useState('У1А');
  const [viewMode, setViewMode] = useState<'today' | 'week'>('week');

  const getCurrentDay = () => {
    const dayIndex = new Date().getDay();
    if (dayIndex === 0) return 'ПН';
    return days[dayIndex - 1];
  };

  const currentDay = getCurrentDay();

  return (
    <div className="flex-1 bg-white dark:bg-slate-900 min-h-full p-4 lg:p-8 relative">
      
      {/* Заголовок */}
      <h2 className="font-bold text-[#0D69AF] mb-6 pb-2 border-b-2 border-[#0D69AF] inline-block text-2xl lg:text-3xl">
        Расписание занятий
      </h2>

      {/* Панель выбора класса (вместо select) */}
      <ClassTabs 
        current={selectedGroup} 
        onSelect={setSelectedGroup} 
      />

      {/* Переключатель режима (Сегодня / Неделя) */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setViewMode('today')}
          className={`h-[50px] px-8 rounded-lg font-bold transition-colors text-base lg:text-lg ${
            viewMode === 'today' 
              ? 'bg-[#0D69AF] text-white shadow-md' 
              : 'bg-white dark:bg-slate-800 border-2 border-[#0D69AF] text-[#0D69AF] dark:text-blue-400'
          }`}
        >
          Сегодня
        </button>
        <button
          onClick={() => setViewMode('week')}
          className={`h-[50px] px-8 rounded-lg font-bold transition-colors text-base lg:text-lg ${
            viewMode === 'week' 
              ? 'bg-[#0D69AF] text-white shadow-md' 
              : 'bg-white dark:bg-slate-800 border-2 border-[#0D69AF] text-[#0D69AF] dark:text-blue-400'
          }`}
        >
          Вся неделя
        </button>
      </div>

      {/* Список расписания */}
      <div className="space-y-8 pb-20"> {/* pb-20 чтобы кнопка Назад не перекрывала контент */}
        {days.map((day) => {
          if (viewMode === 'today' && day !== currentDay) return null;

          const daySchedule = schedule[selectedGroup]?.[day] || [];

          return (
            <div key={day}>
              <h3 className="font-bold mb-4 text-[#0D69AF] text-xl lg:text-2xl border-l-4 border-[#0D69AF] pl-4">
                {day === 'ПН' && 'ПОНЕДЕЛЬНИК'}
                {day === 'ВТ' && 'ВТОРНИК'}
                {day === 'СР' && 'СРЕДА'}
                {day === 'ЧТ' && 'ЧЕТВЕРГ'}
                {day === 'ПТ' && 'ПЯТНИЦА'}
                {day === 'СБ' && 'СУББОТА'}
              </h3>

              {daySchedule.length > 0 ? (
                <div className="space-y-3">
                  {daySchedule.map((lesson, index) => (
                    <div
                      key={index}
                      className={`rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center overflow-hidden shadow-sm ${
                        lesson.type === 'professional' 
                          ? 'bg-[#EAF4FB] dark:bg-blue-900/20' 
                          : 'bg-white dark:bg-slate-800'
                      }`}
                    >
                      {/* Время */}
                      <div className="w-full sm:w-[140px] flex items-center justify-center py-3 sm:py-0 text-[#0D69AF] font-bold border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-sm sm:text-base">{lesson.time}</span>
                      </div>
                      
                      {/* Предмет */}
                      <div className="flex-1 px-4 py-3 font-bold text-slate-800 dark:text-slate-100 text-base sm:text-lg">
                        {lesson.subject}
                      </div>
                      
                      {/* Преподаватель и Кабинет */}
                      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end px-4 py-3 sm:py-0 sm:pr-6 gap-4">
                        <div className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-medium">
                          {lesson.teacher}
                        </div>
                        <div className="bg-[#0D69AF] text-white px-4 py-1.5 rounded-full text-center font-bold text-sm shadow-sm whitespace-nowrap">
                          каб. {lesson.room}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  Нет занятий
                </div>
              )}
            </div>
          );
        })}
      </div>

      <BackButton />
    </div>
  );
}
