import { prisma } from '../prisma';

export async function createOrganization(data: any, userId?: string) {
  const { operationalRegions, ...orgData } = data;
  
  return await prisma.organization.create({ 
    data: {
      ...orgData,
      ...(operationalRegions && {
        operationalRegions: {
          create: operationalRegions.map((region: string) => ({ regionName: region })),
        },
      }),
      ...(userId && {
        memberships: {
          create: {
            userId: userId,
            role: 'ADMIN',
            status: 'ACTIVE',
          }
        }
      })
    },
    include: {
      operationalRegions: true,
      memberships: true,
    }
  });
}

export async function getOrganizations(skip: number = 0, take: number = 20) {
  return await prisma.organization.findMany({
    skip,
    take,
    include: {
      operationalRegions: true,
    }
  });
}

export async function searchOrganizations(query: string, skip: number = 0, take: number = 20) {
  return await prisma.organization.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { legalName: { contains: query, mode: 'insensitive' } },
        { displayName: { contains: query, mode: 'insensitive' } }
      ]
    },
    skip,
    take,
    include: {
      operationalRegions: true,
    }
  });
}

export async function joinOrganization(userId: string, organizationId: string) {
  return await prisma.membership.create({
    data: {
      userId,
      organizationId,
      role: 'MEMBER',
      status: 'PENDING',
    }
  });
}

export async function getOrganizationById(id: string) {
  return await prisma.organization.findUnique({ 
    where: { id },
    include: {
      operationalRegions: true,
    }
  });
}

export async function updateOrganization(id: string, data: any) {
  const { operationalRegions, ...orgData } = data;
  
  return await prisma.organization.update({
    where: { id },
    data: {
      ...orgData,
      ...(operationalRegions && {
        operationalRegions: {
          deleteMany: {},
          create: operationalRegions.map((region: string) => ({ regionName: region })),
        },
      }),
    },
    include: {
      operationalRegions: true,
    }
  });
}
