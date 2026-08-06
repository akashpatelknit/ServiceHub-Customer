import { ArrowRight, LayoutGrid } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { SearchResponse } from '@/api/types';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Skeleton } from '@/components/ui/skeleton';
import { categoryLinkFor, type FlatSearchItem } from '@/hooks/useSearchBox';
import { cn } from '@/lib/utils';

interface SearchSuggestionsListProps {
  query: string;
  data?: SearchResponse;
  isLoading: boolean;
  activeIndex: number;
  flatItems: FlatSearchItem[];
  onSelect: (item: FlatSearchItem) => void;
  onHover: (index: number) => void;
  onSeeAll: () => void;
}

const formatInr = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

/**
 * Shared dropdown/overlay body for both the desktop popover SearchBar and the mobile
 * full-screen search overlay. Section headings only render when that group actually
 * has results (an empty "Products" heading with nothing under it would be confusing).
 */
export function SearchSuggestionsList({ query, data, isLoading, activeIndex, flatItems, onSelect, onHover, onSeeAll }: SearchSuggestionsListProps) {
  if (!query) return null;

  if (isLoading) {
    return (
      <div className="space-y-2 p-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-2 py-2">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        ))}
      </div>
    );
  }

  const hasResults = flatItems.length > 0;
  let flatIndex = -1;

  return (
    <div>
      {!hasResults && (
        <p className="px-3 py-6 text-center text-sm text-ink-secondary">No results for &ldquo;{query}&rdquo;</p>
      )}

      {data && data.categories.length > 0 && (
        <div className="pb-1">
          <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-ink-muted">Categories</p>
          {data.categories.map((category) => {
            flatIndex += 1;
            const index = flatIndex;
            return (
              <Link
                key={category.id}
                {...categoryLinkFor(category)}
                onMouseEnter={() => onHover(index)}
                onClick={() => onSelect({ kind: 'category', item: category })}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-primary hover:bg-surface-hover',
                  activeIndex === index && 'bg-surface-hover',
                )}
              >
                <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                  <ImageWithFallback src={category.image?.url} alt="" className="size-full object-cover" />
                </span>
                <span className="truncate">{category.name}</span>
              </Link>
            );
          })}
        </div>
      )}

      {data && data.services.length > 0 && (
        <div className="pb-1">
          <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-ink-muted">Services</p>
          {data.services.map((service) => {
            flatIndex += 1;
            const index = flatIndex;
            return (
              <Link
                key={service.id}
                to="/service/$serviceId"
                params={{ serviceId: service.id }}
                onMouseEnter={() => onHover(index)}
                onClick={() => onSelect({ kind: 'service', item: service })}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-primary hover:bg-surface-hover',
                  activeIndex === index && 'bg-surface-hover',
                )}
              >
                <span className="size-9 shrink-0 overflow-hidden rounded-md bg-muted">
                  <ImageWithFallback src={service.image?.url} alt="" className="size-full object-cover" />
                </span>
                <span className="min-w-0 flex-1 truncate">{service.name}</span>
                <span className="shrink-0 text-xs font-medium text-ink-secondary">{formatInr(service.price)}</span>
              </Link>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={onSeeAll}
        className="flex w-full items-center justify-between gap-2 border-t border-border px-3 py-2.5 text-sm font-medium text-ink-link hover:bg-surface-hover"
      >
        <span className="flex items-center gap-2">
          <LayoutGrid className="size-4" />
          See all results for &ldquo;{query}&rdquo;
        </span>
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
