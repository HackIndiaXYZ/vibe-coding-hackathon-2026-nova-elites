import { api } from '../../../shared/lib/api';

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  organizationName?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role?: string;
    }
  }
}

export interface MeResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    memberships: Array<{
      id: string;
      role: string;
      status: string;
      organization: {
        id: string;
        name: string;
      };
    }>;
    volunteer: {
      id: string;
      isActive: boolean;
    } | null;
  }
}

export const authService = {
  login: (payload: LoginPayload) => {
    return api<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  
  register: (payload: RegisterPayload) => {
    return api<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getMe: () => {
    return api<MeResponse>('/api/auth/me', {
      method: 'GET',
    });
  }
};
