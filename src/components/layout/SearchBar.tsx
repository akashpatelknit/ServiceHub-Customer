import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { SearchSuggestionsList } from '@/components/layout/SearchSuggestionsList';
import { useSearchBox } from '@/hooks/useSearchBox';
import { SEARCH_PLACEHOLDER_SUGGESTIONS } from '@/lib/config';

/**
 * Header search entry point (desktop). Submitting (Enter, or the dropdown's "See
 * all") always navigates to /search?q=; the dropdown itself is quick preview/nav,
 * not a replacement for the full results page. Mobile gets its own overlay
 * container (MobileSearchOverlay) built on the same useSearchBox logic.
 */
export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const box = useSearchBox(() => setOpen(false));

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % SEARCH_PLACEHOLDER_SUGGESTIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Popover open={open && box.value.trim().length > 0} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            box.goToFullResults(box.value);
          }}
          className="relative w-full max-w-xl"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <Input
            value={box.value}
            onChange={(event) => {
              box.setValue(event.target.value);
              setOpen(true);
            }}
            onFocus={() => box.value.trim() && setOpen(true)}
            onKeyDown={box.handleKeyDown}
            placeholder={SEARCH_PLACEHOLDER_SUGGESTIONS[placeholderIndex]}
            className="rounded-pill border-line bg-surface-sunken pl-9"
            aria-label="Search for a service"
          />
        </form>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="w-[min(28rem,90vw)] max-h-[70vh] overflow-y-auto p-1"
      >
        <SearchSuggestionsList
          query={box.debouncedQuery}
          data={box.data}
          isLoading={box.isLoading}
          activeIndex={box.activeIndex}
          flatItems={box.flatItems}
          onSelect={box.goToItem}
          onHover={box.setActiveIndex}
          onSeeAll={() => box.goToFullResults(box.value)}
        />
      </PopoverContent>
    </Popover>
  );
}
