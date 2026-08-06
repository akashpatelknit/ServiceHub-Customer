import type { Category, Service } from '@/api/types';
import { CategoryGrid } from '@/components/catalog/CategoryGrid';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

interface HeroProps {
  categories: Category[];
  collageServices: Service[];
  isLoading?: boolean;
}

/** 4-image collage — built from real seeded service photos rather than stock imagery, gracefully falling back to a branded placeholder tile if fewer than 4 are available. */
function ImageCollage({ services }: { services: Service[] }) {
  const images = services.map((s) => s.images[0]?.url).filter((url): url is string => Boolean(url));

  return (
    <div className="grid h-full grid-cols-2 grid-rows-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-card bg-primary-subtle">
          {images[i] ? (
            <ImageWithFallback src={images[i]} alt="" className="size-full object-cover" loading="lazy" />
          ) : (
            <div className="flex size-full items-center justify-center">
              <img src="/servicehub-icon.svg" alt="" className="size-10 opacity-40" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function Hero({ categories, collageServices, isLoading }: HeroProps) {
  return (
    <section className="border-b border-border bg-gradient-to-b from-primary-subtle to-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-ink-primary sm:text-4xl">Home services at your doorstep</h1>
            <p className="mt-2 text-ink-secondary">Verified professionals for every home service, booked in minutes.</p>
            <div className="mt-6">
              <CategoryGrid categories={categories} isLoading={isLoading} />
            </div>
          </div>

          <div className="hidden h-80 sm:block">
            <ImageCollage services={collageServices} />
          </div>
        </div>
      </div>
    </section>
  );
}
