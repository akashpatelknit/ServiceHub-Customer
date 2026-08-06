import type { SVGProps } from 'react';
import type { LinkProps } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Logo } from '@/components/layout/Logo';

const FOOTER_COLUMNS: { title: string; links: { label: string; to: LinkProps['to'] }[] }[] = [
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'ServiceHub blog', to: '/blog' },
      { label: 'Careers', to: '/careers' },
      { label: 'Press', to: '/press' },
    ],
  },
  {
    title: 'For customers',
    links: [
      { label: 'Help & support', to: '/help' },
      { label: 'Terms & conditions', to: '/terms' },
      { label: 'Privacy policy', to: '/privacy' },
      { label: 'Cancellation & refunds', to: '/cancellation-refunds' },
    ],
  },
  {
    title: 'For professionals',
    links: [
      { label: 'Register as a professional', to: '/register-professional' },
      { label: 'Partner app', to: '/partner-app' },
      { label: 'Vendor resources', to: '/vendor-resources' },
    ],
  },
];

// lucide-react dropped brand/social icons — small inline outlines instead of adding a new icon package.
function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C4 15.5 2.4 13.6 2 11.4c.9.2 1.7.2 2.6-.1C.6 10.4-.7 7.3.4 4.6c2.4 2.9 6 4.7 9.9 4.9-.7-3 2.4-6 5.6-4.9 1.2.4 2 1.3 2.4 2.5 1.3-.3 2.1-.7 3.3-1.4-.4 1.4-1.3 2.5-2.4 3.1 1.1-.1 1.9-.4 2.8-.8z" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v1.6A6 6 0 0 1 16 8z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

// TODO: swap '#' for real profile URLs before launch — accounts don't exist yet.
const SOCIAL_LINKS = [
  { label: 'Facebook', icon: FacebookIcon, href: '#' },
  { label: 'Instagram', icon: InstagramIcon, href: '#' },
  { label: 'Twitter', icon: TwitterIcon, href: '#' },
  { label: 'LinkedIn', icon: LinkedinIcon, href: '#' },
];

// TODO: swap '#' for real store listing URLs once the customer/vendor apps are actually published.
const APP_STORE_LINKS = [
  { label: 'Get it on Google Play', href: '#' },
  { label: 'Download on the App Store', href: '#' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Logo className="h-7" />
            <p className="mt-3 text-sm text-ink-secondary">Home services at your doorstep.</p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-ink-primary">{column.title}</h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-ink-secondary hover:text-ink-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-border pt-6 sm:flex-row">
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-line text-ink-secondary hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {APP_STORE_LINKS.map((badge) => (
              <a
                key={badge.label}
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-xs font-medium text-ink-primary hover:bg-surface-hover"
              >
                {badge.label}
              </a>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted sm:text-left">
          © {new Date().getFullYear()} ServiceHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
