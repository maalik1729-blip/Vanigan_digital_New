import { ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** Base path without extension (e.g., '/assets/temple-logo') */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Width in pixels for 1x display */
  width: number;
  /** Height in pixels for 1x display */
  height: number;
  /** Enable lazy loading (default: true for below-the-fold images) */
  loading?: 'lazy' | 'eager';
  /** CSS classes */
  className?: string;
  /** Sizes attribute for responsive images */
  sizes?: string;
}

/**
 * Optimized image component that serves WebP/AVIF with PNG fallback
 * Automatically generates responsive image sets for retina displays
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  className,
  sizes,
  ...props
}: OptimizedImageProps) {
  // Extract base name and directory
  const basePath = src.replace(/\.(png|jpg|jpeg)$/, '');
  
  return (
    <picture>
      {/* AVIF format - best compression */}
      <source
        type="image/avif"
        srcSet={`${basePath}.avif ${width}w, ${basePath}@2x.avif ${width * 2}w`}
        sizes={sizes || `${width}px`}
      />
      
      {/* WebP format - great compression, wide support */}
      <source
        type="image/webp"
        srcSet={`${basePath}.webp ${width}w, ${basePath}@2x.webp ${width * 2}w`}
        sizes={sizes || `${width}px`}
      />
      
      {/* Fallback to original */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        className={className}
        {...props}
      />
    </picture>
  );
}
