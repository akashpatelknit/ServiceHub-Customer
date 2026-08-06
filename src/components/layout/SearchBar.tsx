import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SEARCH_PLACEHOLDER_SUGGESTIONS } from '@/lib/config';

/**
 * Header search entry point — submits straight to /search?q=. The debounced
 * search-as-you-type behavior lives on the /search results page itself (Listing
 * phase), not here.
 */
export function SearchBar() {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % SEARCH_PLACEHOLDER_SUGGESTIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const query = value.trim();
    if (query) {
      void navigate({ to: '/search', search: { q: query } });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={SEARCH_PLACEHOLDER_SUGGESTIONS[placeholderIndex]}
        className="rounded-pill border-line bg-surface-sunken pl-9"
        aria-label="Search for a service"
      />
    </form>
  );
}
