import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../../modules/auth/services/auth.service';
import type { MeResponse } from '../../modules/auth/services/auth.service';
import { workspaceUtils } from '../../shared/lib/workspace';
import type { Workspace } from '../../shared/lib/workspace';

interface AuthContextType {
  token: string | null;
  user: MeResponse['data'] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  activeWorkspace: Workspace | null;
  login: (token: string) => void;
  logout: () => void;
  refreshHydration: () => Promise<void>;
  setActiveWorkspace: (workspace: Workspace | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('samanvay_token'));
  const [user, setUser] = useState<MeResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeWorkspace, setActiveWorkspaceState] = useState<Workspace | null>(() => {
    return workspaceUtils.getStoredWorkspace();
  });

  const setActiveWorkspace = (workspace: Workspace | null) => {
    if (workspace) {
      workspaceUtils.setStoredWorkspace(workspace);
    } else {
      workspaceUtils.clearStoredWorkspace();
    }
    setActiveWorkspaceState(workspace);
  };

  const refreshHydration = async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.getMe();
      if (res.success) {
        setUser(res.data);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to hydrate session", error);
      // logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshHydration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('samanvay_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('samanvay_token');
    workspaceUtils.clearStoredWorkspace();
    setToken(null);
    setUser(null);
    setActiveWorkspaceState(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        user, 
        isLoading, 
        isAuthenticated: !!token,
        activeWorkspace,
        login, 
        logout,
        refreshHydration,
        setActiveWorkspace
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
