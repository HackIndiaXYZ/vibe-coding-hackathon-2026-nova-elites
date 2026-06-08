import React from 'react';
import { ActivityItem } from './ActivityItem';
import type { ActivityData } from './ActivityItem';
import { Activity } from 'lucide-react';

interface RecentActivityPanelProps {
  activities: ActivityData[];
  isLoading: boolean;
}

export const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({ activities, isLoading }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-800/50 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 text-indigo-400">
          <Activity className="w-4 h-4" />
        </div>
        <h2 className="text-lg font-medium text-white tracking-tight">Recent Activity</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
            Loading activity feed...
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-500 text-sm text-center px-4">
            <p>No recent activity in this workspace.</p>
          </div>
        ) : (
          activities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </div>
  );
};
