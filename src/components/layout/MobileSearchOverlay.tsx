import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { SearchSuggestionsList } from '@/components/layout/SearchSuggestionsList';
import { useSearchBox } from '@/hooks/useSearchBox';

/**
 * Mobile counterpart to SearchBar: a header icon that expands into a full-width
 * overlay input instead of a small dropdown, per the responsive header spec. Same
 * useSearchBox logic as desktop, different presentation container.
 */
export function MobileSearchOverlay() {
  const [open, setOpen] = useState(false);
  const box = useSearchBox(() => setOpen(false));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex size-10 items-center justify-center rounded-full text-ink-primary hover:bg-surface-hover"
        aria-label="Search"
      >
        <Search className="size-5" />
      </button>

      <Sheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) box.reset();
        }}
      >
        <SheetContent side="top" className="flex h-dvh flex-col gap-0 p-0">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              box.goToFullResults(box.value);
            }}
            className="border-b border-border p-3 pr-12"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
              <Input
                autoFocus
                value={box.value}
                onChange={(event) => box.setValue(event.target.value)}
                onKeyDown={box.handleKeyDown}
                placeholder="Search for a service, category..."
                className="pl-9"
                aria-label="Search for a service"
              />
            </div>
          </form>

          <div className="flex-1 overflow-y-auto p-1">
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
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
