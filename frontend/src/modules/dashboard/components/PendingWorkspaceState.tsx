import React from 'react';

interface PendingWorkspaceStateProps {
  organizationName: string;
}

export const PendingWorkspaceState: React.FC<PendingWorkspaceStateProps> = ({ organizationName }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-400 border border-slate-800">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-light mb-2">Pending Membership Request</h2>
          <p className="text-slate-400">
            Your request to join {organizationName} is currently under review by their administrators.
          </p>
        </div>
      </div>
    </div>
  );
};
