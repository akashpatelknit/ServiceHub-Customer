import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { DEFAULT_LOCATION_LABEL } from '@/lib/config';

/** Display-only for now — the backend has no serviceability/location API to select against. */
export function LocationSelector() {
  return (
    <button
      type="button"
      onClick={() => toast('Location selection is coming soon')}
      className="hidden shrink-0 items-center gap-1 rounded-pill px-2 py-1.5 text-sm text-ink-primary hover:bg-surface-hover md:flex"
    >
      <MapPin className="size-4 text-primary" />
      <span className="font-medium">{DEFAULT_LOCATION_LABEL}</span>
    </button>
  );
}
