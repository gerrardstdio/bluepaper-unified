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
      <section className="relative flex h-screen min-h-screen max-h-screen flex-col overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0">
          <img
            src={BACKGROUNDS.event}
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/65" />
        </div>

        {/* Semua konten dikelompokkan di tengah — tanpa justify-between */}
        <div
          className="
            relative z-10 flex h-full w-full flex-col items-center justify-center
            px-5 py-10
            sm:px-8 sm:py-12
            md:px-10 md:py-14
          "
        >
          <div className="flex w-full max-w-[20rem] flex-col items-center sm:max-w-sm md:max-w-md">
            {/* Header */}
            <div className="shrink-0 text-center">
              <p
                data-reveal
                className="text-[11px] uppercase tracking-[0.3em] text-white/70 sm:text-[12px] md:text-sm"
              >
                {COUPLE?.weddingDateLabel || ""}
              </p>
              <h2
                data-reveal
                className="mt-2 font-serif text-[1.75rem] font-normal tracking-tight sm:text-4xl md:text-5xl"
              >
                Wedding Event
              </h2>
              <div
                data-reveal
                className="mx-auto mt-2.5 h-px w-8 bg-white/35 sm:mt-3 md:w-10"
              />
            </div>

            {/* Timeline — jarak tetap, tidak meregang */}
            <div className="relative mt-6 w-full sm:mt-7 md:mt-8">
              <div className="absolute bottom-2 left-1/2 top-2 w-px -translate-x-1/2 bg-white/25" />

              <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
                {events.map((item) => {
                  const isLeft = item.side === "left";
                  return (
                    <div
                      key={item.title}
                      data-reveal
                      className="relative grid grid-cols-[1fr_16px_1fr] items-start gap-x-2.5 sm:grid-cols-[1fr_18px_1fr] sm:gap-x-3 md:gap-x-4"
                    >
                      <div
                        className={`flex flex-col ${
                          isLeft
                            ? "items-end text-right"
                            : "pointer-events-none items-end opacity-0"
                        }`}
                      >
                        {isLeft && <EventBody item={item} />}
                      </div>

                      <div className="relative flex justify-center pt-1">
                        <span className="z-10 h-2 w-2 rounded-full border border-white/70 bg-white/95 sm:h-2.5 sm:w-2.5" />
                      </div>

                      <div
                        className={`flex flex-col ${
                          !isLeft
                            ? "items-start text-left"
                            : "pointer-events-none items-start opacity-0"
                        }`}
                      >
                        {!isLeft && <EventBody item={item} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Save The Date — menempel di bawah timeline */}
            {calendarUrl && (
              <a
                data-reveal
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-6 inline-flex shrink-0 items-center justify-center rounded-full bg-white
                  px-6 py-2.5 text-[11px] uppercase tracking-[0.22em] text-neutral-900
                  transition hover:bg-white/90
                  sm:mt-7 sm:px-7 sm:py-3 sm:text-xs
                  md:mt-8 md:px-8 md:py-3.5 md:text-[13px]
                "
              >
                Save The Date
              </a>
            )}
          </div>
        </div>
      </section>
    </InvitationSection>
  );
};

function EventBody({ item }) {
  return (
    <>
      <span className="text-[11px] font-medium tracking-wide text-white/90 sm:text-[12px] md:text-sm">
        {item.time}
      </span>
      <h3 className="mt-0.5 font-serif text-[15px] leading-snug text-white sm:text-base md:text-xl">
        {item.title}
      </h3>
      <p className="mt-0.5 text-[11px] text-white/80 sm:text-[12px] md:text-[13px]">
        {item.place}
      </p>
      <p className="mt-0.5 max-w-[8.5rem] text-[10px] leading-snug text-white/55 sm:max-w-[10rem] sm:text-[11px] md:max-w-[12rem] md:text-[12px]">
        {item.address}
      </p>
      {item.mapsUrl && (
        <a
          href={item.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-1.5 inline-flex rounded-full border border-white/35 bg-white/10
            px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-white/95
            backdrop-blur-sm transition hover:bg-white/15
            sm:mt-2 sm:px-3.5 sm:text-[10px]
            md:px-4 md:py-1.5 md:text-[11px]
          "
        >
          Lokasi
        </a>
      )}
    </>
  );
}

export default EventSection;
