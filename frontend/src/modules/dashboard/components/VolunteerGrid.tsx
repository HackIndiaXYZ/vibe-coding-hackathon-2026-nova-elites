import React from 'react';
import type { VolunteerSchema } from '../services/VolunteerMockData';
import { VolunteerCard } from './VolunteerCard';

interface VolunteerGridProps {
  volunteers: VolunteerSchema[];
  onVolunteerClick: (volunteer: VolunteerSchema) => void;
  isLoading?: boolean;
}

export const VolunteerGrid: React.FC<VolunteerGridProps> = ({ volunteers, onVolunteerClick, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 border border-slate-800/50 rounded-xl bg-slate-900/20">
        Loading volunteer personnel...
      </div>
    );
  }

  if (volunteers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 border border-slate-800/50 rounded-xl bg-slate-900/20">
        <p>No volunteers found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {volunteers.map(volunteer => (
        <VolunteerCard 
          key={volunteer.id} 
          volunteer={volunteer} 
          onClick={() => onVolunteerClick(volunteer)} 
        />
      ))}
    </div>
  );
};
