import { prisma } from '../../prisma';
import { CreateActivityEventDto, ActivityQueryFilters, PaginatedActivityEvents } from './activity.types';
import { ActivityMapper } from './activity.mapper';

export class ActivityService {
  /**
   * INTERNAL SERVICE HELPER ONLY.
   * Operational modules may call this directly. No public POST route should exist.
   * Activity events are immutable operational records. Updates and deletions are strictly forbidden.
   */
  async createActivityEvent(data: CreateActivityEventDto) {
    const event = await prisma.activityEvent.create({
      data: {
        type: data.type,
        actorId: data.actorId || null,
        organizationId: data.organizationId || null,
        operationId: data.operationId || null,
        message: data.message,
        metadata: data.metadata as any,
      },
    });

    return ActivityMapper.toResponse(event);
  }

  async getOrganizationActivity(organizationId: string, filters: ActivityQueryFilters): Promise<PaginatedActivityEvents> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where = { organizationId };

    // Lean Selects Only: No deep include trees or nested operational entities
    const [total, items] = await prisma.$transaction([
      prisma.activityEvent.count({ where }),
      prisma.activityEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      items: ActivityMapper.toResponseList(items),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOperationActivity(operationId: string, filters: ActivityQueryFilters): Promise<PaginatedActivityEvents> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where = { operationId };

    const [total, items] = await prisma.$transaction([
      prisma.activityEvent.count({ where }),
      prisma.activityEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      items: ActivityMapper.toResponseList(items),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const activityService = new ActivityService();
