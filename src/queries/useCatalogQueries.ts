import { useQuery } from '@tanstack/react-query';
import {
  catalogApi,
  type ListAddOnsParams,
  type ListServiceGroupsParams,
  type ListServicesParams,
  type ListSubcategoriesParams,
} from '@/api/catalogApi';
import type { ListCatalogParams } from '@/api/types';
import { queryKeys } from '@/lib/queryKeys';

export function useCategories(params?: ListCatalogParams) {
  return useQuery({
    queryKey: queryKeys.categories.all(params),
    queryFn: () => catalogApi.getCategories(params),
  });
}

export function useCategory(categoryId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.categories.detail(categoryId),
    queryFn: () => catalogApi.getCategory(categoryId!),
    enabled: Boolean(categoryId),
  });
}

/** No get-by-slug endpoint exists (backend only supports get-by-id) — resolves a slug from the URL by fetching the active pool and finding the match. */
export function useCategoryBySlug(slug: string | undefined) {
  const query = useCategories({ isActive: 'true', limit: 100 });
  const category = query.data?.items.find((c) => c.slug === slug);
  return { ...query, data: category, notFound: query.isSuccess && !category };
}

export function useSubcategories(params?: ListSubcategoriesParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.subcategories.all(params),
    queryFn: () => catalogApi.getSubcategories(params),
    enabled: options?.enabled,
  });
}

export function useSubcategory(subcategoryId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.subcategories.detail(subcategoryId),
    queryFn: () => catalogApi.getSubcategory(subcategoryId!),
    enabled: Boolean(subcategoryId),
  });
}

/** See useCategoryBySlug — same slug-resolution gap, scoped to a known parent category. */
export function useSubcategoryBySlug(categoryId: string | undefined, slug: string | undefined) {
  const query = useSubcategories({ category: categoryId, isActive: 'true', limit: 100 }, { enabled: Boolean(categoryId) });
  const subcategory = query.data?.items.find((s) => s.slug === slug);
  return { ...query, data: subcategory, notFound: query.isSuccess && !subcategory };
}

export function useServiceGroups(params?: ListServiceGroupsParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.serviceGroups.all(params),
    queryFn: () => catalogApi.getServiceGroups(params),
    enabled: options?.enabled,
  });
}

export function useServiceGroup(serviceGroupId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.serviceGroups.detail(serviceGroupId),
    queryFn: () => catalogApi.getServiceGroup(serviceGroupId!),
    enabled: Boolean(serviceGroupId),
  });
}

export function useServices(params?: ListServicesParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.services.all(params),
    queryFn: () => catalogApi.getServices(params),
    enabled: options?.enabled,
  });
}

export function useService(serviceId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.services.detail(serviceId),
    queryFn: () => catalogApi.getService(serviceId!),
    enabled: Boolean(serviceId),
  });
}

export function useSearchServices(search: string, params?: ListCatalogParams) {
  return useQuery({
    queryKey: queryKeys.services.search(search, params),
    queryFn: () => catalogApi.searchServices(search, params),
    enabled: search.trim().length > 0,
  });
}

export function useAddOns(params?: ListAddOnsParams) {
  return useQuery({
    queryKey: queryKeys.addOns.all(params),
    queryFn: () => catalogApi.getAddOns(params),
    enabled: Boolean(params?.service || params?.serviceGroup),
  });
}
