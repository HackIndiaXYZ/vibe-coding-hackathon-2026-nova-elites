import React from 'react';
import { Activity } from 'lucide-react';

export interface ActivityData {
  id: string;
  action: string;
  actorName: string;
  entityName: string;
  timestamp: string;
}

interface ActivityItemProps {
  activity: ActivityData;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
      <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center shrink-0 mt-1">
        <Activity className="w-4 h-4 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-300 leading-snug">
          <span className="font-medium text-white">{activity.actorName}</span>{' '}
          <span className="text-slate-400">{activity.action}</span>{' '}
          <span className="font-medium text-slate-200">{activity.entityName}</span>
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {new Date(activity.timestamp).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};
