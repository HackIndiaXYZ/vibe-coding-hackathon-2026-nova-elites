import { Request, Response } from 'express';
import { createResourceNeedSchema } from '../schemas/resource.schema';
import { createResourceNeed, getResourceNeeds, getNeedById, cancelResourceNeed } from '../services/resource-need.service';
import { createSuccessResponse } from '../utils/response';
import { asyncHandler } from '../middleware/asyncHandler';
import { NotFoundError } from '../utils/errors';

export const createResourceNeedController = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = createResourceNeedSchema.parse(req.body);
  const need = await createResourceNeed(validatedData);
  res.status(201).json(createSuccessResponse(need));
});

export const getResourceNeedsController = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;
  
  const filters: any = {};
  if (req.query.organizationId) filters.organizationId = req.query.organizationId;
  if (req.query.status) filters.status = req.query.status;
  if (req.query.resourceId) filters.resourceId = req.query.resourceId;

  const needs = await getResourceNeeds(filters, skip, limit);
  res.status(200).json(createSuccessResponse(needs));
});

export const getResourceNeedController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const need = await getNeedById(id);
  if (!need) {
    throw new NotFoundError('ResourceNeed not found');
  }
  res.status(200).json(createSuccessResponse(need));
});

export const cancelResourceNeedController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const need = await cancelResourceNeed(id);
  res.status(200).json(createSuccessResponse(need));
});

export const getResourceNeedMatchesController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { prisma } = require('../prisma');
  
  const need = await getNeedById(id);
  if (!need) throw new NotFoundError('ResourceNeed not found');

  // Find lots that match the resourceId, have availableQuantity > 0, 
  // and are not owned by the requesting organization
  const matches = await prisma.resourceLot.findMany({
    where: {
      resourceId: need.resourceId,
      availableQuantity: { gt: 0 },
      organizationId: { not: need.organizationId }
    },
    include: {
      organization: {
        select: { id: true, name: true }
      }
    },
    orderBy: {
      availableQuantity: 'desc'
    },
    take: 10
  });

  const formattedMatches = matches.map((match: any) => {
    let confidence = 'Low';
    if (match.availableQuantity >= need.quantity) confidence = 'High';
    else if (match.availableQuantity >= need.quantity / 2) confidence = 'Medium';

    return {
      organization: match.organization,
      resourceLotId: match.id,
      availableQuantity: match.availableQuantity,
      confidence,
      mockDistance: Math.floor(Math.random() * 50) + 5 // 5-55 km (Presentational only per architecture)
    };
  });

  res.status(200).json(createSuccessResponse(formattedMatches));
});
