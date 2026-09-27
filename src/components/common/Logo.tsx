import React, { useState } from 'react';
import logoImg from '../../assets/images/prompt_travels_logo.jpg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'mark';
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  // Responsive size definitions
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
  };

  const markSize = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none transition-transform active:scale-95 group ${className}`}
      role="banner"
      aria-label="Prompt Travels Home"
    >
      {!imageError ? (
        <div className="relative flex items-center">
          <img
            src={logoImg}
            alt="Prompt Travels Logo"
            onError={() => setImageError(true)}
            className={`${heightClasses[size]} w-auto object-contain rounded-md transition-all duration-300 group-hover:brightness-105 filter drop-shadow-sm`}
          />
        </div>
      ) : (
        /* Crisp High-Res Vector Brand Fallback */
        <div className="flex items-center gap-2.5">
          <div
            className={`flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#9D174D] via-[#D81B60] to-[#F59E0B] p-0.5 shadow-md shadow-pink-900/10 ${markSize[size]}`}
          >
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white">
              <span className="font-display font-black bg-gradient-to-br from-[#BE185D] to-[#D4AF37] bg-clip-text text-transparent">
                P
              </span>
            </div>
          </div>

          {variant === 'full' && (
            <div className="flex flex-col text-left">
              <span className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                PROMPT <span className="font-serif-luxury font-normal text-[#C59B27]">TRAVELS</span>
              </span>
              <span className="text-[9px] font-semibold tracking-widest text-[#BE185D] uppercase">
                Tours & Travels · Since 2001
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
