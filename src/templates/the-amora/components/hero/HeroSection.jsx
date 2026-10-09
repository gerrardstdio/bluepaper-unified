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
          overflow-hidden bg-neutral-950 px-5 text-white
          sm:px-8
          md:px-10
        "
      >
        <div className="absolute inset-0">
          <img
            src={BACKGROUNDS.hero}
            alt={COUPLE.displayName}
            className="h-full w-full object-cover object-center"
          />
          {/*
            Overlay seimbang:
            - tipis di atas (langit tetap terang)
            - sedikit di tengah (area teks)
            - lebih dalam di bawah (kaki / scroll)
            - radial lembut di center agar nama tetap kontras
          */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-black/55"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.25)_0%,transparent_65%)]"
            aria-hidden
          />
        </div>

        <div
          className="
            relative z-10 flex w-full flex-col items-center text-center
            max-w-[22rem]
            sm:max-w-md
            md:max-w-xl
            lg:max-w-lg
          "
        >
          <p
            data-reveal
            className="
              text-[13px] uppercase tracking-[0.4em] text-white/85
              sm:text-sm
              md:text-base
            "
          >
            The Wedding Of
          </p>

          <h1
            data-reveal
            className="
              mt-5 font-serif font-normal leading-[1.05] tracking-tight
              text-5xl
              sm:text-6xl
              md:text-7xl
            "
          >
            {COUPLE.displayName}
          </h1>

          <p
            data-reveal
            className="
              mt-5 text-[13px] uppercase tracking-[0.28em] text-white/90
              sm:mt-6 sm:text-sm
              md:text-base
            "
          >
            {COUPLE.weddingDateLabel}
          </p>

          <div data-reveal className="mt-4 h-px w-14 bg-white/60 sm:w-16" />

          <p
            data-reveal
            className="
              mt-5 text-[15px] leading-relaxed text-white/90
              sm:mt-6 sm:text-base
              md:text-lg md:leading-relaxed
            "
          >
            {heroVerseText}
          </p>

          <p
            data-reveal
            className="
              mt-3 text-[13px] font-medium tracking-wide text-white/90
              sm:mt-4 sm:text-sm
              md:text-base
            "
          >
            {heroVerseRef}
          </p>

          <div data-reveal className="mt-10 sm:mt-12 md:mt-14">
            <Countdown targetDate={WEDDING_DATE} />
          </div>

          <div
            data-reveal
            className="mt-12 flex flex-col items-center gap-2 text-white/80 sm:mt-14"
          >
            <span className="animate-bounce text-2xl font-light">↓</span>
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/60 sm:text-xs">
              Scroll
            </span>
          </div>
        </div>
      </section>
    </InvitationSection>
  );
};

export default HeroSection;
