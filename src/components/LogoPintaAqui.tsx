import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  withPill?: boolean;
}

export default function LogoPintaAqui({ 
  className = '', 
  size = 'md', 
  onClick,
  withPill = true 
}: LogoProps) {
  // Configuração de tamanhos
  const heights = {
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-11',
    lg: 'h-12 sm:h-14'
  };

  const content = (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer hover:opacity-95 transition-all' : ''} ${className}`}
    >
      {/* Ícone Pin de Localização com Rolo de Pintura */}
      <svg
        viewBox="0 0 120 130"
        className="w-auto h-7 sm:h-9 shrink-0 drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pin Laranja Exterior */}
        <path
          d="M 60 6 C 30 6 8 28 8 58 C 8 86 38 114 60 126 C 82 114 112 86 112 58 C 112 28 90 6 60 6 Z"
          fill="#FF7A18"
        />
        {/* Círculo Branco Central */}
        <circle cx="60" cy="52" r="32" fill="#FFFFFF" />
        
        {/* Rolo de Pintura Laranja */}
        <rect x="42" y="38" width="36" height="17" rx="3.5" fill="#FF7A18" />
        
        {/* Cabo de Arame Azul Marinho */}
        <path
          d="M 57 55 L 57 68 A 5 5 0 0 1 52 73 L 49 73 A 5 5 0 0 0 44 78 L 44 87"
          fill="none"
          stroke="#004B8D"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Empunhadura do Cabo */}
        <line
          x1="44"
          y1="82"
          x2="44"
          y2="88"
          stroke="#004B8D"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Tipografia Oficial: "pinta" (Azul Marinho) + "aqui" (Laranja) */}
      <div className="flex items-baseline font-black tracking-tight leading-none text-xl sm:text-2xl md:text-3xl font-sans">
        <span className="text-[#004B8D]">pinta</span>
        <span className="text-[#FF7A18]">aqui</span>
      </div>
    </div>
  );

  if (withPill) {
    return (
      <div 
        onClick={onClick}
        className={`bg-white px-3 sm:px-4 py-1.5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-stone-200/40 inline-flex items-center ${onClick ? 'cursor-pointer' : ''}`}
      >
        {content}
      </div>
    );
  }

  return content;
}
