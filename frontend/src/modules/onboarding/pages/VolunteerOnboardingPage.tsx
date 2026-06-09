import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { onboardingService } from '../services/onboarding.service';
import type { VolunteerProfilePayload } from '../services/onboarding.service';

export const VolunteerOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshHydration, setActiveWorkspace } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<VolunteerProfilePayload>({
    fullName: '',
    phoneNumber: '',
    bio: '',
    homeLocation: '',
    experienceYears: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'experienceYears' ? (value ? parseInt(value) : 0) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        operationalRegions: formData.homeLocation ? [formData.homeLocation] : []
      };
      const res = await onboardingService.createVolunteerProfile(payload);
      
      if (res.success) {
        // Hydrate to get the new volunteer profile
        await refreshHydration();
        
        // Set workspace and go to dashboard
        setActiveWorkspace({ type: 'volunteer' });
        navigate('/dashboard');
      } else {
        setError('Failed to create volunteer profile. Please try again.');
      }
    } catch (err: any) {
      // Handle unique constraint error specifically if possible
      const msg = err.message || '';
      if (msg.includes('Unique constraint failed') || msg.toLowerCase().includes('already exists')) {
        setError('Volunteer profile already exists for this user.');
      } else {
        setError(msg || 'An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/onboarding')}
            className="text-slate-400 hover:text-white transition-colors flex items-center text-sm gap-2"
          >
            ← Back to options
          </button>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight">
            Become a Volunteer
          </h1>
          <p className="text-slate-400">
            Set up your capability profile to offer your skills and time.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Full Name *</label>
              <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors" placeholder="Your full name" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Phone Number *</label>
              <input required name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors" placeholder="Contact number" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Home Location</label>
              <input name="homeLocation" value={formData.homeLocation} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors" placeholder="City or area" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Years of Experience</label>
              <input type="number" min="0" name="experienceYears" value={formData.experienceYears} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-400">Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors" placeholder="Tell us a little about yourself, your background, and your interests..." />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving Profile...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
