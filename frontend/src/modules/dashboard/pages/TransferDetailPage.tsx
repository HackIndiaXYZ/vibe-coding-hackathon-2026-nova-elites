import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../shared/lib/api';
import { ArrowLeft, Calendar, Info, Package, AlertCircle } from 'lucide-react';
import { TransferLifecyclePanel } from '../components/TransferLifecyclePanel';
import { TransferActionBar } from '../components/TransferActionBar';

interface TransferDetailData {
  id: string;
  resourceId: string;
  quantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  resource: {
    id: string;
    name: string;
    unit: string;
  };
  fromOrganization: {
    id: string;
    name: string;
  };
  toOrganization: {
    id: string;
    name: string;
  };
}

export const TransferDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transfer, setTransfer] = useState<TransferDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchTransfer = async () => {
      try {
        const res = await api<{ success: boolean; data: TransferDetailData }>(`/api/transfers/${id}`);
        if (isMounted && res.success) {
          setTransfer(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    if (id) fetchTransfer();
    return () => { isMounted = false; };
  }, [id]);

  if (isLoading) {
    return <div className="h-full flex items-center justify-center text-slate-500">Loading transfer details...</div>;
  }

  if (!transfer) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
        <AlertCircle className="w-12 h-12 text-slate-600" />
        <p>Transfer not found.</p>
        <button onClick={() => navigate('/dashboard/transfers')} className="text-indigo-400 hover:text-indigo-300">
          Return to transfers
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button 
          onClick={() => navigate('/dashboard/transfers')}
          className="mt-1 p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-light text-white tracking-tight">Transfer Details</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                transfer.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                transfer.status === 'IN_TRANSIT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                transfer.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                transfer.status === 'CANCELLED' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              }`}>
                {transfer.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-slate-400 flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              Initiated on {new Date(transfer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Resource Info */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <TransferLifecyclePanel status={transfer.status} />

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-400" />
                Shipment Details
              </h3>
            </div>
            
            <div className="bg-slate-950/50 rounded-xl p-5 border border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500 block mb-1">Resource</span>
                <span className="text-xl font-medium text-white">{transfer.resource?.name || 'Unknown Resource'}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500 block mb-1">Quantity Transferring</span>
                <span className="text-3xl font-light text-white tracking-tight">{transfer.quantity} <span className="text-sm font-normal text-slate-500">{transfer.resource?.unit}</span></span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-950/30 border border-slate-800/50 rounded-xl p-4">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500 block mb-1">Origin</span>
                <span className="text-white font-medium">{transfer.fromOrganization?.name || 'Unknown'}</span>
              </div>
              <div className="bg-slate-950/30 border border-slate-800/50 rounded-xl p-4">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500 block mb-1">Destination</span>
                <span className="text-white font-medium">{transfer.toOrganization?.name || 'Unknown'}</span>
              </div>
            </div>

            <TransferActionBar 
              transferId={transfer.id}
              status={transfer.status}
              fromOrganizationId={transfer.fromOrganization.id}
              toOrganizationId={transfer.toOrganization.id}
              onProcessed={() => {
                // To trigger a re-fetch, we can just reload or we should have a callback
                window.location.reload();
              }}
            />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-400" />
              Metadata
            </h3>
            <div className="space-y-4">
              <div>
                <span className="block text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Transfer ID</span>
                <span className="text-slate-400 font-mono text-sm">{transfer.id}</span>
              </div>
              <div>
                <span className="block text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Last Updated</span>
                <span className="text-slate-300 text-sm">{new Date(transfer.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
