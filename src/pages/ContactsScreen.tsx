import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import BackButton from './BackButton';

export default function ContactsScreen() {
  return (
    <div className="flex-1 bg-white">
      <div className="px-12 py-8">
        <h2 className="font-bold text-[#0D69AF] mb-1 pb-2 border-b-2 border-[#0D69AF] inline-block" style={{ fontSize: '32px' }}>
          Контакты
        </h2>

        <div className="flex gap-8 mt-12">
          <div className="flex-[50]">
            <div className="bg-[#F3F4F6] rounded-lg flex items-center justify-center" style={{ height: '500px' }}>
              <MapPin size={64} className="text-[#9CA3AF]" />
            </div>
          </div>

          <div className="flex-[50] space-y-6">
            <div className="bg-white rounded-lg border-l-4 border-[#0D69AF] border border-[#E5E7EB] p-6">
              <div className="flex items-start gap-4">
                <MapPin size={28} className="text-[#0D69AF] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2" style={{ fontSize: '20px' }}>Адрес</h3>
                  <p className="text-[#6B7280]" style={{ fontSize: '16px' }}>
                    353740, Краснодарский край,<br />
                    ст. Ленинградская,<br />
                    ул. Красная, 152
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border-l-4 border-[#0D69AF] border border-[#E5E7EB] p-6">
              <div className="flex items-start gap-4">
                <Phone size={28} className="text-[#0D69AF] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2" style={{ fontSize: '20px' }}>Телефон</h3>
                  <p className="text-[#6B7280]" style={{ fontSize: '16px' }}>
                    +7 (861) 457-01-40
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border-l-4 border-[#0D69AF] border border-[#E5E7EB] p-6">
              <div className="flex items-start gap-4">
                <Mail size={28} className="text-[#0D69AF] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2" style={{ fontSize: '20px' }}>Email</h3>
                  <p className="text-[#6B7280]" style={{ fontSize: '16px' }}>
                    lpk31@mail.ru
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border-l-4 border-[#0D69AF] border border-[#E5E7EB] p-6">
              <div className="flex items-start gap-4">
                <Clock size={28} className="text-[#0D69AF] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2" style={{ fontSize: '20px' }}>Режим работы</h3>
                  <p className="text-[#6B7280]" style={{ fontSize: '16px' }}>
                    пн–сб: 08:00–19:00<br />
                    вс: выходной
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full h-[60px] bg-[#0D69AF] text-white rounded-lg font-bold flex items-center justify-center gap-3 hover:bg-[#0A5590] transition-colors" style={{ fontSize: '18px' }}>
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
