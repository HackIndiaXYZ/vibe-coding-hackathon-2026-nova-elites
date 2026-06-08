import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { workspaceUtils } from '../../../shared/lib/workspace';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const volunteerNavigation: NavItem[] = [
  { label: 'Overview', path: '/dashboard/overview', icon: <span className="w-5 h-5 flex items-center justify-center">O</span> },
  { label: 'Assignments', path: '/dashboard/assignments', icon: <span className="w-5 h-5 flex items-center justify-center">A</span> },
  { label: 'Activity', path: '/dashboard/activity', icon: <span className="w-5 h-5 flex items-center justify-center">L</span> },
];

const organizationNavigation: NavItem[] = [
  { label: 'Overview', path: '/dashboard/overview', icon: <span className="w-5 h-5 flex items-center justify-center">O</span> },
  { label: 'Inventory', path: '/dashboard/inventory', icon: <span className="w-5 h-5 flex items-center justify-center">I</span> },
  { label: 'Volunteers', path: '/dashboard/volunteers', icon: <span className="w-5 h-5 flex items-center justify-center">V</span> },
  { label: 'Requests', path: '/dashboard/requests', icon: <span className="w-5 h-5 flex items-center justify-center">R</span> },
  { label: 'Transfers', path: '/dashboard/transfers', icon: <span className="w-5 h-5 flex items-center justify-center">T</span> },
  { label: 'Activity', path: '/dashboard/activity', icon: <span className="w-5 h-5 flex items-center justify-center">L</span> },
];

export const SidebarNavigation: React.FC = () => {
  const { activeWorkspace, user } = useAuth();

  let navItems: NavItem[] = [];

  if (workspaceUtils.isVolunteerWorkspace(activeWorkspace)) {
    // In future: filter based on specific volunteer capabilities
    navItems = volunteerNavigation;
  } else if (workspaceUtils.isOrganizationWorkspace(activeWorkspace)) {
    // In future: filter based on user.memberships[..].role and .status
    const orgId = workspaceUtils.getOrganizationWorkspaceId(activeWorkspace);
    const orgMembership = user?.memberships?.find(m => m.organization.id === orgId);
    
    // Example capability filtering (pseudo-code conceptually):
    // const canViewInventory = orgMembership?.role === 'ADMIN' || orgMembership?.role === 'COORDINATOR';
    // if (canViewInventory) items.push(inventoryNavItem);
    
    // For now, allow all organization navigation if active context is valid
    if (orgMembership?.status === 'ACTIVE') {
      navItems = organizationNavigation;
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/50">
      <div className="h-16 border-b border-slate-800 flex items-center px-6">
        <h1 className="text-xl font-light tracking-wide text-white">Samanvay</h1>
      </div>

      <WorkspaceSwitcher />

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
