/**
 * Policy text here is written to match the actual cancellation rules enforced by the
 * backend (src/features/order-core/utils/assertValidTransition.js +
 * orderStatus.constants.js in service-booking/product-order) — not invented separately.
 * Still worth a legal-review pass before launch, same as terms.tsx/privacy.tsx, since
 * it's customer-facing policy language even though the mechanics are accurate.
 */
import { createRoute, Link } from '@tanstack/react-router';
import { LegalPageLayout, type LegalSection } from '@/components/shared/LegalPageLayout';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Route as RootRoute } from './__root';

const SECTIONS: LegalSection[] = [
  {
    id: 'overview',
    title: '1. Overview',
    content: (
      <p>
        Whether a booking can be cancelled depends on how far along it is. Once a professional has started work (or, for products, once your
        order has been packed for shipping), it can no longer be cancelled through the app.
      </p>
    ),
  },
  {
    id: 'service-bookings',
    title: '2. Cancelling a service booking',
    content: (
      <>
        <p>A service booking can be cancelled while it's in one of these states:</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            <strong className="text-ink-primary">Pending</strong> — booking placed, not yet confirmed
          </li>
          <li>
            <strong className="text-ink-primary">Confirmed</strong> — booking confirmed, professional not yet assigned
          </li>
          <li>
            <strong className="text-ink-primary">Assigned</strong> — a professional has been assigned but hasn't started
          </li>
        </ul>
        <p>
          Once a booking moves to <strong className="text-ink-primary">In Progress</strong> or{' '}
          <strong className="text-ink-primary">Completed</strong>, it can no longer be cancelled.
        </p>
      </>
    ),
  },
  {
    id: 'product-orders',
    title: '3. Cancelling a product order',
    content: (
      <>
        <p>A product order can be cancelled while it's in one of these states:</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            <strong className="text-ink-primary">Pending</strong> — order placed, not yet confirmed
          </li>
          <li>
            <strong className="text-ink-primary">Confirmed</strong> — order confirmed, not yet packed for shipping
          </li>
        </ul>
        <p>
          Once an order moves to <strong className="text-ink-primary">Packed</strong>,{' '}
          <strong className="text-ink-primary">Shipped</strong>, or <strong className="text-ink-primary">Delivered</strong>, it can no longer be
          cancelled through the app. If a delivered product needs to go back, that's handled as a return, not a cancellation.
        </p>
      </>
    ),
  },
  {
    id: 'how-to-cancel',
    title: '4. How to cancel',
    content: (
      <p>
        Go to{' '}
        <Link to="/account/orders" className="font-medium text-ink-link hover:underline">
          My Account &gt; Order History
        </Link>
        , open the order, and use the "Cancel order" button — it's only shown when the order is still in a cancellable state.
      </p>
    ),
  },
  {
    id: 'refunds',
    title: '5. Refunds',
    content: (
      <p>
        Payments are processed through Razorpay. When a booking is cancelled after payment has been captured, the refund is issued to your
        original payment method. Refund timelines depend on your bank/payment provider and are typically a few business days once initiated.
      </p>
    ),
  },
  {
    id: 'questions',
    title: '6. Questions',
    content: (
      <p>
        If a cancellation or refund isn't behaving as described here, reach out through our{' '}
        <Link to="/help" className="font-medium text-ink-link hover:underline">
          Help & Support
        </Link>{' '}
        page with your order number.
      </p>
    ),
  },
];

function CancellationRefundsPage() {
  useDocumentTitle('Cancellation & Refunds', "ServiceHub's cancellation and refund policy for service bookings and product orders.");

  return (
    <LegalPageLayout
      title="Cancellation & Refunds"
      lastUpdated="Draft — not yet published"
      intro={<p>This policy explains when a booking or order can be cancelled, and how refunds work.</p>}
      sections={SECTIONS}
    />
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/cancellation-refunds',
  component: CancellationRefundsPage,
});
