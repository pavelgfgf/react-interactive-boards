// src/components/ui/Input.tsx
import { type FC } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  onClear?: () => void;
}

export const Input: FC<InputProps> = ({ 
  label, 
  error, 
  icon, 
  className = '', 
  onClear,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
          {label}
        </label>
      )}
      
      <div className="relative group">
        {/* Иконка слева */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}

        <input
          className={`
            w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 
            text-slate-800 dark:text-slate-100 rounded-lg px-4 py-2 text-sm
            placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
            transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${onClear ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Кнопка очистки справа */}
        {onClear && props.value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;