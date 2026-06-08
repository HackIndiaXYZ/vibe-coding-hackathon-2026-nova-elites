import React, { useState } from 'react';
import { api } from '../../../shared/lib/api';
import { X, Save } from 'lucide-react';
import type { ResourceLotData } from './InventoryTable';
import { useAuth } from '../../../app/providers/AuthProvider';
import { workspaceUtils } from '../../../shared/lib/workspace';

interface EditInventoryModalProps {
  lot: ResourceLotData;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditInventoryModal: React.FC<EditInventoryModalProps> = ({ lot, onClose, onSuccess }) => {
  const { activeWorkspace } = useAuth();
  const [quantity, setQuantity] = useState(lot.quantity.toString());
  const [availableQuantity, setAvailableQuantity] = useState(lot.availableQuantity.toString());
  const [notes, setNotes] = useState(lot.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const orgId = workspaceUtils.getOrganizationWorkspaceId(activeWorkspace);
    if (!orgId) return;

    setIsSubmitting(true);
    try {
      const payload = {
        organizationId: orgId,
        quantity: parseInt(quantity, 10),
        availableQuantity: parseInt(availableQuantity, 10),
        notes
      };

      const res = await api<{ success: boolean }>(`/api/resource-lots/${lot.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });

      if (res.success) {
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to update inventory', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/50">
          <div>
            <h2 className="text-lg font-medium text-white tracking-tight">Edit Inventory Record</h2>
            <p className="text-xs text-slate-400 mt-0.5">{lot.resource.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Total Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Available Quantity</label>
              <input
                type="number"
                min="0"
                max={quantity}
                value={availableQuantity}
                onChange={e => setAvailableQuantity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Location / Notes</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Warehouse A, Aisle 3"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !quantity || !availableQuantity}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
