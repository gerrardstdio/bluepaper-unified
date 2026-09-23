// LoveJourney.jsx
import InvitationSection from "../layout/InvitationSection";
import { useWedding } from "../../../../context/WeddingContext";

const LoveJourney = ({ isOpen, scrollRoot }) => {
  const { backgrounds: BACKGROUNDS, journeys = [] } = useWedding();

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
      <section
        className="
          relative flex min-h-screen items-center justify-center
          overflow-hidden bg-neutral-950 px-6 py-20 text-white
          sm:px-8 sm:py-24
        "
      >
        <div className="absolute inset-0">
          <img
            src={BACKGROUNDS.journey}
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.5)_100%)]" />
        </div>

        <div
          className="
            relative z-10 flex w-full max-w-[300px] flex-col items-center
            sm:max-w-[320px]
            md:max-w-md
            lg:max-w-[300px]
          "
        >
          <p
            data-reveal
            className="
              text-[9px] uppercase tracking-[0.4em] text-white/50
              sm:text-[10px]
              md:text-[12px]
              lg:text-[9px]
            "
          >
            Our Story
          </p>

          <h2
            data-reveal
            className="
              mt-3 font-serif font-normal tracking-tight text-white
              text-2xl
              sm:text-[1.75rem]
              md:text-4xl
              lg:text-2xl
            "
          >
            Perjalanan Cinta
          </h2>

          <div
            data-reveal
            className="mt-5 h-px w-8 bg-white/30 sm:mt-6 md:mt-8 md:w-10 lg:mt-6 lg:w-8"
          />

          <div className="mt-10 flex w-full flex-col gap-9 sm:mt-12 sm:gap-11 md:gap-14 lg:gap-11">
            {journeys.map((item, index) => (
              <div
                key={`${item.year}-${item.title}-${index}`}
                className="flex flex-col items-center text-center"
              >
                <div data-reveal className="flex flex-col items-center">
                  <span
                    className="
                      text-[9px] uppercase tracking-[0.3em] text-white/40
                      sm:text-[10px]
                      md:text-[12px]
                      lg:text-[9px]
                    "
                  >
                    {item.year}
                  </span>

                  <h3
                    className="
                      mt-2 font-serif font-normal tracking-wide text-white
                      text-[15px]
                      sm:text-base
                      md:text-xl
                      lg:text-[15px]
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-3 max-w-[260px] leading-[1.8] text-white/65
                      text-[10px]
                      sm:text-[11px] sm:max-w-[280px]
                      md:mt-4 md:max-w-sm md:text-[14px] md:leading-[1.85]
                      lg:mt-3 lg:max-w-[260px] lg:text-[10px]
                    "
                  >
                    {item.text}
                  </p>
                </div>

                {index < journeys.length - 1 && (
                  <div className="mt-9 h-1 w-1 rounded-full bg-white/25 sm:mt-11 md:mt-14 lg:mt-11" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </InvitationSection>
  );
};

export default LoveJourney;
