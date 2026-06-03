import { CheckCircle2, GraduationCap, Handshake, Users } from 'lucide-react';
import BackButton from './BackButton';

export default function AboutScreen() {
  return (
    <div className="flex-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="px-12 py-8">
        <h2 className="font-bold text-[#449284] dark:text-[#5fb5a8] mb-1 pb-2 border-b-2 border-[#449284] dark:border-[#5fb5a8] inline-block" style={{ fontSize: '32px' }}>
          О колледже
        </h2>

        <div className="flex gap-8 mt-8">
          <div className="flex-[65]">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-3" style={{ fontSize: '20px' }}>История</h3>
                <p className="text-[#6B7280] dark:text-slate-400 leading-relaxed" style={{ fontSize: '16px' }}>
                  ГАПОУ КК «Ленинградский социально-педагогический колледж» - одно из старейших учебных заведений Краснодарского края.
                  Колледж ведет свою историю с 1931 года и на протяжении многих десятилетий готовит специалистов для системы образования,
                  социальной сферы и других направлений, востребованных в регионе.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-3" style={{ fontSize: '20px' }}>Цель</h3>
                <p className="text-[#6B7280] dark:text-slate-400 leading-relaxed" style={{ fontSize: '16px' }}>
                  Главная цель колледжа - подготовка конкурентоспособных специалистов, которые умеют применять знания на практике,
                  работать с людьми, развиваться в профессии и быть полезными обществу. Обучение направлено не только на получение
                  квалификации, но и на формирование ответственности, самостоятельности и культуры профессионального общения.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-3" style={{ fontSize: '20px' }}>Аккредитация и лицензия</h3>
                <p className="text-[#6B7280] dark:text-slate-400 leading-relaxed" style={{ fontSize: '16px' }}>
                  Колледж имеет государственную аккредитацию и лицензию на осуществление образовательной деятельности.
                  Выпускники получают дипломы государственного образца, подтверждающие освоение образовательной программы
                  и готовность к профессиональной деятельности.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-3" style={{ fontSize: '20px' }}>Колледж сегодня</h3>
                <p className="text-[#6B7280] dark:text-slate-400 leading-relaxed" style={{ fontSize: '16px' }}>
                  Сегодня колледж сочетает традиции педагогического образования и современные подходы к подготовке специалистов.
                  Учебный процесс строится на практике, проектной деятельности, наставничестве и тесной связи с будущей профессией.
                  Студенты осваивают профессиональные дисциплины, учатся работать в команде, принимать решения и уверенно действовать
                  в реальных рабочих ситуациях.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-3" style={{ fontSize: '20px' }}>Образовательная среда</h3>
                <p className="text-[#6B7280] dark:text-slate-400 leading-relaxed" style={{ fontSize: '16px' }}>
                  В колледже созданы условия для учебы, творчества и профессионального роста. Аудитории и кабинеты используются для
                  теоретических занятий, практических работ, консультаций и подготовки к итоговой аттестации. Особое внимание уделяется
                  воспитательной работе, участию студентов в конкурсах, волонтерских проектах, культурных и спортивных мероприятиях.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-[#E5E7EB] dark:border-slate-700 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <GraduationCap size={26} className="text-[#449284] dark:text-[#5fb5a8]" />
                    <h3 className="font-bold" style={{ fontSize: '18px' }}>Практика</h3>
                  </div>
                  <p className="text-[#6B7280] dark:text-slate-400 leading-relaxed" style={{ fontSize: '15px' }}>
                    Практическая подготовка помогает студентам заранее познакомиться с задачами будущей профессии.
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-[#E5E7EB] dark:border-slate-700 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Users size={26} className="text-[#449284] dark:text-[#5fb5a8]" />
                    <h3 className="font-bold" style={{ fontSize: '18px' }}>Наставничество</h3>
                  </div>
                  <p className="text-[#6B7280] dark:text-slate-400 leading-relaxed" style={{ fontSize: '15px' }}>
                    Преподаватели сопровождают студентов в учебе, профессиональном выборе и личностном развитии.
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-[#E5E7EB] dark:border-slate-700 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Handshake size={26} className="text-[#449284] dark:text-[#5fb5a8]" />
                    <h3 className="font-bold" style={{ fontSize: '18px' }}>Партнерство</h3>
                  </div>
                  <p className="text-[#6B7280] dark:text-slate-400 leading-relaxed" style={{ fontSize: '15px' }}>
                    Колледж взаимодействует с образовательными организациями и социальными партнерами района и края.
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-[#E5E7EB] dark:border-slate-700 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 size={26} className="text-[#449284] dark:text-[#5fb5a8]" />
                    <h3 className="font-bold" style={{ fontSize: '18px' }}>Результат</h3>
                  </div>
                  <p className="text-[#6B7280] dark:text-slate-400 leading-relaxed" style={{ fontSize: '15px' }}>
                    Выпускники готовы к работе по специальности и дальнейшему профессиональному развитию.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 mt-8">
                <div className="flex-1 bg-[#E8F4F1] dark:bg-[#449284]/20 rounded-lg p-6 border-l-4 border-[#449284] dark:border-[#5fb5a8] text-center">
                  <div className="font-bold text-[#449284] dark:text-[#5fb5a8] mb-2" style={{ fontSize: '32px' }}>более 1500</div>
                  <div className="text-[#6B7280] dark:text-slate-400" style={{ fontSize: '15px' }}>студентов</div>
                </div>
                <div className="flex-1 bg-[#E8F4F1] dark:bg-[#449284]/20 rounded-lg p-6 border-l-4 border-[#449284] dark:border-[#5fb5a8] text-center">
                  <div className="font-bold text-[#449284] dark:text-[#5fb5a8] mb-2" style={{ fontSize: '32px' }}>5</div>
                  <div className="text-[#6B7280] dark:text-slate-400" style={{ fontSize: '15px' }}>специальностей</div>
                </div>
                <div className="flex-1 bg-[#E8F4F1] dark:bg-[#449284]/20 rounded-lg p-6 border-l-4 border-[#449284] dark:border-[#5fb5a8] text-center">
                  <div className="font-bold text-[#449284] dark:text-[#5fb5a8] mb-2" style={{ fontSize: '32px' }}>более 95 лет</div>
                  <div className="text-[#6B7280] dark:text-slate-400" style={{ fontSize: '15px' }}>истории</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-[35]">
            <div className="bg-[#F3F4F6] dark:bg-slate-800 rounded-lg flex items-center justify-center" style={{ height: '360px' }}>
              <img src="https://pavelgfgf.github.io/react-interactive-boards/home.png" className="text-[#9CA3AF] dark:text-slate-500" />
            </div>

            <div className="mt-6 bg-[#E8F4F1] dark:bg-[#449284]/20 rounded-lg p-6 border-l-4 border-[#449284] dark:border-[#5fb5a8]">
              <h3 className="font-bold text-[#449284] dark:text-[#5fb5a8] mb-3" style={{ fontSize: '22px' }}>Наши ценности</h3>
              <ul className="space-y-3 text-[#6B7280] dark:text-slate-400" style={{ fontSize: '16px' }}>
                <li>• уважение к личности студента;</li>
                <li>• ответственность за качество образования;</li>
                <li>• связь обучения с практикой;</li>
                <li>• поддержка инициативы и творчества;</li>
                <li>• открытость к сотрудничеству.</li>
              </ul>
            </div>

            <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg border border-[#E5E7EB] dark:border-slate-700 p-6">
              <h3 className="font-bold mb-3" style={{ fontSize: '22px' }}>Студенческая жизнь</h3>
              <p className="text-[#6B7280] dark:text-slate-400 leading-relaxed" style={{ fontSize: '16px' }}>
                Студенты участвуют в профессиональных конкурсах, творческих событиях, спортивных мероприятиях,
                добровольческих акциях и проектах, которые помогают раскрыть способности и почувствовать себя частью команды.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BackButton />
    </div>
  );
}
