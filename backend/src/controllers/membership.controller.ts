import { Request, Response, NextFunction } from 'express';
import * as membershipService from '../services/membership.service';
import { createMembershipSchema } from '../schemas/membership.schema';
import { createSuccessResponse } from '../utils/response';
import { safeAudit } from '../utils/safe-audit';
import { createAuditLog } from '../services/audit.service';
import { AuthRequest } from '../middleware/auth.middleware';

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createMembershipSchema.parse(req.body);
    const membership = await membershipService.createMembership(data);

    await safeAudit(() =>
      createAuditLog({
        action: 'MEMBERSHIP_CREATED',
        entityType: 'MEMBERSHIP',
        entityId: membership.id,
        userId: req.user?.id,
        organizationId: membership.organizationId,
        metadata: { role: membership.role },
      })
    );

    res.status(201).json(createSuccessResponse(membership));
  } catch (error) {
    next(error);
  }
}

export async function getOrganizationMembers(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const members = await membershipService.getOrganizationMembers(id, skip, limit);
    res.json(createSuccessResponse(members));
  } catch (error) {
    next(error);
  }
}

export async function approveMembership(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const membership = await membershipService.updateMembershipStatus(id, 'ACTIVE');
    res.json(createSuccessResponse(membership));
  } catch (error) {
    next(error);
  }
}

export async function rejectMembership(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const membership = await membershipService.updateMembershipStatus(id, 'REJECTED');
    res.json(createSuccessResponse(membership));
  } catch (error) {
    next(error);
  }
}

export async function getPendingMemberships(req: Request, res: Response, next: NextFunction) {
  try {
    const orgId = req.query.organizationId as string;
    if (!orgId) throw new Error('organizationId is required');
    const { prisma } = require('../prisma');
    const pending = await prisma.membership.findMany({
      where: { organizationId: orgId, status: 'PENDING' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        organization: { select: { id: true, name: true } }
      }
    });
    res.json(createSuccessResponse(pending));
  } catch (error) {
    next(error);
  }
}
