import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface AtmosphericInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
}

export const AtmosphericInput = forwardRef<HTMLInputElement, AtmosphericInputProps>(
  ({ label, error, description, className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <label className="text-sm font-medium text-text-secondary pl-1">
          {label}
        </label>
        
        <div className="relative group">
          {/* Subtle focus glow behind input */}
          <div className="absolute -inset-0.5 bg-primary/20 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 rounded-xl pointer-events-none -z-10" />
          
          <input
            ref={ref}
            className={`
              w-full bg-surface/30 border border-white/5 rounded-xl px-4 py-3
              text-text-primary placeholder:text-text-muted/50
              focus:outline-none focus:border-primary/40 focus:bg-surface/50
              transition-all duration-300
              shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]
              ${error ? 'border-red-500/30 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20' : ''}
            `}
            {...props}
          />
        </div>

        {description && !error && (
          <span className="text-xs text-text-muted pl-1">{description}</span>
        )}
        
        {error && (
          <span className="text-xs text-red-400/80 pl-1 font-medium tracking-wide">
            {error}
          </span>
        )}
      </div>
    );
  }
);

AtmosphericInput.displayName = 'AtmosphericInput';
