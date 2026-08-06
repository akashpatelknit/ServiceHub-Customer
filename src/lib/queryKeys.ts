import type { ListAddOnsParams, ListServiceGroupsParams, ListServicesParams, ListSubcategoriesParams } from '@/api/catalogApi';
import type { ListCatalogParams, ListOrdersParams } from '@/api/types';

/**
 * Single source of truth for query keys so cache invalidation (queryClient.invalidateQueries)
 * stays consistent across the app — every hook in src/queries reads its key from here rather
 * than building ad hoc arrays.
 */
export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  cart: {
    current: () => ['cart'] as const,
  },
  categories: {
    all: (params?: ListCatalogParams) => ['categories', params] as const,
    detail: (categoryId: string | undefined) => ['categories', categoryId] as const,
  },
  subcategories: {
    all: (params?: ListSubcategoriesParams) => ['subcategories', params] as const,
    detail: (subcategoryId: string | undefined) => ['subcategories', subcategoryId] as const,
  },
  serviceGroups: {
    all: (params?: ListServiceGroupsParams) => ['serviceGroups', params] as const,
    detail: (serviceGroupId: string | undefined) => ['serviceGroups', serviceGroupId] as const,
  },
  services: {
    all: (params?: ListServicesParams) => ['services', params] as const,
    detail: (serviceId: string | undefined) => ['services', serviceId] as const,
    search: (query: string) => ['services', 'search', query] as const,
  },
  addOns: {
    all: (params?: ListAddOnsParams) => ['addOns', params] as const,
  },
  addresses: {
    all: () => ['addresses'] as const,
  },
  orders: {
    list: (filters?: ListOrdersParams) => ['orders', 'list', filters] as const,
    detail: (orderNumber: string | undefined) => ['orders', orderNumber] as const,
  },
} as const;
