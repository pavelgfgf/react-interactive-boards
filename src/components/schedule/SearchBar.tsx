// src/components/schedule/SearchBar.tsx
import { type FC } from 'react';
import { Input } from '../ui/Input'; // Импорт из ui

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export const SearchBar: FC<SearchBarProps> = ({ value, onChange, onClear }) => {
  return (
    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClear={onClear}
        placeholder="Поиск преподавателя..."
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        }
      />
    </div>
  );
};

export default SearchBar;