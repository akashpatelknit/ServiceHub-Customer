import { useEffect, useState, type ImgHTMLAttributes } from 'react';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';

interface ImageWithFallbackProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
}

/**
 * Drop-in <img> replacement: falls back to PLACEHOLDER_IMAGE when `src` is missing
 * up front, or swaps to it on a runtime load failure (broken URL, 404). The error
 * guard only fires once per resolved src (reset via the `src` effect below) so a
 * failing placeholder itself can't trigger a retry loop.
 */
export function ImageWithFallback({ src, ...props }: ImageWithFallbackProps) {
  const [hasErrored, setHasErrored] = useState(false);

  useEffect(() => {
    setHasErrored(false);
  }, [src]);

  const resolvedSrc = src && !hasErrored ? src : PLACEHOLDER_IMAGE;

  return (
    <img
      {...props}
      src={resolvedSrc}
      onError={() => {
        if (resolvedSrc !== PLACEHOLDER_IMAGE) setHasErrored(true);
      }}
    />
  );
}
