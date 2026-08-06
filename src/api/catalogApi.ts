import { apiGet } from './client';
import type { AddOn, Category, ListCatalogParams, Paginated, Service, ServiceGroup, Subcategory } from './types';

const BASE = '/service-catalog';

export interface ListServicesParams extends ListCatalogParams {
  category?: string;
  subcategory?: string;
  serviceGroup?: string;
  search?: string;
}

export interface ListSubcategoriesParams extends ListCatalogParams {
  category?: string;
}

export interface ListServiceGroupsParams extends ListCatalogParams {
  category?: string;
  subcategory?: string;
}

export interface ListAddOnsParams extends ListCatalogParams {
  service?: string;
  serviceGroup?: string;
}

export const catalogApi = {
  getCategories: (params?: ListCatalogParams) => apiGet<Paginated<Category>>(`${BASE}/categories`, { params }),

  getCategory: (categoryId: string) => apiGet<Category>(`${BASE}/categories/${categoryId}`),

  getSubcategories: (params?: ListSubcategoriesParams) => apiGet<Paginated<Subcategory>>(`${BASE}/subcategories`, { params }),

  getSubcategory: (subcategoryId: string) => apiGet<Subcategory>(`${BASE}/subcategories/${subcategoryId}`),

  getServiceGroups: (params?: ListServiceGroupsParams) => apiGet<Paginated<ServiceGroup>>(`${BASE}/service-groups`, { params }),

  getServiceGroup: (serviceGroupId: string) => apiGet<ServiceGroup>(`${BASE}/service-groups/${serviceGroupId}`),

  getServices: (params?: ListServicesParams) => apiGet<Paginated<Service>>(`${BASE}/services`, { params }),

  getService: (serviceId: string) => apiGet<Service>(`${BASE}/services/${serviceId}`),

  searchServices: (search: string, params?: ListCatalogParams) =>
    apiGet<Paginated<Service>>(`${BASE}/services`, { params: { ...params, search } }),

  getAddOns: (params?: ListAddOnsParams) => apiGet<Paginated<AddOn>>(`${BASE}/add-ons`, { params }),
};
