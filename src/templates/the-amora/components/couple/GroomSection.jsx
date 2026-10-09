// GroomSection.jsx
import InvitationSection from "../layout/InvitationSection";
import { useWedding } from "../../../../context/WeddingContext";

const GroomSection = ({ isOpen, scrollRoot }) => {
  const { backgrounds: BACKGROUNDS, couple: COUPLE } = useWedding();

  const parents = COUPLE.groomParents || "Bapak & Ibu";
  const igHandle = COUPLE.groomIg || "";
  const igUrl =
    COUPLE.groomIgUrl || (igHandle ? `https://instagram.com/${igHandle}` : "");

  return (
    <InvitationSection
      id="groom"
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
            src={BACKGROUNDS.groom}
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
            text-[13px] uppercase tracking-[0.35em] text-white/70
            sm:left-8 sm:top-10 sm:text-sm
            md:left-10 md:top-12 md:text-base
          "
        >
          The Groom
        </p>

        <div
          className="
            absolute bottom-14 left-6 z-10 flex flex-col items-start
            max-w-[min(20rem,88vw)]
            sm:bottom-16 sm:left-8 sm:max-w-sm
            md:bottom-20 md:left-10 md:max-w-md
          "
        >
          <h2
            data-reveal
            className="
              font-serif font-normal leading-none tracking-tight text-white
              text-5xl
              sm:text-6xl
              md:text-7xl
            "
          >
            {COUPLE.groom}
          </h2>

          <p
            data-reveal
            className="
              mt-4 text-[15px] leading-relaxed tracking-wide text-white/80
              sm:mt-5 sm:text-base
              md:text-lg
            "
          >
            Putra dari
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
                text-xs uppercase tracking-[0.2em] text-white/90
                backdrop-blur-sm transition
                hover:border-white/45 hover:bg-white/15
                sm:mt-6 sm:px-6 sm:py-3 sm:text-[13px]
                md:text-sm
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

export default GroomSection;
