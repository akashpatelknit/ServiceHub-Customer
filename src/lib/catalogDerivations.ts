import type { Service, ServiceGroup } from '@/api/types';

export interface ServiceGroupSection {
  serviceGroup: ServiceGroup;
  services: Service[];
}

/** Groups a flat services pool by ServiceGroup for the listing page's sectioned layout — one fetch instead of N+1 per-group queries. */
export function groupServicesByServiceGroup(services: Service[], serviceGroups: ServiceGroup[]): ServiceGroupSection[] {
  const servicesByGroupId = new Map<string, Service[]>();
  for (const service of services) {
    const list = servicesByGroupId.get(service.serviceGroup) ?? [];
    list.push(service);
    servicesByGroupId.set(service.serviceGroup, list);
  }

  return [...serviceGroups]
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
    .map((serviceGroup) => ({ serviceGroup, services: servicesByGroupId.get(serviceGroup._id) ?? [] }))
    .filter((section) => section.services.length > 0);
}

export interface CatalogFilters {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

/** Client-side only — the catalog API has no price/rating filter params, so this narrows whatever pool was already fetched. */
export function applyFilters(services: Service[], filters: CatalogFilters): Service[] {
  return services.filter((service) => {
    if (filters.minPrice !== undefined && service.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && service.price > filters.maxPrice) return false;
    if (filters.minRating !== undefined && service.rating.average < filters.minRating) return false;
    return true;
  });
}
