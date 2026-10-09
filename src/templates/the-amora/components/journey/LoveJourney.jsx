// LoveJourney.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import InvitationSection from "../layout/InvitationSection";
import { useWedding } from "../../../../context/WeddingContext";

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function animateScroll(el, to, duration = 620) {
  const from = el.scrollTop;
  const delta = to - from;
  if (Math.abs(delta) < 1) return Promise.resolve();

  const start = performance.now();
  return new Promise((resolve) => {
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      el.scrollTop = from + delta * easeInOutCubic(t);
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

const LoveJourney = ({ isOpen, scrollRoot }) => {
  const { backgrounds: BACKGROUNDS, journeys = [] } = useWedding();
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const [active, setActive] = useState(0);
  const touchStartY = useRef(0);
  const handoffLock = useRef(false);
  const isAnimating = useRef(false);

  const setItemRef = useCallback((el, i) => {
    itemRefs.current[i] = el;
  }, []);

  const getParentScroll = useCallback(() => {
    if (scrollRoot?.current) return scrollRoot.current;
    if (scrollRoot instanceof HTMLElement) return scrollRoot;
    return (
      listRef.current?.closest("[data-scroll-root]") ||
      document.querySelector("[data-scroll-root]")
    );
  }, [scrollRoot]);

  const scrollToIndex = useCallback(async (index) => {
    const root = listRef.current;
    const el = itemRefs.current[index];
    if (!root || !el) return;
    if (index < 0 || index >= itemRefs.current.length) return;
    if (isAnimating.current) return;

    isAnimating.current = true;
    setActive(index);
    await animateScroll(root, el.offsetTop, 640);
    isAnimating.current = false;
  }, []);

  const passToParent = useCallback(
    (direction) => {
      if (handoffLock.current) return;
      const parent = getParentScroll();
      if (!parent) return;
      handoffLock.current = true;
      const amount = Math.min(window.innerHeight * 0.9, parent.clientHeight);
      parent.scrollBy({ top: direction * amount, behavior: "smooth" });
      window.setTimeout(() => {
        handoffLock.current = false;
      }, 800);
    },
    [getParentScroll],
  );

  const goBy = useCallback(
    (delta) => {
      if (isAnimating.current || handoffLock.current) return;
      const next = active + delta;
      if (next < 0) {
        passToParent(-1);
        return;
      }
      if (next >= journeys.length) {
        passToParent(1);
        return;
      }
      scrollToIndex(next);
    },
    [active, journeys.length, scrollToIndex, passToParent],
  );

  useEffect(() => {
    const root = listRef.current;
    if (!root || !journeys.length) return;

    let ticking = false;
    const onScroll = () => {
      if (isAnimating.current) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const mid = root.getBoundingClientRect().top + root.clientHeight / 2;
        let bestIdx = 0;
        let bestDist = Infinity;
        itemRefs.current.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const center = r.top + r.height / 2;
          const dist = Math.abs(center - mid);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        });
        setActive((prev) => (prev === bestIdx ? prev : bestIdx));
        ticking = false;
      });
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, [journeys.length, isOpen]);

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;

    let wheelLock = false;
    const onWheel = (e) => {
      e.preventDefault();
      if (wheelLock || isAnimating.current || handoffLock.current) return;
      if (Math.abs(e.deltaY) < 8) return;
      wheelLock = true;
      goBy(e.deltaY > 0 ? 1 : -1);
      window.setTimeout(() => {
        wheelLock = false;
      }, 520);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [goBy]);

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;

    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0]?.clientY ?? 0;
    };

    const onTouchEnd = (e) => {
      if (isAnimating.current || handoffLock.current) return;
      const y = e.changedTouches[0]?.clientY ?? 0;
      const dy = touchStartY.current - y;
      if (Math.abs(dy) < 40) return;
      goBy(dy > 0 ? 1 : -1);
    };

    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchend", onTouchEnd);
    };
  }, [goBy]);

  return (
    <InvitationSection
      id="story"
      height="screen"
      trigger="scroll"
      isOpen={isOpen}
      scrollRoot={scrollRoot}
      animation="fade"
      className="bg-neutral-950"
    >
      <section className="relative flex h-screen min-h-screen max-h-screen flex-col overflow-hidden bg-neutral-950 text-white">
        <div className="pointer-events-none absolute inset-0">
          <img
            src={BACKGROUNDS.journey}
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.5)_100%)]" />
        </div>

        {/* Header */}
        <div className="relative z-10 shrink-0 px-6 pt-12 text-center sm:px-10 sm:pt-14 md:pt-16">
          <p className="text-[13px] uppercase tracking-[0.35em] text-white/55 sm:text-sm md:text-base">
            Our Story
          </p>
          <h2 className="mt-2 font-serif text-[1.85rem] font-normal tracking-tight text-white sm:text-4xl md:text-5xl">
            Perjalanan Cinta
          </h2>
          <div className="mx-auto mt-3 h-px w-10 bg-white/35 sm:mt-4 md:mt-5 md:w-12" />
        </div>

        {/* Carousel — konten di TENGAH area */}
        <div
          ref={listRef}
          className="relative z-10 min-h-0 flex-1 overflow-y-hidden"
          style={{ overscrollBehaviorY: "none", scrollbarWidth: "none" }}
        >
          {journeys.map((item, index) => {
            const isActive = index === active;
            return (
              <div
                key={`${item.year}-${item.title}-${index}`}
                ref={(el) => setItemRef(el, index)}
                className="flex h-full min-h-full w-full shrink-0 flex-col items-center justify-center px-6 sm:px-10 md:px-14"
              >
                <div
                  className="
                    flex w-full flex-col items-center text-center
                    max-w-[22rem]
                    sm:max-w-md
                    md:max-w-2xl
                  "
                  style={{
                    opacity: isActive ? 1 : 0,
                    filter: isActive ? "blur(0px)" : "blur(6px)",
                    transform: isActive
                      ? "scale(1) translateY(0)"
                      : "scale(0.96) translateY(10px)",
                    pointerEvents: isActive ? "auto" : "none",
                    transition:
                      "opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), filter 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <span
                    className="
                      uppercase tracking-[0.3em] text-white/70
                      text-[13px]
                      sm:text-sm
                      md:text-base
                    "
                  >
                    {item.year}
                  </span>

                  <h3
                    className="
                      mt-3 font-serif font-normal leading-tight tracking-wide text-white
                      text-[1.75rem]
                      sm:mt-4 sm:text-3xl
                      md:mt-5 md:text-5xl
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-4 leading-[1.75] text-white/85
                      text-[15px]
                      sm:mt-5 sm:text-base sm:leading-[1.8]
                      md:mt-6 md:max-w-xl md:text-xl md:leading-[1.85]
                    "
                  >
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {journeys.length > 1 && (
          <div className="absolute bottom-5 right-4 z-20 flex flex-col gap-2 sm:bottom-8 sm:right-6">
            {journeys.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Babak ${i + 1}`}
                onClick={() => scrollToIndex(i)}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                  i === active
                    ? "scale-125 bg-white"
                    : "bg-white/35 hover:bg-white/55"
                }`}
              />
            ))}
          </div>
        )}
      </section>
    </InvitationSection>
  );
};

export default LoveJourney;
