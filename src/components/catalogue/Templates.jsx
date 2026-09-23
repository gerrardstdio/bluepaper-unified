// Templates.jsx
import { useEffect, useState } from "react";
import { templates, filters, themeClasses } from "../../data/templates";

const INITIAL_COUNT = 6;
const SLIDE_MS = 3500;
const WA_NUMBER = "6285739211076";

const formatPrice = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const getDiscountPercent = (original, price) =>
  Math.round(((original - price) / original) * 100);

function buildOrderMessage(t) {
  const price = formatPrice(t.price);
  return (
    `Halo Bluepaper Invitation 👋\n\n` +
    `Saya ingin memilih template:\n` +
    `• Nama: ${t.title}\n` +
    `• Tema: ${t.names}\n` +
    `• Kategori: ${t.cat}\n` +
    `• Harga: ${price}\n\n` +
    `Mohon info langkah selanjutnya. Terima kasih.`
  );
}

function openWhatsAppOrder(t) {
  const text = encodeURIComponent(buildOrderMessage(t));
  window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank", "noopener");
}

function CardPreview({ t }) {
  const images = Array.isArray(t.coverImages)
    ? t.coverImages.filter(Boolean)
    : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [images.length]);

  if (images.length > 0) {
    return (
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
            draggable={false}
          />
        ))}

        {/* Soft top fade */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/20 to-transparent" />

        {/* ===== Soft multi-layer bottom blur ===== */}
        {/* Layer 1: very soft wide blur */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] " />

        {/* Layer 2: gradual dark gradient (lebih panjang & halus) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/65 via-black/30 via-40% to-transparent" />

        {/* Popular badge */}
        {t.popular && (
          <span className="absolute right-3.5 top-3.5 z-20 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium tracking-wide text-sky-700 shadow-sm  sm:right-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[11px]">
            Popular
          </span>
        )}
      </div>
    );
  }

  // Fallback tanpa gambar
  return (
    <div
      className={`relative flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden px-4 py-8 text-center ${themeClasses[t.theme]}`}
    >
      {t.popular && (
        <span className="absolute right-3.5 top-3.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-sky-700 shadow-sm sm:right-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[11px]">
          Popular
        </span>
      )}
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-current/40 font-serif text-sm sm:h-11 sm:w-11 sm:text-base">
        {t.mono}
      </div>
      <h4 className="font-serif text-[18px] font-normal leading-tight sm:text-[22px]">
        {t.names}
      </h4>
      <div className="my-3 h-px w-8 bg-current opacity-40" />
      <p className="text-[12px] opacity-70">{t.cat}</p>
    </div>
  );
}

export default function Templates() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const filtered =
    activeFilter === "all"
      ? templates
      : templates.filter((t) => t.cat === activeFilter);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hasMore = filtered.length > INITIAL_COUNT;

  const openDemo = (url) => {
    if (!url) return;
    window.location.href = url;
  };

  return (
    <section
      id="templates"
      className="bg-slate-50/70 py-16 sm:py-20 md:py-[90px] lg:py-[110px]"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 md:px-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-2 sm:mb-12 sm:flex-row sm:items-end sm:justify-between md:mb-14">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-sky-600">
              Koleksi
            </p>
            <h2 className="mt-2 font-serif text-[clamp(1.6rem,3.5vw,2.25rem)] font-normal tracking-tight text-slate-900">
              Pilih template
            </h2>
          </div>
          <p className="max-w-xs text-[14px] leading-relaxed text-slate-500 sm:text-right">
            Desain siap pakai — sesuaikan nama, tanggal, dan foto Anda.
          </p>
        </div>

        {/* Filters */}
        <div
          className="mb-8 flex flex-wrap gap-2  pb-5 sm:gap-2.5 sm:pb-7 md:mb-12"
          role="group"
          aria-label="Filter template"
        >
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => {
                setActiveFilter(f.key);
                setShowAll(false);
              }}
              className={`rounded-full border px-4 py-2 text-[12.5px] transition-all duration-300 sm:px-5 sm:py-[9px] sm:text-[13.5px] ${
                activeFilter === f.key
                  ? "border-sky-400/40 text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-sky-700 hover:shadow-[0_2px_8px_-2px_rgba(14,165,233,0.15)]"
              }`}
              style={
                activeFilter === f.key
                  ? {
                      backgroundImage: "url('/Hero Background.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:gap-y-8 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-9">
          {visible.map((t) => {
            const discount = getDiscountPercent(t.originalPrice, t.price);
            const hasDemo = Boolean(t.demoUrl);

            return (
              <article
                key={t.id}
                className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-16px_rgba(14,165,233,0.18)]"
              >
                <CardPreview t={t} />

                {/* Konten overlay di area blur */}
                <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 px-4 pb-5 pt-20 sm:gap-2.5 sm:px-5 sm:pb-6 sm:pt-24">
                  <div>
                    <h3 className="font-serif text-[15px] font-medium leading-snug text-white drop-shadow-sm sm:text-[18px]">
                      {t.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-white/70 sm:text-[12.5px]">
                      {t.names}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] text-white/50 line-through sm:text-[12.5px]">
                      {formatPrice(t.originalPrice)}
                    </span>
                    <span className="text-[14px] font-semibold text-white sm:text-[16px]">
                      {formatPrice(t.price)}
                    </span>
                    <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-medium text-white  sm:px-2 sm:text-[11px]">
                      -{discount}%
                    </span>
                  </div>

                  <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:gap-2.5">
                    <button
                      type="button"
                      disabled={!hasDemo}
                      onClick={() => openDemo(t.demoUrl)}
                      className={`inline-flex flex-1 items-center justify-center rounded-full border px-3 py-2 text-[11.5px] font-medium transition-all duration-300 sm:px-4 sm:py-2.5 sm:text-[13px] ${
                        hasDemo
                          ? "border-white/30 bg-white/10 text-white  hover:bg-white/20"
                          : "cursor-not-allowed border-white/15 text-white/35"
                      }`}
                    >
                      Lihat demo
                    </button>

                    <button
                      type="button"
                      onClick={() => openWhatsAppOrder(t)}
                      className="inline-flex flex-1 items-center justify-center rounded-full bg-white px-3 py-2 text-[11.5px] font-medium text-sky-700 shadow-sm transition-all duration-300 hover:bg-sky-50 sm:px-4 sm:py-2.5 sm:text-[13px]"
                    >
                      Pilih template
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {hasMore && (
          <div className="mt-10 text-center sm:mt-12 md:mt-14">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-6 py-3 text-[13.5px] font-medium text-slate-700 shadow-sm transition-all hover:border-sky-400 hover:text-sky-700 sm:px-7 sm:py-3.5 sm:text-[14.5px]"
            >
              {showAll ? "Tampilkan lebih sedikit" : "Lihat semua template"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
