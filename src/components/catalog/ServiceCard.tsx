import type { MouseEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Service } from '@/api/types';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { RatingStars } from '@/components/catalog/RatingStars';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { useAddToCart } from '@/queries/useCartQueries';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  className?: string;
}

/**
 * Reused across the homepage rows, listing grids, and search results. Clicking the
 * card navigates to the service detail page; clicking "Add" adds directly to the
 * cart without navigating away (same interaction pattern as the InstaHelp reference).
 */
export function ServiceCard({ service, className }: ServiceCardProps) {
  const addToCart = useAddToCart();

  const handleAdd = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart.mutate(
      { service },
      {
        onSuccess: () => toast.success(`${service.name} added to cart`),
        onError: (error: unknown) => {
          const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : undefined;
          toast.error(message ?? 'Could not add to cart');
        },
      },
    );
  };

  return (
    <Link
      to="/service/$serviceId"
      params={{ serviceId: service._id }}
      className={cn(
        'flex w-56 shrink-0 flex-col overflow-hidden rounded-card border border-border bg-card transition-shadow hover:shadow-card-light dark:hover:shadow-card-dark sm:w-64',
        className,
      )}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        <ImageWithFallback src={service.images[0]?.url} alt={service.name} className="size-full object-cover" loading="lazy" />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-ink-primary">{service.name}</h3>
        <RatingStars average={service.rating.average} count={service.rating.count} size="sm" />

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <PriceDisplay price={service.price} mrp={service.mrp} unitPriceLabel={service.unitPriceLabel} size="sm" />
          <Button
            size="sm"
            variant="outline"
            className="h-8 shrink-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={handleAdd}
            disabled={addToCart.isPending}
          >
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>
      </div>
    </Link>
  );
}
