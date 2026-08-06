import { useEffect, useMemo, useState } from 'react';
import { createRoute, Link, useNavigate } from '@tanstack/react-router';
import { Search, SearchX } from 'lucide-react';
import { z } from 'zod';
import { CatalogFilterBar } from '@/components/catalog/CatalogFilterBar';
import { ServiceGrid } from '@/components/catalog/ServiceGrid';
import { EmptyState } from '@/components/shared/EmptyState';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { categoryLinkFor } from '@/hooks/useSearchBox';
import { applyFilters, type CatalogFilters } from '@/lib/catalogDerivations';
import { useCategories, useSearchServices } from '@/queries/useCatalogQueries';
import { useFullSearch } from '@/queries/useSearchQueries';
import { Route as RootRoute } from './__root';

const searchParamsSchema = z.object({
  q: z.string().optional().default(''),
});

const FULL_SERVICE_LIMIT = 20;

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [inputValue, setInputValue] = useState(q);
  const [filters, setFilters] = useState<CatalogFilters>({});
  const debouncedQuery = useDebounce(inputValue, 300);
  const trimmedQuery = debouncedQuery.trim();

  useEffect(() => {
    void navigate({ search: { q: debouncedQuery }, replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const { data: searchData, isLoading: isCategoriesLoading } = useFullSearch(trimmedQuery);
  const { data: servicesData, isLoading: isServicesLoading, isFetching: isServicesFetching } = useSearchServices(trimmedQuery, {
    limit: FULL_SERVICE_LIMIT,
  });
  const { data: popularCategories } = useCategories({ isActive: 'true', limit: 6 });

  const services = useMemo(() => applyFilters(servicesData?.items ?? [], filters), [servicesData, filters]);
  const categories = searchData?.categories ?? [];

  const isLoading = isCategoriesLoading || isServicesLoading;
  const hasNoResults = !isLoading && categories.length === 0 && services.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search for a service, category..."
          className="pl-9"
          autoFocus
        />
      </div>

      {trimmedQuery ? (
        <>
          <h1 className="mt-4 text-lg font-semibold text-ink-primary">
            {isLoading || isServicesFetching ? 'Searching…' : `Results for "${trimmedQuery}"`}
          </h1>

          {hasNoResults ? (
            <EmptyState
              icon={SearchX}
              title="No results found"
              description={`We couldn't find anything matching "${trimmedQuery}". Try a different search, or browse categories instead.`}
              actionLabel="Browse homepage"
              actionLink={{ to: '/' }}
            >
              {popularCategories && popularCategories.items.length > 0 && (
                <div className="mt-4 w-full">
                  <p className="mb-3 text-sm font-medium text-ink-secondary">Popular categories</p>
                  <div className="grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-6">
                    {popularCategories.items.slice(0, 6).map((category) => (
                      <Link
                        key={category._id}
                        to="/category/$categorySlug"
                        params={{ categorySlug: category.slug }}
                        className="flex flex-col items-center gap-2 text-center"
                      >
                        <span className="flex size-14 items-center justify-center overflow-hidden rounded-full bg-muted">
                          <ImageWithFallback src={category.image?.url} alt="" className="size-full object-cover" />
                        </span>
                        <span className="line-clamp-2 text-xs text-ink-primary">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </EmptyState>
          ) : (
            <>
              {(isCategoriesLoading || categories.length > 0) && (
                <section className="mt-5">
                  <h2 className="mb-3 text-base font-semibold text-ink-primary">Categories</h2>
                  <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-1">
                    {isCategoriesLoading &&
                      Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex shrink-0 flex-col items-center gap-2">
                          <Skeleton className="size-16 rounded-full" />
                          <Skeleton className="h-3 w-14" />
                        </div>
                      ))}

                    {!isCategoriesLoading &&
                      categories.map((category) => (
                        <Link
                          key={category.id}
                          {...categoryLinkFor(category)}
                          className="flex shrink-0 flex-col items-center gap-2 text-center"
                        >
                          <span className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-muted">
                            <ImageWithFallback src={category.image?.url} alt="" className="size-full object-cover" />
                          </span>
                          <span className="line-clamp-2 w-16 text-xs text-ink-primary">{category.name}</span>
                        </Link>
                      ))}
                  </div>
                </section>
              )}

              <section className="mt-5">
                <h2 className="mb-1 text-base font-semibold text-ink-primary">Services</h2>
                <CatalogFilterBar filters={filters} onChange={setFilters} />
                <div className="pt-4">
                  <ServiceGrid
                    services={services}
                    isLoading={isServicesLoading}
                    emptyTitle="No services found"
                    emptyDescription={`We couldn't find any services matching "${trimmedQuery}".`}
                  />
                </div>
              </section>
            </>
          )}
        </>
      ) : (
        <p className="mt-6 text-ink-secondary">Start typing to search for a service or category.</p>
      )}
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/search',
  validateSearch: searchParamsSchema,
  component: SearchPage,
});
