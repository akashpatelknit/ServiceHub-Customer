import { SPOTLIGHT_BANNERS } from '@/lib/config';
import { cn } from '@/lib/utils';

/** Static/config-driven promo carousel — see lib/config.ts for why (Banner model exists but isn't mounted yet). */
export function SpotlightRow() {
  return (
    <section className="py-6">
      <h2 className="mb-3 text-lg font-semibold text-ink-primary sm:text-xl">In the spotlight</h2>
      <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
        {SPOTLIGHT_BANNERS.map((banner) => (
          <div
            key={banner._id}
            className={cn(
              'flex h-36 w-72 shrink-0 flex-col justify-end overflow-hidden rounded-card bg-gradient-to-br p-4 text-white sm:w-80',
              banner.gradientClassName,
            )}
          >
            <h3 className="text-lg font-semibold">{banner.title}</h3>
            {banner.subtitle && <p className="text-sm text-white/85">{banner.subtitle}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
