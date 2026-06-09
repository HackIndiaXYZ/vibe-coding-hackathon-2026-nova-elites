import { PrismaClient } from '@prisma/client';
import { IDS } from './utils';
import * as bcrypt from 'bcryptjs';

export async function seedOrganizations(prisma: PrismaClient) {
  console.log('🌍 Seeding organizations...');

  const passwordHash = await bcrypt.hash('Relief@123', 10);

  // 1. Seed Organizations
  await prisma.organization.upsert({
    where: { id: IDS.organizations.floodRelief },
    update: {},
    create: {
      id: IDS.organizations.floodRelief,
      name: 'Flood Relief India',
      legalName: 'Flood Relief India Foundation',
      type: 'NGO',
      sector: 'Disaster Response',
      verificationStatus: 'VERIFIED',
      verified: true
    }
  });

  await prisma.organization.upsert({
    where: { id: IDS.organizations.redCross },
    update: {},
    create: {
      id: IDS.organizations.redCross,
      name: 'Red Cross Delhi',
      legalName: 'Red Cross Society Delhi',
      type: 'NGO',
      sector: 'Medical Logistics',
      verificationStatus: 'VERIFIED',
      verified: true
    }
  });

  await prisma.organization.upsert({
    where: { id: IDS.organizations.foodNetwork },
    update: {},
    create: {
      id: IDS.organizations.foodNetwork,
      name: 'Community Food Network',
      legalName: 'Community Food Network Trust',
      type: 'NGO',
      sector: 'Food Distribution',
      verificationStatus: 'VERIFIED',
      verified: true
    }
  });

  await prisma.organization.upsert({
    where: { id: IDS.organizations.shelterAlliance },
    update: {},
    create: {
      id: IDS.organizations.shelterAlliance,
      name: 'Emergency Shelter Alliance',
      legalName: 'Emergency Shelter Alliance',
      type: 'NGO',
      sector: 'Shelter Operations',
      verificationStatus: 'VERIFIED',
      verified: true
    }
  });

  // 2. Seed Users
  await prisma.user.upsert({
    where: { email: 'adi@floodrelief.org' },
    update: {},
    create: {
      id: IDS.users.adi,
      name: 'Aditya Sharma',
      email: 'adi@floodrelief.org',
      passwordHash
    }
  });

  await prisma.user.upsert({
    where: { email: 'aisha@redcross.org' },
    update: {},
    create: {
      id: IDS.users.aisha,
      name: 'Aisha Khan',
      email: 'aisha@redcross.org',
      passwordHash
    }
  });

  await prisma.user.upsert({
    where: { email: 'ravi@foodnetwork.org' },
    update: {},
    create: {
      id: IDS.users.ravi,
      name: 'Ravi Mehta',
      email: 'ravi@foodnetwork.org',
      passwordHash
    }
  });

  // 3. Seed Memberships
  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: IDS.users.adi, organizationId: IDS.organizations.floodRelief } },
    update: {},
    create: {
      userId: IDS.users.adi,
      organizationId: IDS.organizations.floodRelief,
      role: 'OWNER',
      status: 'ACTIVE'
    }
  });

  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: IDS.users.aisha, organizationId: IDS.organizations.redCross } },
    update: {},
    create: {
      userId: IDS.users.aisha,
      organizationId: IDS.organizations.redCross,
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });

  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: IDS.users.ravi, organizationId: IDS.organizations.foodNetwork } },
    update: {},
    create: {
      userId: IDS.users.ravi,
      organizationId: IDS.organizations.foodNetwork,
      role: 'OPERATOR',
      status: 'ACTIVE'
    }
  });
}
