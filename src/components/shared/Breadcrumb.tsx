import { Link, type LinkProps } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  link?: LinkProps;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-ink-secondary">
      <Link to="/" className="hover:text-ink-link">
        Home
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5">
          <ChevronRight className="size-3.5" />
          {item.link ? (
            <Link {...item.link} className="hover:text-ink-link">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-primary">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
