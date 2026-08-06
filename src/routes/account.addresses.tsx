import { useState } from 'react';
import { createRoute } from '@tanstack/react-router';
import { MapPinOff, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { Address } from '@/api/types';
import { AccountPage } from '@/components/account/AccountPage';
import { AddressCard } from '@/components/account/AddressCard';
import { AddressForm } from '@/components/shared/AddressForm';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { RequireAuth } from '@/components/shared/RequireAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useAddresses, useDeleteAddress, useSetDefaultAddress } from '@/queries/useAddressQueries';
import { Route as RootRoute } from './__root';

type SheetState = { mode: 'add' } | { mode: 'edit'; address: Address } | null;

function AddressesContent() {
  const { data: addresses, isLoading, isError, refetch } = useAddresses();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const [sheetState, setSheetState] = useState<SheetState>(null);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const handleSetDefault = (address: Address) => {
    setSettingDefaultId(address._id);
    setDefaultAddress.mutate(address._id, {
      onSettled: () => setSettingDefaultId(null),
      onError: () => toast.error('Could not set this as your default address. Please try again.'),
    });
  };

  const handleDelete = () => {
    if (!deletingAddress) return;
    deleteAddress.mutate(deletingAddress._id, {
      onSuccess: () => {
        toast.success('Address deleted');
        setDeletingAddress(null);
      },
      onError: () => toast.error('Could not delete this address. Please try again.'),
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-28 w-full rounded-card" />
        <Skeleton className="h-28 w-full rounded-card" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-sm text-ink-secondary">Could not load your addresses.</p>
        <Button variant="outline" onClick={() => void refetch()}>
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    );
  }

  const hasAddresses = Boolean(addresses?.length);

  return (
    <div className="flex flex-col gap-4">
      {hasAddresses ? (
        <>
          <div className="flex flex-col gap-3">
            {addresses?.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={() => setSheetState({ mode: 'edit', address })}
                onDelete={() => setDeletingAddress(address)}
                onSetDefault={() => handleSetDefault(address)}
                isSettingDefault={settingDefaultId === address._id}
              />
            ))}
          </div>
          <Button type="button" variant="outline" className="self-start" onClick={() => setSheetState({ mode: 'add' })}>
            <Plus className="size-4" />
            Add new address
          </Button>
        </>
      ) : (
        <EmptyState icon={MapPinOff} title="No saved addresses yet" description="Add an address so you're ready to check out.">
          <Button className="mt-2" onClick={() => setSheetState({ mode: 'add' })}>
            <Plus className="size-4" />
            Add address
          </Button>
        </EmptyState>
      )}

      <Sheet open={sheetState !== null} onOpenChange={(open) => !open && setSheetState(null)}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-card">
          <SheetHeader>
            <SheetTitle>{sheetState?.mode === 'edit' ? 'Edit address' : 'Add new address'}</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <AddressForm
              address={sheetState?.mode === 'edit' ? sheetState.address : undefined}
              onSaved={() => {
                toast.success(sheetState?.mode === 'edit' ? 'Address updated' : 'Address added');
                setSheetState(null);
              }}
              onCancel={() => setSheetState(null)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={deletingAddress !== null}
        onOpenChange={(open) => !open && setDeletingAddress(null)}
        title="Delete this address?"
        description={
          addresses?.length === 1
            ? "This is your only saved address. You'll need to add a new one before you can check out again."
            : "This can't be undone."
        }
        confirmLabel="Delete"
        danger
        loading={deleteAddress.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function AddressesPage() {
  return (
    <RequireAuth returnTo="/account/addresses">
      <AccountPage title="Addresses">
        <AddressesContent />
      </AccountPage>
    </RequireAuth>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/account/addresses',
  component: AddressesPage,
});
