import { useEffect, useMemo, useState } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { z } from 'zod';
import { CatalogFilterBar } from '@/components/catalog/CatalogFilterBar';
import { ServiceGrid } from '@/components/catalog/ServiceGrid';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { applyFilters, type CatalogFilters } from '@/lib/catalogDerivations';
import { useSearchServices } from '@/queries/useCatalogQueries';
import { Route as RootRoute } from './__root';

const searchParamsSchema = z.object({
  q: z.string().optional().default(''),
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [inputValue, setInputValue] = useState(q);
  const [filters, setFilters] = useState<CatalogFilters>({});
  const debouncedQuery = useDebounce(inputValue, 300);

  useEffect(() => {
    void navigate({ search: { q: debouncedQuery }, replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const { data, isLoading, isFetching } = useSearchServices(debouncedQuery);
  const results = useMemo(() => applyFilters(data?.items ?? [], filters), [data, filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search for a service"
          className="pl-9"
          autoFocus
        />
      </div>

      {debouncedQuery.trim() ? (
        <>
          <h1 className="mt-4 text-lg font-semibold text-ink-primary">
            {isLoading || isFetching ? 'Searching…' : `${results.length} result${results.length === 1 ? '' : 's'} for "${debouncedQuery}"`}
          </h1>

          <CatalogFilterBar filters={filters} onChange={setFilters} />

          <div className="pt-4">
            <ServiceGrid
              services={results}
              isLoading={isLoading}
              emptyTitle="No services found"
              emptyDescription={`We couldn't find anything matching "${debouncedQuery}". Try a different search.`}
            />
          </div>
        </>
      ) : (
        <p className="mt-6 text-ink-secondary">Start typing to search for a service.</p>
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
