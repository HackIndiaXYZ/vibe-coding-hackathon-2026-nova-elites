import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { onboardingService } from '../services/onboarding.service';
import type { CreateOrganizationPayload } from '../services/onboarding.service';

export const CreateOrganizationPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshHydration, setActiveWorkspace } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateOrganizationPayload>({
    name: '',
    legalName: '',
    displayName: '',
    registrationType: '',
    registrationNumber: '',
    registeredOfficeAddressLine: '',
    registeredOfficeState: '',
    operationalRegions: [],
    type: 'NGO',
    sector: '',
    description: '',
    location: ''
  });

  const [regionsInput, setRegionsInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Parse regions
      const regions = regionsInput.split(',').map(r => r.trim()).filter(Boolean);
      const payload = { ...formData, operationalRegions: regions.length > 0 ? regions : ['Default'] };

      const res = await onboardingService.createOrganization(payload);
      
      if (res.success && res.data?.id) {
        // Hydrate to get the new membership
        await refreshHydration();
        
        // Set workspace and go to dashboard
        setActiveWorkspace({ type: 'organization', organizationId: res.data.id });
        navigate('/dashboard');
      } else {
        setError('Failed to create organization. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/onboarding')}
            className="text-slate-400 hover:text-white transition-colors flex items-center text-sm gap-2"
          >
            ← Back to options
          </button>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight">
            Create an Organization
          </h1>
          <p className="text-slate-400">
            Establish your organization's presence on the platform.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Identity Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-medium text-slate-200 border-b border-slate-800 pb-2">Identity</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Organization Name *</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="Common name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Legal Name *</label>
                <input required name="legalName" value={formData.legalName} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="Registered legal name" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-400">Display Name</label>
                <input name="displayName" value={formData.displayName} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="How it should appear to others" />
              </div>
            </div>
          </section>

          {/* Registration Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-medium text-slate-200 border-b border-slate-800 pb-2">Registration</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Registration Type *</label>
                <input required name="registrationType" value={formData.registrationType} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="e.g., Trust, Society, Section 8" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Registration Number *</label>
                <input required name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="Reg. number" />
              </div>
            </div>
          </section>

          {/* Operations Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-medium text-slate-200 border-b border-slate-800 pb-2">Operations</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Organization Type *</label>
                <select required name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors">
                  <option value="NGO">NGO</option>
                  <option value="CSR">CSR</option>
                  <option value="GOVERNMENT">Government</option>
                  <option value="INSTITUTION">Institution</option>
                  <option value="COMMUNITY">Community</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Sector *</label>
                <input required name="sector" value={formData.sector} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="e.g., Education, Health, Disaster Relief" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-400">Operational Regions * (Comma separated)</label>
                <input required name="regionsInput" value={regionsInput} onChange={(e) => setRegionsInput(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="e.g., Mumbai, Delhi, Remote" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-400">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="Brief overview of what you do" />
              </div>
            </div>
          </section>

          {/* Location Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-medium text-slate-200 border-b border-slate-800 pb-2">Location</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-400">Registered Office Address *</label>
                <input required name="registeredOfficeAddressLine" value={formData.registeredOfficeAddressLine} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="Full address" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Registered State *</label>
                <input required name="registeredOfficeState" value={formData.registeredOfficeState} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="State/Province" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">HQ/Primary Location</label>
                <input name="location" value={formData.location} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="City or Region" />
              </div>
            </div>
          </section>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Organization'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
