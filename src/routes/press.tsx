import { createRoute } from '@tanstack/react-router';
import { Newspaper } from 'lucide-react';
import { PRESS_MENTIONS } from '@/data/press';
import { StaticContentPage } from '@/components/shared/StaticContentPage';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Route as RootRoute } from './__root';

// Placeholder inbox (.example.com is the IANA-reserved placeholder TLD).
const PRESS_EMAIL = 'press@servicehub.example.com';

function PressPage() {
  useDocumentTitle('Press', 'ServiceHub in the news, and how to reach our press team.');

  return (
    <StaticContentPage eyebrow="Newsroom" title="ServiceHub in the news" description="A running list of press coverage and mentions.">
      <div className="flex flex-col gap-3">
        {PRESS_MENTIONS.map((mention) => (
          <a
            key={mention.id}
            href={mention.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-card border border-border bg-card p-4 hover:bg-surface-hover"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-ink-secondary">
              <Newspaper className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink-primary">{mention.title}</p>
              <p className="mt-0.5 text-xs text-ink-secondary">
                {mention.outlet} · {new Date(mention.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-10 rounded-card border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-ink-primary">Press inquiries</h2>
        <p className="mt-1.5 text-sm text-ink-secondary">
          For interview requests, brand assets, or any other press inquiry, reach out at{' '}
          <a href={`mailto:${PRESS_EMAIL}`} className="font-medium text-ink-link hover:underline">
            {PRESS_EMAIL}
          </a>
          .
        </p>
      </div>
    </StaticContentPage>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/press',
  component: PressPage,
});
