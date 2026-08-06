import type { CartLineItem } from '@/api/types';
import { cartRowTotal, normalizeServerItem } from '@/lib/cartDerivations';

interface OrderSummaryProps {
  items: CartLineItem[];
}

/** Read-only line items for checkout — reuses the same cart data/derivation as the Cart page, but without CartItemRow's quantity/remove controls (checkout isn't where you edit the cart). */
export function OrderSummary({ items }: OrderSummaryProps) {
  const rows = items.map(normalizeServerItem);
  const total = rows.reduce((sum, row) => sum + cartRowTotal(row), 0);

  return (
    <div className="rounded-card border border-border bg-card p-5">
      <h2 className="text-base font-semibold text-ink-primary">Order summary</h2>

      <div className="mt-4 flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.id} className="flex items-start justify-between gap-3 text-sm">
            <div>
              <p className="font-medium text-ink-primary">{row.name}</p>
              {row.addons.map((addon) => (
                <p key={addon.id} className="text-xs text-ink-secondary">
                  + {addon.name}
                </p>
              ))}
              <p className="text-xs text-ink-secondary">Qty {row.quantity}</p>
            </div>
            <span className="shrink-0 font-medium text-ink-primary">₹{cartRowTotal(row).toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-base font-semibold">
        <span className="text-ink-primary">Total</span>
        <span className="text-ink-primary">₹{total.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}
