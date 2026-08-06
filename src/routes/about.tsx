import { createRoute } from '@tanstack/react-router';
import { Handshake, ShieldCheck, Sparkles } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { StaticContentPage } from '@/components/shared/StaticContentPage';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Route as RootRoute } from './__root';

// Placeholder aggregate numbers — not modeled as real backend data yet (same pattern as
// TRUST_STATS in lib/config.ts). Swap for real analytics once available.
const ABOUT_STATS = [
  { id: 'customers', value: '12 Lakh+', label: 'Customers served' },
  { id: 'services', value: '25 Lakh+', label: 'Services completed' },
  { id: 'cities', value: '30+', label: 'Cities covered' },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Trust, verified',
    description: 'Every professional on ServiceHub goes through identity verification and background checks before they take their first booking.',
  },
  {
    icon: Sparkles,
    title: 'Quality you can rely on',
    description: 'Ratings and reviews are tracked on every booking, and consistently low-rated professionals are reviewed — not just quietly buried in search results.',
  },
  {
    icon: Handshake,
    title: 'Fair to both sides',
    description: 'Transparent pricing for customers, and a platform built to help professionals grow a sustainable business, not just pick up one-off gigs.',
  },
];

function AboutPage() {
  useDocumentTitle('About Us', 'Learn about ServiceHub’s mission to make trusted home services accessible in every city we operate in.');

  return (
    <StaticContentPage
      eyebrow="Our story"
      title="Home services, done right"
      description="ServiceHub started with a simple frustration: finding a professional you could actually trust to show up, do the job well, and charge a fair price shouldn't be this hard."
    >
      <section className="flex flex-col gap-4 text-sm leading-relaxed text-ink-secondary">
        <p>
          We built ServiceHub to fix that. Instead of word-of-mouth referrals and unverified listings, we wanted a single place where booking a
          service professional felt as easy and reliable as booking anything else online — with real accountability behind every booking.
        </p>
        <p>
          Today, ServiceHub connects customers with verified professionals across categories like home cleaning, repairs, appliance servicing,
          salon at home, and more. Every professional on the platform is vetted before they go live, every booking is tracked end-to-end, and
          every rating feeds back into who gets recommended next.
        </p>
        <p>
          We're still early, and there's a lot more we want to build — but the mission hasn't changed: make it easy to get quality home services
          you can trust, on your schedule.
        </p>
      </section>

      <div className="mt-10 rounded-card border border-border bg-card p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {ABOUT_STATS.map((stat) => (
            <StatCard key={stat.id} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-ink-primary">What we care about</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {VALUES.map((value) => (
            <div key={value.title} className="rounded-card border border-border bg-card p-5">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary-subtle text-primary-subtle-text">
                <value.icon className="size-4" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-ink-primary">{value.title}</h3>
              <p className="mt-1.5 text-sm text-ink-secondary">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </StaticContentPage>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/about',
  component: AboutPage,
});
