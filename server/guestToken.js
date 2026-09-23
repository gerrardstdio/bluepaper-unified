// server/guestToken.js
import { randomBytes, randomUUID } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

/** Token URL-safe ~10 karakter */
export function createGuestToken(length = 10) {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

export function ensureUniqueToken(existingTokens = [], length = 10) {
  const set = new Set(existingTokens.filter(Boolean));
  for (let i = 0; i < 24; i++) {
    const token = createGuestToken(length);
    if (!set.has(token)) return token;
  }
  throw new Error("Gagal membuat token unik");
}

export function newGuestId() {
  return randomUUID();
}

/** Migrasi data lama: slug nama → token */
export function normalizeGuests(guests = []) {
  const used = new Set(guests.map((g) => g.token).filter(Boolean));
  return guests.map((g) => {
    let token = g.token;
    if (!token) {
      token = ensureUniqueToken([...used]);
      used.add(token);
    } else {
      used.add(token);
    }
    // di server/guestToken.js — dalam return object tiap guest:
    return {
      id: g.id || newGuestId(),
      token,
      name: String(g.name || "Tamu Undangan").trim() || "Tamu Undangan",
      createdAt: g.createdAt || new Date().toISOString(),
      shared: Boolean(g.shared),
      sharedAt: g.sharedAt || null,
    };
  });
}

export function findGuestByParam(guests, param) {
  if (!param) return null;
  const p = String(param);
  return (
    (guests || []).find((g) => g.token === p || g.id === p || g.slug === p) ||
    null
  );
}
