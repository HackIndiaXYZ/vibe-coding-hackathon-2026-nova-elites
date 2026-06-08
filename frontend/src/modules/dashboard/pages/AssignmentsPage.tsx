import React from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { WorkspacePlaceholder } from '../components/WorkspacePlaceholder';

export const AssignmentsPage: React.FC = () => {
  const { activeWorkspace } = useAuth();
  
  return (
    <div className="h-full">
      <WorkspacePlaceholder 
        title="My Assignments" 
        description="View and manage your active tasks and deployments." 
        workspaceType={activeWorkspace?.type === 'volunteer' ? 'Volunteer' : 'Organization'}
      />
    </div>
  );
};
