import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { workspaceUtils } from '../../../shared/lib/workspace';
import { VolunteerGrid } from '../components/VolunteerGrid';
import { VolunteerProfilePanel } from '../components/VolunteerProfilePanel';
import { VolunteerAssignmentPanel } from '../components/VolunteerAssignmentPanel';
import type { VolunteerSchema } from '../services/VolunteerMockData';
import { api } from '../../../shared/lib/api';

export const VolunteersPage: React.FC = () => {
  const { activeWorkspace } = useAuth();
  
  const [volunteers, setVolunteers] = useState<VolunteerSchema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerSchema | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchVolunteers = async () => {
      setIsLoading(true);
      const orgId = workspaceUtils.getOrganizationWorkspaceId(activeWorkspace);
      
      try {
        if (orgId) {
          const res = await api<{ success: boolean; data: VolunteerSchema[] }>(`/api/volunteers`);
          if (isMounted && res.success) {
            setVolunteers(res.data || []);
          }
        } else {
          setVolunteers([]); // Volunteer workspace shouldn't manage other volunteers
        }
      } catch (err) {
        console.error('Failed to fetch volunteers', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchVolunteers();

    return () => {
      isMounted = false;
    };
  }, [activeWorkspace]);

  return (
    <div className="h-full flex flex-col gap-6 max-w-6xl mx-auto relative">
      <div>
        <h1 className="text-2xl font-light text-white mb-1">Volunteer Roster</h1>
        <p className="text-slate-400">Discover and manage operational personnel for your context.</p>
      </div>

      <VolunteerAssignmentPanel />

      <VolunteerGrid 
        volunteers={volunteers} 
        onVolunteerClick={setSelectedVolunteer} 
        isLoading={isLoading} 
      />

      {/* Render the drawer if a volunteer is selected */}
      {selectedVolunteer && (
        <>
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity" 
            onClick={() => setSelectedVolunteer(null)}
          />
          <VolunteerProfilePanel 
            volunteer={selectedVolunteer} 
            onClose={() => setSelectedVolunteer(null)} 
          />
        </>
      )}
    </div>
  );
};
