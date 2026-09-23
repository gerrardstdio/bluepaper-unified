import { useEffect } from "react";
import { NAV_ITEMS } from "../../data/navbar";

const InvitationNavbar = ({
  isOpen,
  onToggle,
  onNavigate,
  disabled = false,
}) => {
  /*
   * ========================================
   * ESCAPE TO CLOSE
   * ========================================
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onToggle]);

  /*
   * ========================================
   * LOCK BODY SCROLL
   * ========================================
   */
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (disabled) {
    return null;
  }

  return (
    <>
      {/* ========================================
          HAMBURGER / CLOSE BUTTON
          ======================================== */}

      <button
        type="button"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="
          fixed
          right-6
          top-6
          z-100
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-white/20
          bg-black/30
          text-white
          backdrop-blur-sm
          transition-all
          duration-300
          ease-out
          hover:bg-black/40
          active:scale-95
          md:right-7
          md:top-7
        "
      >
        {/* LINE 1 */}

        <span
          className={`
            absolute
            h-px
            w-5
            bg-white
            transition-transform
            duration-300
            ease-out
            ${isOpen ? "rotate-45" : "-translate-y-0.75"}
          `}
        />

        {/* LINE 2 */}

        <span
          className={`
            absolute
            h-px
            w-5
            bg-white
            transition-transform
            duration-300
            ease-out
            ${isOpen ? "-rotate-45" : "translate-y-0.75"}
          `}
        />
      </button>

      {/* ========================================
          FULL VIEWPORT NAVIGATION LAYER
          ======================================== */}

      <div
        className={`
          fixed
          inset-0
          z-90
          transition-opacity
          duration-500
          ease-out
          ${
            isOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      >
        {/* ========================================
            BACKDROP BLUR

            Blur selalu ada pada layer,
            tetapi opacity yang dianimasikan.
            Ini membuat efek blur terasa smooth.
            ======================================== */}

        <div
          className={`
            absolute
            inset-0
            bg-black/10
            backdrop-blur-[3px]
            transition-opacity
            duration-500
            ease-out
            ${isOpen ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* ========================================
            CLICK AREA
            ======================================== */}

        <button
          type="button"
          aria-label="Close navigation"
          onClick={onToggle}
          className="
            absolute
            inset-0
            h-full
            w-full
            cursor-default
            border-0
            bg-transparent
            outline-none
          "
        />

        {/* ========================================
            FLOATING MENU
            ======================================== */}

        <nav
          aria-label="Wedding navigation"
          className={`
            absolute
            right-6
            top-6
            z-110
            w-82.5
            max-w-[calc(100vw-3rem)]
            rounded-3xl
            border
            border-white/20
            bg-neutral-950/90
            px-7
            pb-6
            pt-18
            text-white
            shadow-2xl

            transition-all
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]

            md:right-7
            md:top-7

            ${
              isOpen
                ? "translate-y-0 scale-100 opacity-100"
                : "-translate-y-3 scale-[0.98] opacity-0"
            }
          `}
        >
          {/* ========================================
              NAVIGATION ITEMS
              ======================================== */}

          <div className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.target}
                type="button"
                onClick={() => onNavigate(item.target)}
                className="
                  py-1.75
                  text-left
                  font-serif
                  text-[25px]
                  leading-tight
                  text-white/90
                  transition-all
                  duration-300
                  ease-out
                  hover:translate-x-1
                  hover:text-white
                  active:scale-[0.99]
                "
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* ========================================
              PERSONALIZED CARD
              ======================================== */}

          <div
            className="
              mt-8
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-white/10
              bg-white/5
              px-4
              py-3
            "
          >
            {/* Envelope */}

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-white/15
                text-white/70
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-4 w-4"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />

                <path d="m3 7 9 6 9-6" />
              </svg>
            </div>

            {/* Text */}

            <div>
              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.15em]
                  text-white/40
                "
              >
                Personalized For
              </p>

              <p
                className="
                  mt-0.5
                  font-serif
                  text-base
                  text-white/90
                "
              >
                Tamu Undangan
              </p>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default InvitationNavbar;
