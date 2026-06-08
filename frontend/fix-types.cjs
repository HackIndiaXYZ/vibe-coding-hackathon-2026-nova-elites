const fs = require('fs');

const fixTypes = (file, replacements) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(file, content);
};

// ActivityTimeline
fixTypes('src/modules/dashboard/components/ActivityTimeline.tsx', [
  ["import { ActivityItem, ActivityData } from './ActivityItem';", "import { ActivityItem } from './ActivityItem';\nimport type { ActivityData } from './ActivityItem';"]
]);

// CreateInventoryModal
fixTypes('src/modules/dashboard/components/CreateInventoryModal.tsx', [
  ["api<{ data: any[] }>", "api<{ success: boolean; data: any[] }>"]
]);

// OverviewStatCard
fixTypes('src/modules/dashboard/components/OverviewStatCard.tsx', [
  ["import { LucideIcon } from 'lucide-react';", "import type { LucideIcon } from 'lucide-react';"]
]);

// RecentActivityPanel
fixTypes('src/modules/dashboard/components/RecentActivityPanel.tsx', [
  ["import { ActivityItem, ActivityData } from './ActivityItem';", "import { ActivityItem } from './ActivityItem';\nimport type { ActivityData } from './ActivityItem';"]
]);

// VolunteerCard
fixTypes('src/modules/dashboard/components/VolunteerCard.tsx', [
  ["import { VolunteerSchema } from '../services/VolunteerMockData';", "import type { VolunteerSchema } from '../services/VolunteerMockData';"]
]);

// VolunteerGrid
fixTypes('src/modules/dashboard/components/VolunteerGrid.tsx', [
  ["import { VolunteerSchema } from '../services/VolunteerMockData';", "import type { VolunteerSchema } from '../services/VolunteerMockData';"]
]);

// VolunteerProfilePanel
fixTypes('src/modules/dashboard/components/VolunteerProfilePanel.tsx', [
  ["import { VolunteerSchema } from '../services/VolunteerMockData';", "import type { VolunteerSchema } from '../services/VolunteerMockData';"]
]);

// ActivityPage
fixTypes('src/modules/dashboard/pages/ActivityPage.tsx', [
  ["import { ActivityData } from '../components/ActivityItem';", "import type { ActivityData } from '../components/ActivityItem';"],
  ["api<{ data: any[] }>", "api<{ success: boolean; data: any[] }>"]
]);

// InventoryDetailPage
fixTypes('src/modules/dashboard/pages/InventoryDetailPage.tsx', [
  ["import { ResourceLotData } from '../components/InventoryTable';", "import type { ResourceLotData } from '../components/InventoryTable';"],
  ["import { ActivityItem, ActivityData } from '../components/ActivityItem';", "import { ActivityItem } from '../components/ActivityItem';\nimport type { ActivityData } from '../components/ActivityItem';"],
  ["api<{ data: ResourceLotData }>", "api<{ success: boolean; data: ResourceLotData }>"]
]);

// InventoryPage
fixTypes('src/modules/dashboard/pages/InventoryPage.tsx', [
  ["import { InventoryTable, ResourceLotData } from '../components/InventoryTable';", "import { InventoryTable } from '../components/InventoryTable';\nimport type { ResourceLotData } from '../components/InventoryTable';"],
  ["api<{ data: ResourceLotData[] }>", "api<{ success: boolean; data: ResourceLotData[] }>"]
]);

// OverviewPage
fixTypes('src/modules/dashboard/pages/OverviewPage.tsx', [
  ["import { OverviewStatsGrid, OverviewMetrics } from '../components/OverviewStatsGrid';", "import { OverviewStatsGrid } from '../components/OverviewStatsGrid';\nimport type { OverviewMetrics } from '../components/OverviewStatsGrid';"],
  ["import { ActivityData } from '../components/ActivityItem';", "import type { ActivityData } from '../components/ActivityItem';"],
  ["api<{ data: any[] }>", "api<{ success: boolean; data: any[] }>"]
]);

// VolunteersPage
fixTypes('src/modules/dashboard/pages/VolunteersPage.tsx', [
  ["import { generateMockVolunteers, VolunteerSchema } from '../services/VolunteerMockData';", "import { generateMockVolunteers } from '../services/VolunteerMockData';\nimport type { VolunteerSchema } from '../services/VolunteerMockData';"]
]);

console.log('Fixed types!');
