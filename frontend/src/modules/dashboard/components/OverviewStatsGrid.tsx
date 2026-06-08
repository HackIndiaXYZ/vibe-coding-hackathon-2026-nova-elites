import React from 'react';
import { OverviewStatCard } from './OverviewStatCard';
import { Package, Truck, Activity, Users } from 'lucide-react';

export interface OverviewMetrics {
  inventoryItems: number;
  activeTransfers: number;
  pendingRequests: number;
  activeVolunteers: number;
}

interface OverviewStatsGridProps {
  metrics: OverviewMetrics;
}

export const OverviewStatsGrid: React.FC<OverviewStatsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <OverviewStatCard 
        title="Inventory Items" 
        value={metrics.inventoryItems} 
        icon={Package} 
        description="Total distinct resource lots"
      />
      <OverviewStatCard 
        title="Active Transfers" 
        value={metrics.activeTransfers} 
        icon={Truck} 
        description="In-transit or pending approval"
      />
      <OverviewStatCard 
        title="Pending Requests" 
        value={metrics.pendingRequests} 
        icon={Activity} 
        description="Awaiting fulfillment"
      />
      <OverviewStatCard 
        title="Active Volunteers" 
        value={metrics.activeVolunteers} 
        icon={Users} 
        description="Currently available personnel"
      />
    </div>
  );
};
