// GallerySection.jsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import InvitationSection from "../layout/InvitationSection";
import { useWedding } from "../../../../context/WeddingContext";

function useScrollChain(listRef, scrollRoot) {
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const getParent = () => {
      if (scrollRoot?.current instanceof Element) return scrollRoot.current;
      return (
        el.closest("[data-scroll-root]") ||
        el.closest("main") ||
        document.scrollingElement ||
        document.documentElement
      );
    };

    let startY = 0;
    let snapOff = false;
    let reenableTimer = null;

    const disableSnap = () => {
      const parent = getParent();
      if (!parent || snapOff) return;
      parent.style.scrollSnapType = "none";
      snapOff = true;
    };

    const enableSnap = () => {
      const parent = getParent();
      if (!parent || !snapOff) return;
      parent.style.scrollSnapType = "";
      snapOff = false;
    };

    const onTouchStart = (e) => {
      startY = e.touches[0]?.clientY ?? 0;
      if (reenableTimer) {
        clearTimeout(reenableTimer);
        reenableTimer = null;
      }
      disableSnap();
    };

    const onTouchMove = (e) => {
      if (!e.touches[0]) return;
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if ((atTop && deltaY < 0) || (atBottom && deltaY > 0)) {
        return;
      }
    };

    const onTouchEnd = () => {
      reenableTimer = setTimeout(() => {
        enableSnap();
        reenableTimer = null;
      }, 120);
    };

    const onWheel = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      if ((atTop && scrollingUp) || (atBottom && scrollingDown)) {
        return;
      }
      e.stopPropagation();
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      if (reenableTimer) clearTimeout(reenableTimer);
      enableSnap();
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("wheel", onWheel);
    };
  }, [listRef, scrollRoot]);
}

const aspectClass = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

const GallerySection = ({ isOpen, scrollRoot }) => {
  const {
    backgrounds: BACKGROUNDS,
    galleryPhotos = [],
    galleryVideoUrl = "",
  } = useWedding();

  const [lightbox, setLightbox] = useState(null);
  const listRef = useRef(null);

  useScrollChain(listRef, scrollRoot);

  const lightboxNode =
    lightbox &&
    createPortal(
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-5 md:p-8"
        onClick={() => setLightbox(null)}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={() => setLightbox(null)}
          className="
            absolute right-4 top-[4.5rem] z-[201]
            flex h-11 w-11 items-center justify-center rounded-full
            border border-white/30 bg-black/50 text-white backdrop-blur-md
            transition hover:bg-white/15
            md:right-6 md:top-6 md:h-12 md:w-12
          "
          aria-label="Tutup"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="h-5 w-5 md:h-6 md:w-6"
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div
          className="relative max-h-[78vh] w-full max-w-md overflow-hidden rounded-md md:max-w-2xl lg:max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[78vh] w-full object-contain"
          />
        </div>
      </div>,
      document.body,
    );

  return (
    <InvitationSection
      id="gallery"
      height="screen"
      trigger="scroll"
      isOpen={isOpen}
      scrollRoot={scrollRoot}
      animation="fade"
      className="bg-neutral-950"
    >
      <section
        className="
          relative flex min-h-screen flex-col items-center justify-center
          overflow-hidden bg-neutral-950 px-5 py-16 text-white
          sm:px-8
        "
      >
        <img
          src={BACKGROUNDS.gallery}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-neutral-950/45" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/30 via-transparent to-neutral-950/55" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)]" />

        <div
          className="
            relative z-10 flex w-full max-w-lg flex-col
            md:max-w-xl
            lg:max-w-lg
          "
        >
          <div className="mb-5 flex flex-col items-center text-center sm:mb-6 md:mb-8 lg:mb-6">
            <p
              data-reveal
              className="
                text-[9px] uppercase tracking-[0.45em] text-white/80 drop-shadow-sm
                sm:text-[10px]
                md:text-[12px]
                lg:text-[9px]
              "
            >
              Momen Kami
            </p>
            <h2
              data-reveal
              className="
                mt-3 font-serif font-normal tracking-tight drop-shadow-md
                text-3xl
                sm:text-[2rem]
                md:text-5xl
                lg:text-3xl
              "
            >
              Gallery
            </h2>
            <div
              data-reveal
              className="mt-4 h-px w-10 bg-white/50 sm:mt-5 md:mt-6 md:w-12 lg:mt-5 lg:w-10"
            />
          </div>

          {galleryVideoUrl && (
            <div
              data-reveal
              className="
                relative mb-4 aspect-video w-full shrink-0 overflow-hidden
                rounded-lg bg-neutral-900/80 shadow-lg shadow-black/40
              "
            >
              <iframe
                src={galleryVideoUrl}
                title="Wedding video"
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}

          <div
            ref={listRef}
            className="
              max-h-[42vh] w-full overflow-y-auto pr-1 overscroll-y-auto
              md:max-h-[45vh]
              lg:max-h-[42vh]
              [scrollbar-color:rgba(255,255,255,0.15)_transparent]
              [&::-webkit-scrollbar]:w-0.75
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-white/15
              hover:[&::-webkit-scrollbar-thumb]:bg-white/25
              [&::-webkit-scrollbar-thumb]:transition-colors
            "
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="columns-2 gap-2 md:gap-3 lg:gap-2.5">
              {galleryPhotos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  data-reveal
                  onClick={() => setLightbox(photo)}
                  className="
                    group relative mb-2 w-full break-inside-avoid
                    overflow-hidden rounded-md bg-neutral-900/60
                    focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40
                    md:mb-3
                    lg:mb-2.5
                  "
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    draggable={false}
                    className={`
                      pointer-events-none w-full object-cover object-center
                      transition duration-500 group-hover:scale-[1.04]
                      ${aspectClass[photo.aspect] || aspectClass.portrait}
                    `}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                </button>
              ))}
            </div>
          </div>

          <p
            data-reveal
            className="
              mt-4 text-center leading-relaxed text-white/55 drop-shadow-sm
              text-[10px]
              md:mt-5 md:text-[13px]
              lg:mt-4 lg:text-[10px]
            "
          >
            Ketuk foto untuk memperbesar · geser untuk melihat semua
          </p>
        </div>
      </section>

      {lightboxNode}
    </InvitationSection>
  );
};

export default GallerySection;
