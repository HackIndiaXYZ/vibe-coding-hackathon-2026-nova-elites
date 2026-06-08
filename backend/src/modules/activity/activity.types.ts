export interface CreateActivityEventDto {
  type: string;
  actorId?: string | null;
  organizationId?: string | null;
  operationId?: string | null;
  message: string;
  metadata?: Record<string, unknown> | null;
}

export interface ActivityQueryFilters {
  page?: number;
  limit?: number;
}

export interface ActivityEventResponse {
  id: string;
  type: string;
  actorId: string | null;
  organizationId: string | null;
  operationId: string | null;
  message: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface PaginatedActivityEvents {
  items: ActivityEventResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
