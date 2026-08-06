import { Link } from '@tanstack/react-router';
import type { Category } from '@/api/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Skeleton } from '@/components/ui/skeleton';
import { useSubcategories } from '@/queries/useCatalogQueries';

interface CategoryModalProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Picker sheet opened when a Category has displayType 'modal' and hasChildren true
 * (see CategoryGrid.tsx for the fallback-to-navigate rule). Subcategory selection
 * always navigates to the subcategory listing page — Subcategory has its own
 * displayType field in the schema (for a further service-group picker), but this
 * phase's scope has no service-group-level route to send that drill-down to, so it's
 * not branched on here.
 */
export function CategoryModal({ category, open, onOpenChange }: CategoryModalProps) {
  const { data, isLoading } = useSubcategories({ category: category?._id, isActive: 'true', limit: 100 });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-card">
        <SheetHeader>
          <SheetTitle>{category?.name}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 grid grid-cols-3 gap-4 pb-6 sm:grid-cols-4 md:grid-cols-6">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="size-16 rounded-full" />
                <Skeleton className="h-3 w-14" />
              </div>
            ))}

          {!isLoading && category &&
            data?.items.map((subcategory) => (
              <Link
                key={subcategory._id}
                to="/category/$categorySlug/$subcategorySlug"
                params={{ categorySlug: category.slug, subcategorySlug: subcategory.slug }}
                onClick={() => onOpenChange(false)}
                className="flex flex-col items-center gap-2 text-center"
              >
                <span className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-muted">
                  <ImageWithFallback src={subcategory.image?.url} alt="" className="size-full object-cover" />
                </span>
                <span className="line-clamp-2 text-xs text-ink-primary">{subcategory.name}</span>
              </Link>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
