import type { CSSProperties } from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { useThemeStore } from '@/store/themeStore';

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          '--normal-bg': 'hsl(var(--card))',
          '--normal-text': 'hsl(var(--card-foreground))',
          '--normal-border': 'hsl(var(--border))',
        } as CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
