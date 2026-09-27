/**
 * Service to upload images directly to ImgBB cloud storage
 * Returns permanent direct image URL hosted on CDN
 */

// Default free key (or can be configured via environment/user input)
const DEFAULT_IMGBB_KEY = "6d207e02198a847aa5fb3d9a425acc2a"; // Public upload key for free hosting

export interface ImgBBUploadResult {
  url: string;
  displayUrl: string;
  deleteUrl?: string;
  thumb?: string;
}

/**
 * Uploads a File or Base64 data URL to ImgBB Cloud
 * If successful, returns permanent HTTPS image URL
 * If failed, falls back gracefully
 */
export async function uploadToImgBB(fileOrBase64: File | string, customKey?: string): Promise<string> {
  const apiKey = customKey || localStorage.getItem("imgbb_api_key") || DEFAULT_IMGBB_KEY;
  
  const formData = new FormData();
  if (typeof fileOrBase64 === "string") {
    // Strip header if data URL
    const base64Data = fileOrBase64.replace(/^data:image\/[a-z]+;base64,/, "");
    formData.append("image", base64Data);
  } else {
    formData.append("image", fileOrBase64);
  }

  const endpoint = `https://api.imgbb.com/1/upload?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ImgBB upload failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (data && data.success && data.data && data.data.url) {
    return data.data.display_url || data.data.url;
  }

  throw new Error("Invalid response from ImgBB");
}
