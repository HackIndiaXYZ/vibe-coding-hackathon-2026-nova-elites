import { ActivityEvent } from '@prisma/client';
import { ActivityEventResponse } from './activity.types';

export class ActivityMapper {
  static toResponse(event: ActivityEvent): ActivityEventResponse {
    return {
      id: event.id,
      type: event.type,
      actorId: event.actorId,
      organizationId: event.organizationId,
      operationId: event.operationId,
      message: event.message,
      metadata: event.metadata as Record<string, unknown> | null,
      createdAt: event.createdAt.toISOString(),
    };
  }

  static toResponseList(events: ActivityEvent[]): ActivityEventResponse[] {
    return events.map(ActivityMapper.toResponse);
  }
}
