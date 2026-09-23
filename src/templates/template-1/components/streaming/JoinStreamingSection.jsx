// JoinStreamingSection.jsx
import InvitationSection from "../layout/InvitationSection";
import { useWedding } from "../../../../context/WeddingContext";

const JoinStreamingSection = ({ isOpen, scrollRoot }) => {
  const { backgrounds: BACKGROUNDS, streamingUrl = "" } = useWedding();

  return (
    <InvitationSection
      id="streaming"
      height="screen"
      trigger="scroll"
      isOpen={isOpen}
      scrollRoot={scrollRoot}
      animation="fade"
      className="bg-neutral-950"
    >
      <section
        className="
          relative flex min-h-screen items-center justify-center
          overflow-hidden bg-neutral-950 px-6 py-20 text-white
          sm:px-8
        "
      >
        <img
          src={BACKGROUNDS.streaming}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-neutral-950/45" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/30 via-transparent to-neutral-950/55" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)]" />

        <div
          className="
            relative z-10 flex w-full max-w-sm flex-col items-center text-center
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
            Live Streaming
          </p>

          <h2
            data-reveal
            className="
              mt-4 font-serif font-normal leading-tight tracking-tight
              text-white drop-shadow-md
              text-3xl
              sm:mt-5 sm:text-[2rem]
              md:text-5xl
              lg:text-3xl
            "
          >
            Saksikan
            <br />
            Resepsi Kami
          </h2>

          <div
            data-reveal
            className="mt-6 h-px w-10 bg-white/50 sm:mt-8 md:mt-10 md:w-12 lg:mt-8 lg:w-10"
          />

          <p
            data-reveal
            className="
              mt-6 max-w-[280px] leading-relaxed text-white/85 drop-shadow-sm
              text-[11px]
              sm:mt-8 sm:max-w-xs sm:text-[12px]
              md:max-w-sm md:text-[15px] md:leading-[1.75]
              lg:mt-8 lg:max-w-[280px] lg:text-[11px]
            "
          >
            Bagi keluarga dan sahabat yang berhalangan hadir, kami mengundang
            Anda untuk bergabung melalui siaran langsung YouTube.
          </p>

          {streamingUrl && (
            <a
              data-reveal
              href={streamingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-10 inline-flex items-center gap-2.5 rounded-full
                border border-white/40 bg-black/25
                px-7 py-3.5 uppercase tracking-[0.28em] text-white
                backdrop-blur-sm transition
                hover:border-white/60 hover:bg-black/40 active:scale-[0.98]
                text-[10px]
                sm:mt-12
                md:mt-14 md:px-9 md:py-4 md:text-[13px]
                lg:mt-12 lg:px-7 lg:py-3.5 lg:text-[10px]
              "
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
                className="md:h-4 md:w-4 lg:h-3.5 lg:w-3.5"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Join Streaming
            </a>
          )}

          <p
            data-reveal
            className="
              mt-5 text-[9px] uppercase tracking-[0.25em] text-white/55
              sm:mt-6
              md:text-[11px]
              lg:text-[9px]
            "
          >
            YouTube Live
          </p>
        </div>
      </section>
    </InvitationSection>
  );
};

export default JoinStreamingSection;
