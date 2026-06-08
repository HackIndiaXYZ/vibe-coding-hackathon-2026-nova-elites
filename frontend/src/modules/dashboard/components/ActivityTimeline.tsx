import React from 'react';
import { ActivityItem } from './ActivityItem';
import type { ActivityData } from './ActivityItem';

interface ActivityTimelineProps {
  activities: ActivityData[];
  isLoading: boolean;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, isLoading }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md overflow-hidden">
      <div className="p-6 border-b border-slate-800/50">
        <h2 className="text-xl font-medium text-white tracking-tight">Operational Timeline</h2>
        <p className="text-sm text-slate-400 mt-1">Full history of actions in this context.</p>
      </div>
      
      <div className="p-6 space-y-4 relative">
        {/* Timeline connecting line */}
        {!isLoading && activities.length > 0 && (
          <div className="absolute top-10 bottom-10 left-[2.35rem] w-px bg-slate-800/80 z-0" />
        )}
        
        <div className="relative z-10 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-48 text-slate-500">
              Loading operational history...
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-center">
              <p>No activity recorded in this workspace yet.</p>
            </div>
          ) : (
            activities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
