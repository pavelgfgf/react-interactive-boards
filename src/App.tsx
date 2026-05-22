// src/App.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

// Импорт страниц
import Header from './components/Header';
import AboutScreen from './pages/AboutScreen';
import ApplicantsScreen from './pages/ApplicantsScreen';
import ContactsScreen from './pages/ContactsScreen';
import HomeScreen from './pages/HomeScreen';
import ScheduleScreen from './pages/ScheduleScreen';
import SpecialtiesScreen from './pages/SpecialtiesScreen';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Таймер неактивности (90 сек)
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (location.pathname !== '/') {
      timerRef.current = setTimeout(() => {
        navigate('/', { replace: true });
      }, 90000);
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      {/* Фон как в первом проекте */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col items-center py-4 font-sans transition-colors duration-300">
        
        {/* Ваш оригинальный Header */}
        <Header onToggleTheme={toggleTheme} theme={theme} />

        <main className="w-full max-w-[1600px] px-6 lg:px-12 flex-1 overflow-auto box-border">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/about" element={<AboutScreen />} />
            <Route path="/schedule" element={<ScheduleScreen />} />
            <Route path="/specialties" element={<SpecialtiesScreen />} />
            <Route path="/applicants" element={<ApplicantsScreen />} />
            <Route path="/contacts" element={<ContactsScreen />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
