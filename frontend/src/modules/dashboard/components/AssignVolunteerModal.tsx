import React, { useState } from 'react';
import { api } from '../../../shared/lib/api';
import { X, Calendar } from 'lucide-react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { workspaceUtils } from '../../../shared/lib/workspace';

interface AssignVolunteerModalProps {
  volunteerId: string;
  volunteerName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssignVolunteerModal: React.FC<AssignVolunteerModalProps> = ({ volunteerId, volunteerName, onClose, onSuccess }) => {
  const { activeWorkspace } = useAuth();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const orgId = workspaceUtils.getOrganizationWorkspaceId(activeWorkspace);
    if (!orgId) return;

    setIsSubmitting(true);
    try {
      const payload = {
        organizationId: orgId,
        title,
        location,
        notes,
        startDate: new Date().toISOString()
      };

      const res = await api<{ success: boolean }>(`/api/volunteers/${volunteerId}/assignments`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.success) {
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to assign volunteer', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/50">
          <div>
            <h2 className="text-lg font-medium text-white tracking-tight">Assign Volunteer</h2>
            <p className="text-xs text-slate-400 mt-0.5">Deploy {volunteerName} to an operation</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Assignment Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Relief Distribution Lead"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Sector 4 Camp"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Operational Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              placeholder="Duties, reporting instructions..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !title}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Calendar className="w-4 h-4" />
              {isSubmitting ? 'Deploying...' : 'Deploy Volunteer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
