import React from 'react';
import { Search, Filter } from 'lucide-react';

interface InventoryFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  // Extensible for future category filtering
}

export const InventoryFilters: React.FC<InventoryFiltersProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
      </div>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-sm text-slate-300 font-medium transition-colors whitespace-nowrap">
        <Filter className="w-4 h-4" />
        Filter Status
      </button>
    </div>
  );
};
