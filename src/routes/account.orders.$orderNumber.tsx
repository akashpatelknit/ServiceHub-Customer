import { useState } from 'react';
import { createRoute } from '@tanstack/react-router';
import { CalendarClock, MapPin, PackageX, Truck, UserCheck, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AccountPage } from '@/components/account/AccountPage';
import { OrderStatusStepper } from '@/components/account/OrderStatusStepper';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { RequireAuth } from '@/components/shared/RequireAuth';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { isOrderCancellable, PRODUCT_ORDER_STEPS, SERVICE_ORDER_STEPS } from '@/lib/orderDerivations';
import { useCancelOrder, useOrder } from '@/queries/useOrderQueries';
import { Route as RootRoute } from './__root';

function OrderDetailContent({ orderNumber }: { orderNumber: string }) {
  const { data: order, isLoading, isError } = useOrder(orderNumber);
  const cancelOrder = useCancelOrder();
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full rounded-card" />
        <Skeleton className="h-48 w-full rounded-card" />
      </div>
    );
  }

  if (isError || !order) {
    return <EmptyState icon={PackageX} title="Order not found" actionLabel="Back to orders" actionLink={{ to: '/account/orders' }} />;
  }

  const isTerminalSideState = order.status === 'cancelled' || order.status === 'returned';
  const steps = order.orderType === 'service' ? SERVICE_ORDER_STEPS : PRODUCT_ORDER_STEPS;

  const handleCancel = () => {
    cancelOrder.mutate(order.orderNumber, {
      onSuccess: () => {
        toast.success('Order cancelled');
        setConfirmingCancel(false);
      },
      onError: () => toast.error('Could not cancel this order. Please try again.'),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-card border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-ink-primary">{order.orderNumber}</p>
            <p className="text-xs text-ink-secondary">
              Placed {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="mt-5">
          {isTerminalSideState ? (
            <div className="flex items-center gap-2 rounded-md bg-status-inactive-bg px-3 py-2 text-sm text-status-inactive-text">
              <XCircle className="size-4 shrink-0" />
              This order was {order.status}.
            </div>
          ) : (
            <OrderStatusStepper steps={steps} currentStep={order.status} />
          )}
        </div>
      </div>

      {order.orderType === 'service' ? (
        <div className="flex flex-col gap-2 rounded-card border border-border bg-card p-4 text-sm">
          <div className="flex items-center gap-2 text-ink-secondary">
            <CalendarClock className="size-4 shrink-0" />
            {new Date(order.scheduledDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}, {order.scheduledSlot}
          </div>
          {order.assignedVendor && (
            <div className="flex items-center gap-2 text-ink-secondary">
              <UserCheck className="size-4 shrink-0" />A professional has been assigned to this booking.
            </div>
          )}
        </div>
      ) : (
        (order.shippingStatus !== 'pending' || order.trackingId) && (
          <div className="flex flex-col gap-2 rounded-card border border-border bg-card p-4 text-sm">
            <div className="flex items-center gap-2 text-ink-secondary">
              <Truck className="size-4 shrink-0" />
              {order.courierName ?? 'Shipping'} — {order.shippingStatus.replace(/-/g, ' ')}
            </div>
            {order.trackingId && <p className="pl-6 text-xs text-ink-muted">Tracking ID: {order.trackingId}</p>}
          </div>
        )
      )}

      <div className="rounded-card border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-ink-primary">Items</h2>
        <div className="mt-3 flex flex-col gap-3">
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
      </div>

      <div className="rounded-card border border-border bg-card p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-primary">
          <MapPin className="size-4" />
          Address
        </h2>
        <p className="mt-2 text-sm text-ink-secondary">{order.addressSnapshot.fullAddress}</p>
      </div>

      {isOrderCancellable(order) && (
        <Button type="button" variant="outline" className="self-start text-danger hover:bg-danger-subtle hover:text-danger" onClick={() => setConfirmingCancel(true)}>
          Cancel order
        </Button>
      )}

      <ConfirmDialog
        open={confirmingCancel}
        onOpenChange={setConfirmingCancel}
        title="Cancel this order?"
        description="This can't be undone."
        confirmLabel="Cancel order"
        danger
        loading={cancelOrder.isPending}
        onConfirm={handleCancel}
      />
    </div>
  );
}

function OrderDetailPage() {
  const { orderNumber } = Route.useParams();
  return (
    <RequireAuth returnTo="/account/orders">
      <AccountPage title="Order details">
        <OrderDetailContent orderNumber={orderNumber} />
      </AccountPage>
    </RequireAuth>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/account/orders/$orderNumber',
  component: OrderDetailPage,
});
