import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../shared/lib/api';
import type { ResourceLotData } from '../components/InventoryTable';
import { InventoryStatusBadge, computeInventoryStatus } from '../components/InventoryStatusBadge';
import { ArrowLeft, Package, MapPin, Tag } from 'lucide-react';
import { ActivityItem } from '../components/ActivityItem';
import type { ActivityData } from '../components/ActivityItem';
import { EditInventoryModal } from '../components/EditInventoryModal';
import { Pencil } from 'lucide-react';

export const InventoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [lot, setLot] = useState<ResourceLotData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchLot = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await api<{ success: boolean; data: ResourceLotData }>(`/api/resource-lots/${id}`);
      if (res.success && res.data) {
        setLot(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch resource lot:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLot();
  }, [fetchLot]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Loading operational details...
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
        <p>Resource not found or access denied.</p>
        <button 
          onClick={() => navigate('/dashboard/inventory')}
          className="text-indigo-400 hover:underline"
        >
          Return to Inventory
        </button>
      </div>
    );
  }

  const status = computeInventoryStatus(lot.quantity, lot.availableQuantity);

  // Mock activity data for this specific inventory item
  const mockActivity: ActivityData[] = [
    {
      id: 'mock-1',
      action: 'created inventory record',
      actorName: 'System',
      entityName: lot.resource.name,
      timestamp: lot.updatedAt
    }
  ];

  return (
    <div className="h-full flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <button 
          onClick={() => navigate('/dashboard/inventory')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Inventory
        </button>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
              {lot.resource.name}
              <InventoryStatusBadge status={status} />
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
              <span className="flex items-center gap-1"><Tag className="w-4 h-4" /> {lot.resource.unit}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {lot.notes || 'Main Storage'}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl px-5 py-3 flex flex-col items-center">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total</span>
              <div className="text-2xl font-light text-slate-300">
                {lot.quantity}
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-3 flex flex-col items-center">
              <span className="text-xs font-medium text-amber-500/70 uppercase tracking-wider mb-1">Reserved</span>
              <div className="text-2xl font-light text-amber-400">
                {lot.reservedQuantity}
              </div>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-5 py-3 flex flex-col items-center relative group">
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="absolute top-1 right-1 p-1 rounded-md bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Pencil className="w-3 h-3" />
              </button>
              <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-1">Available</span>
              <div className="text-3xl font-light text-white tracking-tight">
                {lot.availableQuantity}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-400" />
              Operational Metadata
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <span className="block text-slate-500 mb-1">Resource ID</span>
                <span className="text-slate-300 font-mono">{lot.resource.id}</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-1">Lot ID</span>
                <span className="text-slate-300 font-mono">{lot.id}</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-1">Last Updated</span>
                <span className="text-slate-300">{new Date(lot.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
            <h3 className="text-lg font-medium text-white mb-4">Item History</h3>
            <div className="space-y-4">
              {mockActivity.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditInventoryModal 
          lot={lot}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            fetchLot();
          }}
        />
      )}
    </div>
  );
};
