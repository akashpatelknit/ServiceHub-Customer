import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';

function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <Toaster position="top-center" />
      {import.meta.env.DEV && (
        <>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </>
      )}
    </div>
  );
}

export const Route = createRootRoute({ component: RootLayout });
