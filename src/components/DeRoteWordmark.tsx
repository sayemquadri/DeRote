import React from 'react';
import deroteLogo from '../assets/images/derote_logo_fitted.png';

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
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-11 h-11',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* DeRote Logo Image replacing old SVG */}
      <span
        className={`${iconSizes[size]} rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center bg-white border border-[#D5E4F3]`}
        aria-hidden="true"
      >
        <img
          src={deroteLogo}
          alt="DeRote logo"
          className="w-full h-full object-cover object-center select-none"
          loading="eager"
        />
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

