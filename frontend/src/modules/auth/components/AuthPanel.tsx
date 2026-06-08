import React from 'react';

interface AuthPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-8 md:p-10 rounded-2xl atmospheric-panel relative overflow-hidden group ${className}`}>
      {/* Subtle interaction glow */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.02] transition-colors duration-1000 -z-10 pointer-events-none" />
      {children}
    </div>
  );
};
