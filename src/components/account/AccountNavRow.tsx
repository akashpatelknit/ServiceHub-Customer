import type { ComponentType } from 'react';
import { Link, type LinkProps } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RowContentProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  danger?: boolean;
  showChevron?: boolean;
}

function RowContent({ icon: Icon, label, danger, showChevron = true }: RowContentProps) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-border bg-card p-3 transition-colors hover:bg-surface-hover">
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full',
          danger ? 'bg-danger-subtle text-danger' : 'bg-muted text-ink-secondary',
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className={cn('flex-1 text-sm font-medium', danger ? 'text-danger' : 'text-ink-primary')}>{label}</span>
      {showChevron && <ChevronRight className="size-4 shrink-0 text-ink-muted" />}
    </div>
  );
}

interface AccountNavLinkProps extends RowContentProps {
  to: LinkProps['to'];
}

/** A row on the /account landing page that navigates to a dedicated sub-page. */
export function AccountNavLink({ to, ...rowProps }: AccountNavLinkProps) {
  return (
    <Link to={to} className="block">
      <RowContent {...rowProps} />
    </Link>
  );
}

interface AccountNavActionProps extends RowContentProps {
  onClick: () => void;
  disabled?: boolean;
}

/** Same row visual, for a non-navigational action (Logout). */
export function AccountNavAction({ onClick, disabled, ...rowProps }: AccountNavActionProps) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="block w-full text-left">
      <RowContent {...rowProps} />
    </button>
  );
}
