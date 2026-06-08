import { ActivityEventResponse } from '../activity/activity.types';

export interface OrganizationSummary {
  activeOperations: number;
  pendingRequests: number;
  activeVolunteers: number;
  unreadNotifications: number;
}

export interface ResourceSummary {
  totalResources: number;
  activeTransfers: number;
  pendingReservations: number;
}

export interface VolunteerSummary {
  totalVolunteers: number;
  assignedVolunteers: number;
  availableVolunteers: number;
}

export interface DashboardOverview {
  organizationSummary: OrganizationSummary;
  resourceSummary: ResourceSummary;
  volunteerSummary: VolunteerSummary;
  recentActivity: ActivityEventResponse[];
  unreadNotifications: number;
}
