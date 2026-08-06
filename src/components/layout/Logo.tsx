import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

/**
 * The shared logo SVG's "Hub" text is hardcoded to a dark navy fill (#0F172A) —
 * invisible against a dark surface. Swaps in a dark-mode variant (light "Hub" text)
 * rather than patching the light-mode asset, since it's shared brand artwork.
 */
export function Logo({ className }: LogoProps) {
  const theme = useThemeStore((state) => state.theme);
  const src = theme === 'dark' ? '/servicehub-logo-dark.svg' : '/servicehub-logo.svg';

  return <img src={src} alt="ServiceHub" className={cn('h-7 sm:h-8', className)} />;
}
