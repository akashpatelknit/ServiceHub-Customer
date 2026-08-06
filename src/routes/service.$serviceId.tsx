import { useMemo, useState } from 'react';
import { createRoute } from '@tanstack/react-router';
import { Clock, PackageX } from 'lucide-react';
import { toast } from 'sonner';
import { AddOnToggle } from '@/components/catalog/AddOnToggle';
import { RatingStars } from '@/components/catalog/RatingStars';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { EmptyState } from '@/components/shared/EmptyState';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Skeleton } from '@/components/ui/skeleton';
import { useAddOns, useCategory, useService, useSubcategory } from '@/queries/useCatalogQueries';
import { useAddToCart } from '@/queries/useCartQueries';
import { Route as RootRoute } from './__root';

function ServiceDetailPage() {
  const { serviceId } = Route.useParams();
  const { data: service, isLoading: serviceLoading, isError } = useService(serviceId);
  const { data: category } = useCategory(service?.category);
  const { data: subcategory } = useSubcategory(service?.subcategory);
  const { data: addOnsData } = useAddOns({ service: serviceId, isActive: 'true' });
  const addToCart = useAddToCart();

  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const addOns = useMemo(() => addOnsData?.items ?? [], [addOnsData]);

  const total = useMemo(() => {
    if (!service) return 0;
    const addonsTotal = addOns.filter((a) => selectedAddonIds.includes(a._id)).reduce((sum, a) => sum + a.price, 0);
    return service.price + addonsTotal;
  }, [service, addOns, selectedAddonIds]);

  const toggleAddon = (addonId: string, checked: boolean) => {
    setSelectedAddonIds((prev) => (checked ? [...prev, addonId] : prev.filter((id) => id !== addonId)));
  };

  const handleAddToCart = () => {
    if (!service) return;
    const selectedAddonObjects = addOns.filter((a) => selectedAddonIds.includes(a._id));
    addToCart.mutate(
      { service, selectedAddons: selectedAddonObjects },
      {
        onSuccess: () => toast.success(`${service.name} added to cart`),
        onError: (error: unknown) => {
          const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : undefined;
          toast.error(message ?? 'Could not add to cart');
        },
      },
    );
  };

  if (serviceLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="mt-4 h-72 w-full rounded-card" />
        <Skeleton className="mt-4 h-8 w-1/2" />
        <Skeleton className="mt-2 h-24 w-full" />
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <EmptyState icon={PackageX} title="Service not found" actionLabel="Back to home" actionLink={{ to: '/' }} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 pb-28 sm:pb-6">
      <Breadcrumb
        items={[
          ...(category ? [{ label: category.name, link: { to: '/category/$categorySlug' as const, params: { categorySlug: category.slug } } }] : []),
          ...(category && subcategory
            ? [
                {
                  label: subcategory.name,
                  link: {
                    to: '/category/$categorySlug/$subcategorySlug' as const,
                    params: { categorySlug: category.slug, subcategorySlug: subcategory.slug },
                  },
                },
              ]
            : []),
          { label: service.name },
        ]}
      />

      <div className="mt-4 overflow-hidden rounded-card bg-muted">
        <ImageWithFallback src={service.images[0]?.url} alt={service.name} className="max-h-96 w-full object-cover" />
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-primary">{service.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <RatingStars average={service.rating.average} count={service.rating.count} />
            <span className="flex items-center gap-1 text-sm text-ink-secondary">
              <Clock className="size-4" />
              {service.durationMins} mins
            </span>
          </div>
        </div>
        <PriceDisplay price={service.price} mrp={service.mrp} unitPriceLabel={service.unitPriceLabel} className="sm:items-end sm:text-right" />
      </div>

      {service.bullets.length > 0 && (
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {service.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-secondary">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              {bullet}
            </li>
          ))}
        </ul>
      )}

      {service.description && (
        <div className="mt-6">
          <h2 className="text-base font-semibold text-ink-primary">About this service</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-ink-secondary">{service.description}</p>
        </div>
      )}

      {addOns.length > 0 && (
        <div className="mt-6">
          <h2 className="text-base font-semibold text-ink-primary">Add-ons</h2>
          <div className="mt-3 flex flex-col gap-2">
            {addOns.map((addOn) => (
              <AddOnToggle
                key={addOn._id}
                addOn={addOn}
                checked={selectedAddonIds.includes(addOn._id)}
                onCheckedChange={(checked) => toggleAddon(addOn._id, checked)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 hidden sm:block">
        <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={addToCart.isPending}>
          Add to cart · ₹{total.toLocaleString('en-IN')}
        </Button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card p-4 sm:hidden">
        <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={addToCart.isPending}>
          Add to cart · ₹{total.toLocaleString('en-IN')}
        </Button>
      </div>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/service/$serviceId',
  component: ServiceDetailPage,
});
