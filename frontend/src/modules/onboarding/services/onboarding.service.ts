import { api } from '../../../shared/lib/api';

export interface CreateOrganizationPayload {
  name: string;
  legalName: string;
  displayName?: string;
  registrationType: string;
  registrationNumber: string;
  registeredOfficeAddressLine: string;
  registeredOfficeState: string;
  operationalRegions: string[];
  type: string;
  sector: string;
  description?: string;
  location?: string;
}

export interface VolunteerProfilePayload {
  fullName: string;
  phoneNumber: string;
  bio?: string;
  homeLocation?: string;
  experienceYears?: number;
}

export const onboardingService = {
  createOrganization: (payload: CreateOrganizationPayload) => {
    return api<{ success: boolean; data: { id: string } }>('/api/organizations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  searchOrganizations: (query: string) => {
    return api<{ success: boolean; data: Array<{ id: string; name: string }> }>(`/api/organizations/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
  },

  joinOrganization: (organizationId: string) => {
    return api<{ success: boolean; data: any }>(`/api/organizations/${organizationId}/join`, {
      method: 'POST',
    });
  },

  createVolunteerProfile: (payload: VolunteerProfilePayload) => {
    return api<{ success: boolean; data: { id: string } }>('/api/volunteers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
};
