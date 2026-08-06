import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  average: number;
  count: number;
  size?: 'sm' | 'md';
  className?: string;
}

function formatReviewCount(count: number): string {
  if (count >= 100000) return `${(count / 100000).toFixed(1)}L`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

export function RatingStars({ average, count, size = 'md', className }: RatingStarsProps) {
  if (count === 0) {
    return <span className={cn('text-xs text-ink-muted', className)}>No ratings yet</span>;
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span className="flex items-center gap-0.5 rounded bg-status-active-bg px-1.5 py-0.5 text-status-active-text">
        <Star className={cn('fill-current', size === 'md' ? 'size-3.5' : 'size-3')} />
        <span className={cn('font-medium', size === 'md' ? 'text-xs' : 'text-[11px]')}>{average.toFixed(1)}</span>
      </span>
      <span className="text-xs text-ink-muted">({formatReviewCount(count)})</span>
    </div>
  );
}
