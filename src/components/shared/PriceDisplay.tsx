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
      <div className="flex items-baseline gap-1.5">
        <span className={cn('font-semibold text-ink-primary', size === 'md' ? 'text-base' : 'text-sm')}>
          {formatInr(price)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-xs text-ink-muted line-through">{formatInr(mrp)}</span>
            <span className="text-xs font-medium text-primary">{discountPercent}% off</span>
          </>
        )}
      </div>
      {unitPriceLabel && <span className="text-xs text-ink-secondary">{unitPriceLabel}</span>}
    </div>
  );
}
