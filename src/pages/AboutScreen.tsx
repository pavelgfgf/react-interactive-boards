import { Camera } from 'lucide-react';
import BackButton from './BackButton';

export default function AboutScreen() {
  return (
    <div className="flex-1 bg-white">
      <div className="px-12 py-8">
        <h2 className="font-bold text-[#0D69AF] mb-1 pb-2 border-b-2 border-[#0D69AF] inline-block" style={{ fontSize: '32px' }}>
          О колледже
        </h2>

        <div className="flex gap-8 mt-8">
          <div className="flex-[65]">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-3" style={{ fontSize: '20px' }}>История</h3>
                <p className="text-[#6B7280] leading-relaxed" style={{ fontSize: '16px' }}>
                  ГАПОУ КК «Ленинградский социально-педагогический колледж» — одно из старейших учебных заведений Краснодарского края.
                  Колледж ведёт свою историю с 1937 года и готовит высококвалифицированных специалистов в области образования и социальной работы.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-3" style={{ fontSize: '20px' }}>Миссия</h3>
                <p className="text-[#6B7280] leading-relaxed" style={{ fontSize: '16px' }}>
                  Подготовка конкурентоспособных специалистов для системы образования Краснодарского края, способных к профессиональному
                  и личностному росту, социальной и профессиональной мобильности.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-3" style={{ fontSize: '20px' }}>Аккредитация и лицензия</h3>
                <p className="text-[#6B7280] leading-relaxed" style={{ fontSize: '16px' }}>
                  Колледж имеет государственную аккредитацию и лицензию на осуществление образовательной деятельности.
                  Выпускники получают дипломы государственного образца.
                </p>
              </div>

              <div className="flex gap-6 mt-8">
                <div className="flex-1 bg-[#EAF4FB] rounded-lg p-6 border-l-4 border-[#0D69AF] text-center">
                  <div className="font-bold text-[#0D69AF] mb-2" style={{ fontSize: '32px' }}>более 1500</div>
                  <div className="text-[#6B7280]" style={{ fontSize: '15px' }}>студентов</div>
                </div>
                <div className="flex-1 bg-[#EAF4FB] rounded-lg p-6 border-l-4 border-[#0D69AF] text-center">
                  <div className="font-bold text-[#0D69AF] mb-2" style={{ fontSize: '32px' }}>5</div>
                  <div className="text-[#6B7280]" style={{ fontSize: '15px' }}>специальностей</div>
                </div>
                <div className="flex-1 bg-[#EAF4FB] rounded-lg p-6 border-l-4 border-[#0D69AF] text-center">
                  <div className="font-bold text-[#0D69AF] mb-2" style={{ fontSize: '32px' }}>более 80 лет</div>
                  <div className="text-[#6B7280]" style={{ fontSize: '15px' }}>истории</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-[35]">
            <div className="bg-[#F3F4F6] rounded-lg flex items-center justify-center" style={{ height: '500px' }}>
              <Camera size={64} className="text-[#9CA3AF]" />
            </div>
          </div>
        </div>
      </div>

      <BackButton />
    </div>
  );
}
