import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingService } from '../services/onboarding.service';

export const JoinOrganizationPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ id: string; name: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await onboardingService.searchOrganizations(query);
        if (res.success && res.data) {
          setResults(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleJoin = async (organizationId: string) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await onboardingService.joinOrganization(organizationId);
      if (res.success) {
        // Just redirect to dashboard, the resolver will handle pending state
        navigate('/dashboard');
      } else {
        // Typical fallback error
        setError('Failed to request membership. You might already have a pending request.');
      }
    } catch (err: any) {
      // Backend might return unique constraint error or already pending error
      setError(err.message || 'Request already exists or another error occurred.');
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
            Join an Organization
          </h1>
          <p className="text-slate-400">
            Search for an existing organization to request membership.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name... (min 3 chars)"
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-teal-500/50 transition-colors"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
            )}
          </div>

          <div className="space-y-3">
            {query.length >= 3 && results.length === 0 && !isSearching && (
              <div className="p-8 text-center border border-slate-800 rounded-xl bg-slate-900/30 text-slate-500">
                No organizations found matching "{query}"
              </div>
            )}

            {results.map(org => (
              <div key={org.id} className="p-4 md:p-6 border border-slate-800 rounded-xl bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium text-white text-lg">{org.name}</h3>
                  <p className="text-slate-400 text-sm">ID: {org.id.split('-')[0]}...</p>
                </div>
                <button
                  onClick={() => handleJoin(org.id)}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-teal-600/10 hover:bg-teal-600/20 text-teal-400 border border-teal-500/30 hover:border-teal-500/50 rounded-lg transition-all disabled:opacity-50"
                >
                  Request Join
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
