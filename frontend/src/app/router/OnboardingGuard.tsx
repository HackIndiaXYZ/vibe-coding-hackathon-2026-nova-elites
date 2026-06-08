import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

interface Props {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export const OnboardingGuard: React.FC<Props> = ({ children, requireOnboarding }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Determine onboarding completion dynamically via relationships
  const hasMemberships = user?.memberships && user.memberships.length > 0;
  const hasVolunteerProfile = !!user?.volunteer;
  const isOnboarded = hasMemberships || hasVolunteerProfile;

  // If this route is strictly for onboarding, but the user is already onboarded, redirect to dashboard
  if (requireOnboarding && isOnboarded) {
    return <Navigate to="/dashboard" replace />;
  }

  // If this route is strictly for dashboard/app, but user is NOT onboarded, redirect to onboarding
  if (!requireOnboarding && !isOnboarded) {
    // Only redirect if they aren't already on an onboarding route
    if (!location.pathname.startsWith('/onboarding')) {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return <>{children}</>;
};
