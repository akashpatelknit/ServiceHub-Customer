import { useMemo, useState } from 'react';
import type { Service, ServiceGroup } from '@/api/types';
import { CatalogFilterBar } from '@/components/catalog/CatalogFilterBar';
import { ServiceGrid } from '@/components/catalog/ServiceGrid';
import { Breadcrumb, type BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { applyFilters, type CatalogFilters, groupServicesByServiceGroup } from '@/lib/catalogDerivations';

interface CatalogListingProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  services: Service[];
  serviceGroups: ServiceGroup[];
  isLoading: boolean;
}

/** Shared by the category and subcategory listing pages: breadcrumb + title + filter bar + ServiceGroup-sectioned grid. */
export function CatalogListing({ title, breadcrumbItems, services, serviceGroups, isLoading }: CatalogListingProps) {
  const [filters, setFilters] = useState<CatalogFilters>({});

  const filteredServices = useMemo(() => applyFilters(services, filters), [services, filters]);
  const sections = useMemo(() => groupServicesByServiceGroup(filteredServices, serviceGroups), [filteredServices, serviceGroups]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="mt-2 text-2xl font-semibold text-ink-primary sm:text-3xl">{title}</h1>

      <CatalogFilterBar filters={filters} onChange={setFilters} />

      {isLoading ? (
        <div className="flex flex-wrap gap-4 pt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-56 rounded-card sm:w-64" />
          ))}
        </div>
      ) : sections.length === 0 ? (
        <ServiceGrid services={[]} emptyTitle="No services found" emptyDescription="Try adjusting your filters." />
      ) : (
        <div className="divide-y divide-border">
          {sections.map(({ serviceGroup, services: groupServices }) => (
            <section key={serviceGroup._id} className="py-6">
              <h2 className="mb-4 text-lg font-semibold text-ink-primary">{serviceGroup.name}</h2>
              <ServiceGrid services={groupServices} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
