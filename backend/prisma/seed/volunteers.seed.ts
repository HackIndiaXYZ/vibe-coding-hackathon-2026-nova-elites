import { PrismaClient, SkillLevel, VolunteerNeedStatus, AssignmentStatus } from '@prisma/client';
import { IDS } from './utils';
import * as bcrypt from 'bcryptjs';

export async function seedVolunteers(prisma: PrismaClient) {
  console.log('👥 Seeding volunteers...');

  const passwordHash = await bcrypt.hash('Relief@123', 10);

  // 1. Seed Skills
  const skills = [
    { id: IDS.skills.fieldMedicine, name: 'Field Medicine' },
    { id: IDS.skills.logistics, name: 'Logistics' },
    { id: IDS.skills.searchRescue, name: 'Search & Rescue' },
    { id: IDS.skills.generalRelief, name: 'General Relief' }
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill
    });
  }

  // 2. Seed Volunteers (Users first, then Volunteer profile)
  
  // Sarah Jenkins
  await prisma.user.upsert({
    where: { email: 'sarah@volunteer.org' },
    update: {},
    create: {
      id: IDS.users.sarah,
      name: 'Sarah Jenkins',
      email: 'sarah@volunteer.org',
      passwordHash
    }
  });

  await prisma.volunteer.upsert({
    where: { userId: IDS.users.sarah },
    update: {},
    create: {
      id: IDS.volunteers.sarah,
      userId: IDS.users.sarah,
      fullName: 'Sarah Jenkins',
      verificationStatus: 'VERIFIED',
      experienceYears: 5,
      bio: 'Experienced field medic, has worked in 3 disaster zones.',
      location: 'Delhi',
      isAvailable: true,
      skills: {
        create: [
          { skillId: IDS.skills.fieldMedicine, level: SkillLevel.EXPERT }
        ]
      }
    }
  });

  // Marcus Thorne
  await prisma.user.upsert({
    where: { email: 'marcus@volunteer.org' },
    update: {},
    create: {
      id: IDS.users.marcus,
      name: 'Marcus Thorne',
      email: 'marcus@volunteer.org',
      passwordHash
    }
  });

  await prisma.volunteer.upsert({
    where: { userId: IDS.users.marcus },
    update: {},
    create: {
      id: IDS.volunteers.marcus,
      userId: IDS.users.marcus,
      fullName: 'Marcus Thorne',
      verificationStatus: 'VERIFIED',
      experienceYears: 8,
      bio: 'Logistics expert, specialized in supply chain management during crises.',
      location: 'Mumbai',
      isAvailable: false,
      skills: {
        create: [
          { skillId: IDS.skills.logistics, level: SkillLevel.EXPERT }
        ]
      }
    }
  });

  // Elena Rostova
  await prisma.user.upsert({
    where: { email: 'elena@volunteer.org' },
    update: {},
    create: {
      id: IDS.users.elena,
      name: 'Elena Rostova',
      email: 'elena@volunteer.org',
      passwordHash
    }
  });

  await prisma.volunteer.upsert({
    where: { userId: IDS.users.elena },
    update: {},
    create: {
      id: IDS.volunteers.elena,
      userId: IDS.users.elena,
      fullName: 'Elena Rostova',
      verificationStatus: 'VERIFIED',
      experienceYears: 3,
      bio: 'Trained in Search & Rescue operations in mountainous regions.',
      location: 'Dehradun',
      isAvailable: true,
      skills: {
        create: [
          { skillId: IDS.skills.searchRescue, level: SkillLevel.ADVANCED }
        ]
      }
    }
  });

  // 3. Seed Volunteer Needs
  await prisma.volunteerNeed.upsert({
    where: { id: IDS.needs.volunteerCampAlpha },
    update: {},
    create: {
      id: IDS.needs.volunteerCampAlpha,
      organizationId: IDS.organizations.floodRelief,
      title: 'Flood Camp Alpha Coordination',
      description: 'Need volunteers to help coordinate relief material distribution at Camp Alpha.',
      requiredCount: 5,
      location: 'Camp Alpha, Assam',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: VolunteerNeedStatus.OPEN,
      createdBy: IDS.users.adi
    }
  });

  await prisma.volunteerNeed.upsert({
    where: { id: IDS.needs.volunteerMedUnit },
    update: {},
    create: {
      id: IDS.needs.volunteerMedUnit,
      organizationId: IDS.organizations.redCross,
      title: 'Emergency Medical Unit Support',
      description: 'Require field medics for the newly set up medical unit.',
      requiredCount: 2,
      location: 'Delhi',
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: VolunteerNeedStatus.OPEN,
      createdBy: IDS.users.aisha
    }
  });

  // 4. Seed Volunteer Assignments
  await prisma.volunteerAssignment.upsert({
    where: { id: 'assignment_1' },
    update: {},
    create: {
      id: 'assignment_1',
      volunteerId: IDS.volunteers.sarah,
      needId: IDS.needs.volunteerMedUnit,
      organizationId: IDS.organizations.redCross,
      title: 'Medical Officer - Delhi Unit',
      status: AssignmentStatus.ASSIGNED,
      startDate: new Date(),
      createdBy: IDS.users.aisha
    }
  });

  await prisma.volunteerAssignment.upsert({
    where: { id: 'assignment_2' },
    update: {},
    create: {
      id: 'assignment_2',
      volunteerId: IDS.volunteers.marcus,
      needId: IDS.needs.volunteerCampAlpha,
      organizationId: IDS.organizations.floodRelief,
      title: 'Logistics Coordinator - Camp Alpha',
      status: AssignmentStatus.ASSIGNED,
      startDate: new Date(),
      createdBy: IDS.users.adi
    }
  });
}
