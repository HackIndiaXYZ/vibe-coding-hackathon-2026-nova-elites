import React, { useState } from 'react';
import { api } from '../../../shared/lib/api';
import { Check } from 'lucide-react';
import type { NotificationData } from './NotificationPanel';

interface NotificationItemProps {
  notification: NotificationData;
  onReadStatusChange: (id: string, isRead: boolean) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onReadStatusChange }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleRead = async () => {
    setIsProcessing(true);
    try {
      const action = notification.isRead ? 'unread' : 'read';
      const res = await api<{ success: boolean }>(`/api/notifications/${notification.id}/${action}`, {
        method: 'PATCH'
      });
      if (res.success) {
        onReadStatusChange(notification.id, !notification.isRead);
      }
    } catch (err) {
      console.error('Failed to toggle notification status', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`p-4 border-b border-slate-800/50 flex items-start gap-4 transition-colors ${notification.isRead ? 'opacity-60 bg-slate-900/20' : 'bg-slate-900/60'}`}>
      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notification.isRead ? 'bg-transparent' : 'bg-indigo-500'}`} />
      
      <div className="flex-1">
        <h4 className={`text-sm ${notification.isRead ? 'text-slate-400 font-normal' : 'text-slate-200 font-medium'} mb-1`}>
          {notification.title}
        </h4>
        <p className="text-xs text-slate-500 mb-2">{notification.body}</p>
        <span className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">
          {new Date(notification.createdAt).toLocaleString()}
        </span>
      </div>

      <button 
        onClick={toggleRead}
        disabled={isProcessing}
        className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50 shrink-0"
        title={notification.isRead ? "Mark as unread" : "Mark as read"}
      >
        <Check className="w-4 h-4" />
      </button>
    </div>
  );
};
