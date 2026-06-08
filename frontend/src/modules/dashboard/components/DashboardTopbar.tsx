import React, { useState, useEffect } from 'react';
import { api } from '../../../shared/lib/api';
import { NotificationPanel } from './NotificationPanel';
import { Bell } from 'lucide-react';

interface DashboardTopbarProps {
  workspaceLabel: string;
  workspaceType: string;
  userName: string;
  onLogout: () => void;
}

export const DashboardTopbar: React.FC<DashboardTopbarProps> = ({
  workspaceLabel,
  workspaceType,
  userName,
  onLogout
}) => {
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchUnreadCount = async () => {
      try {
        const res = await api<{ success: boolean; data: { unreadCount: number } }>('/api/notifications/unread-count');
        if (res.success && isMounted) {
          setUnreadCount(res.data.unreadCount);
        }
      } catch (err) {
        console.error('Failed to fetch unread count', err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Workspace Identifier */}
        <div>
          <h2 className="text-white font-medium">{workspaceLabel}</h2>
          <p className="text-xs text-slate-400 tracking-wider uppercase">{workspaceType}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 relative">
        {/* Notifications */}
        <button 
          onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
          className="text-slate-400 hover:text-white transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900"></span>
          )}
        </button>

        {isNotificationPanelOpen && (
          <NotificationPanel onClose={() => setIsNotificationPanelOpen(false)} />
        )}

        {/* User Identity & Actions */}
        <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
          <span className="text-sm text-slate-300 font-medium">{userName}</span>
          <button 
            onClick={onLogout}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
