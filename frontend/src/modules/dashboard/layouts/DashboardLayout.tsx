import React, { useMemo } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { workspaceUtils } from '../../../shared/lib/workspace';
import { DashboardTopbar } from '../components/DashboardTopbar';
import { SidebarNavigation } from '../components/SidebarNavigation';

export const DashboardLayout: React.FC = () => {
  const { user, activeWorkspace, logout } = useAuth();

  // Validate active workspace before rendering layout
  const isValid = useMemo(() => workspaceUtils.isValidWorkspace(activeWorkspace, user), [activeWorkspace, user]);

  if (!user || !isValid) {
    // If somehow landed here without a valid workspace, punt back to resolver
    return <Navigate to="/dashboard" replace />;
  }

  // Compute Topbar props
  let workspaceLabel = 'Unknown Workspace';
  let workspaceTypeStr = 'Workspace';

  if (activeWorkspace?.type === 'volunteer') {
    workspaceLabel = 'Volunteer Operations';
    workspaceTypeStr = 'Volunteer';
  } else if (activeWorkspace?.type === 'organization') {
    const orgMembership = user.memberships?.find(m => m.organization.id === activeWorkspace.organizationId);
    if (orgMembership) {
      workspaceLabel = orgMembership.organization.name;
      workspaceTypeStr = 'Organization';
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-text-primary)] flex overflow-hidden">
      
      {/* Sidebar Region */}
      <div className="w-64 flex-shrink-0 border-r border-[var(--color-border)] bg-[var(--color-sidebar)] flex flex-col z-30">
        <SidebarNavigation />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <DashboardTopbar 
          workspaceLabel={workspaceLabel}
          workspaceType={workspaceTypeStr}
          userName={user.name || 'User'}
          onLogout={logout}
        />

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
