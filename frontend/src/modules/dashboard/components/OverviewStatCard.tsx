import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface OverviewStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  trendUp?: boolean;
}

export const OverviewStatCard: React.FC<OverviewStatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendUp
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg backdrop-blur-md transition-all hover:bg-slate-800/40">
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-indigo-500/5 blur-[50px] pointer-events-none" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 text-indigo-400 shadow-inner shadow-indigo-500/10">
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {trend}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-3xl font-light text-white tracking-tight mb-1">{value}</h3>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        {description && <p className="text-xs text-slate-500 mt-2">{description}</p>}
      </div>
    </div>
  );
};
