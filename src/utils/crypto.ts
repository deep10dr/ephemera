// cryptoUtils.ts

async function getKeyFromPin(pin: string): Promise<CryptoKey> {
  if (!/^\d{6}$/.test(pin)) {
    throw new Error("PIN must be a 6-digit number");
  }
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(pin.padEnd(32, "0")), 
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptLink(link: string, pin: string): Promise<string> {
  const key = await getKeyFromPin(pin);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
  const enc = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(link)
  );

  // Store IV + ciphertext together
  const encryptedBytes = new Uint8Array(iv.length + encrypted.byteLength);
  encryptedBytes.set(iv, 0);
  encryptedBytes.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...encryptedBytes)); // Base64
}

export async function decryptLink(
  encryptedData: string,
  pin: string
): Promise<string> {
  const key = await getKeyFromPin(pin);

  const bytes = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));
  const iv = bytes.slice(0, 12);
  const ciphertext = bytes.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  const dec = new TextDecoder();
  return dec.decode(decrypted);
}
