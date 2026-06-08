import { DashboardOverview } from './dashboard.types';

export class DashboardMapper {
  // Currently identical mapping, but protects against future schema drift
  static toOverviewResponse(overview: DashboardOverview): DashboardOverview {
    return {
      organizationSummary: {
        activeOperations: overview.organizationSummary.activeOperations,
        pendingRequests: overview.organizationSummary.pendingRequests,
        activeVolunteers: overview.organizationSummary.activeVolunteers,
        unreadNotifications: overview.organizationSummary.unreadNotifications,
      },
      resourceSummary: {
        totalResources: overview.resourceSummary.totalResources,
        activeTransfers: overview.resourceSummary.activeTransfers,
        pendingReservations: overview.resourceSummary.pendingReservations,
      },
      volunteerSummary: {
        totalVolunteers: overview.volunteerSummary.totalVolunteers,
        assignedVolunteers: overview.volunteerSummary.assignedVolunteers,
        availableVolunteers: overview.volunteerSummary.availableVolunteers,
      },
      recentActivity: overview.recentActivity,
      unreadNotifications: overview.unreadNotifications,
    };
  }
}
