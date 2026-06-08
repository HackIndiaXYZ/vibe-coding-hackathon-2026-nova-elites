import React, { useState } from 'react';
import { api } from '../../../shared/lib/api';
import { Truck, CheckCircle, Package, XCircle } from 'lucide-react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { workspaceUtils } from '../../../shared/lib/workspace';

interface TransferActionBarProps {
  transferId: string;
  status: string;
  fromOrganizationId: string;
  toOrganizationId: string;
  onProcessed: () => void;
}

export const TransferActionBar: React.FC<TransferActionBarProps> = ({ transferId, status, fromOrganizationId, toOrganizationId, onProcessed }) => {
  const { activeWorkspace } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const orgId = workspaceUtils.getOrganizationWorkspaceId(activeWorkspace);

  const handleAction = async (action: 'accept' | 'start-transit' | 'deliver' | 'cancel') => {
    setIsProcessing(true);
    try {
      const res = await api<{ success: boolean }>(`/api/transfers/${transferId}/${action}`, {
        method: 'PATCH'
      });
      if (res.success) {
        onProcessed();
      }
    } catch (err) {
      console.error(`Failed to ${action} transfer`, err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!orgId) return null;

  const isSender = orgId === fromOrganizationId;
  const isReceiver = orgId === toOrganizationId;

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {status === 'PENDING' && isSender && (
        <button
          onClick={() => handleAction('accept')}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <CheckCircle className="w-4 h-4" />
          Accept Transfer
        </button>
      )}

      {status === 'ACCEPTED' && isSender && (
        <button
          onClick={() => handleAction('start-transit')}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Truck className="w-4 h-4" />
          Start Transit
        </button>
      )}

      {status === 'IN_TRANSIT' && isReceiver && (
        <button
          onClick={() => handleAction('deliver')}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Package className="w-4 h-4" />
          Mark Delivered
        </button>
      )}

      {['PENDING', 'ACCEPTED'].includes(status) && (isSender || isReceiver) && (
        <button
          onClick={() => handleAction('cancel')}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/20 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <XCircle className="w-4 h-4" />
          Cancel Transfer
        </button>
      )}
    </div>
  );
};
