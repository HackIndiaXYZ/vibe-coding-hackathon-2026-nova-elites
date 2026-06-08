import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({ name, email, password });
      // Store token
      localStorage.setItem('samanvay_token', response.data.token);
      // Temporarily direct to dashboard or onboarding placeholder
      navigate('/onboarding/role-selection');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.1),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 my-12">
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full border border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.15)] flex items-center justify-center bg-[#0f172a]/30 backdrop-blur-md">
              <div className="w-2 h-2 bg-[#8B5CF6] rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-[#f4f2ff] mb-3">
            Register Presence
          </h1>
          <p className="text-sm md:text-base text-[#dcd6ff]/80 leading-relaxed max-w-sm mx-auto font-sans">
            Join the humanitarian coordination network.
          </p>
        </div>

        <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-b from-[#141c34]/80 to-[#080c1c]/80 backdrop-blur-xl border border-[#8B5CF6]/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_0_60px_rgba(139,92,246,0.05)]">
          <form onSubmit={handleSignup} className="flex flex-col gap-5 font-sans">
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#dcd6ff]/80 pl-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="w-full bg-[#0f172a]/40 border border-white/5 rounded-xl px-4 py-3 text-[#f4f2ff] placeholder:text-[#beb4ff]/40 focus:outline-none focus:border-[#8B5CF6]/40 focus:bg-[#0f172a]/60 transition-all duration-300"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#dcd6ff]/80 pl-1">
                Operational Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="node@organization.org"
                required
                className="w-full bg-[#0f172a]/40 border border-white/5 rounded-xl px-4 py-3 text-[#f4f2ff] placeholder:text-[#beb4ff]/40 focus:outline-none focus:border-[#8B5CF6]/40 focus:bg-[#0f172a]/60 transition-all duration-300"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#dcd6ff]/80 pl-1">
                Security Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0f172a]/40 border border-white/5 rounded-xl px-4 py-3 text-[#f4f2ff] placeholder:text-[#beb4ff]/40 focus:outline-none focus:border-[#8B5CF6]/40 focus:bg-[#0f172a]/60 transition-all duration-300"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#dcd6ff]/80 pl-1">
                Confirm Security Key
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0f172a]/40 border border-white/5 rounded-xl px-4 py-3 text-[#f4f2ff] placeholder:text-[#beb4ff]/40 focus:outline-none focus:border-[#8B5CF6]/40 focus:bg-[#0f172a]/60 transition-all duration-300"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400/90 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <div className="pt-4 flex flex-col gap-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-500 overflow-hidden group bg-[#8B5CF6] text-white border border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60 hover:bg-[#8B5CF6]/80 shadow-[0_0_30px_rgba(168,85,247,0.28),0_0_80px_rgba(168,85,247,0.12)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Registering...' : 'Create Account'}
              </button>
              
              <div className="text-center mt-2">
                <Link 
                  to="/login" 
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-500 bg-transparent text-[#dcd6ff]/80 border border-white/5 hover:border-white/10 hover:bg-white/5 w-full"
                >
                  Already have an active node? Sign In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
