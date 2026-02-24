// image-utils.ts — uses backend /api/upload (no Supabase storage)

import { api } from "@/lib/apiClient";

export interface ImageVariant {
  width: number;
  height: number;
  path: string;
  url: string;
}

export interface ProcessedImage {
  originalPath: string;
  originalUrl: string;
  variants: Record<string, ImageVariant>;
  altText: string;
  width: number;
  height: number;
}

// Target sizes for responsive images
export const IMAGE_SIZES = {
  hero: 1920,
  section: 1200,
  mobile: 600,
  thumbnail: 400,
} as const;

// Generate SEO-friendly filename prefix
export function generateSeoFilename(originalName: string, prefix?: string): string {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 10);

  const baseName = originalName
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);

  const finalPrefix = prefix
    ? prefix.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20)
    : '';

  return `${finalPrefix ? finalPrefix + '-' : ''}${baseName}-${timestamp}`;
}

// Get image dimensions from File
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve({ width: img.width, height: img.height }); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
    img.src = url;
  });
}

// Upload a single variant to the backend
async function uploadVariant(
  file: File,
  variant: string,
  prefix: string,
  token?: string
): Promise<{ path: string; url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const authToken = token || localStorage.getItem('auth_token') || '';
  // In production VITE_API_URL is not set — use relative /api/... paths on same Vercel domain
  const apiBase = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:4000' : '');

  const res = await fetch(
    `${apiBase}/api/upload?variant=${variant}&prefix=${encodeURIComponent(prefix)}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: formData,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || `Upload failed: ${res.status}`);
  }

  return res.json();
}

// Process and upload image with all variants
export async function processAndUploadImage(
  file: File,
  altText: string,
  prefix?: string,
  onProgress?: (progress: number) => void
): Promise<ProcessedImage> {
  const seoPrefix = generateSeoFilename(file.name, prefix);
  const { width: originalWidth, height: originalHeight } = await getImageDimensions(file);

  onProgress?.(5);

  // Upload original
  const originalUpload = await uploadVariant(file, 'original', seoPrefix);
  onProgress?.(30);

  // Upload each variant
  const variants: Record<string, ImageVariant> = {};
  const sizes = Object.entries(IMAGE_SIZES) as [string, number][];
  const step = 60 / sizes.length;
  let progress = 30;

  for (const [sizeName, maxWidth] of sizes) {
    if (originalWidth >= maxWidth) {
      const upload = await uploadVariant(file, sizeName, seoPrefix);
      const aspectRatio = originalHeight / originalWidth;
      const variantWidth = Math.min(originalWidth, maxWidth);
      variants[sizeName] = {
        width: variantWidth,
        height: Math.round(variantWidth * aspectRatio),
        path: upload.path,
        url: upload.url,
      };
    }
    progress += step;
    onProgress?.(Math.round(progress));
  }

  onProgress?.(100);

  const aspectRatio = originalHeight / originalWidth;
  const finalWidth = Math.min(originalWidth, IMAGE_SIZES.hero);

  return {
    originalPath: originalUpload.path,
    originalUrl: originalUpload.url,
    variants,
    altText,
    width: finalWidth,
    height: Math.round(finalWidth * aspectRatio),
  };
}

// Delete an uploaded image via backend
export async function deleteImage(storagePath: string): Promise<void> {
  const authToken = localStorage.getItem('auth_token') || '';
  // In production VITE_API_URL is not set — use relative /api/... paths on same Vercel domain
  const apiBase = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:4000' : '');

  await fetch(`${apiBase}/api/upload?path=${encodeURIComponent(storagePath)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${authToken}` },
  });
}

// Generate srcset string from variants
export function generateSrcSet(variants: Record<string, ImageVariant>): string {
  return Object.values(variants)
    .sort((a, b) => a.width - b.width)
    .map(v => `${v.url} ${v.width}w`)
    .join(', ');
}

// Generate sizes attribute for responsive images
export function generateSizes(type: 'hero' | 'card' | 'thumbnail' | 'avatar' = 'card'): string {
  switch (type) {
    case 'hero': return '100vw';
    case 'card': return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'thumbnail': return '(max-width: 640px) 50vw, 200px';
    case 'avatar': return '96px';
    default: return '100vw';
  }
}

// Check if URL is from our own uploads
export function isStorageUrl(url: string): boolean {
  return url.includes('/uploads/') || url.includes('supabase.co/storage');
}

// Get the best variant URL for a given width
export function getBestVariantUrl(
  variants: Record<string, ImageVariant>,
  originalUrl: string,
  targetWidth: number
): string {
  if (!variants || Object.keys(variants).length === 0) return originalUrl;
  const sorted = Object.values(variants).sort((a, b) => a.width - b.width);
  return (sorted.find(v => v.width >= targetWidth) || sorted[sorted.length - 1])?.url || originalUrl;
}
