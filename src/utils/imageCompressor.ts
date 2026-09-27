/**
 * Compress an uploaded image file before saving to base64
 * This prevents browser storage quota crashes while keeping high visual clarity on 1080p/4K TVs
 */
export function compressImageFile(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG, read as dataURL directly
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP or JPEG for optimal compression
        try {
          const compressedDataUrl = canvas.toDataURL("image/webp", quality);
          resolve(compressedDataUrl);
        } catch {
          const fallbackDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(fallbackDataUrl);
        }
      };
      img.onerror = () => {
        // Fallback to original
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
