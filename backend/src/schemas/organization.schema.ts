import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().max(200),
  legalName: z.string().min(1),
  displayName: z.string().max(200).optional(),
  registrationType: z.string().min(1),
  registrationNumber: z.string().min(1),
  registeredOfficeAddressLine: z.string().min(1),
  registeredOfficeState: z.string().min(1),
  registeredOfficeDistrict: z.string().optional(),
  operationalRegions: z.array(z.string()).min(1),
  type: z.enum(['NGO', 'CSR', 'GOVERNMENT', 'INSTITUTION', 'COMMUNITY']),
  sector: z.string(),
  description: z.string().max(2000).optional(),
  location: z.string().optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial().extend({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'ARCHIVED']).optional(),
});
