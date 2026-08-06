import type { ReactNode } from 'react';
import { Link, type LinkProps } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionLink?: LinkProps;
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionLink, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <Icon className="size-7 text-ink-muted" />
      </div>
      <h2 className="text-lg font-semibold text-ink-primary">{title}</h2>
      {description && <p className="max-w-sm text-sm text-ink-secondary">{description}</p>}
      {actionLabel && actionLink && (
        <Button asChild className="mt-2">
          <Link {...actionLink}>{actionLabel}</Link>
        </Button>
      )}
      {children}
    </div>
  );
}
