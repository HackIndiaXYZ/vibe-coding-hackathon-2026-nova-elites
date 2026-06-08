import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../app';
import { prisma } from '../../prisma';
import { clearDatabase } from '../helpers/clearDatabase';
import { createTestUser, createTestOrganization } from '../helpers/testFactory';
import { activityService } from '../../modules/activity/activity.service';

const generateToken = (userId: string) => jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1h' });

describe('Activity Orchestration', () => {
  let user1Token: string;
  let user1Id: string;
  let user2Token: string;
  let org1Id: string;
  let org2Id: string;
  let event1Id: string;

  beforeAll(async () => {
    await clearDatabase(prisma);
    
    // Create users and orgs
    const user1 = await createTestUser();
    user1Id = user1.id;
    user1Token = generateToken(user1.id);

    const user2 = await createTestUser();
    user2Token = generateToken(user2.id);

    const org1 = await createTestOrganization('Activity Org 1');
    org1Id = org1.id;

    const org2 = await createTestOrganization('Activity Org 2');
    org2Id = org2.id;

    // Add user1 to org1 as OWNER
    await prisma.membership.create({
      data: {
        userId: user1.id,
        organizationId: org1.id,
        role: 'OWNER',
        status: 'ACTIVE'
      }
    });

    // Add user2 to org2 as OWNER
    await prisma.membership.create({
      data: {
        userId: user2.id,
        organizationId: org2.id,
        role: 'OWNER',
        status: 'ACTIVE'
      }
    });

    // Create an operation/event under org1
    const event = await prisma.event.create({
      data: {
        title: 'Flood Relief Ops',
        type: 'DISASTER_RELIEF',
        organizationId: org1.id,
        createdById: user1.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
      }
    });
    event1Id = event.id;
  });

  afterAll(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  describe('Activity Creation (Internal Helper)', () => {
    it('creates successfully and stores metadata correctly', async () => {
      const activity = await activityService.createActivityEvent({
        type: 'RESOURCE_TRANSFER',
        message: 'Kits transferred',
        organizationId: org1Id,
        operationId: event1Id,
        actorId: user1Id,
        metadata: { transferId: 'tr-123', amount: 50 }
      });

      expect(activity.id).toBeDefined();
      expect(activity.type).toBe('RESOURCE_TRANSFER');
      expect(activity.message).toBe('Kits transferred');
      expect(activity.metadata).toEqual({ transferId: 'tr-123', amount: 50 });
      expect(activity.actorId).toBe(user1Id);
    });

    it('creates minimal valid event', async () => {
      const activity = await activityService.createActivityEvent({
        type: 'SYSTEM_ALERT',
        message: 'System went down'
      });
      expect(activity.id).toBeDefined();
      expect(activity.type).toBe('SYSTEM_ALERT');
    });
  });

  describe('Queries', () => {
    beforeAll(async () => {
      // Seed some events for org1 and org2
      await activityService.createActivityEvent({ type: 'LOG', message: 'Org1 Msg 1', organizationId: org1Id });
      // small delay to ensure sort order
      await new Promise(resolve => setTimeout(resolve, 50));
      await activityService.createActivityEvent({ type: 'LOG', message: 'Org1 Msg 2', organizationId: org1Id, operationId: event1Id });
      await new Promise(resolve => setTimeout(resolve, 50));
      await activityService.createActivityEvent({ type: 'LOG', message: 'Org2 Msg 1', organizationId: org2Id });
    });

    it('fetches organization activity with pagination and latest-first sorting', async () => {
      const res = await request(app)
        .get(`/api/activity/organizations/${org1Id}?limit=1&page=1`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      // Latest-first sorting: should be 'Org1 Msg 2'
      expect(res.body.data[0].message).toBe('Org1 Msg 2');
      expect(res.body.meta.total).toBeGreaterThanOrEqual(2); // At least the 2 we seeded, plus 1 from earlier test
    });

    it('fetches operation activity', async () => {
      const res = await request(app)
        .get(`/api/activity/operations/${event1Id}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // We added one operation event in the seeding + 1 in the creation test
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].operationId).toBe(event1Id);
    });
  });

  describe('Security', () => {
    it('blocks cross-organization access for org feed', async () => {
      const res = await request(app)
        .get(`/api/activity/organizations/${org1Id}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('blocks unauthorized access to operation feed', async () => {
      const res = await request(app)
        .get(`/api/activity/operations/${event1Id}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Activity Integrity', () => {
    it('does not expose public POST, PUT, or DELETE routes', async () => {
      const postRes = await request(app).post('/api/activity').set('Authorization', `Bearer ${user1Token}`).send({});
      expect(postRes.status).toBe(404);

      const putRes = await request(app).put(`/api/activity/123`).set('Authorization', `Bearer ${user1Token}`).send({});
      expect(putRes.status).toBe(404);

      const delRes = await request(app).delete(`/api/activity/123`).set('Authorization', `Bearer ${user1Token}`);
      expect(delRes.status).toBe(404);
    });
  });
});
