import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { dashboardService } from './dashboard.service';
import { DashboardMapper } from './dashboard.mapper';
import { createSuccessResponse } from '../../utils/response';
import { getActivityQuerySchema } from './dashboard.validation';
import { prisma } from '../../prisma';
import { ValidationError } from '../../utils/errors';

export class DashboardController {
  private async resolveOrganizationId(req: AuthRequest): Promise<string> {
    if (!req.user) {
      throw new ValidationError('Authentication required');
    }

    const membership = await prisma.membership.findFirst({
      where: { userId: req.user.id },
      select: { organizationId: true }
    });

    if (!membership) {
      throw new ValidationError('Organization context missing');
    }

    return membership.organizationId;
  }

  getOverview = async (req: AuthRequest, res: Response) => {
    const orgId = await this.resolveOrganizationId(req);
    const validatedQuery = getActivityQuerySchema.parse({ query: req.query });
    
    const overview = await dashboardService.getDashboardOverview(orgId, validatedQuery.query.limit);
    
    return res.status(200).json(createSuccessResponse(DashboardMapper.toOverviewResponse(overview)));
  };

  getResources = async (req: AuthRequest, res: Response) => {
    const orgId = await this.resolveOrganizationId(req);

    const summary = await dashboardService.getResourceSummary(orgId);
    return res.status(200).json(createSuccessResponse(summary));
  };

  getVolunteers = async (req: AuthRequest, res: Response) => {
    const orgId = await this.resolveOrganizationId(req);

    const summary = await dashboardService.getVolunteerSummary(orgId);
    return res.status(200).json(createSuccessResponse(summary));
  };

  getActivity = async (req: AuthRequest, res: Response) => {
    const orgId = await this.resolveOrganizationId(req);
    const validatedQuery = getActivityQuerySchema.parse({ query: req.query });

    const activity = await dashboardService.getRecentActivity(orgId, validatedQuery.query.limit);
    return res.status(200).json(createSuccessResponse(activity));
  };
}

export const dashboardController = new DashboardController();
