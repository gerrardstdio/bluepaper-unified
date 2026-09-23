// EventSection.jsx
import InvitationSection from "../layout/InvitationSection";
import { useWedding } from "../../../../context/WeddingContext";

const EventSection = ({ isOpen, scrollRoot }) => {
  const {
    backgrounds: BACKGROUNDS,
    events = [],
    calendarUrl = "",
    couple: COUPLE,
  } = useWedding();

  return (
    <InvitationSection
      id="event"
      height="screen"
      trigger="scroll"
      isOpen={isOpen}
      scrollRoot={scrollRoot}
      animation="fade"
      className="bg-neutral-950"
    >
      <section
        className="
          relative flex min-h-screen flex-col items-center overflow-hidden
          px-5 py-16 text-white
          sm:px-8 sm:py-18
          md:py-20
          lg:px-5 lg:py-16
        "
      >
        <div className="absolute inset-0">
          <img
            src={BACKGROUNDS.event}
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.5)_100%)]" />
        </div>

        <div
          className="
            relative z-10 flex w-full max-w-[340px] flex-col items-center
            md:max-w-lg
            lg:max-w-[340px]
          "
        >
          <div className="mb-10 text-center sm:mb-12 md:mb-14 lg:mb-12">
            <p
              data-reveal
              className="
                text-[11px] uppercase tracking-[0.3em] text-white/75
                sm:text-[12px]
                md:text-[14px]
                lg:text-[11px]
              "
            >
              {COUPLE?.weddingDateLabel || ""}
            </p>
            <h2
              data-reveal
              className="
                mt-3 font-serif font-normal tracking-tight drop-shadow-md
                text-3xl
                sm:text-[2rem]
                md:text-5xl
                lg:text-3xl
              "
            >
              Wedding Event
            </h2>
            <div
              data-reveal
              className="mx-auto mt-4 h-px w-8 bg-white/30 md:mt-5 md:w-10 lg:mt-4 lg:w-8"
            />
          </div>

          <div className="relative w-full">
            <div className="absolute bottom-2 left-1/2 top-2 w-px -translate-x-1/2 bg-white/30" />

            <div className="flex flex-col gap-9 py-1 sm:gap-10 md:gap-12 lg:gap-10">
              {events.map((item) => {
                const isLeft = item.side === "left";

                return (
                  <div
                    key={item.title}
                    data-reveal
                    className="relative grid grid-cols-[1fr_20px_1fr] items-start gap-x-3 md:gap-x-4 lg:gap-x-3"
                  >
                    {/* Kiri */}
                    <div
                      className={`flex flex-col ${
                        isLeft
                          ? "items-end text-right"
                          : "pointer-events-none items-end text-right opacity-0"
                      }`}
                    >
                      {isLeft && (
                        <>
                          <span
                            className="
                              font-medium tracking-wide text-white/90
                              text-[11px]
                              sm:text-[12px]
                              md:text-[14px]
                              lg:text-[11px]
                            "
                          >
                            {item.time}
                          </span>
                          <h3
                            className="
                              mt-1.5 font-serif leading-snug text-white drop-shadow-sm
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
                              mt-1 text-white/80
                              text-[11px]
                              sm:text-[12px]
                              md:text-[14px]
                              lg:text-[11px]
                            "
                          >
                            {item.place}
                          </p>
                          <p
                            className="
                              mt-0.5 max-w-[130px] leading-relaxed text-white/55
                              text-[10px]
                              sm:max-w-[150px] sm:text-[11px]
                              md:max-w-[180px] md:text-[13px]
                              lg:max-w-[130px] lg:text-[10px]
                            "
                          >
                            {item.address}
                          </p>
                          {item.mapsUrl && (
                            <a
                              href={item.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="
                                mt-2.5 inline-flex rounded-full border border-white/35
                                bg-white/10 px-3 py-1.5 uppercase tracking-[0.18em]
                                text-white/95 backdrop-blur-sm transition hover:bg-white/15
                                text-[9px]
                                md:mt-3 md:px-4 md:py-2 md:text-[11px]
                                lg:mt-2.5 lg:px-3 lg:py-1.5 lg:text-[9px]
                              "
                            >
                              Lokasi
                            </a>
                          )}
                        </>
                      )}
                    </div>

                    {/* Dot */}
                    <div className="relative flex justify-center pt-1">
                      <span className="z-10 h-2.5 w-2.5 rounded-full border border-white/70 bg-white/90 md:h-3 md:w-3 lg:h-2.5 lg:w-2.5" />
                    </div>

                    {/* Kanan */}
                    <div
                      className={`flex flex-col ${
                        !isLeft
                          ? "items-start text-left"
                          : "pointer-events-none items-start text-left opacity-0"
                      }`}
                    >
                      {!isLeft && (
                        <>
                          <span
                            className="
                              font-medium tracking-wide text-white/90
                              text-[11px]
                              sm:text-[12px]
                              md:text-[14px]
                              lg:text-[11px]
                            "
                          >
                            {item.time}
                          </span>
                          <h3
                            className="
                              mt-1.5 font-serif leading-snug text-white drop-shadow-sm
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
                              mt-1 text-white/80
                              text-[11px]
                              sm:text-[12px]
                              md:text-[14px]
                              lg:text-[11px]
                            "
                          >
                            {item.place}
                          </p>
                          <p
                            className="
                              mt-0.5 max-w-[130px] leading-relaxed text-white/55
                              text-[10px]
                              sm:max-w-[150px] sm:text-[11px]
                              md:max-w-[180px] md:text-[13px]
                              lg:max-w-[130px] lg:text-[10px]
                            "
                          >
                            {item.address}
                          </p>
                          {item.mapsUrl && (
                            <a
                              href={item.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="
                                mt-2.5 inline-flex rounded-full border border-white/35
                                bg-white/10 px-3 py-1.5 uppercase tracking-[0.18em]
                                text-white/95 backdrop-blur-sm transition hover:bg-white/15
                                text-[9px]
                                md:mt-3 md:px-4 md:py-2 md:text-[11px]
                                lg:mt-2.5 lg:px-3 lg:py-1.5 lg:text-[9px]
                              "
                            >
                              Lokasi
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {calendarUrl && (
            <a
              data-reveal
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-10 inline-flex items-center justify-center rounded-full bg-white
                px-6 py-3 uppercase tracking-[0.22em] text-neutral-900
                transition hover:bg-white/90
                text-[11px]
                sm:mt-12
                md:mt-14 md:px-8 md:py-3.5 md:text-[13px]
                lg:mt-12 lg:px-6 lg:py-3 lg:text-[11px]
              "
            >
              Save The Date
            </a>
          )}
        </div>
      </section>
    </InvitationSection>
  );
};

export default EventSection;
