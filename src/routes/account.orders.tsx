import { useState } from 'react';
import { createRoute } from '@tanstack/react-router';
import { PackageX, RefreshCw } from 'lucide-react';
import { AccountPage } from '@/components/account/AccountPage';
import { OrderCard } from '@/components/account/OrderCard';
import { RequireAuth } from '@/components/shared/RequireAuth';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInfiniteOrders } from '@/queries/useOrderQueries';
import { Route as RootRoute } from './__root';

type OrderTab = 'all' | 'service' | 'product';

const TAB_TYPE: Record<OrderTab, 'service' | 'product' | undefined> = {
  all: undefined,
  service: 'service',
  product: 'product',
};

function OrderList({ tab }: { tab: OrderTab }) {
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteOrders(TAB_TYPE[tab]);
  const orders = data?.pages.flatMap((page) => page.items) ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-24 w-full rounded-card" />
        <Skeleton className="h-24 w-full rounded-card" />
        <Skeleton className="h-24 w-full rounded-card" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-sm text-ink-secondary">Could not load your orders.</p>
        <Button variant="outline" onClick={() => void refetch()}>
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState icon={PackageX} title="No orders yet" description="Once you book a service or order a product, it'll show up here." actionLabel="Browse services" actionLink={{ to: '/' }} />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
      {hasNextPage && (
        <Button type="button" variant="outline" className="self-center" onClick={() => void fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading…' : 'Load more'}
        </Button>
      )}
    </div>
  );
}

function OrdersContent() {
  const [tab, setTab] = useState<OrderTab>('all');

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as OrderTab)}>
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="service">Bookings</TabsTrigger>
        <TabsTrigger value="product">Products</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-4">
        <OrderList tab="all" />
      </TabsContent>
      <TabsContent value="service" className="mt-4">
        <OrderList tab="service" />
      </TabsContent>
      <TabsContent value="product" className="mt-4">
        <OrderList tab="product" />
      </TabsContent>
    </Tabs>
  );
}

function OrdersPage() {
  return (
    <RequireAuth returnTo="/account/orders">
      <AccountPage title="Order History">
        <OrdersContent />
      </AccountPage>
    </RequireAuth>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/account/orders',
  component: OrdersPage,
});
