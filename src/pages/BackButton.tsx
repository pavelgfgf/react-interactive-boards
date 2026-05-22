import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className="fixed bottom-8 left-8 w-[140px] h-[60px] bg-white rounded-lg flex items-center justify-center gap-2 border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-colors"
      style={{ fontSize: '16px', color: '#1A1A1A' }}
    >
      <ArrowLeft size={20} />
      Назад
    </button>
  );
}
