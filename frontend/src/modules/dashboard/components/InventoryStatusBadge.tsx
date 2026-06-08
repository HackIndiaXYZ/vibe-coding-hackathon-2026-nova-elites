import React from 'react';

export type InventoryStatus = 'Available' | 'Low Stock' | 'Critical' | 'Reserved' | 'Transferred';

interface InventoryStatusBadgeProps {
  status: InventoryStatus;
}

export const InventoryStatusBadge: React.FC<InventoryStatusBadgeProps> = ({ status }) => {
  let styleClasses = '';
  
  switch (status) {
    case 'Available':
      styleClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
      break;
    case 'Low Stock':
      styleClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]';
      break;
    case 'Critical':
      styleClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]';
      break;
    case 'Reserved':
      styleClasses = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]';
      break;
    case 'Transferred':
      styleClasses = 'bg-slate-500/10 text-slate-400 border-slate-500/20 shadow-[0_0_10px_rgba(100,116,139,0.1)]';
      break;
    default:
      styleClasses = 'bg-slate-500/10 text-slate-400 border-slate-500/20 shadow-[0_0_10px_rgba(100,116,139,0.1)]';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styleClasses}`}>
      {status}
    </span>
  );
};

export const computeInventoryStatus = (quantity: number, availableQuantity: number): InventoryStatus => {
  if (availableQuantity === 0) return 'Critical';
  if (availableQuantity < 10) return 'Low Stock'; // Simplified threshold for demo
  if (availableQuantity < quantity) return 'Reserved'; // Some are reserved
  return 'Available';
};
