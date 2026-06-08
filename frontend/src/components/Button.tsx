import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  icon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  icon
}) => {
  const baseStyles = "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-500 overflow-hidden group";
  
  const variants = {
    primary: "bg-primary-glow text-white border border-primary/30 hover:border-primary/60 hover:bg-primary/20 button-glow-primary",
    secondary: "bg-surface-bright/30 text-white border border-white/5 hover:border-white/10 hover:bg-surface-bright/50",
    ghost: "bg-transparent text-on-surface-variant hover:text-white"
  };

  return (
    <motion.button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {variant === 'primary' && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out -z-10" />
      )}
      <span className={`relative z-10 ${variant === 'primary' ? 'drop-shadow-md' : ''}`}>
        {children}
      </span>
      {icon && <span className="relative z-10 ml-1">{icon}</span>}
      
      {/* Subtle outer glow for primary button */}
      {variant === 'primary' && (
        <span className="absolute -inset-2 bg-primary/20 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 -z-20 rounded-full" />
      )}
    </motion.button>
  );
};
