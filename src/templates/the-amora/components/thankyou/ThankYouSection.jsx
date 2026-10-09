// ThankYouSection.jsx
import InvitationSection from "../layout/InvitationSection";
import { COMPANY } from "../../data/dataAdmin";
import { useWedding } from "../../../../context/WeddingContext";

const SocialIcon = ({ id }) => {
  if (id === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-4 w-4 sm:h-[18px] sm:w-[18px] md:h-5 md:w-5"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (id === "facebook") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4 sm:h-[18px] sm:w-[18px] md:h-5 md:w-5"
      >
        <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.5l.5-3H14V9z" />
      </svg>
    );
  }

  if (id === "tiktok") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4 sm:h-[18px] sm:w-[18px] md:h-5 md:w-5"
      >
        <path d="M19.6 8.4a5.9 5.9 0 01-3.5-1.1v6.3a5.4 5.4 0 11-5.4-5.4c.3 0 .5 0 .8.1v2.7a2.7 2.7 0 10-1.9 2.6V3.5h2.6a5.9 5.9 0 003.5 5.1 5.9 5.9 0 003.9 1.1v2.7z" />
      </svg>
    );
  }

  if (id === "youtube") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4 sm:h-[18px] sm:w-[18px] md:h-5 md:w-5"
      >
        <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.8zM9.8 15.5v-7l6.3 3.5-6.3 3.5z" />
      </svg>
    );
  }

  return null;
};

const ThankYouSection = ({ isOpen, scrollRoot }) => {
  const { backgrounds: BACKGROUNDS } = useWedding();

  const companyName = COMPANY?.name || "bluepaper-invitation.co";
  const copyrightYear = COMPANY?.copyrightYear || new Date().getFullYear();
  const socials = Array.isArray(COMPANY?.socials) ? COMPANY.socials : [];
  const waUrl = COMPANY?.whatsapp ? `https://wa.me/${COMPANY.whatsapp}` : null;

  return (
    <InvitationSection
      id="thankyou"
      height="screen"
      trigger="scroll"
      isOpen={isOpen}
      scrollRoot={scrollRoot}
      animation="fade"
      className="bg-neutral-950"
    >
      <section
        className="
          relative flex h-screen min-h-screen max-h-screen
          flex-col items-center justify-between
          overflow-hidden bg-neutral-950 px-5 pb-8 pt-16 text-white
          sm:px-8 sm:pb-10 sm:pt-20
          md:px-10
        "
      >
        <img
          src={BACKGROUNDS.thankyou}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-neutral-950/45" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/30 via-transparent to-neutral-950/70" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)]" />

        <div
          className="
            relative z-10 flex w-full flex-1 flex-col items-center
            justify-center text-center
            max-w-[22rem]
            sm:max-w-md
            md:max-w-lg
          "
        >
          <p
            data-reveal
            className="
              uppercase tracking-[0.4em] text-white/75 drop-shadow-sm
              text-[12px]
              sm:text-[13px]
              md:text-sm
            "
          >
            Terima Kasih
          </p>

          <h2
            data-reveal
            className="
              mt-3 font-serif font-normal leading-snug tracking-tight drop-shadow-md
              text-3xl
              sm:mt-4 sm:text-4xl
              md:mt-5 md:text-5xl
            "
          >
            Thank You
            <br />
            for Your Attendance
          </h2>

          <div
            data-reveal
            className="mt-5 h-px w-12 bg-white/45 sm:mt-6 md:mt-7 md:w-14"
          />

          <p
            data-reveal
            className="
              mt-5 leading-relaxed text-white/85 drop-shadow-sm
              text-[14px]
              sm:mt-6 sm:text-base
              md:mt-7 md:text-lg
            "
          >
            Kehadiran dan doa restu Anda
            <br />
            merupakan hadiah terindah bagi kami.
          </p>

          <div data-reveal className="mt-8 opacity-40 sm:mt-10 md:mt-12">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              className="text-white sm:h-11 sm:w-11 md:h-12 md:w-12"
            >
              <path
                d="M20 6c-2.5 4.5-8 7-8 13a8 8 0 0016 0c0-6-5.5-8.5-8-13z"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>
        </div>

        <footer
          data-reveal
          className="
            relative z-10 mt-6 flex w-full flex-col items-center gap-3.5
            text-center
            max-w-[22rem]
            sm:mt-8 sm:max-w-md sm:gap-4
            md:max-w-lg md:gap-5
          "
        >
          <p
            className="
              font-medium uppercase tracking-[0.28em] text-white/70
              text-[11px]
              sm:text-xs
              md:text-sm
            "
          >
            {companyName}
          </p>

          <div className="flex items-center justify-center gap-3 sm:gap-3.5 md:gap-4">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="
                  flex items-center justify-center rounded-full
                  border border-white/25 bg-black/25 text-white/75
                  backdrop-blur-sm transition
                  hover:border-white/45 hover:bg-black/40 hover:text-white
                  h-10 w-10
                  sm:h-11 sm:w-11
                  md:h-12 md:w-12
                "
              >
                <SocialIcon id={s.id} />
              </a>
            ))}

            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="
                  flex items-center justify-center rounded-full
                  border border-white/25 bg-black/25 text-white/75
                  backdrop-blur-sm transition
                  hover:border-white/45 hover:bg-black/40 hover:text-white
                  h-10 w-10
                  sm:h-11 sm:w-11
                  md:h-12 md:w-12
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 sm:h-[18px] sm:w-[18px] md:h-5 md:w-5"
                >
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.76.46 3.45 1.28 4.92L2 22l5.33-1.4a9.86 9.86 0 004.71 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.78 14.1c-.24.68-1.4 1.25-1.94 1.33-.5.07-1.13.1-1.82-.11-.42-.13-.96-.28-1.65-.55-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.2-1.6-1.2-3.05s.76-2.17 1.03-2.47c.27-.3.59-.37.79-.37h.57c.18 0 .42-.07.66.5.24.58.82 2 .89 2.14.07.14.12.3.02.49-.1.2-.15.32-.3.49-.14.17-.3.38-.43.51-.14.14-.29.29-.12.56.16.27.72 1.19 1.55 1.93 1.07.95 1.97 1.24 2.25 1.38.28.14.44.12.6-.07.17-.2.7-.81.89-1.09.18-.27.37-.23.62-.14.26.1 1.63.77 1.91.91.28.14.47.21.54.32.07.12.07.68-.17 1.36z" />
                </svg>
              </a>
            )}
          </div>

          <p
            className="
              tracking-[0.12em] text-white/40
              text-[10px]
              sm:text-[11px]
              md:text-xs
            "
          >
            © {copyrightYear} {companyName}. All rights reserved.
          </p>
        </footer>
      </section>
    </InvitationSection>
  );
};

export default ThankYouSection;
