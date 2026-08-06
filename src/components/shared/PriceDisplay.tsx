import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  mrp?: number;
  unitPriceLabel?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const formatInr = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export function PriceDisplay({ price, mrp, unitPriceLabel, size = 'md', className }: PriceDisplayProps) {
  const hasDiscount = typeof mrp === 'number' && mrp > price;
  const discountPercent = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <div className={cn('flex flex-col', className)}>
      {/* flex-wrap + whitespace-nowrap per span: if space runs out, "₹mrp 12% off" drops
          to its own line as whole units — it never breaks a span mid-word (e.g. "12%" / "off"). */}
      <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
        <span className={cn('whitespace-nowrap font-semibold text-ink-primary', size === 'md' ? 'text-base' : 'text-sm')}>
          {formatInr(price)}
        </span>
        {hasDiscount && (
          <>
            <span className="whitespace-nowrap text-xs text-ink-muted line-through">{formatInr(mrp)}</span>
            <span className="whitespace-nowrap text-xs font-medium text-primary">{discountPercent}% off</span>
          </>
        )}
      </div>
      {unitPriceLabel && <span className="text-xs text-ink-secondary">{unitPriceLabel}</span>}
    </div>
  );
}
