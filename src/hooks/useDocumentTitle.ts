import { useEffect } from 'react';

const SITE_NAME = 'ServiceHub';

function setMetaDescription(content: string) {
  let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = 'description';
    document.head.appendChild(tag);
  }
  tag.content = content;
}

/**
 * This is a Vite SPA with no SSR, so there's no per-route <head> rendering — this hook
 * is the whole "SEO meta tags" story: set document.title + the description meta tag
 * imperatively on mount/change. No react-helmet-async in the dependency tree; adding
 * one for a handful of static pages wasn't worth the extra dependency.
 */
export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | ${SITE_NAME}`;
    if (description) setMetaDescription(description);

    return () => {
      document.title = previousTitle;
    };
  }, [title, description]);
}
