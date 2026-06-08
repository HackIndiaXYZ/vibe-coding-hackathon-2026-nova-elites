import { z } from 'zod';

export const volunteerSchema = z.object({
  userId: z.string().uuid(),
  fullName: z.string().optional(),
  phoneNumber: z.string().optional(),
  homeLocation: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  experienceYears: z.number().int().min(0).optional(),
  isAvailable: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const updateVolunteerSchema = volunteerSchema.partial().omit({ userId: true });
