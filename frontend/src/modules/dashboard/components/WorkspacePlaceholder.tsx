import React from 'react';

interface WorkspacePlaceholderProps {
  title: string;
  description: string;
  workspaceType: string;
}

export const WorkspacePlaceholder: React.FC<WorkspacePlaceholderProps> = ({ title, description, workspaceType }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] border border-slate-800/50 rounded-2xl bg-slate-900/20 p-8 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-500 mb-2">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h2 className="text-2xl font-light text-white">{title}</h2>
      <p className="text-slate-400 max-w-md">
        {description}
      </p>
      <div className="pt-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
          Context: {workspaceType}
        </span>
      </div>
    </div>
  );
};
