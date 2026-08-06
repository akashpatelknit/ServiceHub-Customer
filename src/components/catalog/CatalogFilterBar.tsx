import { X } from 'lucide-react';
import type { CatalogFilters } from '@/lib/catalogDerivations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CatalogFilterBarProps {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
}

const RATING_OPTIONS = [4.5, 4, 3.5, 3];

/** Client-side narrowing only — the catalog API has no price/rating query params (see catalogDerivations.ts). */
export function CatalogFilterBar({ filters, onChange }: CatalogFilterBarProps) {
  const hasActiveFilters = filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.minRating !== undefined;

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border py-3">
      <div className="flex items-center gap-1.5">
        <Input
          type="number"
          inputMode="numeric"
          placeholder="Min ₹"
          className="h-9 w-24"
          value={filters.minPrice ?? ''}
          onChange={(e) => onChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
        />
        <span className="text-ink-muted">–</span>
        <Input
          type="number"
          inputMode="numeric"
          placeholder="Max ₹"
          className="h-9 w-24"
          value={filters.maxPrice ?? ''}
          onChange={(e) => onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
        />
      </div>

      <Select
        value={filters.minRating ? String(filters.minRating) : 'any'}
        onValueChange={(value) => onChange({ ...filters, minRating: value === 'any' ? undefined : Number(value) })}
      >
        <SelectTrigger className="h-9 w-36">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any rating</SelectItem>
          {RATING_OPTIONS.map((rating) => (
            <SelectItem key={rating} value={String(rating)}>
              {rating}+ stars
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={() => onChange({})} className="text-ink-secondary">
          <X className="size-3.5" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
