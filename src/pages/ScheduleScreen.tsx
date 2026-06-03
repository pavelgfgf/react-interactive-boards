import { useEffect, useMemo, useState } from 'react';
import { useFullSchedule } from '../hooks/useLesson';
import { getBellSchedule, getDaysOfWeek, type BellScheduleItem, type DayOfWeek } from '../utils/pocketbase';
import BackButton from './BackButton';

type Lesson = {
  subject: string;
  teacher: string;
  room: string;
  time?: string;
  type?: string;
};

type GroupSections = Record<string, string[]>;

const fallbackDays: DayOfWeek[] = [
  { id: 'pn', key: 'ПН', full: 'Понедельник', order_num: 1 },
  { id: 'vt', key: 'ВТ', full: 'Вторник', order_num: 2 },
  { id: 'sr', key: 'СР', full: 'Среда', order_num: 3 },
  { id: 'cht', key: 'ЧТ', full: 'Четверг', order_num: 4 },
  { id: 'pt', key: 'ПТ', full: 'Пятница', order_num: 5 },
  { id: 'sb', key: 'СБ', full: 'Суббота', order_num: 6 },
];

const groupNames: Record<string, string> = {
  У: 'Учитель начальных классов',
  Д: 'Дошкольное образование',
  И: 'Информационные системы',
  С: 'Социальная работа',
  Г: 'Гостиничное дело',
};

const normalizeDayKey = (key: string) => key.trim().toUpperCase();

const getGroupPrefix = (group: string) => group.trim().charAt(0).toUpperCase() || 'Другое';

const buildGroupSections = (groups: string[]): GroupSections => {
  return groups.reduce<GroupSections>((sections, group) => {
    const prefix = getGroupPrefix(group);
    sections[prefix] = [...(sections[prefix] || []), group];
    return sections;
  }, {});
};

const getLessonTime = (lesson: Lesson, index: number, bellSchedule: BellScheduleItem[]) => {
  if (lesson.time) return lesson.time;

  const slot = bellSchedule.find((item) => item.num === index + 1);
  return slot ? `${slot.start}-${slot.end}` : `${index + 1} пара`;
};

interface ClassTabsProps {
  groups: GroupSections;
  current: string;
  onSelect: (cls: string) => void;
}

const ClassTabs = ({ groups, current, onSelect }: ClassTabsProps) => {
  const prefixes = Object.keys(groups).sort((a, b) => a.localeCompare(b, 'ru'));

  return (
    <div className="w-full pb-2 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {prefixes.map((prefix) => (
          <div key={prefix} className="flex flex-col gap-2 min-w-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
              {groupNames[prefix] || `Группы ${prefix}`}
            </span>
            <div className="flex flex-wrap gap-2">
              {groups[prefix].map((cls) => (
                <button
                  key={cls}
                  onClick={() => onSelect(cls)}
                  className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all border ${
                    current === cls
                      ? 'bg-[#449284] text-white border-[#449284] shadow-sm'
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
  const { schedule, loading, error } = useFullSchedule();
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [viewMode, setViewMode] = useState<'today' | 'week'>('week');
  const [days, setDays] = useState<DayOfWeek[]>(fallbackDays);
  const [bellSchedule, setBellSchedule] = useState<BellScheduleItem[]>([]);

  const availableGroups = useMemo(() => {
    return Object.keys(schedule || {}).sort((a, b) => a.localeCompare(b, 'ru', { numeric: true }));
  }, [schedule]);

  const groupSections = useMemo(() => buildGroupSections(availableGroups), [availableGroups]);
  const selectedGroup = availableGroups.includes(selectedGroupId) ? selectedGroupId : availableGroups[0] || '';

  useEffect(() => {
    let isMounted = true;

    const fetchMeta = async () => {
      try {
        const [loadedDays, loadedBells] = await Promise.all([getDaysOfWeek(), getBellSchedule()]);

        if (!isMounted) return;
        if (loadedDays.length > 0) setDays(loadedDays);
        setBellSchedule(loadedBells);
      } catch (err) {
        console.error('Ошибка загрузки данных расписания из PocketBase:', err);
      }
    };

    fetchMeta();

    return () => {
      isMounted = false;
    };
  }, []);

  const getCurrentDay = () => {
    const dayIndex = new Date().getDay();
    if (dayIndex === 0) return normalizeDayKey(days[0]?.key || 'ПН');

    return normalizeDayKey(days[dayIndex - 1]?.key || 'ПН');
  };

  const currentDay = getCurrentDay();

  return (
    <div className="flex-1 bg-white dark:bg-slate-900 min-h-full p-4 lg:p-8 relative">
      <h2 className="font-bold text-[#449284] mb-6 pb-2 border-b-2 border-[#449284] inline-block text-2xl lg:text-3xl">
        Расписание занятий
      </h2>

      {loading && (
        <div className="p-6 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          Загружаем расписание из PocketBase...
        </div>
      )}

      {!loading && error && (
        <div className="p-6 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          Не удалось загрузить расписание: {error}
        </div>
      )}

      {!loading && !error && availableGroups.length === 0 && (
        <div className="p-6 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          В PocketBase пока нет расписания для групп.
        </div>
      )}

      {!loading && !error && availableGroups.length > 0 && (
        <>
          <ClassTabs groups={groupSections} current={selectedGroup} onSelect={setSelectedGroupId} />

          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setViewMode('today')}
              className={`h-[50px] px-8 rounded-lg font-bold transition-colors text-base lg:text-lg ${
                viewMode === 'today'
                  ? 'bg-[#449284] text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 border-2 border-[#449284] text-[#449284] dark:text-[#5fb5a8]'
              }`}
            >
              Сегодня
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`h-[50px] px-8 rounded-lg font-bold transition-colors text-base lg:text-lg ${
                viewMode === 'week'
                  ? 'bg-[#449284] text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 border-2 border-[#449284] text-[#449284] dark:text-[#5fb5a8]'
              }`}
            >
              Вся неделя
            </button>
          </div>

          <div className="space-y-8 pb-20">
            {days.map((day) => {
              const dayKey = normalizeDayKey(day.key);
              if (viewMode === 'today' && dayKey !== currentDay) return null;

              const selectedSchedule = schedule?.[selectedGroup] || {};
              const matchingScheduleKey = Object.keys(selectedSchedule).find((key) => normalizeDayKey(key) === dayKey);
              const daySchedule = ((matchingScheduleKey ? selectedSchedule[matchingScheduleKey] : []) || []) as Lesson[];

              return (
                <div key={day.id || day.key}>
                  <h3 className="font-bold mb-4 text-[#449284] text-xl lg:text-2xl border-l-4 border-[#449284] pl-4 uppercase">
                    {day.full}
                  </h3>

                  {daySchedule.length > 0 ? (
                    <div className="space-y-3">
                      {daySchedule.map((lesson, index) => (
                        <div
                          key={`${day.key}-${index}-${lesson.subject}`}
                          className={`rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center overflow-hidden shadow-sm ${
                            lesson.type === 'professional'
                              ? 'bg-[#E8F4F1] dark:bg-[#449284]/20'
                              : 'bg-white dark:bg-slate-800'
                          }`}
                        >
                          <div className="w-full sm:w-[140px] flex items-center justify-center py-3 sm:py-0 text-[#449284] font-bold border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <span className="text-sm sm:text-base">{getLessonTime(lesson, index, bellSchedule)}</span>
                          </div>

                          <div className="flex-1 px-4 py-3 font-bold text-slate-800 dark:text-slate-100 text-base sm:text-lg">
                            {lesson.subject}
                          </div>

                          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end px-4 py-3 sm:py-0 sm:pr-6 gap-4">
                            <div className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-medium">
                              {lesson.teacher || 'Преподаватель не указан'}
                            </div>
                            <div className="bg-[#449284] text-white px-4 py-1.5 rounded-full text-center font-bold text-sm shadow-sm whitespace-nowrap">
                              каб. {lesson.room || '-'}
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
        </>
      )}

      <BackButton />
    </div>
  );
}
