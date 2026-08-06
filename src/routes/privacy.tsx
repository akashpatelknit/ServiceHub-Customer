/**
 * ⚠️ PLACEHOLDER LEGAL CONTENT — see the same flag in terms.tsx. This is NOT reviewed
 * by a lawyer or privacy counsel and MUST NOT ship to a real launch as-is, especially
 * given actual PII and payment data flow through this platform.
 */
import { createRoute } from '@tanstack/react-router';
import { LegalPageLayout, type LegalSection } from '@/components/shared/LegalPageLayout';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Route as RootRoute } from './__root';

const SECTIONS: LegalSection[] = [
  {
    id: 'information-we-collect',
    title: '1. Information we collect',
    content: (
      <>
        <p>
          <strong className="text-ink-primary">Account information:</strong> name, email, phone number, and password (stored hashed, never in
          plain text).
        </p>
        <p>
          <strong className="text-ink-primary">Booking information:</strong> service addresses, scheduling preferences, and order history.
        </p>
        <p>
          <strong className="text-ink-primary">Payment information:</strong> processed directly by our payment partner, Razorpay — ServiceHub
          does not store your full card or bank account details.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: '2. How we use your information',
    content: (
      <p>
        We use your information to process bookings, communicate order updates, provide customer support, improve the platform, and — where
        you've opted in — send you service reminders or offers.
      </p>
    ),
  },
  {
    id: 'cookies',
    title: '3. Cookies & tracking',
    content: (
      <p>
        ServiceHub uses essential cookies to keep you logged in and to keep your session secure. We do not currently use third-party
        advertising trackers.
      </p>
    ),
  },
  {
    id: 'payment-processing',
    title: '4. Payment processing',
    content: (
      <p>
        Payments are handled entirely by Razorpay, a PCI-DSS-compliant payment processor. When you pay for a booking, your payment details are
        sent directly to Razorpay — ServiceHub only receives confirmation of payment success or failure, not your raw card/bank details.
      </p>
    ),
  },
  {
    id: 'third-party-sharing',
    title: '5. Third-party sharing',
    content: (
      <p>
        We share the minimum information necessary with the Professional assigned to your booking (name, service address, and scheduling
        details) so the service can be delivered. We do not sell your personal information to third parties.
      </p>
    ),
  },
  {
    id: 'data-retention',
    title: '6. Data retention',
    content: (
      <p>
        We retain account and booking data for as long as your account is active, and for a reasonable period afterward to comply with legal,
        accounting, and dispute-resolution obligations.
      </p>
    ),
  },
  {
    id: 'your-rights',
    title: '7. Your rights',
    content: (
      <p>
        You can access and update most of your account information directly from My Account. To request a copy of your data or ask us to
        delete your account, contact us using the details below.
      </p>
    ),
  },
  {
    id: 'childrens-privacy',
    title: "8. Children's privacy",
    content: <p>ServiceHub is not directed at children under 18, and we do not knowingly collect information from them.</p>,
  },
  {
    id: 'changes',
    title: '9. Changes to this policy',
    content: <p>We may update this privacy policy periodically. Material changes will be reflected by an updated "last updated" date above.</p>,
  },
  {
    id: 'contact',
    title: '10. Contact us',
    content: (
      <p>
        Questions about this policy, or requests regarding your data, can be sent to{' '}
        <a href="mailto:privacy@servicehub.example.com" className="font-medium text-ink-link hover:underline">
          privacy@servicehub.example.com
        </a>
        .
      </p>
    ),
  },
];

function PrivacyPage() {
  useDocumentTitle('Privacy Policy', 'How ServiceHub collects, uses, and protects your information.');

  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated="Draft — not yet published"
      intro={<p>This policy explains what information ServiceHub collects, how it's used, and the choices you have around it.</p>}
      sections={SECTIONS}
    />
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/privacy',
  component: PrivacyPage,
});
