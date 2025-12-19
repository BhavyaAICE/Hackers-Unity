import { supabase } from "@/integrations/supabase/client";

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

// Generate SEO-friendly filename
export function generateSeoFilename(originalName: string, prefix?: string): string {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 10);
  
  // Clean the filename
  const baseName = originalName
    .toLowerCase()
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
    .slice(0, 50); // Limit length
  
  const finalPrefix = prefix 
    ? prefix.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20)
    : '';
  
  return `${finalPrefix ? finalPrefix + '-' : ''}${baseName}-${timestamp}`;
}

// Convert image to canvas and resize
async function resizeImage(
  file: File | Blob,
  maxWidth: number,
  quality = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      let { width, height } = img;
      
      // Only resize if larger than target
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Use high quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        'image/webp',
        quality
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

// Get image dimensions
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

// Upload a single image variant to storage
async function uploadVariant(
  blob: Blob,
  path: string
): Promise<{ path: string; url: string }> {
  const { data, error } = await supabase.storage
    .from('images')
    .upload(path, blob, {
      contentType: 'image/webp',
      cacheControl: '31536000', // 1 year cache
      upsert: true,
    });
  
  if (error) throw error;
  
  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(data.path);
  
  return {
    path: data.path,
    url: urlData.publicUrl,
  };
}

// Process and upload image with all variants
export async function processAndUploadImage(
  file: File,
  altText: string,
  prefix?: string,
  onProgress?: (progress: number) => void
): Promise<ProcessedImage> {
  const seoFilename = generateSeoFilename(file.name, prefix);
  const { width: originalWidth, height: originalHeight } = await getImageDimensions(file);
  
  onProgress?.(10);
  
  // Create variants for each size
  const variants: Record<string, ImageVariant> = {};
  const sizes = Object.entries(IMAGE_SIZES);
  let progress = 10;
  const progressStep = 70 / (sizes.length + 1);
  
  // Upload original as WebP
  const originalBlob = await resizeImage(file, Math.max(originalWidth, IMAGE_SIZES.hero), 0.9);
  progress += progressStep;
  onProgress?.(Math.round(progress));
  
  const originalUpload = await uploadVariant(
    originalBlob,
    `${seoFilename}/original.webp`
  );
  progress += progressStep;
  onProgress?.(Math.round(progress));
  
  // Generate and upload each variant
  for (const [sizeName, maxWidth] of sizes) {
    if (originalWidth >= maxWidth) {
      const resizedBlob = await resizeImage(file, maxWidth, 0.85);
      const upload = await uploadVariant(
        resizedBlob,
        `${seoFilename}/${sizeName}.webp`
      );
      
      // Calculate actual dimensions
      const aspectRatio = originalHeight / originalWidth;
      const variantWidth = Math.min(originalWidth, maxWidth);
      const variantHeight = Math.round(variantWidth * aspectRatio);
      
      variants[sizeName] = {
        width: variantWidth,
        height: variantHeight,
        path: upload.path,
        url: upload.url,
      };
    }
    
    progress += progressStep;
    onProgress?.(Math.round(progress));
  }
  
  onProgress?.(100);
  
  // Calculate original dimensions after WebP conversion
  const aspectRatio = originalHeight / originalWidth;
  const finalWidth = Math.min(originalWidth, IMAGE_SIZES.hero);
  const finalHeight = Math.round(finalWidth * aspectRatio);
  
  return {
    originalPath: originalUpload.path,
    originalUrl: originalUpload.url,
    variants,
    altText,
    width: finalWidth,
    height: finalHeight,
  };
}

// Delete image and all variants from storage
export async function deleteImage(storagePath: string): Promise<void> {
  // Extract the folder path from the storage path
  const folderPath = storagePath.replace(/\/[^/]+$/, '');
  
  // List all files in the folder
  const { data: files, error: listError } = await supabase.storage
    .from('images')
    .list(folderPath);
  
  if (listError) throw listError;
  
  if (files && files.length > 0) {
    const filePaths = files.map(file => `${folderPath}/${file.name}`);
    const { error: deleteError } = await supabase.storage
      .from('images')
      .remove(filePaths);
    
    if (deleteError) throw deleteError;
  }
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
    case 'hero':
      return '100vw';
    case 'card':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'thumbnail':
      return '(max-width: 640px) 50vw, 200px';
    case 'avatar':
      return '96px';
    default:
      return '100vw';
  }
}

// Check if URL is a Supabase storage URL
export function isStorageUrl(url: string): boolean {
  return url.includes('supabase.co/storage/v1/object/public/images/');
}

// Get the best variant URL for a given width
export function getBestVariantUrl(
  variants: Record<string, ImageVariant>,
  originalUrl: string,
  targetWidth: number
): string {
  if (!variants || Object.keys(variants).length === 0) {
    return originalUrl;
  }
  
  // Sort variants by width
  const sortedVariants = Object.values(variants).sort((a, b) => a.width - b.width);
  
  // Find the smallest variant that's >= target width, or the largest available
  const bestVariant = sortedVariants.find(v => v.width >= targetWidth) || sortedVariants[sortedVariants.length - 1];
  
  return bestVariant?.url || originalUrl;
}
