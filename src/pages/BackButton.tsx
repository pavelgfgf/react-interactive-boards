import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.querySelectorAll<HTMLElement>('*').forEach((element) => {
      if (element.scrollTop > 0) {
        element.scrollTop = 0;
      }
    });
  };

  const handleBack = () => {
    navigate('/');
    requestAnimationFrame(scrollToTop);
  };

  return (
    <button
      onClick={handleBack}
      className="fixed bottom-8 left-8 w-[140px] h-[60px] bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center gap-2 border border-[#E5E7EB] dark:border-slate-700 hover:bg-[#F3F4F6] dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors"
      style={{ fontSize: '16px' }}
    >
      <ArrowLeft size={20} />
      Назад
    </button>
  );
}
