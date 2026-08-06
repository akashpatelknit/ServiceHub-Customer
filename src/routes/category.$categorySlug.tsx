import { createRoute } from '@tanstack/react-router';
import { FolderX } from 'lucide-react';
import { CatalogListing } from '@/components/catalog/CatalogListing';
import { EmptyState } from '@/components/shared/EmptyState';
import { useCategoryBySlug, useServiceGroups, useServices } from '@/queries/useCatalogQueries';
import { Route as RootRoute } from './__root';

const CATALOG_POOL_LIMIT = 100;

function CategoryPage() {
  const { categorySlug } = Route.useParams();
  const { data: category, isLoading: categoryLoading, notFound } = useCategoryBySlug(categorySlug);

  const { data: serviceGroupsData, isLoading: groupsLoading } = useServiceGroups(
    { category: category?._id, isActive: 'true', limit: CATALOG_POOL_LIMIT },
    { enabled: Boolean(category?._id) },
  );
  const { data: servicesData, isLoading: servicesLoading } = useServices(
    { category: category?._id, isActive: 'true', limit: CATALOG_POOL_LIMIT },
    { enabled: Boolean(category?._id) },
  );

  if (notFound) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <EmptyState icon={FolderX} title="Category not found" actionLabel="Back to home" actionLink={{ to: '/' }} />
      </div>
    );
  }

  return (
    <CatalogListing
      title={category?.name ?? ''}
      breadcrumbItems={category ? [{ label: category.name }] : []}
      services={servicesData?.items ?? []}
      serviceGroups={serviceGroupsData?.items ?? []}
      isLoading={categoryLoading || groupsLoading || servicesLoading}
    />
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/category/$categorySlug',
  component: CategoryPage,
});
