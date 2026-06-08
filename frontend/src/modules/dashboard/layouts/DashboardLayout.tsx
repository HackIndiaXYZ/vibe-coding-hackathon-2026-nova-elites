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
    <div className="min-h-screen bg-[#020617] text-white flex overflow-hidden">
      
      {/* Sidebar Region */}
      <div className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900/30 flex flex-col z-30">
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

      {/* Future Command Panel Region */}
      {/* <div className="hidden xl:block w-72 border-l border-slate-800 bg-slate-900/30 flex-shrink-0">
         Future contextual actions / activity feed
      </div> */}
    </div>
  );
};
