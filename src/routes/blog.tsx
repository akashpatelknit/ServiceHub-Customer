import { createRoute, Link } from '@tanstack/react-router';
import { BLOG_POSTS } from '@/data/blogPosts';
import { StaticContentPage } from '@/components/shared/StaticContentPage';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Route as RootRoute } from './__root';

function BlogPage() {
  useDocumentTitle('Blog', 'Tips, guides, and updates from ServiceHub on home maintenance and services.');

  return (
    <StaticContentPage
      eyebrow="ServiceHub blog"
      title="Tips for a well-kept home"
      description="Practical guides on home maintenance, plus the occasional look behind the scenes at ServiceHub."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="flex flex-col overflow-hidden rounded-card border border-border bg-card transition-shadow hover:shadow-card-light dark:hover:shadow-card-dark"
          >
            <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
              <ImageWithFallback src={post.thumbnailUrl} alt="" className="size-full object-cover" loading="lazy" />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <p className="text-xs text-ink-muted">
                {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <h2 className="line-clamp-2 text-base font-semibold text-ink-primary">{post.title}</h2>
              <p className="line-clamp-3 text-sm text-ink-secondary">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </StaticContentPage>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/blog',
  component: BlogPage,
});
