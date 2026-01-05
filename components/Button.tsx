import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed touch-target active:scale-[0.97]";
  
  const variants = {
    primary: "bg-primary text-primary-foreground active:bg-primary-hover shadow-lg shadow-primary/20 border border-transparent",
    secondary: "bg-white text-secondary active:bg-slate-50 border border-slate-200 shadow-sm",
    outline: "bg-transparent text-primary border border-primary active:bg-primary-light",
    ghost: "bg-transparent text-slate-600 active:bg-slate-100 active:text-secondary",
  };

  const sizes = {
    sm: "px-3 py-2 text-xs sm:text-sm min-h-[40px]",
    md: "px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]",
    lg: "px-5 sm:px-6 py-3 sm:py-3.5 text-base sm:text-lg min-h-[48px]",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;