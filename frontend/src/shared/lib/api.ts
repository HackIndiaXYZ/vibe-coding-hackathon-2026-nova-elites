// src/shared/lib/api.ts

export interface ApiOptions extends RequestInit {
  useCoordinationLayer?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any, message?: string) {
    super(message || data?.message || 'An API error occurred');
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const api = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
  const token = localStorage.getItem('samanvay_token');
  
  const baseUrl = options.useCoordinationLayer 
    ? import.meta.env.VITE_COORDINATION_URL || 'https://bicholiya-production.up.railway.app'
    : import.meta.env.VITE_API_URL || 'https://samanvay-production.up.railway.app';

  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data;
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    data = {};
  }

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data as T;
};
