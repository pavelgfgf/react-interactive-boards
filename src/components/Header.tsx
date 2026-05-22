// src/components/Header.tsx

interface HeaderProps {
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
}

export default function Header({ onToggleTheme, theme }: HeaderProps) {
  return (
    <header className="w-full max-w-[1600px] px-6 lg:px-12 flex justify-between items-center mb-4 mx-auto box-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
          🎓
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight leading-tight text-slate-800 dark:text-slate-100">
            ГАПОУ КК "Ленинградский социально-педагогический колледж"
          </h1>
          <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            Интерактивная панель
          </p>
        </div>
      </div>
      
      {/* Кнопка смены темы */}
      <button
        onClick={onToggleTheme}
        className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm hover:scale-105 transition-all shadow-sm text-slate-800 dark:text-slate-100"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
}
