import BackButton from './BackButton';

const specialties = [
  {
    code: '44.02.01',
    name: 'Дошкольное образование',
    description: 'Подготовка воспитателей для дошкольных образовательных учреждений. Обучение методикам работы с детьми дошкольного возраста.'
  },
  {
    code: '44.02.02',
    name: 'Преподавание в начальных классах',
    description: 'Подготовка учителей начальных классов. Изучение методик преподавания основных предметов начальной школы.'
  },
  {
    code: '44.02.04',
    name: 'Специальное дошкольное образование',
    description: 'Подготовка специалистов для работы с детьми дошкольного возраста с ограниченными возможностями здоровья.'
  }
];

export default function SpecialtiesScreen() {
  return (
    <div className="flex-1 bg-white">
      <div className="px-12 py-8">
        <h2 className="font-bold text-[#0D69AF] mb-1 pb-2 border-b-2 border-[#0D69AF] inline-block" style={{ fontSize: '32px' }}>
          Специальности колледжа
        </h2>

        <div className="flex gap-6 mt-12">
          {specialties.map((specialty) => (
            <div
              key={specialty.code}
              className="flex-1 bg-white rounded-lg border border-[#E5E7EB] overflow-hidden"
            >
              <div className="h-[180px] bg-[#EAF4FB] flex items-center justify-center">
                <div className="bg-[#0D69AF] text-white px-6 py-3 rounded-lg font-bold" style={{ fontSize: '20px' }}>
                  {specialty.code}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold mb-3" style={{ fontSize: '20px', color: '#1A1A1A' }}>
                  {specialty.name}
                </h3>
                <p className="text-[#6B7280] mb-6 leading-relaxed" style={{ fontSize: '15px' }}>
                  {specialty.description}
                </p>
                <button className="w-full h-[50px] border-2 border-[#0D69AF] text-[#0D69AF] rounded-lg font-bold hover:bg-[#EAF4FB] transition-colors" style={{ fontSize: '16px' }}>
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BackButton />
    </div>
  );
}
