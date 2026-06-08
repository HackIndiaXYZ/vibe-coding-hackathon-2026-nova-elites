import React, { useState } from 'react';
import { api } from '../../../shared/lib/api';
import { Check, X, User } from 'lucide-react';

export interface PendingMembership {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  organization: {
    id: string;
    name: string;
  };
}

interface MembershipRequestCardProps {
  membership: PendingMembership;
  onProcessed: () => void;
}

export const MembershipRequestCard: React.FC<MembershipRequestCardProps> = ({ membership, onProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action: 'approve' | 'reject') => {
    setIsProcessing(true);
    try {
      const res = await api<{ success: boolean }>(`/api/memberships/${membership.id}/${action}?organizationId=${membership.organizationId}`, {
        method: 'PATCH'
      });
      if (res.success) {
        onProcessed();
      }
    } catch (err) {
      console.error(`Failed to ${action} membership`, err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-slate-800/30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-white font-medium">{membership.user.name}</h4>
          <div className="flex items-center gap-2 text-sm text-slate-400 mt-0.5">
            <span>{membership.user.email}</span>
            <span>&bull;</span>
            <span className="text-indigo-400">{membership.role}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => handleAction('reject')}
          disabled={isProcessing}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          title="Reject Request"
        >
          <X className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleAction('approve')}
          disabled={isProcessing}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors disabled:opacity-50"
          title="Approve Request"
        >
          <Check className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
