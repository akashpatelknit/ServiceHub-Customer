import { createRoute } from '@tanstack/react-router';
import { Briefcase, MapPin } from 'lucide-react';
import { JOB_OPENINGS } from '@/data/careers';
import { StaticContentPage } from '@/components/shared/StaticContentPage';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Route as RootRoute } from './__root';

// Placeholder inbox (.example.com is the IANA-reserved placeholder TLD) — no real
// applications backend exists, so "Apply" is just a mailto: link for now.
const CAREERS_EMAIL = 'careers@servicehub.example.com';

function CareersPage() {
  useDocumentTitle('Careers', 'Open roles at ServiceHub — help us build a home-services marketplace people actually trust.');

  return (
    <StaticContentPage
      eyebrow="Join us"
      title="Help us build something people trust"
      description="We're a small team working on a genuinely hard trust-and-logistics problem — matching the right professional to the right job, every time."
    >
      <section className="text-sm leading-relaxed text-ink-secondary">
        <p>
          We're early enough that everyone here has real ownership over what they build. If you like working close to the problem — talking to
          customers and professionals, not just shipping features — you'll probably like it here.
        </p>
      </section>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-ink-primary">Open roles</h2>
        <div className="mt-4 flex flex-col gap-3">
          {JOB_OPENINGS.map((job) => (
            <div
              key={job.id}
              className="flex flex-col gap-3 rounded-card border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-ink-primary">{job.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-secondary">
                  <span className="flex items-center gap-1">
                    <Briefcase className="size-3.5" />
                    {job.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {job.location}
                  </span>
                  <span>{job.type}</span>
                </div>
              </div>
              <a
                href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                className="shrink-0 rounded-md border border-line px-3 py-2 text-center text-sm font-medium text-ink-primary hover:bg-surface-hover"
              >
                Apply
              </a>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-sm text-ink-secondary">
        Don't see a fit? Reach out anyway at{' '}
        <a href={`mailto:${CAREERS_EMAIL}`} className="font-medium text-ink-link hover:underline">
          {CAREERS_EMAIL}
        </a>
        .
      </p>
    </StaticContentPage>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/careers',
  component: CareersPage,
});
