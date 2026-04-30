// src/components/PhotoGallery.tsx
import  { type FC, useState, useCallback, useEffect } from 'react';
import type { PhotoItem } from '../data/types';
import { PHOTO_DATA } from '../data/schedule';

export const PhotoGallery: FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const next = useCallback(() => setCurrentIdx((prev) => (prev + 1) % PHOTO_DATA.length), []);
  const prev = useCallback(() => setCurrentIdx((prev) => (prev - 1 + PHOTO_DATA.length) % PHOTO_DATA.length), []);
  const goTo = useCallback((index: number) => setCurrentIdx(index), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative h-full min-h-[200px] bg-slate-200 dark:bg-slate-900 overflow-hidden group">
      <div className="flex h-full transition-transform duration-700 ease-out" style={{ transform: `translateX(-${currentIdx * 100}%)` }}>
        {PHOTO_DATA.map((photo: PhotoItem, i: number) => (
          <img key={i} src={photo.url} alt={photo.caption} className="min-w-full h-full object-cover" />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-10 pb-5 px-6">
        <h3 className="text-white text-xl font-bold">{PHOTO_DATA[currentIdx].caption}</h3>
        <p className="text-white/70 text-sm mt-1">{PHOTO_DATA[currentIdx].sub}</p>
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100">‹</button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100">›</button>

      <div className="absolute bottom-4 right-6 flex gap-1.5">
        {PHOTO_DATA.map((_: PhotoItem, i: number) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-sm transition-all ${i === currentIdx ? 'bg-white scale-125' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery