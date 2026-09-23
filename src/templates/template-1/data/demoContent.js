import { BACKGROUNDS } from "./backgrounds";
import { COUPLE as COUPLE_RAW } from "./couple";
import {
  HERO_VERSE_TEXT,
  HERO_VERSE_REF,
  journeys,
  events,
  calendarUrl,
  STREAMING_URL,
  GALLERY_PHOTOS,
  GALLERY_VIDEO_URL,
  GIFT_ACCOUNTS,
  GIFT_ADDRESS,
  WEDDING_DATE,
  MUSIC_URL,
  BRIDE_PARENTS,
  GROOM_PARENTS,
  BRIDE_IG,
  BRIDE_IG_URL,
  GROOM_IG,
  GROOM_IG_URL,
} from "./users";
import { GUESTS, DEFAULT_GUEST } from "./guests";
import { COMPANY } from "./dataAdmin";

export const DEMO_CONTENT = {
  mode: "demo",
  slug: COUPLE_RAW.slug || "andi-sinta",
  customerSlug: COUPLE_RAW.slug || "andi-sinta",
  template: "template-1",
  couple: {
    groom: COUPLE_RAW.groom,
    bride: COUPLE_RAW.bride,
    slug: COUPLE_RAW.slug,
    weddingDateLabel: COUPLE_RAW.weddingDateLabel || "",
    brideParents: COUPLE_RAW.brideParents || BRIDE_PARENTS || "Bapak & Ibu",
    groomParents: COUPLE_RAW.groomParents || GROOM_PARENTS || "Bapak & Ibu",
    brideIg: COUPLE_RAW.brideIg || BRIDE_IG || "",
    brideIgUrl:
      COUPLE_RAW.brideIgUrl || BRIDE_IG_URL || "https://instagram.com/",
    groomIg: COUPLE_RAW.groomIg || GROOM_IG || "",
    groomIgUrl:
      COUPLE_RAW.groomIgUrl || GROOM_IG_URL || "https://instagram.com/",
    get displayName() {
      return `${this.groom} & ${this.bride}`;
    },
  },
  backgrounds: { ...BACKGROUNDS },
  galleryPhotos: GALLERY_PHOTOS || [],
  galleryVideoUrl: GALLERY_VIDEO_URL || "",
  guests: GUESTS || [{ slug: "tamu-undangan", name: "Tamu Undangan" }],
  defaultGuest: DEFAULT_GUEST || {
    slug: "tamu-undangan",
    name: "Tamu Undangan",
  },
  journeys: journeys || [],
  events: events || [],
  calendarUrl: calendarUrl || "",
  streamingUrl: STREAMING_URL || "",
  giftAccounts: GIFT_ACCOUNTS || [],
  giftAddress: GIFT_ADDRESS || { recipient: "", address: "" },
  musicUrl:
    MUSIC_URL ||
    "/media/template-1/music/Christina Perri - A Thousand Years.mp3",
  weddingDate: WEDDING_DATE || "",
  heroVerseText: HERO_VERSE_TEXT || "",
  heroVerseRef: HERO_VERSE_REF || "",
  company: COMPANY || {
    name: "bluepaper-invitation.co",
    copyrightYear: 2026,
    whatsapp: "",
    socials: [],
  },
};
