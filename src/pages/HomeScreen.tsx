// src/pages/HomeScreen.tsx
import { useNavigate } from 'react-router-dom';
import { Building2, GraduationCap, Calendar, Users, Phone } from 'lucide-react';

// --- ИМПОРТЫ ИЗ ВАШЕГО ПРОЕКТА ---
import { ClockSection } from '../components/info/ClockSection';
import { BellInfo } from '../components/info/BellInfo';
import { NewsSlider } from '../components/News/NewsSlider';
import { useTime } from '../hooks/useTime';
import { useBellSchedule } from '../hooks/useBellSchedule';

const navigationCards = [
  { id: 'about', icon: Building2, title: 'О колледже', desc: 'История, миссия', path: '/about' },
  { id: 'specialties', icon: GraduationCap, title: 'Специальности', desc: 'Направления', path: '/specialties' },
  { id: 'schedule', icon: Calendar, title: 'Расписание', desc: 'Занятия', path: '/schedule' },
  { id: 'applicants', icon: Users, title: 'Поступающим', desc: 'Документы', path: '/applicants' },
  { id: 'contacts', icon: Phone, title: 'Контакты', desc: 'Адрес, телефон', path: '/contacts' }
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const now = useTime();
  const { schedule: bellSchedule, loading: isBellLoading } = useBellSchedule();

  // Рассчитываем activeIdx и nextIdx для BellInfo
  const curMin = now.getHours() * 60 + now.getMinutes();
  let activeIdx = -1;
  let nextIdx = -1;

  if (!isBellLoading && bellSchedule) {
    for (let i = 0; i < bellSchedule.length; i++) {
      // Предполагаем, что у вас есть utils/parseTime или аналогичная функция
      // Если нет, можно использовать простую логику сравнения строк "HH:MM"
      const startParts = bellSchedule[i].start.split(':');
      const endParts = bellSchedule[i].end.split(':');
      const startMin = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
      const endMin = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

      if (curMin >= startMin && curMin < endMin) {
        activeIdx = i;
        break;
      }
      if (curMin < startMin && nextIdx === -1) {
        nextIdx = i;
      }
    }
  }

  return (
    <div className="flex flex-col items-center w-full pb-12 mx-auto">
      
      {/* --- ВЕРХНИЙ БЛОК: ЧАСЫ + НАВИГАЦИЯ --- */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* ЛЕВАЯ КОЛОНКА: ЧАСЫ И ЗВОНКИ (объединенный блок) */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
            {/* Часы */}
            <ClockSection now={now} />
            
            {/* Разделитель */}
            <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-4"></div>
            
            {/* Информация о звонках */}
            <BellInfo 
              activeIdx={activeIdx} 
              nextIdx={nextIdx} 
              now={now} 
              schedule={bellSchedule || []} 
            />
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: 5 КАРТОЧЕК НАВИГАЦИИ */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 h-full">
            {navigationCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => navigate(card.path)}
                  className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group h-full"
                >
                  <div className="text-blue-600 dark:text-blue-400 text-3xl mb-2 group-hover:scale-110 transition-transform">
                    <Icon size={40} />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1 text-center">{card.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center leading-tight">{card.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- НИЖНИЙ БЛОК: НОВОСТИ --- */}
      <div className="w-full">
        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
          <div className="w-full h-[800px]">
            <NewsSlider />
          </div>
        </div>
      </div>

    </div>
  );
}
