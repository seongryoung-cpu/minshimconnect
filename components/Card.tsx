import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverable = false }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white rounded-xl sm:rounded-2xl border border-slate-100 p-4 sm:p-6 
        ${hoverable ? 'cursor-pointer active:shadow-xl active:-translate-y-1 transition-all duration-300 touch-target' : 'shadow-sm'} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;