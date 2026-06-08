import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { workspaceUtils } from '../../../shared/lib/workspace';
import { api } from '../../../shared/lib/api';
import { useNavigate } from 'react-router-dom';
import { Activity, Plus, Truck, Clock } from 'lucide-react';
import { CreateTransferModal } from '../components/CreateTransferModal';

interface TransferData {
  id: string;
  resource: {
    name: string;
  };
  quantity: number;
  status: string;
  createdAt: string;
  fromOrganization: {
    name: string;
  };
  toOrganization: {
    name: string;
  };
}

export const TransfersPage: React.FC = () => {
  const { activeWorkspace } = useAuth();
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState<TransferData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchTransfers = async () => {
    setIsLoading(true);
    const orgId = workspaceUtils.getOrganizationWorkspaceId(activeWorkspace);
    if (orgId) {
      try {
        const res = await api<{ success: boolean; data: any[] }>(`/api/transfers?organizationId=${orgId}`);
        if (res.success) {
          setTransfers(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransfers();
  }, [activeWorkspace]);

  return (
    <div className="h-full flex flex-col gap-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-white mb-1">Transfer Management</h1>
          <p className="text-slate-400">Track incoming and outgoing resource shipments.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Direct Transfer
        </button>
      </div>

      <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Loading transfers...
          </div>
        ) : transfers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 mb-4">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Active Transfers</h3>
            <p className="text-slate-400 max-w-md">
              There are no pending or active resource transfers. Create a new direct transfer to dispatch supplies.
            </p>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500 bg-slate-900/80 sticky top-0 z-10">
                  <th className="px-6 py-4 font-medium">Resource</th>
                  <th className="px-6 py-4 font-medium">Quantity</th>
                  <th className="px-6 py-4 font-medium">From</th>
                  <th className="px-6 py-4 font-medium">To</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {transfers.map(tr => (
                  <tr 
                    key={tr.id} 
                    onClick={() => navigate(`/dashboard/transfers/${tr.id}`)}
                    className="group hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center text-indigo-400">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                            {tr.resource?.name || 'Unknown Resource'}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              {new Date(tr.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {tr.quantity}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/50 text-xs font-medium text-slate-300 border border-slate-700">
                        {tr.fromOrganization?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/50 text-xs font-medium text-slate-300 border border-slate-700">
                        {tr.toOrganization?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        tr.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        tr.status === 'IN_TRANSIT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        tr.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        tr.status === 'CANCELLED' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                        'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      }`}>
                        {tr.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateTransferModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchTransfers();
          }}
        />
      )}
    </div>
  );
};
