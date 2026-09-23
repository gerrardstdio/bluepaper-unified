/**
 * Template registry — tambah template baru di sini.
 *
 * Satu server: demo URL = /demo/{slug}/{coupleSlug}
 *
 * Cara menambah template-2:
 * 1. Copy komponen invitation ke src/components/invitation-template-2 (atau folder serupa)
 * 2. Tambah route di App.jsx
 * 3. Tambah entry di array ini (slug + coupleSlug)
 * 4. Taruh foto di public/media/template-2/photo/
 */

export const templates = [
  {
    id: 1,
    slug: "template-1",
    coupleSlug: "andi-sinta",
    cat: "minimal",
    theme: "theme-ivory",
    mono: "C M",
    title: "Ivory Letters",
    price: 175000,
    originalPrice: 350000,
    popular: false,
    coverImages: [
      "https://ik.imagekit.io/iu0rlgs9i/Catalogue%20Template%20Image/Template-1/4.png",
      "https://ik.imagekit.io/iu0rlgs9i/Catalogue%20Template%20Image/Template-1/3.png",
      "https://ik.imagekit.io/iu0rlgs9i/Catalogue%20Template%20Image/Template-1/1.png",
    ],
    get demoUrl() {
      return `/demo/${this.slug}/${this.coupleSlug}`;
    },
  },
];

export const filters = [
  { key: "all", label: "All" },
  { key: "minimal", label: "Minimal" },
  { key: "elegant", label: "Elegant" },
  { key: "floral", label: "Floral" },
  { key: "modern", label: "Modern" },
];

export const themeClasses = {
  "theme-ivory":
    "bg-gradient-to-b from-[#fbf7f0] to-white to-65% text-[#8a6a3f]",
  "theme-blue":
    "bg-gradient-to-b from-[#eef4f9] to-white to-65% text-primary-dark",
  "theme-floral":
    "bg-gradient-to-b from-[#f6f3ee] to-white to-65% text-[#7a7757]",
  "theme-editorial": "bg-[#fbfbfa] text-ink",
  "theme-blush":
    "bg-gradient-to-b from-[#f8efee] to-white to-65% text-[#a9716d]",
  "theme-classic":
    "bg-gradient-to-b from-[#f5f5f3] to-white to-65% text-[#4a4a48]",
};
