import type { Category, Service, Subcategory } from '@/api/types';
import { NEW_SERVICE_WINDOW_DAYS } from '@/lib/config';

/** Top N services by rating.count — there's no backend sort param, so this derives from a bounded fetched pool (see routes/index.tsx). Returns [] if nothing has any bookings yet, rather than showing a misleading all-zero "most booked" row. */
export function pickMostBooked(services: Service[], limit = 10): Service[] {
  if (!services.some((s) => s.rating.count > 0)) return [];
  return [...services].sort((a, b) => b.rating.count - a.rating.count).slice(0, limit);
}

/** Proxy for a real isFeatured/isNew flag (doesn't exist on Service) — createdAt within the configured window, newest first. */
export function pickNewAndNoteworthy(services: Service[], limit = 10): Service[] {
  const cutoff = Date.now() - NEW_SERVICE_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  return services
    .filter((s) => new Date(s.createdAt).getTime() >= cutoff)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export interface SubcategoryRow {
  subcategory: Subcategory;
  category: Category;
  services: Service[];
}

/**
 * Picks the subcategories with the most services in the fetched pool (e.g. "Spa for
 * Women" style rows) — dynamic rather than hardcoded, since real subcategory names
 * vary by what's actually seeded.
 */
export function pickSubcategoryRows(
  services: Service[],
  subcategories: Subcategory[],
  categories: Category[],
  { rowCount = 2, minServices = 3, servicesPerRow = 10 } = {},
): SubcategoryRow[] {
  const subcategoryById = new Map(subcategories.map((s) => [s._id, s]));
  const categoryById = new Map(categories.map((c) => [c._id, c]));

  const servicesBySubcategory = new Map<string, Service[]>();
  for (const service of services) {
    const list = servicesBySubcategory.get(service.subcategory) ?? [];
    list.push(service);
    servicesBySubcategory.set(service.subcategory, list);
  }

  return Array.from(servicesBySubcategory.entries())
    .filter(([, list]) => list.length >= minServices)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, rowCount)
    .map(([subcategoryId, list]) => {
      const subcategory = subcategoryById.get(subcategoryId);
      const category = subcategory ? categoryById.get(subcategory.category) : undefined;
      return subcategory && category ? { subcategory, category, services: list.slice(0, servicesPerRow) } : null;
    })
    .filter((row): row is SubcategoryRow => row !== null);
}
