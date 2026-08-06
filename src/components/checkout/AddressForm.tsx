import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAddAddress } from '@/queries/useAddressQueries';
import { addressSchema, type AddressFormValues } from '@/validators/addressSchemas';

interface AddressFormProps {
  onSaved: (addressId: string) => void;
  onCancel: () => void;
}

const LABELS: AddressFormValues['label'][] = ['Home', 'Work', 'Other'];

export function AddressForm({ onSaved, onCancel }: AddressFormProps) {
  const addAddress = useAddAddress();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormValues>({ resolver: zodResolver(addressSchema), defaultValues: { label: 'Home' } });

  const onSubmit = (values: AddressFormValues) => {
    addAddress.mutate(values, {
      onSuccess: (address) => onSaved(address._id),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-card border border-border p-4">
      <FormField label="Street address" htmlFor="street" error={errors.street?.message}>
        <Input id="street" {...register('street')} />
      </FormField>

      <FormField label="Landmark (optional)" htmlFor="landmark" error={errors.landmark?.message}>
        <Input id="landmark" {...register('landmark')} />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="City" htmlFor="city" error={errors.city?.message}>
          <Input id="city" {...register('city')} />
        </FormField>
        <FormField label="State" htmlFor="state" error={errors.state?.message}>
          <Input id="state" {...register('state')} />
        </FormField>
      </div>

      <FormField label="PIN code" htmlFor="pinCode" error={errors.pinCode?.message}>
        <Input id="pinCode" inputMode="numeric" maxLength={6} {...register('pinCode')} />
      </FormField>

      <div className="flex flex-col gap-1.5">
        <Label>Address type</Label>
        <RadioGroup value={watch('label')} onValueChange={(value) => setValue('label', value as AddressFormValues['label'])} className="flex gap-4">
          {LABELS.map((label) => (
            <div key={label} className="flex items-center gap-1.5">
              <RadioGroupItem value={label!} id={`label-${label}`} />
              <Label htmlFor={`label-${label}`} className="font-normal">
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {addAddress.isError && (
        <p className="rounded-md bg-danger-subtle px-3 py-2 text-sm text-danger-subtle-text">Could not save this address. Please try again.</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={addAddress.isPending}>
          {addAddress.isPending ? 'Saving…' : 'Save address'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
