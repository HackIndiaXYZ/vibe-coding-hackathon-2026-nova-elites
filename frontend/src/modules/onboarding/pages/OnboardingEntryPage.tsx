import React from 'react';
import { useNavigate } from 'react-router-dom';

export const OnboardingEntryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">
            How would you like to participate?
          </h1>
          <p className="text-slate-400 text-lg md:text-xl">
            Choose a starting point. You can always add other contexts later.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/onboarding/create-organization')}
            className="group p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 text-left flex flex-col items-center text-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-medium text-white mb-2">Create Organization</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Register a new NGO, CSR unit, or community group.
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate('/onboarding/join-organization')}
            className="group p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-teal-500/10 hover:border-teal-500/30 transition-all duration-300 text-left flex flex-col items-center text-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-medium text-white mb-2">Join Organization</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connect with an existing organization on the platform.
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate('/onboarding/volunteer')}
            className="group p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all duration-300 text-left flex flex-col items-center text-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-medium text-white mb-2">Become Volunteer</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Offer your skills and time to support ongoing initiatives.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
