import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/api/searchApi';
import { queryKeys } from '@/lib/queryKeys';

/** Small per-group cap for the header's live-suggestions dropdown. */
export function useSearchSuggestions(query: string) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: queryKeys.search.suggestions(trimmed),
    queryFn: () => searchApi.search(trimmed),
    enabled: trimmed.length > 0,
  });
}

/** Larger per-group cap for the /search results page's Categories row. */
export function useFullSearch(query: string) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: queryKeys.search.full(trimmed),
    queryFn: () => searchApi.search(trimmed, { full: true }),
    enabled: trimmed.length > 0,
  });
}
