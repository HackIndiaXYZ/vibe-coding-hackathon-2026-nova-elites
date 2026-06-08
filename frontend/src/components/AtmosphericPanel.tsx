import React, { type ReactNode } from 'react';

interface AtmosphericPanelProps {
  children: ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const AtmosphericPanel: React.FC<AtmosphericPanelProps> = ({ 
  children, 
  className = '',
  intensity = 'medium'
}) => {
  const intensityMap = {
    low: 'bg-surface/10 backdrop-blur-xl',
    medium: 'bg-surface/20 backdrop-blur-2xl',
    high: 'bg-surface/40 backdrop-blur-3xl'
  };

  return (
    <div className={`atmospheric-panel rounded-xl ${intensityMap[intensity]} ${className}`}>
      {children}
    </div>
  );
};
