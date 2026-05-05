// src/components/ui/Card.tsx
import { type FC } from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode; // Кнопка или элемент в заголовке
  className?: string;
  noPadding?: boolean;
}

export const Card: FC<CardProps> = ({ 
  children, 
  title, 
  subtitle, 
  action, 
  className = '',
  noPadding = false
}) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col ${className}`}>
      
      {(title || action) && (
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            {title && <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>
    </div>
  );
};

export default Card;