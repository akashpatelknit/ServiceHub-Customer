import { createRoute, Link } from '@tanstack/react-router';
import { CalendarClock, ClipboardList, Wallet } from 'lucide-react';
import { StaticContentPage } from '@/components/shared/StaticContentPage';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Route as RootRoute } from './__root';

const FEATURES = [
  { icon: ClipboardList, title: 'Job management', description: 'See new job requests, accept or decline, and track every job from assignment to completion in one place.' },
  { icon: Wallet, title: 'Earnings tracking', description: "Clear breakdowns of what you've earned per job, per week, and per month — no surprises at payout time." },
  { icon: CalendarClock, title: 'Schedule control', description: 'Set your own availability and block out time off — you decide when you take on new jobs.' },
];

function PartnerAppPage() {
  useDocumentTitle('Partner App', 'The ServiceHub app for professionals — manage jobs, track earnings, and control your schedule.');

  return (
    <StaticContentPage
      eyebrow="For professionals"
      title="The ServiceHub Partner App"
      description="A dedicated app for managing your ServiceHub business — currently in development."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-card border border-border bg-card p-5">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary-subtle text-primary-subtle-text">
              <feature.icon className="size-4" />
            </span>
            <h3 className="mt-3 text-sm font-semibold text-ink-primary">{feature.title}</h3>
            <p className="mt-1.5 text-sm text-ink-secondary">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-card border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-ink-primary">Coming soon</h2>
        <p className="mt-1.5 max-w-xl text-sm text-ink-secondary">
          The Partner App isn't published yet. In the meantime,{' '}
          <Link to="/register-professional" className="font-medium text-ink-link hover:underline">
            register your interest as a professional
          </Link>{' '}
          and we'll notify you as soon as it's available.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {/* TODO: point these at real store listings once the vendor app is actually published. */}
          <a
            href="#"
            className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-xs font-medium text-ink-primary hover:bg-surface-hover"
          >
            Get it on Google Play
          </a>
          <a
            href="#"
            className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-xs font-medium text-ink-primary hover:bg-surface-hover"
          >
            Download on the App Store
          </a>
        </div>
      </div>
    </StaticContentPage>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/partner-app',
  component: PartnerAppPage,
});
