import { z } from 'zod';

export const createVolunteerSchema = z.object({
  userId: z.string().uuid({ message: 'User ID must be a valid UUID' }),
  fullName: z.string().min(1),
  phoneNumber: z.string().min(1),
  homeLocation: z.string().optional().nullable(),
  operationalRegions: z.array(z.string()).optional().default([]),
  bio: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  experienceYears: z.number().int().nonnegative({ message: 'Experience years must be a non-negative integer' }).optional().nullable(),
});

export const updateVolunteerSchema = z.object({
  fullName: z.string().min(1).optional(),
  phoneNumber: z.string().min(1).optional(),
  homeLocation: z.string().optional().nullable(),
  operationalRegions: z.array(z.string()).min(1).optional(),
  bio: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  experienceYears: z.number().int().nonnegative({ message: 'Experience years must be a non-negative integer' }).optional().nullable(),
  isAvailable: z.boolean().optional(),
});
