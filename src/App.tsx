import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { queryClient } from '@/lib/queryClient';
import { router } from '@/routes/router';
import { useBootSession } from '@/hooks/useBootSession';

function AppShell() {
  useBootSession();
  return <RouterProvider router={router} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}

export default App;
