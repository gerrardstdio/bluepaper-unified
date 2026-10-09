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
          md:px-10
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
            relative z-10 flex w-full flex-col items-center text-center
            max-w-sm
            sm:max-w-md
            md:max-w-lg
          "
        >
          <p
            data-reveal
            className="
              uppercase tracking-[0.4em] text-white/80 drop-shadow-sm
              text-[12px]
              sm:text-[13px]
              md:text-sm
            "
          >
            Live Streaming
          </p>

          <h2
            data-reveal
            className="
              mt-4 font-serif font-normal leading-tight tracking-tight
              text-white drop-shadow-md
              text-4xl
              sm:mt-5 sm:text-5xl
              md:mt-6 md:text-6xl
            "
          >
            Saksikan
            <br />
            Resepsi Kami
          </h2>

          <div
            data-reveal
            className="mt-6 h-px w-11 bg-white/50 sm:mt-8 sm:w-12 md:mt-10 md:w-14"
          />

          <p
            data-reveal
            className="
              mt-6 max-w-[18rem] leading-relaxed text-white/85 drop-shadow-sm
              text-[14px]
              sm:mt-8 sm:max-w-sm sm:text-base
              md:mt-10 md:max-w-md md:text-lg md:leading-[1.75]
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
                px-8 py-3.5 uppercase tracking-[0.28em] text-white
                backdrop-blur-sm transition
                hover:border-white/60 hover:bg-black/40 active:scale-[0.98]
                text-[12px]
                sm:mt-12 sm:px-9 sm:py-4 sm:text-[13px]
                md:mt-14 md:px-10 md:py-4.5 md:text-sm
              "
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
                className="sm:h-[17px] sm:w-[17px] md:h-5 md:w-5"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Join Streaming
            </a>
          )}

          <p
            data-reveal
            className="
              mt-5 uppercase tracking-[0.25em] text-white/55
              text-[11px]
              sm:mt-6 sm:text-xs
              md:text-sm
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
