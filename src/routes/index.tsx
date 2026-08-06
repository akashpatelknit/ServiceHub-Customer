import { createRoute } from '@tanstack/react-router';
import { ServiceCardRow } from '@/components/catalog/ServiceCardRow';
import { Hero } from '@/components/home/Hero';
import { SpotlightRow } from '@/components/home/SpotlightRow';
import { TrustStrip } from '@/components/home/TrustStrip';
import { pickMostBooked, pickNewAndNoteworthy, pickSubcategoryRows } from '@/lib/homeDerivations';
import { useCategories, useServices, useSubcategories } from '@/queries/useCatalogQueries';
import { Route as RootRoute } from './__root';

// No backend sort/"featured" support exists yet (see homeDerivations.ts), so the
// homepage fetches one bounded, active-only pool of categories/subcategories/services
// and derives the New/Most-booked/category rows from it client-side.
const CATALOG_POOL_LIMIT = 100;

function HomePage() {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({ isActive: 'true', limit: CATALOG_POOL_LIMIT });
  const { data: subcategoriesData } = useSubcategories({ isActive: 'true', limit: CATALOG_POOL_LIMIT });
  const { data: servicesData, isLoading: servicesLoading } = useServices({ isActive: 'true', limit: CATALOG_POOL_LIMIT });

  const categories = categoriesData?.items ?? [];
  const subcategories = subcategoriesData?.items ?? [];
  const services = servicesData?.items ?? [];

  const mostBooked = pickMostBooked(services);
  const newAndNoteworthy = pickNewAndNoteworthy(services);
  const subcategoryRows = pickSubcategoryRows(services, subcategories, categories);

  return (
    <div>
      <Hero categories={categories} collageServices={services.slice(0, 4)} isLoading={categoriesLoading} />
      <TrustStrip />

      <div className="mx-auto max-w-7xl divide-y divide-border px-4">
        <SpotlightRow />
        <ServiceCardRow title="New and noteworthy" services={newAndNoteworthy} isLoading={servicesLoading} />
        <ServiceCardRow title="Most booked services" services={mostBooked} isLoading={servicesLoading} />

        {subcategoryRows.map(({ subcategory, category, services: rowServices }) => (
          <ServiceCardRow
            key={subcategory._id}
            title={subcategory.name}
            services={rowServices}
            seeAllLink={{
              to: '/category/$categorySlug/$subcategorySlug',
              params: { categorySlug: category.slug, subcategorySlug: subcategory.slug },
            }}
          />
        ))}
      </div>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: HomePage,
});
