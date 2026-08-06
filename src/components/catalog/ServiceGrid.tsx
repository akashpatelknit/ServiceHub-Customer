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

/** Wrapping grid for listing/search pages — <ServiceCard /> is fixed-width for the horizontal ServiceCardRow, so this grid just lets it wrap naturally rather than forcing a stretch. */
export function ServiceGrid({ services, isLoading, emptyTitle = 'No services found', emptyDescription }: ServiceGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-56 rounded-card sm:w-64" />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return <EmptyState icon={SearchX} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
}
