import { Link } from '@tanstack/react-router';
import type { CustomerOrder } from '@/api/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { orderItemSummary } from '@/lib/orderDerivations';

export function OrderCard({ order }: { order: CustomerOrder }) {
  return (
    <Link
      to="/account/orders/$orderNumber"
      params={{ orderNumber: order.orderNumber }}
      className="flex flex-col gap-2 rounded-card border border-border bg-card p-4 transition-colors hover:bg-surface-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-primary">{order.orderNumber}</p>
          <p className="text-xs text-ink-secondary">
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <p className="truncate text-sm text-ink-secondary">{orderItemSummary(order)}</p>

      <p className="text-sm font-semibold text-ink-primary">₹{order.totalAmount.toLocaleString('en-IN')}</p>
    </Link>
  );
}
