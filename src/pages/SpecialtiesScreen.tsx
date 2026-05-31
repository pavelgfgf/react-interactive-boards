import { useEffect, useState } from 'react';
import { ClientResponseError } from 'pocketbase';
import BackButton from './BackButton';
import { getSpecialties, pb, type SpecialtyRecord } from '../utils/pocketbase';

const getFileName = (value?: string | string[]) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const getSpecialtyPhotoUrl = (specialty: SpecialtyRecord) => {
  const fileName = getFileName(specialty.photo) || getFileName(specialty.image) || getFileName(specialty.picture);

  if (!fileName) {
    return null;
  }

  return pb.files.getURL(specialty, fileName, { thumb: '640x360' });
};

export default function SpecialtiesScreen() {
  const [specialties, setSpecialties] = useState<SpecialtyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSpecialties = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getSpecialties();
        if (isMounted) {
          setSpecialties(data);
        }
      } catch (err: unknown) {
        if (!isMounted) return;

        if (err instanceof ClientResponseError) {
          if (err.status === 403) {
            setError('Ошибка доступа (403). Проверьте API Rules коллекции specialties.');
          } else if (err.status === 404) {
            setError('Коллекция specialties не найдена в PocketBase.');
          } else {
            setError(`Ошибка PocketBase: ${err.message}`);
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Произошла неизвестная ошибка.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSpecialties();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex-1 bg-white dark:bg-slate-900 min-h-full relative">
      <div className="px-12 py-8">
        <h2 className="font-bold text-[#0D69AF] mb-1 pb-2 border-b-2 border-[#0D69AF] inline-block" style={{ fontSize: '32px' }}>
          Специальности колледжа
        </h2>

        {loading && (
          <div className="mt-12 p-6 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            Загрузка специальностей...
          </div>
        )}

        {!loading && error && (
          <div className="mt-12 p-6 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {!loading && !error && specialties.length === 0 && (
          <div className="mt-12 p-6 text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            Специальности пока не добавлены.
          </div>
        )}

        {!loading && !error && specialties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-12">
            {specialties.map((specialty) => (
              <div key={specialty.id} className="bg-white dark:bg-slate-800 rounded-lg border border-[#E5E7EB] dark:border-slate-700 overflow-hidden">
                <div className="h-[180px] bg-[#EAF4FB] dark:bg-blue-900/20 flex items-center justify-center relative overflow-hidden">
                  {getSpecialtyPhotoUrl(specialty) ? (
                    <img
                      src={getSpecialtyPhotoUrl(specialty) || ''}
                      alt={specialty.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#EAF4FB] dark:bg-blue-900/20" />
                  )}
                </div>
                <div className="p-6">
                  <div className="inline-flex bg-[#0D69AF] text-white px-4 py-1.5 rounded-lg font-bold mb-4" style={{ fontSize: '16px' }}>
                    {specialty.code}
                  </div>
                  <h3 className="font-bold mb-3 text-slate-900 dark:text-slate-100" style={{ fontSize: '20px' }}>
                    {specialty.name}
                  </h3>
                  <p className="text-[#6B7280] dark:text-slate-400 mb-6 leading-relaxed" style={{ fontSize: '15px' }}>
                    {specialty.description}
                  </p>
                  <button className="w-full h-[50px] border-2 border-[#0D69AF] text-[#0D69AF] rounded-lg font-bold hover:bg-[#EAF4FB] dark:hover:bg-blue-900/20 transition-colors" style={{ fontSize: '16px' }}>
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BackButton />
    </div>
  );
}
