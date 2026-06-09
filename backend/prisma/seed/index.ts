import { PrismaClient } from '@prisma/client';
import { seedOrganizations } from './organizations.seed';
import { seedResources } from './resources.seed';
import { seedTransfers } from './transfers.seed';
import { seedVolunteers } from './volunteers.seed';
import { seedActivity } from './activity.seed';

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('🧹 Cleaning existing operational database...');

  // 1. Activity & Notifications
  await prisma.notification.deleteMany();
  await prisma.activityEvent.deleteMany();
  await prisma.auditLog.deleteMany();

  // 2. Volunteer Operational Records
  await prisma.volunteerAttendance.deleteMany();
  await prisma.volunteerAssignment.deleteMany();
  await prisma.volunteerInvitation.deleteMany();
  await prisma.volunteerNeedSkill.deleteMany();
  await prisma.volunteerNeed.deleteMany();
  await prisma.volunteerAvailability.deleteMany();
  await prisma.volunteerCertification.deleteMany();
  await prisma.volunteerSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.volunteerOperationalRegion.deleteMany();
  await prisma.volunteerAudit.deleteMany();

  // 3. Transfer & Coordination Records
  await prisma.reservationAllocation.deleteMany();
  await prisma.inventoryLedgerEntry.deleteMany();
  await prisma.financialLedgerEntry.deleteMany();
  await prisma.reservation.deleteMany();
  
  await prisma.transfer.deleteMany();
  await prisma.resourceOffer.deleteMany();
  await prisma.resourceNeed.deleteMany();

  // 4. Inventory
  await prisma.resourceLot.deleteMany();
  await prisma.resource.deleteMany();

  // 5. Membership & Governance Records
  await prisma.membership.deleteMany();
  await prisma.partnership.deleteMany();

  // 6. Organizations
  await prisma.event.deleteMany();
  await prisma.organizationOperationalRegion.deleteMany();
  await prisma.organization.deleteMany();

  // 7. Users
  await prisma.volunteer.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Database cleanup complete');
}

async function main() {
  try {
    await cleanDatabase();

    await seedOrganizations(prisma);
    await seedResources(prisma);
    await seedTransfers(prisma);
    await seedVolunteers(prisma);
    await seedActivity(prisma);

    console.log('✅ Operational world seeded successfully');
    
    // Optional Advanced Cleanup
    if (process.env.DATABASE_URL?.includes('sqlite')) {
      await prisma.$executeRawUnsafe('VACUUM');
    }
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
