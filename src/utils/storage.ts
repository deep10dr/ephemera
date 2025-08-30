// utils/storage.ts
import { user } from "../utils/types";
type StoredValue<T> = {
  value: T;
  expiry: number;
};

/**
 * Save data to localStorage with an expiry time
 * @param key The storage key
 * @param value The value to store (can be an object)
 * @param ttl Time to live in milliseconds
 */
export function setWithExpiry<T>(key: string, value: T, ttl: number): void {
  const now = new Date();
  const item: StoredValue<T> = {
    value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

/**
 * Retrieve data from localStorage considering expiry
 * @param key The storage key
 * @returns The stored value if valid, otherwise null
 */
export function getWithExpiry<T>(key: string): T | null {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) return null;

  try {
    const item: StoredValue<T> = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (error) {
    console.error("Error parsing stored value:", error);
    return null;
  }
}
export function removeItem(key: string) {
  localStorage.removeItem(key);
}
/**
 * Get user details from storage with expiry check
 * @param key The storage key
 * @returns Processed user details or null
 */
export function getUserWithExpiry(key: string): user | null {
  const item = getWithExpiry<unknown>(key);

  if (!item || !Array.isArray(item) || item.length === 0) return null;

  const data = item[0];
  const {
    email,
    identity_id,
    created_at,
    updated_at,
    provider,
    user_id,
    last_sign_in_at,
  } = data;
  const { name, phone } = data?.identity_data || {};

  const details: user = {
    name: name,
    id: user_id,
    email: email,
    created_at: created_at,
    updated_at: updated_at,
    phone: phone,
    identity_id: identity_id,
    last_sign_in_at: last_sign_in_at,
    provider: provider,
  };

  return details;
}
