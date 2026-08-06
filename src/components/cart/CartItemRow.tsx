import { AlertTriangle, Minus, Plus, Trash2 } from 'lucide-react';
import type { CartRowItem } from '@/lib/cartDerivations';
import { cartRowTotal } from '@/lib/cartDerivations';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { cn } from '@/lib/utils';

interface CartItemRowProps {
  item: CartRowItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  isUpdating?: boolean;
}

export function CartItemRow({ item, onQuantityChange, onRemove, isUpdating }: CartItemRowProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-b-0">
      {item.unavailable && (
        <div className="flex items-center gap-2 rounded-md bg-status-inactive-bg px-3 py-2 text-sm text-status-inactive-text">
          <AlertTriangle className="size-4 shrink-0" />
          This service is no longer available. Please remove it to continue.
        </div>
      )}

      <div className={cn('flex gap-3', item.unavailable && 'opacity-60')}>
        <div className="size-20 shrink-0 overflow-hidden rounded-md bg-muted">
          <ImageWithFallback src={item.image?.url} alt={item.name} className="size-full object-cover" />
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <p className="text-sm font-medium text-ink-primary">{item.name}</p>
          {item.durationMins != null && <p className="text-xs text-ink-secondary">{item.durationMins} mins</p>}

          {item.addons.length > 0 && (
            <ul className="mt-1 space-y-0.5">
              {item.addons.map((addon) => (
                <li key={addon.id} className="text-xs text-ink-secondary">
                  + {addon.name ?? 'Add-on'} {addon.price != null && `(₹${addon.price.toLocaleString('en-IN')})`}
                  {addon.unavailable && <span className="ml-1 text-status-inactive-text">unavailable</span>}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-center rounded-md border border-line">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-none"
                disabled={item.unavailable || isUpdating || item.quantity <= 1}
                onClick={() => onQuantityChange(item.quantity - 1)}
                aria-label="Decrease quantity"
              >
                <Minus className="size-3.5" />
              </Button>
              <span className="w-8 text-center text-sm font-medium text-ink-primary">{item.quantity}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-none"
                disabled={item.unavailable || isUpdating}
                onClick={() => onQuantityChange(item.quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="size-3.5" />
              </Button>
            </div>

            <span className="text-sm font-semibold text-ink-primary">₹{cartRowTotal(item).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-ink-muted hover:bg-danger-subtle hover:text-danger"
          onClick={onRemove}
          aria-label="Remove item"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
