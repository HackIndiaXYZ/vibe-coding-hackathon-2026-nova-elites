import React from 'react';
import type { VolunteerSchema } from '../services/VolunteerMockData';
import { ShieldCheck, MapPin, Briefcase } from 'lucide-react';

interface VolunteerCardProps {
  volunteer: VolunteerSchema;
  onClick: () => void;
}

export const VolunteerCard: React.FC<VolunteerCardProps> = ({ volunteer, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group p-5 rounded-2xl border border-slate-800/50 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-700 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
    >
      {/* Subtle background glow depending on verification status */}
      {volunteer.verificationStatus === 'VERIFIED' && (
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-500/5 blur-[40px] pointer-events-none transition-opacity opacity-0 group-hover:opacity-100" />
      )}
      
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-medium text-lg border border-slate-700">
            {volunteer.fullName.substring(0, 1).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-medium text-white flex items-center gap-1.5">
              {volunteer.fullName}
              {volunteer.verificationStatus === 'VERIFIED' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
            </h3>
            <p className="text-xs text-slate-400">
              {volunteer.skills && volunteer.skills.length > 0 ? volunteer.skills[0].skill.name : 'General Operations'}
            </p>
          </div>
        </div>
        
        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
          volunteer.isAvailable 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          {volunteer.isAvailable ? 'Available' : 'Deployed'}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm relative z-10">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Briefcase className="w-3.5 h-3.5" />
          <span>{volunteer.experienceYears || 0} Years Exp.</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 truncate">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{volunteer.location || volunteer.homeLocation || 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
};
