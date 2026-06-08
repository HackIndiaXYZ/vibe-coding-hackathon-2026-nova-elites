import React, { useState, useEffect } from 'react';
import { api } from '../../../shared/lib/api';
import { Bell, CheckSquare, RefreshCw, X } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
export interface NotificationData {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationPanelProps {
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await api<{ success: boolean; data: NotificationData[] }>('/api/notifications');
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Simulate polling every 30s as per Phase 6 requirements
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleReadStatusChange = (id: string, isRead: boolean) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead } : n));
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await api<{ success: boolean }>('/api/notifications/read-all', { method: 'PATCH' });
      if (res.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="absolute top-16 right-4 w-80 max-h-[80vh] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden z-50">
      <div className="p-4 border-b border-slate-800/50 bg-slate-900/80 flex items-center justify-between">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-400" />
          Notifications
          {unreadCount > 0 && (
            <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
              {unreadCount}
            </span>
          )}
        </h3>
        <div className="flex items-center gap-1">
          <button 
            onClick={fetchNotifications}
            className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            title="Mark all as read"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center gap-2 text-slate-500">
            <Bell className="w-8 h-8 opacity-20" />
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.map(notification => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onReadStatusChange={handleReadStatusChange} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
