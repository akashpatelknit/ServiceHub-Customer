import { createRoute } from '@tanstack/react-router';
import { FolderX } from 'lucide-react';
import { CatalogListing } from '@/components/catalog/CatalogListing';
import { EmptyState } from '@/components/shared/EmptyState';
import { useCategoryBySlug, useServiceGroups, useServices, useSubcategoryBySlug } from '@/queries/useCatalogQueries';
import { Route as RootRoute } from './__root';

const CATALOG_POOL_LIMIT = 100;

function SubcategoryPage() {
  const { categorySlug, subcategorySlug } = Route.useParams();
  const { data: category, isLoading: categoryLoading, notFound: categoryNotFound } = useCategoryBySlug(categorySlug);
  const {
    data: subcategory,
    isLoading: subcategoryLoading,
    notFound: subcategoryNotFound,
  } = useSubcategoryBySlug(category?._id, subcategorySlug);

  const { data: serviceGroupsData, isLoading: groupsLoading } = useServiceGroups(
    { subcategory: subcategory?._id, isActive: 'true', limit: CATALOG_POOL_LIMIT },
    { enabled: Boolean(subcategory?._id) },
  );
  const { data: servicesData, isLoading: servicesLoading } = useServices(
    { subcategory: subcategory?._id, isActive: 'true', limit: CATALOG_POOL_LIMIT },
    { enabled: Boolean(subcategory?._id) },
  );

  if (categoryNotFound || subcategoryNotFound) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <EmptyState icon={FolderX} title="Category not found" actionLabel="Back to home" actionLink={{ to: '/' }} />
      </div>
    );
  }

  return (
    <CatalogListing
      title={subcategory?.name ?? ''}
      breadcrumbItems={
        category && subcategory
          ? [{ label: category.name, link: { to: '/category/$categorySlug', params: { categorySlug: category.slug } } }, { label: subcategory.name }]
          : []
      }
      services={servicesData?.items ?? []}
      serviceGroups={serviceGroupsData?.items ?? []}
      isLoading={categoryLoading || subcategoryLoading || groupsLoading || servicesLoading}
    />
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/category/$categorySlug/$subcategorySlug',
  component: SubcategoryPage,
});
