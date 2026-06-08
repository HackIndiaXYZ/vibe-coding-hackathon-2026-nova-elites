import React, { useState } from 'react';
import type { VolunteerSchema } from '../services/VolunteerMockData';
import { X, MapPin, Briefcase, Phone, Mail, Award, Map, Calendar } from 'lucide-react';
import { AssignVolunteerModal } from './AssignVolunteerModal';

interface VolunteerProfilePanelProps {
  volunteer: VolunteerSchema;
  onClose: () => void;
}

export const VolunteerProfilePanel: React.FC<VolunteerProfilePanelProps> = ({ volunteer, onClose }) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-50 transform transition-transform duration-300">
      {/* Header */}
      <div className="p-6 border-b border-slate-800/50 flex items-start justify-between bg-slate-900/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-medium text-xl border border-slate-700">
            {volunteer.fullName.substring(0, 1).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-medium text-white">{volunteer.fullName}</h2>
            <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${volunteer.isAvailable ? 'bg-emerald-500' : 'bg-slate-500'}`} />
              {volunteer.isAvailable ? 'Available for Deployment' : 'Currently Deployed or Unavailable'}
            </p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Bio */}
        <section>
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-3">About</h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/20 p-4 rounded-xl border border-slate-800/50">
            {volunteer.bio || 'No biography provided.'}
          </p>
        </section>

        {/* Operational Specs */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800/50 flex flex-col gap-1">
            <span className="text-slate-500 flex items-center gap-1.5 text-xs font-medium"><MapPin className="w-3.5 h-3.5" /> Location</span>
            <span className="text-sm text-white">{volunteer.location || volunteer.homeLocation || 'Unknown'}</span>
          </div>
          <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800/50 flex flex-col gap-1">
            <span className="text-slate-500 flex items-center gap-1.5 text-xs font-medium"><Briefcase className="w-3.5 h-3.5" /> Experience</span>
            <span className="text-sm text-white">{volunteer.experienceYears || 0} Years Active</span>
          </div>
          <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800/50 flex flex-col gap-1">
            <span className="text-slate-500 flex items-center gap-1.5 text-xs font-medium"><Phone className="w-3.5 h-3.5" /> Contact</span>
            <span className="text-sm text-white">{volunteer.phoneNumber || 'Unlisted'}</span>
          </div>
          <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800/50 flex flex-col gap-1">
            <span className="text-slate-500 flex items-center gap-1.5 text-xs font-medium"><Calendar className="w-3.5 h-3.5" /> Joined</span>
            <span className="text-sm text-white">{new Date(volunteer.createdAt).toLocaleDateString()}</span>
          </div>
        </section>

        {/* Skills & Certifications */}
        <section>
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            Verified Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {volunteer.skills && volunteer.skills.length > 0 ? (
              volunteer.skills.map(vs => (
                <div key={vs.id} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium rounded-lg">
                  {vs.skill.name} <span className="opacity-50 ml-1">• {vs.level}</span>
                </div>
              ))
            ) : (
              <span className="text-sm text-slate-500 italic">No specialized skills listed.</span>
            )}
          </div>
        </section>

        {/* Operational Regions */}
        <section>
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-3 flex items-center gap-2">
            <Map className="w-4 h-4 text-emerald-400" />
            Approved Regions
          </h3>
          <div className="flex flex-wrap gap-2">
            {volunteer.operationalRegions && volunteer.operationalRegions.length > 0 ? (
              volunteer.operationalRegions.map(or => (
                <div key={or.id} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium rounded-lg">
                  {or.regionName}
                </div>
              ))
            ) : (
              <span className="text-sm text-slate-500 italic">Global / Unrestricted</span>
            )}
          </div>
        </section>
      </div>
      
      {/* Footer Actions */}
      <div className="p-6 border-t border-slate-800/50 bg-slate-900/50 flex gap-3">
        <button 
          onClick={() => setIsAssignModalOpen(true)}
          className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(99,102,241,0.2)]"
        >
          Assign Deployment
        </button>
        <button className="flex items-center justify-center p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700">
          <Mail className="w-5 h-5" />
        </button>
      </div>

      {isAssignModalOpen && (
        <AssignVolunteerModal 
          volunteerId={volunteer.id}
          volunteerName={volunteer.fullName}
          onClose={() => setIsAssignModalOpen(false)}
          onSuccess={() => {
            setIsAssignModalOpen(false);
            onClose(); // Close profile panel too, or trigger refresh
          }}
        />
      )}
    </div>
  );
};
