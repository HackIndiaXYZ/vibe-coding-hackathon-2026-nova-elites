import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { workspaceUtils } from '../../../shared/lib/workspace';
import { ActivityTimeline } from '../components/ActivityTimeline';
import type { ActivityData } from '../components/ActivityItem';
import { api } from '../../../shared/lib/api';

export const ActivityPage: React.FC = () => {
  const { activeWorkspace } = useAuth();
  
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchActivityData = async () => {
      setIsLoading(true);
      
      const orgId = workspaceUtils.getOrganizationWorkspaceId(activeWorkspace);
      
      try {
        let auditData: ActivityData[] = [];

        if (orgId) {
          // In a real implementation, we'd pass ?organizationId=orgId
          const auditRes = await api<{ success: boolean; data: any[] }>(`/api/audit`);

          if (auditRes.success && auditRes.data) {
            auditData = auditRes.data.map(log => ({
              id: log.id,
              action: log.action.replace(/_/g, ' ').toLowerCase(),
              actorName: log.user?.name || 'System',
              entityName: log.entityType,
              timestamp: log.createdAt
            }));
          }
        }

        if (isMounted) {
          setActivities(auditData);
        }
      } catch (error) {
        console.error('Failed to fetch activity data:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchActivityData();

    return () => {
      isMounted = false;
    };
  }, [activeWorkspace]);

  return (
    <div className="h-full flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-light text-white mb-2">Activity Feed</h1>
        <p className="text-slate-400">Continuous timeline of operations in this context.</p>
      </div>

      <ActivityTimeline activities={activities} isLoading={isLoading} />
    </div>
  );
};
