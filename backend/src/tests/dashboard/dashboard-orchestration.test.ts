import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../app';
import { prisma } from '../../prisma';
import { clearDatabase } from '../helpers/clearDatabase';
import { createTestUser, createTestOrganization } from '../helpers/testFactory';
import { activityService } from '../../modules/activity/activity.service';

const generateToken = (userId: string, organizationId?: string) => {
  return jwt.sign(
    { userId, orgContext: organizationId }, 
    process.env.JWT_SECRET || 'test-secret', 
    { expiresIn: '1h' }
  );
};

describe('Dashboard Orchestration', () => {
  let userToken: string;
  let otherUserToken: string;
  let orgId: string;
  let otherOrgId: string;
  let userId: string;

  beforeAll(async () => {
    await clearDatabase(prisma);

    const user = await createTestUser();
    userId = user.id;

    const otherUser = await createTestUser();

    const org = await createTestOrganization('Dashboard Org');
    orgId = org.id;

    const otherOrg = await createTestOrganization('Other Org');
    otherOrgId = otherOrg.id;

    await prisma.membership.create({
      data: { userId: user.id, organizationId: org.id, role: 'OWNER', status: 'ACTIVE' }
    });

    await prisma.membership.create({
      data: { userId: otherUser.id, organizationId: otherOrg.id, role: 'OWNER', status: 'ACTIVE' }
    });

    userToken = generateToken(user.id, org.id); // Add orgContext to token
    otherUserToken = generateToken(otherUser.id, otherOrg.id);
  });

  afterAll(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  describe('Empty State', () => {
    it('returns zeroes for a new organization', async () => {
      const res = await request(app)
        .get('/api/dashboard/overview')
        .set('Authorization', `Bearer ${otherUserToken}`); // otherOrg has no data

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const data = res.body.data;
      expect(data.organizationSummary.activeOperations).toBe(0);
      expect(data.resourceSummary.totalResources).toBe(0);
      expect(data.volunteerSummary.totalVolunteers).toBe(1); // the OWNER is the only membership
      expect(data.recentActivity.length).toBe(0);
      expect(data.unreadNotifications).toBe(0);
    });
  });

  describe('Populated State', () => {
    beforeAll(async () => {
      // 1. Create a published event
      const event = await prisma.event.create({
        data: {
          title: 'Test Event',
          type: 'RELIEF',
          status: 'PUBLISHED',
          organizationId: orgId,
          createdById: userId,
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000)
        }
      });

      // 2. Create an unread notification
      await prisma.notification.create({
        data: {
          userId,
          organizationId: orgId,
          title: 'Test',
          body: 'Test Notification',
          type: 'INFO',
          isRead: false
        }
      });

      // 3. Create a resource lot
      const resource = await prisma.resource.create({
        data: { name: 'Water Bottles', unit: 'Liters' }
      });

      const resourceLot = await prisma.resourceLot.create({
        data: {
          organizationId: orgId,
          resourceId: resource.id,
          quantity: 100,
          availableQuantity: 100
        }
      });

      const needObj = await prisma.resourceNeed.create({
        data: {
          organizationId: orgId,
          resourceId: resource.id,
          eventId: event.id,
          quantity: 10,
          createdById: userId,
          status: 'OPEN'
        }
      });

      const offerObj = await prisma.resourceOffer.create({
        data: {
          offeringOrganizationId: orgId,
          needId: needObj.id,
          resourceLotId: resourceLot.id,
          offeredQuantity: 10,
          createdById: userId,
          status: 'PENDING'
        }
      });

      // 4. Create an active transfer
      await prisma.transfer.create({
        data: {
          fromOrganizationId: orgId,
          toOrganizationId: otherOrgId,
          resourceId: resource.id,
          needId: needObj.id,
          offerId: offerObj.id,
          quantity: 10,
          status: 'IN_TRANSIT',
        }
      });

      // 5. Create a reservation
      await prisma.reservation.create({
        data: {
          organizationId: orgId,
          resourceId: resource.id,
          eventId: event.id,
          requestedQuantity: 5,
          status: 'PENDING',
          createdById: userId
        }
      });

      // 6. Create volunteer assignments
      const volUser = await createTestUser();
      const volunteer = await prisma.volunteer.create({
        data: { userId: volUser.id }
      });
      await prisma.membership.create({
        data: { userId: volUser.id, organizationId: orgId, role: 'VOLUNTEER', status: 'ACTIVE' }
      });

      const need = await prisma.volunteerNeed.create({
        data: {
          organizationId: orgId,
          eventId: event.id,
          title: 'Helper',
          requiredCount: 1,
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000),
          createdBy: userId
        }
      });

      await prisma.volunteerAssignment.create({
        data: {
          volunteerId: volunteer.id,
          needId: need.id,
          status: 'ASSIGNED',
          createdBy: userId
        }
      });

      // 7. Create some activities
      await activityService.createActivityEvent({
        type: 'LOG',
        message: 'Something happened',
        organizationId: orgId,
        operationId: event.id,
        actorId: userId
      });
    });

    it('fetches correct organization summary', async () => {
      const res = await request(app)
        .get('/api/dashboard/overview')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      const data = res.body.data;
      
      expect(data.organizationSummary.activeOperations).toBe(1);
      expect(data.organizationSummary.pendingRequests).toBe(1);
      expect(data.organizationSummary.activeVolunteers).toBe(1);
      expect(data.organizationSummary.unreadNotifications).toBe(1);
    });

    it('fetches correct resource summary', async () => {
      const res = await request(app)
        .get('/api/dashboard/resources')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      const data = res.body.data;
      expect(data.totalResources).toBe(1);
      expect(data.activeTransfers).toBe(1);
      expect(data.pendingReservations).toBe(1);
    });

    it('fetches correct volunteer summary', async () => {
      const res = await request(app)
        .get('/api/dashboard/volunteers')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      const data = res.body.data;
      // total includes OWNER from beforeAll and VOLUNTEER from seeded data
      expect(data.totalVolunteers).toBe(2);
      expect(data.assignedVolunteers).toBe(1);
      expect(data.availableVolunteers).toBe(1);
    });

    it('fetches recent activity', async () => {
      const res = await request(app)
        .get('/api/dashboard/activity?limit=5')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      const data = res.body.data;
      expect(data.length).toBe(1);
      expect(data[0].message).toBe('Something happened');
    });
  });

  describe('Security and Errors', () => {
    it('blocks unauthenticated access', async () => {
      const res = await request(app).get('/api/dashboard/overview');
      expect(res.status).toBe(401);
    });

    it('resolves org context gracefully even if missing from token', async () => {
      const tokenWithoutOrg = jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret');
      const res = await request(app)
        .get('/api/dashboard/overview')
        .set('Authorization', `Bearer ${tokenWithoutOrg}`);

      // The controller resolves it via DB
      expect(res.status).toBe(200); 
      expect(res.body.success).toBe(true);
    });

    it('returns 400 for a user with no memberships', async () => {
      const unattachedUser = await createTestUser();
      const tokenUnattached = jwt.sign({ userId: unattachedUser.id }, process.env.JWT_SECRET || 'test-secret');
      const res = await request(app)
        .get('/api/dashboard/overview')
        .set('Authorization', `Bearer ${tokenUnattached}`);

      expect(res.status).toBe(400); // ValidationError mapping
      expect(res.body.success).toBe(false);
    });
  });
});
