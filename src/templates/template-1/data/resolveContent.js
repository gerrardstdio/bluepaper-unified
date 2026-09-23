/**
 * Ubah wedding.json (live) → shape yang sama untuk semua section
 * Guests: { id, token, name } — token dipakai di URL /live/:slug/:token
 */
export function resolveLiveContent(raw) {
  if (!raw) return null;

  const photos = raw.photos || {};
  const couple = raw.couple || {};

  // Normalisasi guests (token baru + fallback data lama ber-slug)
  const guestsRaw =
    Array.isArray(raw.guests) && raw.guests.length > 0 ? raw.guests : [];

  const guests =
    guestsRaw.length > 0
      ? guestsRaw.map((g, i) => {
          const token = g.token || g.slug || `guest-${i + 1}`;
          return {
            id: g.id || `guest-${i + 1}`,
            token,
            name: String(g.name || "Tamu Undangan").trim() || "Tamu Undangan",
            // kompatibilitas lama (beberapa UI masih baca slug)
            slug: token,
            createdAt: g.createdAt || null,
          };
        })
      : [
          {
            id: "default",
            token: "tamu-undangan",
            name: "Tamu Undangan",
            slug: "tamu-undangan",
            createdAt: null,
          },
        ];

  const galleryPhotos = Array.isArray(raw.gallery)
    ? raw.gallery.map((src, i) =>
        typeof src === "string"
          ? { id: i + 1, src, alt: `Gallery ${i + 1}`, aspect: "portrait" }
          : {
              id: src?.id ?? i + 1,
              src: src?.src || "",
              alt: src?.alt || `Gallery ${i + 1}`,
              aspect: src?.aspect || "portrait",
            },
      )
    : [];

  return {
    mode: "live",
    slug: raw.slug,
    customerSlug: raw.slug,
    template: raw.template || "template-1",

    couple: {
      groom: couple.groom || "",
      bride: couple.bride || "",
      slug: raw.slug,
      weddingDateLabel: couple.weddingDateLabel || "",
      brideParents: couple.brideParents || "",
      groomParents: couple.groomParents || "",
      brideIg: couple.brideIg || "",
      brideIgUrl:
        couple.brideIgUrl ||
        (couple.brideIg ? `https://instagram.com/${couple.brideIg}` : ""),
      groomIg: couple.groomIg || "",
      groomIgUrl:
        couple.groomIgUrl ||
        (couple.groomIg ? `https://instagram.com/${couple.groomIg}` : ""),
      get displayName() {
        return `${this.groom} & ${this.bride}`;
      },
    },

    backgrounds: {
      cover: photos.cover || "",
      hero: photos.hero || "",
      bride: photos.bride || "",
      groom: photos.groom || "",
      journey: photos.journey || "",
      event: photos.event || "",
      streaming: photos.streaming || "",
      rsvp: photos.rsvp || "",
      wishes: photos.wishes || "",
      gallery: photos.gallery || "",
      gift: photos.gift || "",
      thankyou: photos.thankyou || "",
    },

    galleryPhotos,
    galleryVideoUrl: raw.galleryVideoUrl || "",

    guests,
    defaultGuest: guests[0],

    /** Cari tamu dari param URL (token / id / slug lama) */
    findGuest(param) {
      if (!param) return null;
      const p = String(param);
      return (
        guests.find((g) => g.token === p || g.id === p || g.slug === p) || null
      );
    },

    journeys: raw.journeys || [],
    events: raw.events || [],
    calendarUrl: raw.calendarUrl || "",
    streamingUrl: raw.streamingUrl || "",
    giftAccounts: raw.giftAccounts || [],
    giftAddress: (() => {
      const g = raw.giftAddress || {};
      if (Array.isArray(g.lines)) {
        return { name: g.name || g.recipient || "", lines: g.lines };
      }
      const text = g.address || "";
      return {
        name: g.name || g.recipient || "",
        lines: text
          ? String(text)
              .split(/\n/)
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };
    })(),
    musicUrl: raw.musicUrl || "",
    weddingDate: raw.weddingDate || couple.weddingDate || "",
    heroVerseText:
      raw.heroVerseText ||
      "",
    heroVerseRef: raw.heroVerseRef || "",
    company: raw.company || {
      name: "bluepaper-ivitation.co",
      copyrightYear: new Date().getFullYear(),
      whatsapp: "",
      socials: [],
    },
  };
}
