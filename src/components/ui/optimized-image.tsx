import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { generateSrcSet, generateSizes, ImageVariant, isStorageUrl } from "@/lib/image-utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  variants?: Record<string, ImageVariant>;
  width?: number;
  height?: number;
  className?: string;
  containerClassName?: string;
  priority?: boolean; // For hero images - preload and no lazy loading
  sizes?: string;
  objectFit?: "cover" | "contain" | "fill" | "none";
  type?: "hero" | "card" | "thumbnail" | "avatar";
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  variants,
  width,
  height,
  className,
  containerClassName,
  priority = false,
  sizes: customSizes,
  objectFit = "cover",
  type = "card",
  fallbackSrc = "",
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate srcset from variants
  const srcSet = variants && Object.keys(variants).length > 0 
    ? generateSrcSet(variants) 
    : undefined;

  // Use custom sizes or generate based on type
  const sizesAttr = customSizes || generateSizes(type);

  // Preload for priority images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      if (srcSet) {
        link.setAttribute('imagesrcset', srcSet);
        link.setAttribute('imagesizes', sizesAttr);
      }
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src, srcSet, sizesAttr]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
    onError?.();
  };

  // Calculate aspect ratio for skeleton
  const aspectRatio = width && height ? width / height : undefined;
  const paddingBottom = aspectRatio ? `${(1 / aspectRatio) * 100}%` : undefined;

  // Object fit classes
  const objectFitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
  }[objectFit];

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full h-full",
        containerClassName
      )}
      style={{
        paddingBottom: !isLoaded && paddingBottom ? paddingBottom : undefined,
      }}
    >
      {/* Skeleton loader */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          style={{ paddingBottom }}
        />
      )}

      {/* Error state */}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-muted-foreground text-sm">Failed to load</span>
        </div>
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        srcSet={srcSet}
        sizes={sizesAttr}
        className={cn(
          "block w-full h-full transition-opacity duration-300",
          objectFitClass,
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}

// Specialized components for common use cases

interface HeroImageProps extends Omit<OptimizedImageProps, 'priority' | 'type'> {}

export function HeroImage(props: HeroImageProps) {
  return <OptimizedImage {...props} priority type="hero" />;
}

interface CardImageProps extends Omit<OptimizedImageProps, 'type'> {}

export function CardImage(props: CardImageProps) {
  return <OptimizedImage {...props} type="card" />;
}

interface ThumbnailImageProps extends Omit<OptimizedImageProps, 'type'> {}

export function ThumbnailImage(props: ThumbnailImageProps) {
  return <OptimizedImage {...props} type="thumbnail" />;
}

interface AvatarImageProps extends Omit<OptimizedImageProps, 'type' | 'objectFit'> {}

export function AvatarImage(props: AvatarImageProps) {
  return (
    <OptimizedImage 
      {...props} 
      type="avatar" 
      objectFit="cover"
      className={cn("rounded-full", props.className)}
    />
  );
}

export default OptimizedImage;
