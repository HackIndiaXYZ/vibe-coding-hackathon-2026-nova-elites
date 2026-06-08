import { Request, Response, NextFunction } from 'express';
import * as orgService from '../services/organization.service';
import { createOrganizationSchema, updateOrganizationSchema } from '../schemas/organization.schema';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { safeAudit } from '../utils/safe-audit';
import { createAuditLog } from '../services/audit.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../prisma';

async function resolveUserOrganization(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: { userId },
    include: { organization: true },
  });

  if (memberships.length === 0) return null;

  const ownerAdmin = memberships.find(m => m.role === 'OWNER' || m.role === 'ADMIN');
  if (ownerAdmin) return ownerAdmin.organization;

  return memberships[0].organization;
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createOrganizationSchema.parse(req.body);
    const userId = req.user?.id; // now available because route is authenticated
    if (!userId) {
      return res.status(401).json(createErrorResponse('Unauthorized', 'UNAUTHORIZED'));
    }
    const org = await orgService.createOrganization(data, userId);
    res.status(201).json(createSuccessResponse(org));
  } catch (error) {
    next(error);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const orgs = await orgService.getOrganizations(skip, limit);
    res.json(createSuccessResponse(orgs));
  } catch (error) {
    next(error);
  }
}

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const query = (req.query.q as string) || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const orgs = await orgService.searchOrganizations(query, skip, limit);
    res.json(createSuccessResponse(orgs));
  } catch (error) {
    next(error);
  }
}

export async function join(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json(createErrorResponse('Unauthorized', 'UNAUTHORIZED'));
    }
    const orgId = String(req.params.id);
    
    const membership = await orgService.joinOrganization(userId, orgId);
    res.status(201).json(createSuccessResponse(membership));
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Prisma unique constraint violation
      return res.status(400).json(createErrorResponse('You already have a pending or active membership with this organization.', 'DUPLICATE_MEMBERSHIP'));
    }
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const org = await orgService.getOrganizationById(id);
    if (!org) throw new Error('Organization not found');
    res.json(createSuccessResponse(org));
  } catch (error) {
    next(error);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const data = updateOrganizationSchema.parse(req.body);
    const org = await orgService.updateOrganization(id, data);

    await safeAudit(() =>
      createAuditLog({
        action: 'ORGANIZATION_UPDATED',
        entityType: 'ORGANIZATION',
        entityId: org.id,
        userId: req.user?.id,
        organizationId: org.id,
      })
    );

    res.json(createSuccessResponse(org));
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json(createErrorResponse('Unauthorized', 'UNAUTHORIZED'));
    const org = await resolveUserOrganization(req.user.id);
    if (!org) return res.status(404).json(createErrorResponse('No organization found for user.', 'ORGANIZATION_NOT_FOUND'));
    
    const fullOrg = await orgService.getOrganizationById(org.id);
    res.json(createSuccessResponse(fullOrg));
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json(createErrorResponse('Unauthorized', 'UNAUTHORIZED'));
    const org = await resolveUserOrganization(req.user.id);
    if (!org) return res.status(404).json(createErrorResponse('No organization found for user.', 'ORGANIZATION_NOT_FOUND'));

    const data = updateOrganizationSchema.parse(req.body);
    const updatedOrg = await orgService.updateOrganization(org.id, data);

    await safeAudit(() =>
      createAuditLog({
        action: 'ORGANIZATION_UPDATED',
        entityType: 'ORGANIZATION',
        entityId: org.id,
        userId: req.user?.id,
        organizationId: org.id,
      })
    );

    res.json(createSuccessResponse(updatedOrg));
  } catch (error) {
    next(error);
  }
}
