import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { createSuccessResponse } from '../utils/response';
import { asyncHandler } from '../middleware/asyncHandler';
import { NotFoundError } from '../utils/errors';
import { volunteerSchema, updateVolunteerSchema } from '../schemas/volunteer.schema';

export const getVolunteersController = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = (page - 1) * limit;

  const filters: any = {};
  if (req.query.isAvailable !== undefined) {
    filters.isAvailable = req.query.isAvailable === 'true';
  }
  if (req.query.location) {
    filters.location = { contains: req.query.location, mode: 'insensitive' };
  }

  const volunteers = await prisma.volunteer.findMany({
    where: filters,
    skip,
    take: limit,
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      skills: {
        include: { skill: true }
      },
      certifications: {
        include: { certification: true }
      },
      operationalRegions: true
    }
  });

  // Transform to match frontend expectations
  const transformed = volunteers.map(v => ({
    id: v.id,
    userId: v.userId,
    fullName: v.fullName || v.user.name,
    email: v.user.email,
    phoneNumber: v.phoneNumber,
    verificationStatus: v.verificationStatus,
    homeLocation: v.homeLocation || v.location,
    bio: v.bio,
    experienceYears: v.experienceYears,
    isAvailable: v.isAvailable,
    isActive: v.isActive,
    skills: v.skills.map(s => ({
      name: s.skill.name,
      level: s.level
    })),
    certifications: v.certifications.map(c => ({
      name: c.certification.name,
      issuedAt: c.issuedAt,
      expiresAt: c.expiresAt
    })),
    operationalRegions: v.operationalRegions.map(r => r.regionName)
  }));

  res.status(200).json(createSuccessResponse(transformed));
});

export const getVolunteerController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const v = await prisma.volunteer.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      skills: {
        include: { skill: true }
      },
      certifications: {
        include: { certification: true }
      },
      operationalRegions: true
    }
  });

  if (!v) {
    throw new NotFoundError('Volunteer not found');
  }

  const transformed = {
    id: v.id,
    userId: v.userId,
    fullName: v.fullName || v.user.name,
    email: v.user.email,
    phoneNumber: v.phoneNumber,
    verificationStatus: v.verificationStatus,
    homeLocation: v.homeLocation || v.location,
    bio: v.bio,
    experienceYears: v.experienceYears,
    isAvailable: v.isAvailable,
    isActive: v.isActive,
    skills: v.skills.map(s => ({
      name: s.skill.name,
      level: s.level
    })),
    certifications: v.certifications.map(c => ({
      name: c.certification.name,
      issuedAt: c.issuedAt,
      expiresAt: c.expiresAt
    })),
    operationalRegions: v.operationalRegions.map(r => r.regionName)
  };

  res.status(200).json(createSuccessResponse(transformed));
});

export const createVolunteerController = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = volunteerSchema.parse(req.body);
  
  const newVolunteer = await prisma.volunteer.create({
    data: validatedData,
  });

  res.status(201).json(createSuccessResponse(newVolunteer));
});

export const updateVolunteerController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedData = updateVolunteerSchema.parse(req.body);

  const updatedVolunteer = await prisma.volunteer.update({
    where: { id },
    data: validatedData,
  });

  res.status(200).json(createSuccessResponse(updatedVolunteer));
});

export const assignVolunteerController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { organizationId, title, startDate, endDate, location, notes } = req.body;

  const assignment = await prisma.volunteerAssignment.create({
    data: {
      volunteerId: id,
      organizationId,
      title: title || 'General Assignment',
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : undefined,
      location,
      notes,
      status: 'ASSIGNED',
      createdBy: 'system' // placeholder
    }
  });

  res.status(201).json(createSuccessResponse(assignment));
});

export const getOrganizationAssignmentsController = asyncHandler(async (req: Request, res: Response) => {
  const orgId = req.query.organizationId as string;
  if (!orgId) throw new Error('organizationId is required');

  const assignments = await prisma.volunteerAssignment.findMany({
    where: { organizationId: orgId },
    include: {
      volunteer: {
        include: { user: { select: { name: true } } }
      }
    },
    orderBy: { assignedAt: 'desc' }
  });

  const transformed = assignments.map((a: any) => ({
    id: a.id,
    volunteerName: a.volunteer.fullName || a.volunteer.user.name,
    title: a.title,
    status: a.status,
    startDate: a.startDate,
    endDate: a.endDate,
    location: a.location,
    notes: a.notes
  }));

  res.status(200).json(createSuccessResponse(transformed));
});
