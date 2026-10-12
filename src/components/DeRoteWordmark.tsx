import React from 'react';

interface DeRoteWordmarkProps {
  showDescriptor?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DeRoteWordmark: React.FC<DeRoteWordmarkProps> = ({
  showDescriptor = false,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  };

  const iconSizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-9 h-9 text-base',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Distinctive architectural logo mark with layered blue arches */}
      <span
        className={`${iconSizes[size]} rounded-xl bg-gradient-to-br from-[#0866C6] to-[#062B50] p-[1.5px] shadow-sm shrink-0 flex items-center justify-center`}
        aria-hidden="true"
      >
        <span className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-4 h-4 text-[#0866C6]"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Elegant overlapping architectural curve paths */}
            <path
              d="M4 19C4 11.268 10.268 5 18 5"
              stroke="#0866C6"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M7 19C7 13.477 11.477 9 17 9"
              stroke="#168FE5"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="17.5" cy="18" r="2" fill="#062B50" />
          </svg>
        </span>
      </span>

      <div className="flex items-baseline gap-2">
        <span
          className={`font-extrabold tracking-tight font-sans ${sizeClasses[size]}`}
        >
          <span className="text-[#062B50]">De</span>
          <span className="text-[#0866C6]">Rote</span>
        </span>

        {showDescriptor && (
          <span className="hidden sm:inline-block text-[11px] font-bold tracking-widest uppercase text-[#64778C]">
            Student Insight
          </span>
        )}
      </div>
    </div>
  );
};

