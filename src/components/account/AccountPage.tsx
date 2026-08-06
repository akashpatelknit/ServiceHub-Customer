import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';

interface AccountPageProps {
  title: string;
  children: ReactNode;
}

/** Shared shell for dedicated /account/* sub-pages — back link to the /account landing page, a title, consistent width/padding. No repeated nav here on purpose: each section is its own page, not a tab. */
export function AccountPage({ title, children }: AccountPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link to="/account" className="inline-flex items-center gap-1 text-sm font-medium text-ink-secondary hover:text-ink-primary">
        <ChevronLeft className="size-4" />
        Account
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ink-primary">{title}</h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}
