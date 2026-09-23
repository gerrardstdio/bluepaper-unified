// src/data/guests.js

export const GUESTS = [
  { slug: "tamu-undangan", name: "Tamu Undangan" },
  { slug: "budi-santoso", name: "Budi Santoso" },
  { slug: "keluarga-wijaya", name: "Keluarga Wijaya" },
  { slug: "dr-siti-aminah", name: "Dr. Siti Aminah" },
];

/** Guest default bila URL tanpa segment tamu */
export const DEFAULT_GUEST = GUESTS[0];

/** true jika slug ada di daftar (atau kosong = pakai default) */
export function isValidGuestSlug(slug) {
  if (!slug) return true;
  return GUESTS.some((g) => g.slug === slug);
}

export function getGuestBySlug(slug) {
  if (!slug) return DEFAULT_GUEST;
  return GUESTS.find((g) => g.slug === slug) ?? null;
}