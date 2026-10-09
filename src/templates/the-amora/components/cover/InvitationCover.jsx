// InvitationCover.jsx
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useWedding } from "../../../../context/WeddingContext";

const InvitationCover = ({
  isOpen,
  isComplete,
  onOpen,
  onAnimationComplete,
  guestName: guestNameProp,
}) => {
  const {
    backgrounds: BACKGROUNDS,
    couple: COUPLE,
    guestName: guestNameFromContext,
  } = useWedding();

  // Prioritas: context (dari Live page) → prop → fallback
  const guestName = guestNameFromContext || guestNameProp || "Tamu Undangan";

  const coverRef = useRef(null);

  useGSAP(
    () => {
      if (!isOpen) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1280px)", () => {
        const timeline = gsap.timeline({
          onComplete: onAnimationComplete,
        });

        timeline.to(coverRef.current, {
          width: "65vw",
          duration: 1.2,
          ease: "power3.inOut",
        });
      });

      mm.add("(max-width: 1279px)", () => {
        gsap.to(coverRef.current, {
          xPercent: -100,
          duration: 1.2,
          ease: "power3.inOut",
          onComplete: onAnimationComplete,
        });
      });

      return () => {
        mm.revert();
      };
    },
    {
      dependencies: [isOpen],
      scope: coverRef,
    },
  );

  return (
    <aside
      ref={coverRef}
      className="
        fixed inset-y-0 left-0 z-50
        h-screen w-full overflow-hidden bg-neutral-950
      "
    >
      <div className="absolute inset-0">
        <img
          src={BACKGROUNDS.cover}
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      </div>

      <div
        className={`
          absolute inset-0 z-20 flex items-center justify-center px-6
          transition-opacity duration-500 ease-out
          ${
            isOpen
              ? "pointer-events-none opacity-0"
              : "pointer-events-auto opacity-100"
          }
        `}
      >
        <div className="flex w-full max-w-xl flex-col items-center text-center text-white">
          <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-white/70 md:text-xs">
            An Invitation
          </p>

          <h1 className="mt-6 font-serif text-5xl font-normal tracking-tight md:text-6xl">
            {COUPLE.displayName}
          </h1>

          <p className="mt-5 text-[11px] uppercase tracking-[0.35em] text-white/75 md:text-xs">
            {COUPLE.weddingDateLabel}
          </p>

          <div className="mt-8 h-px w-12 bg-white/50" />

          <p className="mt-8 text-[9px] uppercase tracking-[0.25em] text-white/45">
            Kepada Yth.
          </p>
          <p className="mt-2 font-serif text-xl tracking-wide text-white md:text-2xl">
            {guestName}
          </p>

          <p className="mt-6 max-w-xs text-xs leading-relaxed text-white/65">
            Dengan penuh sukacita, kami mengundang Anda untuk menjadi bagian
            dari hari istimewa kami.
          </p>

          <button
            type="button"
            onClick={onOpen}
            className="
              mt-10 rounded-full border border-white/50 bg-white/5
              px-8 py-3 text-xs font-medium tracking-wide text-white
              backdrop-blur-sm transition-all duration-300
              hover:border-white hover:bg-white hover:text-neutral-900
              active:scale-95
            "
          >
            Buka Undangan
          </button>

          <p className="mt-5 text-[9px] uppercase tracking-[0.3em] text-white/40">
            Tap to open
          </p>
        </div>
      </div>

      <div
        className={`
          absolute bottom-10 left-8 z-10 hidden
          transition-all duration-700 ease-out
          xl:bottom-12 xl:left-12 xl:block
          ${
            isComplete ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }
        `}
      >
        <div className="flex flex-col items-start text-left text-white">
          <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-white/80">
            The Wedding Of
          </p>
          <h1 className="mt-3 font-serif text-4xl font-normal tracking-tight xl:text-6xl 2xl:text-7xl">
            {COUPLE.displayName}
          </h1>
        </div>
      </div>
    </aside>
  );
};

export default InvitationCover;
