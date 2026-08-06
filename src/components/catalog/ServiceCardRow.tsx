import { Link, type LinkProps } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import type { Service } from '@/api/types';
import { ServiceCard } from '@/components/catalog/ServiceCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ServiceCardRowProps {
  title: string;
  services: Service[];
  seeAllLink?: LinkProps;
  isLoading?: boolean;
}

/**
 * Single reusable horizontal row (title + "See all" + scrollable cards) — used for
 * every homepage row (Spotlight excluded, banners aren't services) and listing pages.
 * Renders nothing once loaded if there's no data, rather than showing an empty shell.
 */
export function ServiceCardRow({ title, services, seeAllLink, isLoading }: ServiceCardRowProps) {
  if (!isLoading && services.length === 0) return null;

  return (
    <section className="py-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink-primary sm:text-xl">{title}</h2>
        {seeAllLink && (
          <Link {...seeAllLink} className="flex items-center gap-0.5 text-sm font-medium text-ink-link hover:underline">
            See all
            <ChevronRight className="size-4" />
          </Link>
        )}
      </div>

      <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 w-56 shrink-0 rounded-card sm:w-64" />)
          : services.map((service) => <ServiceCard key={service._id} service={service} />)}
      </div>
    </section>
  );
}
