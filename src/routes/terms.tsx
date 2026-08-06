/**
 * ⚠️ PLACEHOLDER LEGAL CONTENT — written to read like a plausible, complete ToS for a
 * home-services marketplace, but it is NOT reviewed by a lawyer and MUST NOT ship to a
 * real launch as-is. Get this reviewed by actual counsel before this page is treated
 * as production-final. (Same flag applies to privacy.tsx.)
 */
import { createRoute, Link } from '@tanstack/react-router';
import { LegalPageLayout, type LegalSection } from '@/components/shared/LegalPageLayout';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Route as RootRoute } from './__root';

const SECTIONS: LegalSection[] = [
  {
    id: 'acceptance',
    title: '1. Acceptance of terms',
    content: (
      <p>
        By creating an account or booking a service through ServiceHub, you agree to these Terms & Conditions. If you do not agree, please do
        not use the platform.
      </p>
    ),
  },
  {
    id: 'description',
    title: '2. Description of service',
    content: (
      <p>
        ServiceHub is a marketplace that connects customers with independent, third-party service professionals ("Professionals") for home
        services. ServiceHub is not itself the provider of the underlying services — Professionals are independent contractors, not employees
        or agents of ServiceHub.
      </p>
    ),
  },
  {
    id: 'accounts',
    title: '3. User accounts',
    content: (
      <>
        <p>You must provide accurate information when creating an account and keep your login credentials secure.</p>
        <p>You are responsible for all activity that occurs under your account.</p>
      </>
    ),
  },
  {
    id: 'bookings-payments',
    title: '4. Bookings & payments',
    content: (
      <>
        <p>
          When you book a service, you authorize ServiceHub to charge the applicable amount through our payment partner, Razorpay, at the time
          of booking.
        </p>
        <p>Prices shown at checkout are final for that booking unless additional services are requested and agreed to separately.</p>
      </>
    ),
  },
  {
    id: 'cancellations',
    title: '5. Cancellations & refunds',
    content: (
      <p>
        Cancellation eligibility depends on the current status of your booking. See our{' '}
        <Link to="/cancellation-refunds" className="font-medium text-ink-link hover:underline">
          Cancellation & Refunds Policy
        </Link>{' '}
        for full details.
      </p>
    ),
  },
  {
    id: 'user-conduct',
    title: '6. User conduct',
    content: (
      <p>
        You agree not to use ServiceHub for any unlawful purpose, to harass or discriminate against Professionals, to provide false booking
        information, or to attempt to circumvent the platform to transact with a Professional outside of ServiceHub for a service originally
        booked through it.
      </p>
    ),
  },
  {
    id: 'professional-vetting',
    title: '7. Professional vetting disclaimer',
    content: (
      <p>
        ServiceHub takes reasonable steps to verify the identity and, where applicable, the background of Professionals on the platform.
        However, ServiceHub does not guarantee the conduct, quality, or safety of any service performed and is not liable for the acts or
        omissions of any Professional.
      </p>
    ),
  },
  {
    id: 'liability',
    title: '8. Limitation of liability',
    content: (
      <p>
        To the maximum extent permitted by law, ServiceHub's liability for any claim arising from your use of the platform is limited to the
        amount you paid for the specific booking giving rise to the claim. ServiceHub is not liable for indirect, incidental, or consequential
        damages.
      </p>
    ),
  },
  {
    id: 'indemnification',
    title: '9. Indemnification',
    content: <p>You agree to indemnify ServiceHub against any claims arising from your breach of these terms or misuse of the platform.</p>,
  },
  {
    id: 'ip',
    title: '10. Intellectual property',
    content: (
      <p>
        All content, branding, and software associated with ServiceHub remain the property of ServiceHub and may not be used without prior
        written permission.
      </p>
    ),
  },
  {
    id: 'termination',
    title: '11. Termination',
    content: (
      <p>
        ServiceHub may suspend or terminate your account for violation of these terms, fraudulent activity, or abuse of the platform, with or
        without notice.
      </p>
    ),
  },
  {
    id: 'governing-law',
    title: '12. Governing law',
    content: <p>These terms are governed by the laws of India, without regard to conflict-of-law principles.</p>,
  },
  {
    id: 'changes',
    title: '13. Changes to these terms',
    content: (
      <p>
        We may update these terms from time to time. Continued use of ServiceHub after changes take effect constitutes acceptance of the
        revised terms.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '14. Contact us',
    content: (
      <p>
        Questions about these terms can be sent to{' '}
        <a href="mailto:legal@servicehub.example.com" className="font-medium text-ink-link hover:underline">
          legal@servicehub.example.com
        </a>
        .
      </p>
    ),
  },
];

function TermsPage() {
  useDocumentTitle('Terms & Conditions', 'The terms that govern your use of ServiceHub.');

  return (
    <LegalPageLayout
      title="Terms & Conditions"
      lastUpdated="Draft — not yet published"
      intro={<p>These terms govern your use of ServiceHub. Please read them carefully.</p>}
      sections={SECTIONS}
    />
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/terms',
  component: TermsPage,
});
