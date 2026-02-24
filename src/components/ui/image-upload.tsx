import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { processAndUploadImage, deleteImage, ProcessedImage } from "@/lib/image-utils";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string, imageData?: ProcessedImage) => void;
  onImageDataChange?: (data: ProcessedImage | null) => void;
  altText?: string;
  onAltTextChange?: (alt: string) => void;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  showThumbnailOption?: boolean;
  thumbnailValue?: string;
  onThumbnailChange?: (url: string) => void;
  useSameAsThumbnail?: boolean;
  onUseSameAsThumbnailChange?: (value: boolean) => void;
  filenamePrefix?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "banner" | "auto";
  allowUrlInput?: boolean;
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  banner: "aspect-[21/9]",
  auto: "",
};

export function ImageUpload({
  value,
  onChange,
  onImageDataChange,
  altText = "",
  onAltTextChange,
  label,
  description,
  required = false,
  disabled = false,
  showThumbnailOption = false,
  thumbnailValue,
  onThumbnailChange,
  useSameAsThumbnail = true,
  onUseSameAsThumbnailChange,
  filenamePrefix,
  className,
  aspectRatio = "video",
  allowUrlInput = true,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [localAltText, setLocalAltText] = useState(altText);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync localAltText with altText prop when it changes
  useEffect(() => {
    setLocalAltText(altText);
  }, [altText]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  }, [disabled, isUploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  }, [disabled, isUploading]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleFile = async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, GIF, WebP, or SVG)");
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError("Image must be smaller than 50MB");
      return;
    }

    // Validate alt text is provided
    const currentAlt = localAltText || altText;
    if (!currentAlt.trim()) {
      setError("Please provide alt text for accessibility before uploading");
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await processAndUploadImage(
        file,
        currentAlt,
        filenamePrefix,
        setUploadProgress
      );

      onChange(result.originalUrl, result);
      onImageDataChange?.(result);

      // Handle thumbnail
      if (showThumbnailOption && useSameAsThumbnail && onThumbnailChange) {
        const thumbnailVariant = result.variants.thumbnail || result.variants.mobile;
        onThumbnailChange(thumbnailVariant?.url || result.originalUrl);
      }

      toast.success("Image uploaded and optimized successfully");
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = async () => {
    if (value && value.includes('supabase.co/storage')) {
      try {
        // Extract path from URL
        const pathMatch = value.match(/\/images\/(.+)/);
        if (pathMatch) {
          await deleteImage(pathMatch[1]);
        }
      } catch (err) {
        console.error("Failed to delete image from storage:", err);
      }
    }

    onChange("");
    onImageDataChange?.(null);
    if (onThumbnailChange) {
      onThumbnailChange("");
    }
    setShowUrlInput(false);
    setUrlInputValue("");
  };

  const handleAltTextChange = (newAlt: string) => {
    setLocalAltText(newAlt);
    onAltTextChange?.(newAlt);
    if (error === "Please provide alt text for accessibility before uploading") {
      setError(null);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInputValue.trim()) {
      setError("Please enter a valid URL");
      return;
    }
    
    // Basic URL validation
    try {
      new URL(urlInputValue);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    onChange(urlInputValue);
    setShowUrlInput(false);
    setUrlInputValue("");
    setError(null);
    toast.success("Image URL added successfully");
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <Label className="flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {/* Alt text input - required before upload */}
      <div className="space-y-2">
        <Label htmlFor="alt-text" className="text-sm">
          Alt Text (required for SEO & accessibility)
        </Label>
        <Input
          id="alt-text"
          value={localAltText}
          onChange={(e) => handleAltTextChange(e.target.value)}
          placeholder="Describe the image for screen readers and SEO..."
          disabled={disabled}
        />
      </div>

      {/* URL Input Mode */}
      {showUrlInput && (
        <div className="space-y-2 p-4 bg-muted/50 rounded-lg border border-border">
          <Label className="text-sm">Image URL</Label>
          <div className="flex gap-2">
            <Input
              value={urlInputValue}
              onChange={(e) => setUrlInputValue(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={disabled}
            />
            <Button type="button" onClick={handleUrlSubmit} disabled={disabled}>
              Add
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowUrlInput(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Upload area */}
      {!showUrlInput && (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg transition-all duration-200",
            aspectRatioClasses[aspectRatio],
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50",
            disabled && "opacity-50 cursor-not-allowed",
            !value && "min-h-[200px]"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {value ? (
            <div className="relative w-full h-full">
              <img
                src={value}
                alt={localAltText || "Uploaded image"}
                className="w-full h-full object-contain rounded-lg bg-muted"
                onError={(e) => {
                  e.currentTarget.src = "";
                  e.currentTarget.alt = "Failed to load image";
                  setError("Failed to load image from URL");
                }}
              />
              {!disabled && !isUploading && (
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Replace
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer",
                (disabled || isUploading) && "cursor-not-allowed"
              )}
              onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <div className="w-48 space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      Optimizing... {uploadProgress}%
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-muted">
                    {isDragging ? (
                      <ImageIcon className="w-8 h-8 text-primary" />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {isDragging ? "Drop image here" : "Click or drag image to upload"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPEG, PNG, GIF, WebP • Max 50MB
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Will be converted to WebP & optimized
                    </p>
                  </div>
                  {allowUrlInput && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUrlInput(true);
                      }}
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Or paste URL
                    </Button>
                  )}
                </>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || isUploading}
          />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Thumbnail options */}
      {showThumbnailOption && value && (
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <Label htmlFor="use-same-thumbnail" className="text-sm">
              Use main image as thumbnail
            </Label>
            <Switch
              id="use-same-thumbnail"
              checked={useSameAsThumbnail}
              onCheckedChange={onUseSameAsThumbnailChange}
              disabled={disabled}
            />
          </div>

          {!useSameAsThumbnail && (
            <div className="pt-2">
              <Label className="text-sm mb-2 block">Custom Thumbnail</Label>
              <ImageUpload
                value={thumbnailValue}
                onChange={(url) => onThumbnailChange?.(url)}
                altText={`Thumbnail: ${localAltText}`}
                aspectRatio="square"
                filenamePrefix={`${filenamePrefix}-thumb`}
                disabled={disabled}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
