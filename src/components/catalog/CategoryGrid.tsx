import { type MouseEvent, useState } from 'react';
import { Link } from '@tanstack/react-router';
import type { Category } from '@/api/types';
import { CategoryModal } from '@/components/catalog/CategoryModal';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryGridProps {
  categories: Category[];
  isLoading?: boolean;
}

/**
 * Icon + label tiles. 'navigate' routes straight to the category page; 'modal' opens
 * a subcategory picker sheet — but only if the category actually has active children.
 * A 'modal' category with hasChildren === false falls back to navigate (see the
 * DISPLAY_TYPES comment in the backend's catalog.constants.js — this fallback is
 * explicitly a frontend responsibility, not enforced server-side).
 */
export function CategoryGrid({ categories, isLoading }: CategoryGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const handleClick = (category: Category, event: MouseEvent) => {
    const isEffectivelyModal = category.displayType === 'modal' && category.hasChildren;
    if (isEffectivelyModal) {
      event.preventDefault();
      setActiveCategory(category);
    }
    // else displayType === 'navigate' (or 'modal' with no children) — let the Link's own navigation proceed.
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-5">
        {isLoading &&
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="size-14 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}

        {!isLoading &&
          categories.map((category) => (
            <Link
              key={category._id}
              to="/category/$categorySlug"
              params={{ categorySlug: category.slug }}
              onClick={(event) => handleClick(category, event)}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="flex size-14 items-center justify-center overflow-hidden rounded-full bg-muted sm:size-16">
                <ImageWithFallback src={category.image?.url} alt="" className="size-full object-cover" />
              </span>
              <span className="line-clamp-2 text-xs text-ink-primary">{category.name}</span>
            </Link>
          ))}
      </div>

      <CategoryModal category={activeCategory} open={Boolean(activeCategory)} onOpenChange={(open) => !open && setActiveCategory(null)} />
    </>
  );
}
