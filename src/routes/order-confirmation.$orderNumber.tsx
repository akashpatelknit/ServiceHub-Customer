import { createRoute } from '@tanstack/react-router';
import { CheckCircle2, Clock, PackageX, XCircle } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrder } from '@/queries/useOrderQueries';
import { Route as RootRoute } from './__root';

const STATUS_DISPLAY = {
  pending: { icon: Clock, label: 'Payment processing…', className: 'bg-status-pending-bg text-status-pending-text' },
  paid: { icon: CheckCircle2, label: 'Order confirmed', className: 'bg-status-active-bg text-status-active-text' },
  failed: { icon: XCircle, label: 'Payment failed', className: 'bg-status-inactive-bg text-status-inactive-text' },
  refunded: { icon: XCircle, label: 'Refunded', className: 'bg-status-inactive-bg text-status-inactive-text' },
} as const;

function OrderConfirmationPage() {
  const { orderNumber } = Route.useParams();
  const { data: order, isLoading, isError } = useOrder(orderNumber);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="mx-auto mt-4 h-6 w-48" />
        <Skeleton className="mt-6 h-48 w-full rounded-card" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <EmptyState icon={PackageX} title="Order not found" actionLabel="Back to home" actionLink={{ to: '/' }} />
      </div>
    );
  }

  const status = STATUS_DISPLAY[order.paymentStatus];
  const StatusIcon = status.icon;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex flex-col items-center text-center">
        <div className={`flex size-16 items-center justify-center rounded-full ${status.className}`}>
          <StatusIcon className="size-8" />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-ink-primary">{status.label}</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Order <span className="font-medium text-ink-primary">{order.orderNumber}</span>
        </p>
        {order.paymentStatus === 'pending' && (
          <p className="mt-1 text-xs text-ink-muted">Confirming your payment — this usually takes just a few seconds.</p>
        )}
      </div>

      <div className="mt-8 rounded-card border border-border bg-card p-5">
        <div className="flex flex-col gap-3">
          {order.orderType === 'service'
            ? order.items.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-ink-primary">{item.serviceNameSnapshot}</p>
                    {item.addonsSnapshot.map((addon, j) => (
                      <p key={j} className="text-xs text-ink-secondary">
                        + {addon.name}
                      </p>
                    ))}
                  </div>
                  <span className="shrink-0 font-medium text-ink-primary">₹{item.priceSnapshot.toLocaleString('en-IN')}</span>
                </div>
              ))
            : order.items.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-3 text-sm">
                  <p className="font-medium text-ink-primary">
                    {item.productNameSnapshot} {item.quantity > 1 && `× ${item.quantity}`}
                  </p>
                  <span className="shrink-0 font-medium text-ink-primary">₹{item.priceSnapshot.toLocaleString('en-IN')}</span>
                </div>
              ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-base font-semibold">
          <span className="text-ink-primary">Total</span>
          <span className="text-ink-primary">₹{order.totalAmount.toLocaleString('en-IN')}</span>
        </div>

        {order.orderType === 'service' && (
          <p className="mt-3 text-sm text-ink-secondary">
            Scheduled for {new Date(order.scheduledDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })},{' '}
            {order.scheduledSlot}
          </p>
        )}

        <p className="mt-1 text-sm text-ink-secondary">{order.addressSnapshot.fullAddress}</p>
      </div>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/order-confirmation/$orderNumber',
  component: OrderConfirmationPage,
});
