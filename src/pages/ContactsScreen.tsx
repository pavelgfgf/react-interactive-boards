import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import BackButton from './BackButton';

const collegeAddress = 'Ленинградский социально-педагогический колледж';
const yandexMapUrl = `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(collegeAddress)}&z=16`;

export default function ContactsScreen() {
  return (
    <div className="flex-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="px-12 py-8">
        <h2 className="font-bold text-[#449284] dark:text-[#5fb5a8] mb-1 pb-2 border-b-2 border-[#449284] dark:border-[#5fb5a8] inline-block" style={{ fontSize: '32px' }}>
          Контакты
        </h2>

        <div className="flex gap-8 mt-12">
          <div className="flex-[50]">
            <div className="bg-[#F3F4F6] dark:bg-slate-800 rounded-lg overflow-hidden border border-[#E5E7EB] dark:border-slate-700 shadow-sm relative" style={{ height: '500px' }}>
              <iframe
                title="Карта колледжа"
                src={yandexMapUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <div className="flex-[50] space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg border-l-4 border-[#449284] dark:border-l-[#5fb5a8] border border-[#E5E7EB] dark:border-slate-700 p-6">
              <div className="flex items-start gap-4">
                <MapPin size={28} className="text-[#449284] dark:text-[#5fb5a8] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2" style={{ fontSize: '20px' }}>Адрес</h3>
                  <p className="text-[#6B7280] dark:text-slate-400" style={{ fontSize: '16px' }}>
                    353740, Краснодарский край,<br />
                    ст. Ленинградская,<br />
                    ул. Красная, 150
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border-l-4 border-[#449284] dark:border-l-[#5fb5a8] border border-[#E5E7EB] dark:border-slate-700 p-6">
              <div className="flex items-start gap-4">
                <Phone size={28} className="text-[#449284] dark:text-[#5fb5a8] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2" style={{ fontSize: '20px' }}>Телефон</h3>
                  <p className="text-[#6B7280] dark:text-slate-400" style={{ fontSize: '16px' }}>
                    +7 (861) 457-01-40
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border-l-4 border-[#449284] dark:border-l-[#5fb5a8] border border-[#E5E7EB] dark:border-slate-700 p-6">
              <div className="flex items-start gap-4">
                <Mail size={28} className="text-[#449284] dark:text-[#5fb5a8] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2" style={{ fontSize: '20px' }}>Email</h3>
                  <p className="text-[#6B7280] dark:text-slate-400" style={{ fontSize: '16px' }}>
                    lpk31@mail.ru
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border-l-4 border-[#449284] dark:border-l-[#5fb5a8] border border-[#E5E7EB] dark:border-slate-700 p-6">
              <div className="flex items-start gap-4">
                <Clock size={28} className="text-[#449284] dark:text-[#5fb5a8] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2" style={{ fontSize: '20px' }}>Режим работы</h3>
                  <p className="text-[#6B7280] dark:text-slate-400" style={{ fontSize: '16px' }}>
                    пн–сб: 08:00–19:00<br />
                    вс: выходной
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full h-[60px] bg-[#449284] text-white rounded-lg font-bold flex items-center justify-center gap-3 hover:bg-[#36766a] transition-colors" style={{ fontSize: '18px' }}>
              <Send size={20} />
              Написать директору
            </button>
          </div>
        </div>
      </div>

      <BackButton />
    </div>
  );
}
