// WishesSection.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import InvitationSection from "../layout/InvitationSection";
import { getRsvpList, RSVP_UPDATED_EVENT } from "../../hooks/useRSVPStorage";
import { useWedding } from "../../../../context/WeddingContext";

function useScrollChain(listRef) {
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    let startY = 0;

    const onTouchStart = (e) => {
      startY = e.touches[0]?.clientY ?? 0;
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
    el.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("wheel", onWheel);
    };
  }, [listRef]);
}

const WishesSection = ({ isOpen, scrollRoot }) => {
  const { backgrounds: BACKGROUNDS, customerSlug, slug } = useWedding();

  const storageKey = customerSlug || slug || "demo";

  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newestId, setNewestId] = useState(null);
  const listRef = useRef(null);

  useScrollChain(listRef);

  const load = useCallback(async () => {
    setLoading(true);
    const list = await getRsvpList(storageKey);
    setWishes(list);
    setLoading(false);
  }, [storageKey]);

  useEffect(() => {
    load();

    const onUpdate = (e) => {
      if (e.detail?.storageKey && e.detail.storageKey !== storageKey) {
        return;
      }

      const list = e.detail?.list;
      if (Array.isArray(list)) {
        setWishes(list);
        setNewestId(list[0]?.id ?? null);
        window.setTimeout(() => setNewestId(null), 2800);
      } else {
        load();
      }
    };

    window.addEventListener(RSVP_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(RSVP_UPDATED_EVENT, onUpdate);
  }, [load, storageKey]);

  const items = wishes.filter((w) => w.ucapan?.trim());

  return (
    <InvitationSection
      id="wishes"
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
          overflow-hidden bg-neutral-950 px-6 py-20 text-white
          sm:px-8
        "
      >
        <img
          src={BACKGROUNDS.wishes}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-neutral-950/45" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/30 via-transparent to-neutral-950/55" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)]" />

        <div
          className="
            relative z-10 flex w-full max-w-sm flex-col items-center
            md:max-w-md
            lg:max-w-sm
          "
        >
          <p
            data-reveal
            className="
              text-[9px] uppercase tracking-[0.45em] text-white/80 drop-shadow-sm
              sm:text-[10px]
              md:text-[12px]
              lg:text-[9px]
            "
          >
            Doa & Ucapan
          </p>
          <h2
            data-reveal
            className="
              mt-3 text-center font-serif font-normal tracking-tight drop-shadow-md
              text-3xl
              sm:mt-4 sm:text-[2rem]
              md:text-5xl
              lg:text-3xl
            "
          >
            Ucapan
            <br />
            untuk Kami
          </h2>
          <div
            data-reveal
            className="mt-5 h-px w-10 bg-white/50 sm:mt-6 md:mt-8 md:w-12 lg:mt-6 lg:w-10"
          />

          <div
            data-reveal
            ref={listRef}
            className="
              mt-8 max-h-[50vh] w-full space-y-5 overflow-y-auto pr-2
              overscroll-y-auto
              sm:mt-10 sm:space-y-6
              md:mt-12 md:space-y-7
              lg:mt-10 lg:space-y-6
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
            {loading ? (
              <p className="py-8 text-center text-[11px] text-white/50 md:text-[14px] lg:text-[11px]">
                Memuat ucapan…
              </p>
            ) : items.length === 0 ? (
              <p className="py-8 text-center leading-relaxed text-white/55 text-[11px] md:text-[14px] lg:text-[11px]">
                Belum ada ucapan.
                <br />
                Jadilah yang pertama memberikan doa.
              </p>
            ) : (
              items.map((item) => {
                const isNew = item.id === newestId;
                return (
                  <article
                    key={item.id}
                    className={`border-b border-white/15 pb-5 last:border-0 last:pb-0 transition-all duration-700 sm:pb-6 ${
                      isNew ? "-mx-2 rounded-sm bg-white/5 px-2 pt-2" : ""
                    }`}
                  >
                    <p
                      className="
                        font-serif leading-relaxed text-white/85
                        text-[13px]
                        md:text-[16px]
                        lg:text-[13px]
                      "
                    >
                      “{item.ucapan}”
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p
                        className="
                          uppercase tracking-[0.2em] text-white/60
                          text-[10px]
                          md:text-[12px]
                          lg:text-[10px]
                        "
                      >
                        — {item.nama}
                      </p>
                      {item.kehadiran && (
                        <span
                          className={`uppercase tracking-[0.18em] text-[8px] md:text-[10px] lg:text-[8px] ${
                            item.kehadiran === "hadir"
                              ? "text-emerald-400/80"
                              : "text-white/40"
                          }`}
                        >
                          {item.kehadiran === "hadir" ? "Hadir" : "Tidak hadir"}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>
    </InvitationSection>
  );
};

export default WishesSection;
