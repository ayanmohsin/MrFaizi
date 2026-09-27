import { openDB, DBSchema, IDBPDatabase } from "idb";
import { ProductGroup, RestaurantInfo, MENU_GROUPS, RESTAURANT_INFO } from "../data/menuData";

interface SignageDB extends DBSchema {
  settings: {
    key: string;
    value: any;
  };
  groups: {
    key: string;
    value: ProductGroup;
  };
}

const DB_NAME = "mrfaizi_signage_db";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<SignageDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<SignageDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings");
        }
        if (!db.objectStoreNames.contains("groups")) {
          db.createObjectStore("groups", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

const STORAGE_KEYS = {
  RESTAURANT_INFO: "restaurant_info",
  GROUPS: "menu_groups",
  INITIALIZED: "is_initialized",
};

/**
 * Save all menu groups to IndexedDB + fallback localStorage
 */
export async function saveGroupsToStorage(groups: ProductGroup[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction("groups", "readwrite");
    await tx.store.clear();
    for (const group of groups) {
      await tx.store.put(group);
    }
    await tx.done;
  } catch (err) {
    console.warn("IndexedDB error saving groups, attempting localStorage fallback:", err);
    try {
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
    } catch (e) {
      console.error("Storage quota exceeded or unavailable:", e);
    }
  }
}

/**
 * Load all menu groups from IndexedDB (or localStorage fallback)
 */
export async function loadGroupsFromStorage(): Promise<ProductGroup[]> {
  try {
    const db = await getDB();
    const allGroups = await db.getAll("groups");
    if (allGroups && allGroups.length > 0) {
      return allGroups;
    }
  } catch (err) {
    console.warn("IndexedDB error reading groups:", err);
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GROUPS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("localStorage parse error:", e);
  }

  return MENU_GROUPS;
}

/**
 * Save restaurant profile (brand name, logo, hotline, ticker note)
 */
export async function saveRestaurantInfoToStorage(info: RestaurantInfo): Promise<void> {
  try {
    const db = await getDB();
    await db.put("settings", info, STORAGE_KEYS.RESTAURANT_INFO);
  } catch (err) {
    console.warn("IndexedDB error saving restaurant info:", err);
    try {
      localStorage.setItem(STORAGE_KEYS.RESTAURANT_INFO, JSON.stringify(info));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }
}

/**
 * Load restaurant profile (brand name, logo, hotline, ticker note)
 */
export async function loadRestaurantInfoFromStorage(): Promise<RestaurantInfo> {
  try {
    const db = await getDB();
    const info = await db.get("settings", STORAGE_KEYS.RESTAURANT_INFO);
    if (info) {
      return info;
    }
  } catch (err) {
    console.warn("IndexedDB error reading restaurant info:", err);
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESTAURANT_INFO);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("localStorage parse error:", e);
  }

  return RESTAURANT_INFO;
}

/**
 * Clear saved storage and reset back to original code defaults
 */
export async function clearSignageStorage(): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(["settings", "groups"], "readwrite");
    await tx.objectStore("settings").clear();
    await tx.objectStore("groups").clear();
    await tx.done;
  } catch (err) {
    console.warn("IndexedDB clear error:", err);
  }

  try {
    localStorage.removeItem(STORAGE_KEYS.GROUPS);
    localStorage.removeItem(STORAGE_KEYS.RESTAURANT_INFO);
  } catch (e) {
    console.error("localStorage clear error:", e);
  }
}
