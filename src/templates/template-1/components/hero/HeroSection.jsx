// HeroSection.jsx
import InvitationSection from "../layout/InvitationSection";
import Countdown from "../countdown/CountDown";
import { useWedding } from "../../../../context/WeddingContext";

const HeroSection = ({ isOpen, scrollRoot }) => {
  const {
    backgrounds: BACKGROUNDS,
    couple: COUPLE,
    weddingDate: WEDDING_DATE,
    heroVerseText,
    heroVerseRef,
  } = useWedding();

  return (
    <InvitationSection
      id="opening"
      height="screen"
      trigger="open"
      isOpen={isOpen}
      scrollRoot={scrollRoot}
      animation="fade"
      delay={1.5}
      className="bg-neutral-950"
    >
      <section
        className="
          relative flex min-h-screen items-center justify-center
          overflow-hidden bg-neutral-950 px-6 text-white
          sm:px-8
        "
      >
        <div className="absolute inset-0">
          <img
            src={BACKGROUNDS.hero}
            alt={COUPLE.displayName}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.45)_100%)]" />
        </div>

        <div
          className="
            relative z-10 flex w-full max-w-sm flex-col items-center text-center
            md:max-w-md
            lg:max-w-sm
          "
        >
          <p
            data-reveal
            className="text-[9px] uppercase tracking-[0.45em] text-white/75 sm:text-[10px]"
          >
            The Wedding Of
          </p>

          <h1
            data-reveal
            className="
              mt-4 font-serif font-normal leading-none tracking-tight
              text-4xl
              sm:text-[2.75rem]
              md:text-5xl
              lg:text-4xl
            "
          >
            {COUPLE.displayName}
          </h1>

          <p
            data-reveal
            className="mt-4 text-[10px] uppercase tracking-[0.35em] text-white/80 sm:mt-5 sm:text-[11px]"
          >
            {COUPLE.weddingDateLabel}
          </p>

          <div data-reveal className="mt-2 h-px w-10 bg-white/50" />

          <p
            data-reveal
            className="
              mt-3 max-w-[280px] text-[10px] leading-relaxed text-white/75
              sm:mt-4 sm:max-w-xs sm:text-[11px]
              md:text-[12px]
              lg:text-[10px]
            "
          >
            {heroVerseText}
          </p>

          <p
            data-reveal
            className="mt-3 text-[9px] font-medium tracking-wide text-white/80 sm:mt-4"
          >
            {heroVerseRef}
          </p>

          <div data-reveal className="mt-8 sm:mt-10">
            <Countdown targetDate={WEDDING_DATE} />
          </div>

          <div
            data-reveal
            className="mt-10 flex flex-col items-center gap-2 text-white/70 sm:mt-12"
          >
            <span className="animate-bounce text-[18px] font-light">↓</span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-white/50">
              Scroll
            </span>
          </div>
        </div>
      </section>
    </InvitationSection>
  );
};

export default HeroSection;
