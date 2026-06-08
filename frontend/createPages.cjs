const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'OverviewPage', title: 'Operational Overview', desc: 'High-level metrics and active operational status will appear here.' },
  { name: 'InventoryPage', title: 'Inventory Management', desc: 'Track resources, stock levels, and supply chains.' },
  { name: 'VolunteersPage', title: 'Volunteer Coordination', desc: 'Manage volunteer rosters, availability, and assignments.' },
  { name: 'ActivityPage', title: 'Activity Log', desc: 'Real-time feed of operational activities and events.' },
  { name: 'TransfersPage', title: 'Resource Transfers', desc: 'Manage incoming and outgoing resource transfers between hubs.' },
  { name: 'AssignmentsPage', title: 'My Assignments', desc: 'View and manage your active tasks and deployments.' },
  { name: 'RequestsPage', title: 'Incoming Requests', desc: 'Review and process aid requests and resource allocations.' }
];

const dir = 'c:\\\\Users\\\\adity\\\\Music\\\\samanvay\\\\frontend\\\\src\\\\modules\\\\dashboard\\\\pages';

pages.forEach(p => {
  const content = `import React from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { WorkspacePlaceholder } from '../components/WorkspacePlaceholder';

export const ${p.name}: React.FC = () => {
  const { activeWorkspace } = useAuth();
  
  return (
    <div className="h-full">
      <WorkspacePlaceholder 
        title="${p.title}" 
        description="${p.desc}" 
        workspaceType={activeWorkspace?.type === 'volunteer' ? 'Volunteer' : 'Organization'}
      />
    </div>
  );
};
`;
  fs.writeFileSync(path.join(dir, p.name + '.tsx'), content);
});
console.log('Pages created successfully.');
