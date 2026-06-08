import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';

export const WorkspaceSelectionScreen: React.FC = () => {
  const { user, setActiveWorkspace } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const activeMemberships = (user.memberships || []).filter(m => m.status === 'ACTIVE');
  const hasVolunteer = !!user.volunteer;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center py-24 px-6 relative overflow-hidden">
      
      {/* Background glow for atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">Select Operational Context</h1>
          <p className="text-lg text-slate-400">Choose the workspace you want to enter for this session.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hasVolunteer && (
            <button
              onClick={() => setActiveWorkspace({ type: 'volunteer' })}
              className="text-left p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:border-slate-700 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-0" />
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-teal-400 shadow-inner shadow-teal-500/10 border border-slate-700">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">Volunteer Context</h3>
                  <div className="text-xs font-semibold tracking-wider text-teal-500 uppercase flex items-center gap-2">
                    Personal Workspace
                  </div>
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                    Access your personal assignments, availability, and activity history.
                  </p>
                </div>
              </div>
            </button>
          )}

          {activeMemberships.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveWorkspace({ type: 'organization', organizationId: m.organization.id })}
              className="text-left p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:border-slate-700 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-0" />
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 shadow-inner shadow-indigo-500/10 border border-slate-700">
                  <span className="text-lg font-bold">{m.organization.name.substring(0, 2).toUpperCase()}</span>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">{m.organization.name}</h3>
                  <div className="text-xs font-semibold tracking-wider text-indigo-500 uppercase flex items-center gap-2">
                    {m.role} &bull; Organization Workspace
                  </div>
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                    Manage organizational resources, requests, transfers, and personnel.
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
