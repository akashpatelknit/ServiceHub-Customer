import type { ReactNode } from 'react';

interface StaticContentPageProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

/** Light shared shell for About/Careers/Press/Vendor Resources — just the header block (eyebrow + title + intro paragraph) and consistent width. Each page builds its own section content beneath it since the four pages don't share enough structure beyond that. */
export function StaticContentPage({ eyebrow, title, description, children }: StaticContentPageProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <div className="max-w-2xl">
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>}
        <h1 className="mt-2 text-3xl font-bold text-ink-primary sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 text-base text-ink-secondary">{description}</p>}
      </div>
      <div className="mt-10">{children}</div>
    </div>
  );
}
