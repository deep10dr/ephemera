// utils/storage.ts

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
