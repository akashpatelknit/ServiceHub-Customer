import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AddressForm } from '@/components/shared/AddressForm';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { useAddresses } from '@/queries/useAddressQueries';

interface AddressSelectorProps {
  selectedAddressId: string | undefined;
  onSelect: (addressId: string) => void;
}

export function AddressSelector({ selectedAddressId, onSelect }: AddressSelectorProps) {
  const { data: addresses, isLoading } = useAddresses();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-16 w-full rounded-card" />
        <Skeleton className="h-16 w-full rounded-card" />
      </div>
    );
  }

  const hasAddresses = Boolean(addresses?.length);

  return (
    <div className="flex flex-col gap-3">
      {hasAddresses && !showForm && (
        <RadioGroup value={selectedAddressId} onValueChange={onSelect} className="flex flex-col gap-2">
          {addresses?.map((address) => (
            <label
              key={address._id}
              htmlFor={`address-${address._id}`}
              className="flex cursor-pointer items-start gap-3 rounded-card border border-border p-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-subtle"
            >
              <RadioGroupItem value={address._id} id={`address-${address._id}`} className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-ink-primary">{address.label}</p>
                <p className="text-sm text-ink-secondary">{address.completeAddress}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      )}

      {showForm ? (
        <AddressForm
          onSaved={(addressId) => {
            onSelect(addressId);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-card border border-dashed border-line px-3 py-3 text-sm font-medium text-primary hover:bg-primary-subtle"
        >
          <Plus className="size-4" />
          Add new address
        </button>
      )}
    </div>
  );
}
