import { useState } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { AddressSelector } from '@/components/checkout/AddressSelector';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ScheduleSelector, type ScheduleValue } from '@/components/checkout/ScheduleSelector';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRequireAuth } from '@/hooks/useAuthGuard';
import { INSTANT_SLOT_LABEL } from '@/lib/checkoutDerivations';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { useCheckout } from '@/queries/useOrderQueries';
import { useCart } from '@/queries/useCartQueries';
import { useAuthStore } from '@/store/authStore';
import { Route as RootRoute } from './__root';

function CheckoutPage() {
  const { isChecking, isAuthenticated } = useRequireAuth('/checkout');
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const cart = useCart();
  const checkout = useCheckout();

  const [selectedAddressId, setSelectedAddressId] = useState<string>();
  const [schedule, setSchedule] = useState<ScheduleValue>({ mode: 'instant', date: new Date(), slot: INSTANT_SLOT_LABEL });

  if (isChecking || !isAuthenticated) {
    return <div className="mx-auto max-w-5xl px-4 py-12 text-ink-secondary">Checking your session…</div>;
  }

  const serverItems = cart.isGuest ? [] : cart.items;
  const hasUnavailableItems = !cart.isGuest && cart.items.some((item) => item.unavailable);
  const canPlaceOrder = Boolean(selectedAddressId) && Boolean(schedule.slot) && !hasUnavailableItems && serverItems.length > 0;

  const handlePlaceOrder = () => {
    if (!selectedAddressId || !schedule.slot) return;

    checkout.mutate(
      {
        addressId: selectedAddressId,
        scheduledDate: schedule.date.toISOString(),
        scheduledSlot: schedule.slot,
        paymentMethod: 'razorpay',
      },
      {
        onSuccess: async (result) => {
          const orderNumber = result.serviceOrder?.orderNumber ?? result.productOrder?.orderNumber;
          if (!orderNumber) {
            toast.error('Order created but no order number was returned. Please contact support.');
            return;
          }

          const goToConfirmation = () => void navigate({ to: '/order-confirmation/$orderNumber', params: { orderNumber } });

          try {
            await openRazorpayCheckout({
              key: result.payment.keyId,
              order_id: result.payment.gatewayOrderId,
              amount: result.payment.amount,
              currency: result.payment.currency,
              name: 'ServiceHub',
              description: `Order ${orderNumber}`,
              prefill: {
                name: [user?.firstName, user?.lastName].filter(Boolean).join(' '),
                email: user?.email,
              },
              theme: { color: '#16A34A' },
              handler: goToConfirmation,
              // The order already exists server-side (checkout.service.js creates it and clears
              // the cart before payment even runs) — dismissing the Razorpay modal doesn't undo
              // that, and there's no retry-payment endpoint, so we still route to the
              // confirmation page, which shows the real (pending) payment status.
              modal: {
                ondismiss: () => {
                  toast.info("Payment wasn't completed — here's your order status.");
                  goToConfirmation();
                },
              },
            });
          } catch {
            toast.error('Could not load the payment gateway. Please try again.');
          }
        },
        onError: (error: unknown) => {
          const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : undefined;
          toast.error(message ?? 'Could not place your order. Please try again.');
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-semibold text-ink-primary">Checkout</h1>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <section>
            <h2 className="mb-3 text-base font-semibold text-ink-primary">Service address</h2>
            <AddressSelector selectedAddressId={selectedAddressId} onSelect={setSelectedAddressId} />
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-ink-primary">When should we come?</h2>
            <ScheduleSelector value={schedule} onChange={setSchedule} />
          </section>
        </div>

        <div>
          {cart.isLoading ? (
            <Skeleton className="h-64 w-full rounded-card" />
          ) : (
            <>
              {hasUnavailableItems && (
                <p className="mb-3 rounded-md bg-status-inactive-bg px-3 py-2 text-sm text-status-inactive-text">
                  Some items in your cart are no longer available. Please go back to your cart to remove them.
                </p>
              )}
              <OrderSummary items={serverItems} />
              <Button size="lg" className="mt-4 w-full" disabled={!canPlaceOrder || checkout.isPending} onClick={handlePlaceOrder}>
                {checkout.isPending ? 'Placing order…' : 'Place order'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/checkout',
  component: CheckoutPage,
});
