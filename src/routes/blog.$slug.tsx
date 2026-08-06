import { createRoute } from '@tanstack/react-router';
import { FileQuestion } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blogPosts';
import { EmptyState } from '@/components/shared/EmptyState';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Route as RootRoute } from './__root';

function BlogPostPage() {
  const { slug } = Route.useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  useDocumentTitle(post?.title ?? 'Blog post not found', post?.excerpt);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState icon={FileQuestion} title="Post not found" actionLabel="Back to blog" actionLink={{ to: '/blog' }} />
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <p className="text-xs text-ink-muted">
        {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {post.author}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-ink-primary">{post.title}</h1>

      <div className="mt-6 overflow-hidden rounded-card bg-muted">
        <ImageWithFallback src={post.thumbnailUrl} alt="" className="aspect-[16/9] w-full object-cover" />
      </div>

      <div className="mt-8 flex flex-col gap-4 text-sm leading-relaxed text-ink-secondary">
        {post.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/blog/$slug',
  component: BlogPostPage,
});
