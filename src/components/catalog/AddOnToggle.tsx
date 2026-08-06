import type { AddOn } from '@/api/types';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { cn } from '@/lib/utils';

interface AddOnToggleProps {
  addOn: AddOn;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function AddOnToggle({ addOn, checked, onCheckedChange }: AddOnToggleProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 transition-colors',
        checked && 'border-primary bg-primary-subtle',
      )}
    >
      <Checkbox checked={checked} onCheckedChange={(value) => onCheckedChange(value === true)} />
      <ImageWithFallback src={addOn.image?.url} alt="" className="size-12 shrink-0 rounded-md object-cover" />
      <div className="flex-1">
        <p className="text-sm font-medium text-ink-primary">{addOn.name}</p>
        {addOn.description && <p className="text-xs text-ink-secondary">{addOn.description}</p>}
      </div>
      <span className="shrink-0 text-sm font-medium text-ink-primary">
        + ₹{addOn.price.toLocaleString('en-IN')}
      </span>
    </label>
  );
}
