import { prisma } from '../../../prisma';
import { CreateVolunteerDTO, UpdateVolunteerDTO } from './types';

export class VolunteerRepository {
  async create(data: CreateVolunteerDTO) {
    return await prisma.volunteer.create({
      data: {
        userId: data.userId,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        homeLocation: data.homeLocation ?? null,
        bio: data.bio ?? null,
        location: data.location ?? null,
        experienceYears: data.experienceYears ?? null,
        ...(data.operationalRegions?.length && {
          operationalRegions: {
            create: data.operationalRegions.map(region => ({ regionName: region })),
          },
        }),
      },
      include: {
        operationalRegions: true,
      },
    });
  }

  async findById(id: string) {
    return await prisma.volunteer.findUnique({
      where: { id },
      include: {
        operationalRegions: true,
        skills: { include: { skill: true } },
        certifications: { include: { certification: true } },
        availability: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return await prisma.volunteer.findUnique({
      where: { userId },
      include: {
        operationalRegions: true,
        skills: { include: { skill: true } },
        certifications: { include: { certification: true } },
        availability: true,
      },
    });
  }

  async findAll() {
    return await prisma.volunteer.findMany({
      where: { isActive: true },
      include: {
        operationalRegions: true,
        skills: { include: { skill: true } },
        certifications: { include: { certification: true } },
        availability: true,
      },
    });
  }

  async update(id: string, data: UpdateVolunteerDTO) {
    return await prisma.volunteer.update({
      where: { id },
      data: {
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber }),
        ...(data.homeLocation !== undefined && { homeLocation: data.homeLocation }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.experienceYears !== undefined && { experienceYears: data.experienceYears }),
        ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
        ...(data.operationalRegions && {
          operationalRegions: {
            deleteMany: {},
            create: data.operationalRegions.map(region => ({ regionName: region })),
          },
        }),
      },
      include: {
        operationalRegions: true,
      },
    });
  }

  async softDelete(id: string) {
    return await prisma.volunteer.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
export const volunteerRepository = new VolunteerRepository();
