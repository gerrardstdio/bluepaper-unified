// BrideSection.jsx
import InvitationSection from "../layout/InvitationSection";
import { useWedding } from "../../../../context/WeddingContext";

const BrideSection = ({ isOpen, scrollRoot }) => {
  const { backgrounds: BACKGROUNDS, couple: COUPLE } = useWedding();

  const parents = COUPLE.brideParents || "Bapak & Ibu";
  const igHandle = COUPLE.brideIg || "";
  const igUrl =
    COUPLE.brideIgUrl || (igHandle ? `https://instagram.com/${igHandle}` : "");

  return (
    <InvitationSection
      id="couple"
      height="screen"
      trigger="scroll"
      isOpen={isOpen}
      scrollRoot={scrollRoot}
      animation="fade"
      className="bg-neutral-950"
    >
      <section className="relative flex min-h-screen flex-col overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0">
          <img
            src={BACKGROUNDS.bride}
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent" />
        </div>

        <p
          data-reveal
          className="
            absolute left-6 top-8 z-10
            text-[11px] uppercase tracking-[0.4em] text-white/60
            sm:left-8 sm:top-10
            md:left-10 md:top-12 md:text-[12px]
            lg:left-8 lg:top-10 lg:text-[11px]
          "
        >
          The Bride
        </p>

        <div
          className="
            absolute bottom-14 left-6 z-10 flex max-w-[260px] flex-col items-start
            sm:bottom-16 sm:left-8 sm:max-w-[280px]
            md:bottom-20 md:left-10 md:max-w-xs
            lg:bottom-16 lg:left-8 lg:max-w-[260px]
          "
        >
          <h2
            data-reveal
            className="
              font-serif font-normal leading-none tracking-tight text-white
              text-4xl
              sm:text-[2.75rem]
              md:text-5xl
              lg:text-4xl
            "
          >
            {COUPLE.bride}
          </h2>

          <p
            data-reveal
            className="
              mt-3 text-[13px] leading-relaxed tracking-wide text-white/70
              sm:mt-4 sm:text-[14px]
              md:text-[15px]
              lg:text-[13px]
            "
          >
            Putri dari
            <br />
            {parents}
          </p>

          {igHandle && (
            <a
              data-reveal
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-5 inline-flex items-center gap-2.5 rounded-full
                border border-white/30 bg-white/10 px-5 py-2.5
                text-[11px] uppercase tracking-[0.22em] text-white/90
                backdrop-blur-sm transition
                hover:border-white/45 hover:bg-white/15
                sm:mt-6
              "
            >
              @{igHandle}
            </a>
          )}
        </div>
      </section>
    </InvitationSection>
  );
};

export default BrideSection;
