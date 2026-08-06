import type { ReactNode } from 'react';

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  intro?: ReactNode;
  sections: LegalSection[];
}

/** Shared shell for Terms / Privacy / Cancellation & Refunds — title + TOC sidebar (desktop) that anchor-links into each section, single readable column for the actual text. */
export function LegalPageLayout({ title, lastUpdated, intro, sections }: LegalPageLayoutProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-ink-primary">{title}</h1>
      <p className="mt-1 text-sm text-ink-secondary">Last updated: {lastUpdated}</p>
      {intro && <div className="mt-4 flex max-w-2xl flex-col gap-2 text-sm leading-relaxed text-ink-secondary">{intro}</div>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Table of contents" className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">On this page</p>
          <ul className="mt-3 flex flex-col gap-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-sm text-ink-secondary hover:text-ink-link">
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex max-w-2xl flex-col gap-8">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-lg font-semibold text-ink-primary">{section.title}</h2>
              <div className="mt-2 flex flex-col gap-3 text-sm leading-relaxed text-ink-secondary">{section.content}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
