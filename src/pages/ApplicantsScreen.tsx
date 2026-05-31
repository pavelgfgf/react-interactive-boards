import { FileText, Calendar, Phone } from 'lucide-react';
import BackButton from './BackButton';

export default function ApplicantsScreen() {
  return (
    <div className="flex-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="px-12 py-8">
        <h2 className="font-bold text-[#0D69AF] dark:text-blue-400 mb-1 pb-2 border-b-2 border-[#0D69AF] dark:border-blue-400 inline-block" style={{ fontSize: '32px' }}>
          Поступающим
        </h2>

        <div className="flex gap-8 mt-12">
          <div className="flex-[60] space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg border-l-4 border-[#0D69AF] dark:border-l-blue-400 border border-[#E5E7EB] dark:border-slate-700 p-6">
              <div className="flex items-start gap-4 mb-4">
                <FileText size={32} className="text-[#0D69AF] dark:text-blue-400" />
                <h3 className="font-bold" style={{ fontSize: '22px' }}>Документы для поступления</h3>
              </div>
              <ul className="space-y-2 text-[#6B7280] dark:text-slate-400 ml-12" style={{ fontSize: '16px' }}>
                <li>• Паспорт (оригинал и копия)</li>
                <li>• Аттестат об основном общем или среднем общем образовании</li>
                <li>• Фотографии 3×4 см (4 штуки)</li>
                <li>• Медицинская справка формы 086/у</li>
                <li>• СНИЛС (копия)</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border-l-4 border-[#0D69AF] dark:border-l-blue-400 border border-[#E5E7EB] dark:border-slate-700 p-6">
              <div className="flex items-start gap-4 mb-4">
                <Calendar size={32} className="text-[#0D69AF] dark:text-blue-400" />
                <h3 className="font-bold" style={{ fontSize: '22px' }}>Сроки приёма</h3>
              </div>
              <div className="ml-12 space-y-2">
                <p className="text-[#6B7280] dark:text-slate-400" style={{ fontSize: '16px' }}>
                  <strong>Начало приёма документов:</strong> 20 июня 2026 года
                </p>
                <p className="text-[#6B7280] dark:text-slate-400" style={{ fontSize: '16px' }}>
                  <strong>Окончание приёма документов:</strong> 15 августа 2026 года
                </p>
                <p className="text-[#6B7280] dark:text-slate-400" style={{ fontSize: '16px' }}>
                  <strong>Зачисление:</strong> до 25 августа 2026 года
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border-l-4 border-[#0D69AF] dark:border-l-blue-400 border border-[#E5E7EB] dark:border-slate-700 p-6">
              <div className="flex items-start gap-4 mb-4">
                <Phone size={32} className="text-[#0D69AF] dark:text-blue-400" />
                <h3 className="font-bold" style={{ fontSize: '22px' }}>Приёмная комиссия</h3>
              </div>
              <div className="ml-12 space-y-2">
                <p className="text-[#6B7280] dark:text-slate-400" style={{ fontSize: '16px' }}>
                  <strong>Кабинет:</strong> 101
                </p>
                <p className="text-[#6B7280] dark:text-slate-400" style={{ fontSize: '16px' }}>
                  <strong>Телефон:</strong> +7 (861) 457-01-40
                </p>
                <p className="text-[#6B7280] dark:text-slate-400" style={{ fontSize: '16px' }}>
                  <strong>Email:</strong> lpk31@mail.ru
                </p>
                <p className="text-[#6B7280] dark:text-slate-400" style={{ fontSize: '16px' }}>
                  <strong>Режим работы:</strong> пн–сб: 08:00–17:00
                </p>
              </div>
            </div>
          </div>

          <div className="flex-[40]">
            <div className="bg-[#EAF4FB] dark:bg-blue-900/20 rounded-lg p-8 flex flex-col items-center justify-center border border-transparent dark:border-blue-900/40" style={{ height: '600px' }}>
              <h3 className="font-bold text-center mb-8 text-[#0D69AF] dark:text-blue-400" style={{ fontSize: '28px' }}>
                Готовы поступить?
              </h3>
              <button className="w-full h-[80px] bg-[#0D69AF] text-white rounded-lg font-bold mb-6 hover:bg-[#0A5590] transition-colors" style={{ fontSize: '20px' }}>
                Записаться в колледж
              </button>
              <a
                href="#"
                className="text-[#0D69AF] dark:text-blue-400 hover:underline text-center"
                style={{ fontSize: '16px' }}
              >
                Узнать подробнее на gosuslugi.ru
              </a>
            </div>
          </div>
        </div>
      </div>

      <BackButton />
    </div>
  );
}
