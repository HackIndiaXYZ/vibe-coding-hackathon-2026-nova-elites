import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../app';
import { prisma } from '../../prisma';
import { clearDatabase } from '../helpers/clearDatabase';
import { createTestUser, createTestOrganization } from '../helpers/testFactory';

const generateToken = (userId: string) => jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1h' });

describe('Notification Orchestration', () => {
  let user1Token: string;
  let user1Id: string;
  let orgId: string;

  beforeAll(async () => {
    await clearDatabase(prisma);
    
    // Create users using helpers
    const user1 = await createTestUser();
    user1Id = user1.id;
    user1Token = generateToken(user1.id);

    const org = await createTestOrganization();
    orgId = org.id;
  });

  afterAll(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  describe('GET /api/notifications', () => {
    beforeAll(async () => {
      // Seed some notifications
      await prisma.notification.createMany({
        data: [
          { userId: user1Id, type: 'ALERT', title: 'Test 1', body: 'Body 1', isRead: false },
          { userId: user1Id, type: 'INFO', title: 'Test 2', body: 'Body 2', isRead: true },
          { userId: user1Id, type: 'INFO', title: 'Test 3', body: 'Body 3', isRead: false, organizationId: orgId },
        ]
      });
    });

    it('should fetch user notifications with pagination and sorting', async () => {
      const res = await request(app)
        .get('/api/notifications?limit=2&page=1')
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.meta.total).toBe(3);
    });

    it('should filter by isRead', async () => {
      const res = await request(app)
        .get('/api/notifications?isRead=true')
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
    
    it('should filter by organizationId', async () => {
      const res = await request(app)
        .get(`/api/notifications?organizationId=${orgId}`)
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });

  describe('GET /api/notifications/unread-count', () => {
    it('should get correct unread count', async () => {
      const res = await request(app)
        .get('/api/notifications/unread-count')
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.count).toBe(2);
    });
  });

  describe('PATCH /api/notifications/:id/read and /unread', () => {
    let notificationId: string;

    beforeAll(async () => {
      const notif = await prisma.notification.create({
        data: { userId: user1Id, type: 'ALERT', title: 'To read', body: 'Body', isRead: false }
      });
      notificationId = notif.id;
    });

    it('should mark as read', async () => {
      const res = await request(app)
        .patch(`/api/notifications/${notificationId}/read`)
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.isRead).toBe(true);
    });

    it('should remain idempotent when marking read again', async () => {
      const res = await request(app)
        .patch(`/api/notifications/${notificationId}/read`)
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.isRead).toBe(true);
    });

    it('should mark as unread', async () => {
      const res = await request(app)
        .patch(`/api/notifications/${notificationId}/unread`)
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.isRead).toBe(false);
    });
  });

  describe('Security and Errors', () => {
    let otherUserId: string;
    let otherUserToken: string;
    let notificationId: string;

    beforeAll(async () => {
      const otherUser = await prisma.user.create({
        data: { name: 'Other', email: 'other@example.com', passwordHash: 'hashed' }
      });
      otherUserId = otherUser.id;
      otherUserToken = generateToken(otherUserId);

      const notif = await prisma.notification.create({
        data: { userId: user1Id, type: 'ALERT', title: 'Mine', body: 'My Body' }
      });
      notificationId = notif.id;
    });

    it('should block unauthorized access', async () => {
      const res = await request(app)
        .patch(`/api/notifications/${notificationId}/read`)
        .set('Authorization', `Bearer ${otherUserToken}`);
      
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.errors[0].code).toBe('FORBIDDEN');
    });

    it('should return 404 for unknown notification', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .patch(`/api/notifications/${fakeId}/read`)
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.status).toBe(404);
      expect(res.body.errors[0].code).toBe('NOT_FOUND');
    });
  });
});
