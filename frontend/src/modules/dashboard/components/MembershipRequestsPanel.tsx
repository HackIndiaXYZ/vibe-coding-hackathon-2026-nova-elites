import React, { useState, useEffect } from 'react';
import { api } from '../../../shared/lib/api';
import { useAuth } from '../../../app/providers/AuthProvider';
import { workspaceUtils } from '../../../shared/lib/workspace';
import { MembershipRequestCard } from './MembershipRequestCard';
import type { PendingMembership } from './MembershipRequestCard';

export const MembershipRequestsPanel: React.FC = () => {
  const { activeWorkspace } = useAuth();
  const [requests, setRequests] = useState<PendingMembership[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    setIsLoading(true);
    const orgId = workspaceUtils.getOrganizationWorkspaceId(activeWorkspace);
    if (!orgId) {
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await api<{ success: boolean; data: PendingMembership[] }>(`/api/memberships/pending?organizationId=${orgId}`);
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch pending memberships', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeWorkspace]);

  if (isLoading) {
    return <div className="text-slate-500 text-sm">Loading requests...</div>;
  }

  if (requests.length === 0) {
    return null; // Don't show the panel if there are no pending requests
  }

  return (
    <div className="bg-slate-900/40 border border-indigo-500/20 rounded-2xl p-6 mb-6">
      <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
        </span>
        Action Required: Pending Approvals
      </h3>
      <p className="text-sm text-slate-400 mb-4">
        The following users have requested to join this organization.
      </p>
      <div className="flex flex-col gap-3">
        {requests.map(req => (
          <MembershipRequestCard 
            key={req.id} 
            membership={req} 
            onProcessed={fetchRequests} 
          />
        ))}
      </div>
    </div>
  );
};
