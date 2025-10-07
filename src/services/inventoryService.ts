// services/inventoryService.ts
import { api } from './apiHelper';

import { InventoryItem } from '@/types';

// Pagination response type
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedInventoryResponse {
  items: InventoryItem[];
  pagination: PaginationInfo;
}

export const inventoryService = {
  getInventoryItems: (): Promise<InventoryItem[]> => {
    return api.get('/inventory');
  },

  getInventoryItemsPaginated: (
    page: number = 1,
    limit: number = 100,
    department: string = 'all'
  ): Promise<PaginatedInventoryResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      department: department
    });
    return api.get(`/inventory/paginated?${params}`);
  },

  getUniqueDepartments: (): Promise<string[]> => {
    return api.get('/inventory/data/departments');
  },

  addInventoryItem: (
    itemData: Omit<InventoryItem, 'id'>
  ): Promise<InventoryItem> => {
    return api.post('/inventory', itemData);
  },

  updateInventoryItem: (
    itemId: number,
    itemData: Partial<InventoryItem>
  ): Promise<InventoryItem> => {
    return api.put(`/inventory/${itemId}`, itemData);
  },

  deleteInventoryItem: (itemId: number): Promise<void> => {
    return api.delete(`/inventory/${itemId}`);
  },

  manageItemSerials: (
    itemId: number,
    serials: string[]
  ): Promise<InventoryItem> => {
    return api.post(`/inventory/${itemId}/serials`, { serials });
  },

  getUniqueCategories: (): Promise<string[]> => {
    return api.get('/inventory/data/categories');
  },

  getIncompleteInventoryItems: (): Promise<InventoryItem[]> => {
    return api.get('/inventory/incomplete');
  },
};
