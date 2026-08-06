import { Briefcase, Home, MapPin, Pencil, Star, Trash2 } from 'lucide-react';
import type { Address, AddressLabel } from '@/api/types';
import { Button } from '@/components/ui/button';

const LABEL_ICONS: Record<AddressLabel, typeof Home> = { Home, Work: Briefcase, Other: MapPin };

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
  isSettingDefault?: boolean;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault, isSettingDefault }: AddressCardProps) {
  const Icon = LABEL_ICONS[address.label];

  return (
    <div className="flex flex-col gap-3 rounded-card border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-ink-secondary">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-ink-primary">{address.label}</p>
            {address.isDefault && (
              <span className="rounded-pill bg-primary-subtle px-2 py-0.5 text-[11px] font-medium text-primary-subtle-text">Default</span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-ink-secondary">{address.completeAddress}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {!address.isDefault && (
          <Button type="button" variant="outline" size="sm" onClick={onSetDefault} disabled={isSettingDefault}>
            <Star className="size-3.5" />
            {isSettingDefault ? 'Setting…' : 'Set as default'}
          </Button>
        )}
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="size-3.5" />
          Edit
        </Button>
        <Button type="button" variant="ghost" size="sm" className="text-danger hover:bg-danger-subtle hover:text-danger" onClick={onDelete}>
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}
