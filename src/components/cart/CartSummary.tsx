import { Button } from '@/components/ui/button';

interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
  hasUnavailableItems: boolean;
  onCheckout: () => void;
  variant?: 'sidebar' | 'bar';
}

const formatInr = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export function CartSummary({ itemCount, subtotal, hasUnavailableItems, onCheckout, variant = 'sidebar' }: CartSummaryProps) {
  if (variant === 'bar') {
    return (
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card px-4 py-3">
        {hasUnavailableItems && (
          <p className="mb-2 text-center text-xs text-status-inactive-text">Remove unavailable items to continue</p>
        )}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-ink-secondary">
              {itemCount} item{itemCount === 1 ? '' : 's'}
            </p>
            <p className="text-lg font-semibold text-ink-primary">{formatInr(subtotal)}</p>
          </div>
          <Button size="lg" onClick={onCheckout} disabled={hasUnavailableItems}>
            Proceed to checkout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-border bg-card p-5">
      <h2 className="text-base font-semibold text-ink-primary">Price summary</h2>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-ink-secondary">
          Subtotal ({itemCount} item{itemCount === 1 ? '' : 's'})
        </span>
        <span className="text-ink-primary">{formatInr(subtotal)}</span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-base font-semibold">
        <span className="text-ink-primary">Total</span>
        <span className="text-ink-primary">{formatInr(subtotal)}</span>
      </div>

      {hasUnavailableItems && (
        <p className="mt-3 text-xs text-status-inactive-text">Remove unavailable items from your cart to proceed.</p>
      )}

      <Button size="lg" className="mt-4 w-full" onClick={onCheckout} disabled={hasUnavailableItems}>
        Proceed to checkout
      </Button>
    </div>
  );
}
