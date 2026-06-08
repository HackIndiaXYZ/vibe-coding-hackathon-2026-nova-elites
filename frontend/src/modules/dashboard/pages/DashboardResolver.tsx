import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { workspaceUtils } from '../../../shared/lib/workspace';
import type { Workspace } from '../../../shared/lib/workspace';
import { PendingWorkspaceState } from '../components/PendingWorkspaceState';

export const DashboardResolver: React.FC = () => {
  const { user, activeWorkspace, setActiveWorkspace, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || !user) return;

    // 1. Gather active contexts
    const activeMemberships = (user.memberships || []).filter(m => m.status === 'ACTIVE');
    const hasVolunteer = !!user.volunteer;
    const allPending = (user.memberships || []).filter(m => m.status === 'PENDING');

    // 2. Validate current activeWorkspace using the strict hydrated util
    const isCurrentValid = workspaceUtils.isValidWorkspace(activeWorkspace, user);

    if (isCurrentValid) {
      // Valid workspace selected, redirect into operational shell
      navigate('/dashboard/overview', { replace: true });
      return;
    }

    // 3. Fallback logic if current is invalid or null
    const totalActiveContexts = activeMemberships.length + (hasVolunteer ? 1 : 0);

    if (totalActiveContexts === 1) {
      // Exactly one ACTIVE context -> auto-select it
      let newWorkspace: Workspace;
      if (hasVolunteer) {
        newWorkspace = { type: 'volunteer' };
      } else {
        newWorkspace = { type: 'organization', organizationId: activeMemberships[0].organization.id };
      }
      setActiveWorkspace(newWorkspace);
      navigate('/dashboard/overview', { replace: true });
    } else if (totalActiveContexts > 1) {
      // Multiple contexts -> explicitly redirect to the selection surface
      navigate('/dashboard/select-workspace', { replace: true });
    } else {
      // 0 active contexts
      if (allPending.length === 0) {
        // No active and no pending -> force onboarding
        navigate('/onboarding', { replace: true });
      }
    }
  }, [user, activeWorkspace, isLoading, setActiveWorkspace, navigate]);

  if (isLoading) {
    return <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">Resolving Workspace...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;

  const activeMemberships = (user.memberships || []).filter(m => m.status === 'ACTIVE');
  const allPending = (user.memberships || []).filter(m => m.status === 'PENDING');
  const hasVolunteer = !!user.volunteer;
  const totalActiveContexts = activeMemberships.length + (hasVolunteer ? 1 : 0);

  // If there are exactly 0 active contexts, but there are pending, render pending state here
  // since they are trapped until approved.
  if (totalActiveContexts === 0 && allPending.length > 0) {
    return <PendingWorkspaceState organizationName={allPending[0].organization.name} />;
  }

  // Otherwise wait for the useEffect navigation
  return null;
};
