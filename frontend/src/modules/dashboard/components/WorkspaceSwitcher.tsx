import React from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { workspaceUtils } from '../../../shared/lib/workspace';

export const WorkspaceSwitcher: React.FC = () => {
  const { user, activeWorkspace, setActiveWorkspace } = useAuth();

  if (!user) return null;

  const activeMemberships = (user.memberships || []).filter(m => m.status === 'ACTIVE');
  const pendingMemberships = (user.memberships || []).filter(m => m.status === 'PENDING');
  const hasVolunteer = !!user.volunteer;

  return (
    <div className="p-4 border-b border-slate-800">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
        Workspaces
      </div>
      
      <div className="space-y-1">
        {hasVolunteer && (
          <button
            onClick={() => setActiveWorkspace({ type: 'volunteer' })}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
              workspaceUtils.isVolunteerWorkspace(activeWorkspace) 
                ? 'bg-teal-500/10 text-teal-400 font-medium' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
              workspaceUtils.isVolunteerWorkspace(activeWorkspace) ? 'bg-teal-500/20' : 'bg-slate-800'
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="truncate">Volunteer</span>
          </button>
        )}

        {activeMemberships.map(m => {
          const isActive = activeWorkspace?.type === 'organization' && activeWorkspace.organizationId === m.organization.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveWorkspace({ type: 'organization', organizationId: m.organization.id })}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                isActive 
                  ? 'bg-indigo-500/10 text-indigo-400 font-medium' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                isActive ? 'bg-indigo-500/20' : 'bg-slate-800'
              }`}>
                <span className="text-[10px] font-bold">{m.organization.name.substring(0, 2).toUpperCase()}</span>
              </div>
              <div className="truncate flex-1">
                <div className="truncate">{m.organization.name}</div>
                <div className="text-[10px] opacity-70 truncate">{m.role}</div>
              </div>
            </button>
          );
        })}

        {pendingMemberships.length > 0 && (
          <div className="pt-2 mt-2 border-t border-slate-800/50">
            {pendingMemberships.map(m => (
              <div
                key={m.id}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left opacity-50 cursor-not-allowed"
                title="Pending Approval"
              >
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="truncate flex-1 text-slate-400">
                  <div className="truncate">{m.organization.name}</div>
                  <div className="text-[10px]">Pending</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
