/**
 * Cloud Sync Service & Admin PIN Protection
 * Synchronizes menu groups, prices, images, and branding across ALL devices, phones, and Smart TVs in real time.
 */

import { ProductGroup, RestaurantInfo } from "../data/menuData";

// Default Master Admin PIN (Owner can change anytime)
export const DEFAULT_ADMIN_PIN = "7860"; 
export const PIN_STORAGE_KEY = "mrfaizi_admin_pin";

// Shared Cloud Bin Endpoint for Mr Faizi Showroom Signage
// Uses JSONBin.io Cloud API for universal multi-device sync
const CLOUD_BIN_ID = "67972e38ad19ca34f8f4a7c0"; // Master showroom cloud document
const MASTER_KEY = "$2a$10$vY3PzKkW27N43gV7Z00xMe6b1kUfx.8tZg4u4kE5lBv5jA3fX2x0C"; // Universal Cloud Key

export interface CloudSignagePayload {
  version: number;
  updatedAt: string;
  updatedBy?: string;
  restaurantInfo: RestaurantInfo;
  groups: ProductGroup[];
}

/**
 * Verify Admin PIN
 */
export function verifyAdminPin(inputPin: string): boolean {
  const currentPin = localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_ADMIN_PIN;
  return inputPin.trim() === currentPin.trim();
}

/**
 * Update Admin PIN
 */
export function setAdminPin(newPin: string): void {
  localStorage.setItem(PIN_STORAGE_KEY, newPin.trim());
}

/**
 * Push full menu, photos & prices to Cloud Server
 * So all TVs, mobiles, and browsers everywhere update instantly
 */
export async function pushToCloud(
  groups: ProductGroup[],
  restaurantInfo: RestaurantInfo
): Promise<boolean> {
  try {
    const payload: CloudSignagePayload = {
      version: Date.now(),
      updatedAt: new Date().toISOString(),
      restaurantInfo,
      groups,
    };

    // 1. Direct JSONBin cloud storage
    const response = await fetch(`https://api.jsonbin.io/v3/b/${CLOUD_BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": MASTER_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn("Cloud sync primary endpoint returned status:", response.status);
      // Secondary fallback endpoint
      return false;
    }

    // Save timestamp locally
    localStorage.setItem("last_cloud_sync", payload.updatedAt);
    return true;
  } catch (err) {
    console.error("Failed to push to cloud storage:", err);
    return false;
  }
}

/**
 * Fetch latest data from Cloud Server
 * Used by Smart TVs and other browsers to stay in sync
 */
export async function fetchFromCloud(): Promise<CloudSignagePayload | null> {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${CLOUD_BIN_ID}/latest`, {
      method: "GET",
      headers: {
        "X-Master-Key": MASTER_KEY,
      },
      cache: "no-store", // Always fetch live data
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    if (json && json.record && json.record.groups) {
      return json.record as CloudSignagePayload;
    }
    return null;
  } catch (err) {
    console.warn("Could not fetch cloud data:", err);
    return null;
  }
}
