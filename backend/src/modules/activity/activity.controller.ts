import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { activityService } from './activity.service';
import { createSuccessResponse } from '../../utils/response';
import { getActivityQuerySchema, organizationActivityParamSchema, operationActivityParamSchema } from './activity.validation';

export class ActivityController {
  async getOrganizationActivity(req: AuthRequest, res: Response) {
    const validatedParams = organizationActivityParamSchema.parse({ params: req.params });
    const validatedQuery = getActivityQuerySchema.parse({ query: req.query });

    const result = await activityService.getOrganizationActivity(validatedParams.params.id, validatedQuery.query);
    
    return res.status(200).json(createSuccessResponse(result.items, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    }));
  }

  async getOperationActivity(req: AuthRequest, res: Response) {
    const validatedParams = operationActivityParamSchema.parse({ params: req.params });
    const validatedQuery = getActivityQuerySchema.parse({ query: req.query });

    const result = await activityService.getOperationActivity(validatedParams.params.id, validatedQuery.query);

    return res.status(200).json(createSuccessResponse(result.items, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    }));
  }
}

export const activityController = new ActivityController();
