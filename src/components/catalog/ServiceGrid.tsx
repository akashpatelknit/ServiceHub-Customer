import { SearchX } from 'lucide-react';
import type { Service } from '@/api/types';
import { ServiceCard } from '@/components/catalog/ServiceCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';

interface ServiceGridProps {
  services: Service[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

/**
 * Responsive grid for listing/search pages. <ServiceCard /> is fixed-width by default
 * (it's shared with the horizontal-scroll ServiceCardRow, which needs that), so here
 * it's overridden to fill its grid cell — a plain `flex flex-wrap` of fixed-width cards
 * left a dead gap on the right on narrow screens where only one card fit per row.
 */
export function ServiceGrid({ services, isLoading, emptyTitle = 'No services found', emptyDescription }: ServiceGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-card sm:h-72" />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return <EmptyState icon={SearchX} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} className="w-full sm:w-full" />
      ))}
    </div>
  );
}
