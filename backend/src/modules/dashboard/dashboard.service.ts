import { prisma } from '../../prisma';
import { 
  DashboardOverview, 
  OrganizationSummary, 
  ResourceSummary, 
  VolunteerSummary 
} from './dashboard.types';
import { ActivityMapper } from '../activity/activity.mapper';

export class DashboardService {
  async getOrganizationSummary(organizationId: string): Promise<OrganizationSummary> {
    const [activeOperations, pendingRequests, activeVolunteers, unreadNotifications] = await Promise.all([
      prisma.event.count({
        where: {
          organizationId,
          status: 'PUBLISHED'
        }
      }),
      prisma.reservation.count({
        where: {
          organizationId,
          status: 'PENDING'
        }
      }),
      prisma.volunteerAssignment.count({
        where: {
          status: { in: ['ASSIGNED', 'CHECKED_IN'] },
          need: {
            organizationId,
            event: {
              status: 'PUBLISHED'
            }
          }
        }
      }),
      prisma.notification.count({
        where: {
          organizationId,
          isRead: false
        }
      })
    ]);

    return {
      activeOperations,
      pendingRequests,
      activeVolunteers,
      unreadNotifications
    };
  }

  async getResourceSummary(organizationId: string): Promise<ResourceSummary> {
    const [totalResources, activeTransfers, pendingReservations] = await Promise.all([
      prisma.resource.count(), // Resources are global, but maybe we should count ResourceLots for the org? The instruction says totalResources. Wait, resources are global, resourceLots are scoped. Let's count resources. Actually, maybe resourceLots. Let's stick to resource count if they want total resources catalog, or resourceLots if they want total inventory. Let's just do `resource.count()` or `resourceLot.count({ where: { organizationId } })`. I'll do `resourceLot.count` to be safe, but they asked for `totalResources`. I'll do `resourceLot.count({ where: { organizationId }})`.
      // Let's refine `totalResources`: `prisma.resourceLot.aggregate({ where: { organizationId }, _sum: { availableQuantity: true } })` might be better, but the schema uses count. I'll just count distinct resources in lots: 
      // Actually, I'll count resources that have a lot in this org.
      // Or just total global resources? Let's assume distinct resources the org has.
      // Wait, let's just do `resourceLot.count({ where: { organizationId } })` as totalResources.
      prisma.resourceLot.count({
        where: { organizationId }
      }),
      prisma.transfer.count({
        where: {
          OR: [{ fromOrganizationId: organizationId }, { toOrganizationId: organizationId }],
          status: { notIn: ['COMPLETED', 'CANCELLED', 'FAILED'] }
        }
      }),
      prisma.reservation.count({
        where: {
          organizationId,
          status: 'PENDING'
        }
      })
    ]);

    return {
      totalResources,
      activeTransfers,
      pendingReservations
    };
  }

  async getVolunteerSummary(organizationId: string): Promise<VolunteerSummary> {
    const [totalVolunteers, assignedVolunteers] = await Promise.all([
      prisma.membership.count({
        where: {
          organizationId,
          status: 'ACTIVE'
        }
      }),
      prisma.volunteerAssignment.count({
        where: {
          status: { in: ['ASSIGNED', 'CHECKED_IN'] },
          need: {
            organizationId,
            event: {
              status: 'PUBLISHED'
            }
          }
        }
      })
    ]);

    return {
      totalVolunteers,
      assignedVolunteers,
      availableVolunteers: Math.max(0, totalVolunteers - assignedVolunteers)
    };
  }

  async getRecentActivity(organizationId: string, limit: number) {
    const activities = await prisma.activityEvent.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    return ActivityMapper.toResponseList(activities);
  }

  async getDashboardOverview(organizationId: string, activityLimit: number = 10): Promise<DashboardOverview> {
    const [
      organizationSummary,
      resourceSummary,
      volunteerSummary,
      recentActivity
    ] = await Promise.all([
      this.getOrganizationSummary(organizationId),
      this.getResourceSummary(organizationId),
      this.getVolunteerSummary(organizationId),
      this.getRecentActivity(organizationId, activityLimit)
    ]);

    return {
      organizationSummary,
      resourceSummary,
      volunteerSummary,
      recentActivity,
      unreadNotifications: organizationSummary.unreadNotifications // Reusing to avoid double query
    };
  }
}

export const dashboardService = new DashboardService();
