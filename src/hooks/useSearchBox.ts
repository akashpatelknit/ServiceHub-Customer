import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { useLocation, useNavigate, useSearch } from '@tanstack/react-router';
import type { SearchCategoryResult, SearchServiceResult } from '@/api/types';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchSuggestions } from '@/queries/useSearchQueries';

export type FlatSearchItem = { kind: 'category'; item: SearchCategoryResult } | { kind: 'service'; item: SearchServiceResult };

function categoryLinkFor(item: SearchCategoryResult) {
  return item.type === 'subcategory'
    ? { to: '/category/$categorySlug/$subcategorySlug' as const, params: { categorySlug: item.categorySlug ?? '', subcategorySlug: item.slug } }
    : { to: '/category/$categorySlug' as const, params: { categorySlug: item.slug } };
}

/**
 * Shared data + keyboard-nav logic behind both the desktop popover SearchBar and the
 * mobile full-screen search overlay — same fetch/debounce/navigate behavior, only the
 * presentation container differs between the two call sites.
 */
export function useSearchBox(onClose?: () => void) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentSearch = useSearch({ strict: false }) as { q?: string };
  const [value, setValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedValue = useDebounce(value, 300);
  const trimmed = debouncedValue.trim();

  // Landing on /search?q=x (direct load or client-side nav) pre-fills this box with
  // "x", so the header input and the results page stay in sync. Only fires on
  // pathname change into /search, not on every keystroke-driven URL update the page
  // itself makes, so it doesn't fight with the user typing here.
  useEffect(() => {
    if (location.pathname === '/search') {
      setValue(currentSearch.q ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const { data, isLoading } = useSearchSuggestions(trimmed);

  const flatItems = useMemo<FlatSearchItem[]>(() => {
    if (!data) return [];
    return [
      ...data.categories.map((item): FlatSearchItem => ({ kind: 'category', item })),
      ...data.services.map((item): FlatSearchItem => ({ kind: 'service', item })),
    ];
  }, [data]);

  function reset() {
    setValue('');
    setActiveIndex(-1);
  }

  function goToItem(flat: FlatSearchItem) {
    if (flat.kind === 'category') {
      void navigate(categoryLinkFor(flat.item));
    } else {
      void navigate({ to: '/service/$serviceId', params: { serviceId: flat.item.id } });
    }
    reset();
    onClose?.();
  }

  function goToFullResults(rawQuery: string) {
    const query = rawQuery.trim();
    if (!query) return;
    void navigate({ to: '/search', search: { q: query } });
    reset();
    onClose?.();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (flatItems.length > 0) setActiveIndex((i) => (i + 1) % flatItems.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (flatItems.length > 0) setActiveIndex((i) => (i - 1 + flatItems.length) % flatItems.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const active = activeIndex >= 0 ? flatItems[activeIndex] : undefined;
      if (active) {
        goToItem(active);
      } else {
        goToFullResults(value);
      }
    } else if (event.key === 'Escape') {
      onClose?.();
    }
  }

  return {
    value,
    setValue,
    debouncedQuery: trimmed,
    data,
    isLoading: isLoading && trimmed.length > 0,
    activeIndex,
    setActiveIndex,
    flatItems,
    handleKeyDown,
    goToItem,
    goToFullResults,
    reset,
  };
}

export { categoryLinkFor };
