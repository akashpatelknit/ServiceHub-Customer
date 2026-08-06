import type { ProductOrderStatus, ServiceOrderStatus } from '@/api/types';
import { cn } from '@/lib/utils';

type OrderStatus = ServiceOrderStatus | ProductOrderStatus;

/**
 * Tone-per-status, same idea as service-hub-admin's StatusBadge (its color/status
 * mapping was the reference — not the component itself, that codebase is Ant Design,
 * not shadcn). Reuses only tokens already defined in this app's tailwind.config.ts —
 * status-pending/active/inactive (used elsewhere, e.g. CartItemRow, order-confirmation)
 * plus `violet`, which exists as a general accent color but wasn't yet used for status.
 */
const STATUS_META: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-status-pending-bg text-status-pending-text' },
  confirmed: { label: 'Confirmed', className: 'bg-violet-subtle text-violet-subtle-text' },
  assigned: { label: 'Assigned', className: 'bg-violet-subtle text-violet-subtle-text' },
  'in-progress': { label: 'In Progress', className: 'bg-violet-subtle text-violet-subtle-text' },
  packed: { label: 'Packed', className: 'bg-violet-subtle text-violet-subtle-text' },
  shipped: { label: 'Shipped', className: 'bg-violet-subtle text-violet-subtle-text' },
  completed: { label: 'Completed', className: 'bg-status-active-bg text-status-active-text' },
  delivered: { label: 'Delivered', className: 'bg-status-active-bg text-status-active-text' },
  returned: { label: 'Returned', className: 'bg-status-inactive-bg text-status-inactive-text' },
  cancelled: { label: 'Cancelled', className: 'bg-status-inactive-bg text-status-inactive-text' },
};

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <span className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-medium leading-none', meta.className, className)}>
      <span className="size-1.5 shrink-0 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}
