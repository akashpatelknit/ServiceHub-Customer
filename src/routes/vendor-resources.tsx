import { createRoute } from '@tanstack/react-router';
import { StaticContentPage } from '@/components/shared/StaticContentPage';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Route as RootRoute } from './__root';

// Placeholder inbox (.example.com is the IANA-reserved placeholder TLD).
const VENDOR_SUPPORT_EMAIL = 'vendor-support@servicehub.example.com';

const GUIDELINE_SECTIONS = [
  {
    title: 'Before you accept a job',
    points: [
      'Confirm you can make the scheduled time slot — reliability is one of the biggest factors in your rating.',
      'Review the job details and any add-ons the customer selected before you arrive.',
    ],
  },
  {
    title: 'Quality standards',
    points: [
      'Arrive with the tools and materials needed for the job — customers should never have to source anything themselves.',
      'Communicate clearly if a job will take longer or cost more than originally scoped, before doing the extra work.',
      'Leave the work area clean once the job is done.',
    ],
  },
  {
    title: 'Professional conduct',
    points: [
      'All pricing and payment happens through the app — never ask a customer to pay you directly for a booking made through ServiceHub.',
      'Treat every customer interaction professionally, regardless of the outcome of the job.',
    ],
  },
];

function VendorResourcesPage() {
  useDocumentTitle('Vendor Resources', 'Guidelines and quality standards for ServiceHub professionals.');

  return (
    <StaticContentPage
      eyebrow="For professionals"
      title="Vendor Resources"
      description="Guidelines and quality standards for professionals working on ServiceHub."
    >
      <div className="flex flex-col gap-8">
        {GUIDELINE_SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-ink-primary">{section.title}</h2>
            <ul className="mt-3 ml-4 flex list-disc flex-col gap-2 text-sm leading-relaxed text-ink-secondary">
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-card border border-border bg-card p-6">
        <h2 className="text-sm font-semibold text-ink-primary">Need help?</h2>
        <p className="mt-1.5 text-sm text-ink-secondary">
          For anything not covered here, reach the vendor support team at{' '}
          <a href={`mailto:${VENDOR_SUPPORT_EMAIL}`} className="font-medium text-ink-link hover:underline">
            {VENDOR_SUPPORT_EMAIL}
          </a>
          .
        </p>
      </div>
    </StaticContentPage>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/vendor-resources',
  component: VendorResourcesPage,
});
