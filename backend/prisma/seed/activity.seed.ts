import { PrismaClient, AuditAction, AuditEntityType } from '@prisma/client';
import { IDS } from './utils';

export async function seedActivity(prisma: PrismaClient) {
  console.log('🔔 Seeding activity & notifications...');

  // 1. Seed Activity/AuditLogs
  const now = Date.now();
  const hoursAgo = (hours: number) => new Date(now - hours * 60 * 60 * 1000);

  // TRANSFER_CREATED
  await prisma.auditLog.create({
    data: {
      action: AuditAction.TRANSFER_CREATED,
      userId: IDS.users.adi,
      organizationId: IDS.organizations.floodRelief,
      entityType: AuditEntityType.TRANSFER,
      entityId: IDS.transfers.transfer1,
      createdAt: hoursAgo(70)
    }
  });

  await prisma.activityEvent.create({
    data: {
      type: 'TRANSFER_CREATED',
      actorId: IDS.users.adi,
      organizationId: IDS.organizations.floodRelief,
      operationId: IDS.transfers.transfer1,
      message: 'Aditya Sharma created a transfer for 200 blankets.',
      createdAt: hoursAgo(70)
    }
  });

  // TRANSFER_ACCEPTED
  await prisma.auditLog.create({
    data: {
      action: AuditAction.TRANSFER_APPROVED,
      userId: IDS.users.adi, // For shelter alliance, the need creator
      organizationId: IDS.organizations.shelterAlliance,
      entityType: AuditEntityType.TRANSFER,
      entityId: IDS.transfers.transfer1,
      createdAt: hoursAgo(48)
    }
  });

  await prisma.activityEvent.create({
    data: {
      type: 'TRANSFER_ACCEPTED',
      actorId: IDS.users.adi,
      organizationId: IDS.organizations.shelterAlliance,
      operationId: IDS.transfers.transfer1,
      message: 'Transfer for 200 blankets was accepted.',
      createdAt: hoursAgo(48)
    }
  });

  // INVENTORY_UPDATED
  await prisma.activityEvent.create({
    data: {
      type: 'INVENTORY_UPDATED',
      actorId: IDS.users.aisha,
      organizationId: IDS.organizations.redCross,
      operationId: IDS.resourceLots.redCrossMedicalKits,
      message: 'Aisha Khan updated medical kits inventory to 400.',
      createdAt: hoursAgo(24)
    }
  });

  // VOLUNTEER_ASSIGNED
  await prisma.activityEvent.create({
    data: {
      type: 'VOLUNTEER_ASSIGNED',
      actorId: IDS.users.aisha,
      organizationId: IDS.organizations.redCross,
      operationId: IDS.needs.volunteerMedUnit,
      message: 'Sarah Jenkins assigned to Emergency Medical Unit.',
      createdAt: hoursAgo(12)
    }
  });

  // 2. Seed Notifications
  await prisma.notification.create({
    data: {
      userId: IDS.users.adi,
      organizationId: IDS.organizations.floodRelief,
      type: 'TRANSFER_UPDATE',
      title: 'Transfer In Transit',
      body: 'Your transfer of 200 Blankets is now in transit.',
      isRead: false,
      createdAt: hoursAgo(5)
    }
  });

  await prisma.notification.create({
    data: {
      userId: IDS.users.aisha,
      organizationId: IDS.organizations.redCross,
      type: 'LOW_STOCK',
      title: 'Low Stock Alert',
      body: 'Medical kits are running low in Delhi warehouse.',
      isRead: false,
      createdAt: hoursAgo(2)
    }
  });

  await prisma.notification.create({
    data: {
      userId: IDS.users.ravi,
      organizationId: IDS.organizations.foodNetwork,
      type: 'ASSIGNMENT_ALERT',
      title: 'New Volunteer Assignment',
      body: 'A new volunteer has been assigned to your region.',
      isRead: true,
      createdAt: hoursAgo(20)
    }
  });
}
