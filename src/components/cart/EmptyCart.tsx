import { ShoppingCart } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';

export function EmptyCart() {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="Your cart is empty"
      description="Browse services and add them to your cart to get started."
      actionLabel="Continue shopping"
      actionLink={{ to: '/' }}
    />
  );
}
