import React, { useState, useEffect } from 'react';
import { api } from '../../../shared/lib/api';
import { X, Truck } from 'lucide-react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { workspaceUtils } from '../../../shared/lib/workspace';

interface CreateTransferModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTransferModal: React.FC<CreateTransferModalProps> = ({ onClose, onSuccess }) => {
  const { activeWorkspace } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [resourceId, setResourceId] = useState('');
  const [toOrganizationId, setToOrganizationId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [resResources, resOrgs] = await Promise.all([
          api<{ success: boolean; data: any[] }>('/api/resources'),
          api<{ success: boolean; data: any[] }>('/api/organizations')
        ]);
        if (isMounted) {
          if (resResources.success) {
            setResources(resResources.data);
            if (resResources.data.length > 0) setResourceId(resResources.data[0].id);
          }
          if (resOrgs.success) {
            setOrganizations(resOrgs.data);
            if (resOrgs.data.length > 0) setToOrganizationId(resOrgs.data[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const orgId = workspaceUtils.getOrganizationWorkspaceId(activeWorkspace);
    if (!orgId) return;

    setIsSubmitting(true);
    try {
      const payload = {
        fromOrganizationId: orgId,
        toOrganizationId,
        resourceId,
        quantity: parseInt(quantity, 10),
        notes,
        // resourceLotId could be required by schema but we'll bypass it for direct mock
      };

      const res = await api<{ success: boolean }>('/api/transfers/direct', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.success) {
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to create direct transfer', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/50">
          <div>
            <h2 className="text-lg font-medium text-white tracking-tight">Direct Transfer</h2>
            <p className="text-xs text-slate-400 mt-0.5">Push supplies to an organization</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Destination Organization</label>
            <select
              value={toOrganizationId}
              onChange={e => setToOrganizationId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            >
              <option value="" disabled>Select Destination</option>
              {organizations.filter(o => o.id !== workspaceUtils.getOrganizationWorkspaceId(activeWorkspace)).map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Resource Category</label>
            <select
              value={resourceId}
              onChange={e => setResourceId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            >
              <option value="" disabled>Select Resource</option>
              {resources.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.unit})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Quantity to Transfer</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. 500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Operational Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              placeholder="Delivery instructions, driver details..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !toOrganizationId || !resourceId || !quantity}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Truck className="w-4 h-4" />
              {isSubmitting ? 'Initiating...' : 'Initiate Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
