// src/templates/template-1/hooks/useRSVPStorage.js

function apiUrl(storageKey = "demo") {
  const key = encodeURIComponent(storageKey || "demo");
  return `/api/rsvp/${key}`;
}

export async function getRsvpList(storageKey = "demo") {
  try {
    const res = await fetch(apiUrl(storageKey), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const parsed = await res.json();
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addRsvpEntry(entry, storageKey = "demo") {
  const res = await fetch(apiUrl(storageKey), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(entry),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal menyimpan RSVP");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : (data.list ?? []);
}

export const RSVP_UPDATED_EVENT = "wedding:rsvp-updated";

export function notifyRsvpUpdated(list, storageKey = "demo") {
  window.dispatchEvent(
    new CustomEvent(RSVP_UPDATED_EVENT, {
      detail: { list, storageKey },
    }),
  );
}
