import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { SessionHydrationScreen } from '../../modules/auth/pages/SessionHydrationScreen';

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <SessionHydrationScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
