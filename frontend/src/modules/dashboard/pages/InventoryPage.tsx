import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { workspaceUtils } from '../../../shared/lib/workspace';
import { api } from '../../../shared/lib/api';
import { InventoryTable } from '../components/InventoryTable';
import type { ResourceLotData } from '../components/InventoryTable';
import { InventoryFilters } from '../components/InventoryFilters';
import { CreateInventoryModal } from '../components/CreateInventoryModal';
import { Plus } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { activeWorkspace } = useAuth();
  
  const [lots, setLots] = useState<ResourceLotData[]>([]);
  const [filteredLots, setFilteredLots] = useState<ResourceLotData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInventory = useCallback(async () => {
    const orgId = workspaceUtils.getOrganizationWorkspaceId(activeWorkspace);
    if (!orgId) {
      setLots([]);
      setFilteredLots([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await api<{ success: boolean; data: ResourceLotData[] }>(`/api/resource-lots?organizationId=${orgId}`);
      if (res.success && res.data) {
        setLots(res.data);
        setFilteredLots(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeWorkspace]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Handle filtering
  useEffect(() => {
    if (!searchTerm) {
      setFilteredLots(lots);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = lots.filter(lot => 
      lot.resource.name.toLowerCase().includes(lower) ||
      (lot.notes && lot.notes.toLowerCase().includes(lower))
    );
    setFilteredLots(filtered);
  }, [searchTerm, lots]);

  return (
    <div className="h-full flex flex-col gap-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-white mb-1">Inventory Management</h1>
          <p className="text-slate-400">Track and manage operational resources in this context.</p>
        </div>
        
        {workspaceUtils.isOrganizationWorkspace(activeWorkspace) && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)] shrink-0"
          >
            <Plus className="w-5 h-5" />
            Add Record
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <InventoryFilters 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        
        <InventoryTable 
          lots={filteredLots} 
          isLoading={isLoading} 
        />
      </div>

      {isModalOpen && (
        <CreateInventoryModal 
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchInventory();
          }}
        />
      )}
    </div>
  );
};
