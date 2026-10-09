// GiftSection.jsx
import { useState, useCallback, useMemo } from "react";
import InvitationSection from "../layout/InvitationSection";
import { useWedding } from "../../../../context/WeddingContext";

const GiftSection = ({ isOpen, scrollRoot }) => {
  const {
    backgrounds: BACKGROUNDS,
    giftAccounts = [],
    giftAddress: rawAddress,
  } = useWedding();

  const address = useMemo(() => {
    if (!rawAddress) return { name: "", lines: [] };
    if (Array.isArray(rawAddress.lines)) {
      return {
        name: rawAddress.name || rawAddress.recipient || "",
        lines: rawAddress.lines,
      };
    }
    const text = rawAddress.address || "";
    return {
      name: rawAddress.name || rawAddress.recipient || "",
      lines: text
        ? String(text)
            .split(/\n|,/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    };
  }, [rawAddress]);

  const [tab, setTab] = useState("amplop");
  const [copied, setCopied] = useState(null);

  const copyText = useCallback(async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 2000);
    }
  }, []);

  return (
    <InvitationSection
      id="gift"
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
          flex-col items-center justify-center
          overflow-hidden bg-neutral-950 px-5 py-10 text-white
          sm:px-8 sm:py-12
          md:px-10
        "
      >
        <img
          src={BACKGROUNDS.gift}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-neutral-950/45" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/30 via-transparent to-neutral-950/55" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)]" />

        <div
          className="
            relative z-10 w-full
            max-w-[22rem]
            sm:max-w-md
            md:max-w-lg
          "
        >
          <div className="mb-5 text-center sm:mb-6">
            <h2
              data-reveal
              className="
                font-serif font-normal tracking-tight drop-shadow-md
                text-3xl
                sm:text-4xl
                md:text-5xl
              "
            >
              Wedding Gift
            </h2>
            <p
              data-reveal
              className="
                mt-2.5 leading-relaxed text-white/85 drop-shadow-sm
                text-[13px]
                sm:mt-3 sm:text-sm
                md:text-base
              "
            >
              Tanpa mengurangi rasa hormat kami, bagi tamu yang ingin
              mengirimkan hadiah kepada kedua mempelai dapat mengirimnya melalui
              :
            </p>
          </div>

          <div
            data-reveal
            className="mb-5 flex items-center justify-center gap-8 sm:mb-6 sm:gap-10"
          >
            <button
              type="button"
              onClick={() => setTab("amplop")}
              className={`
                uppercase tracking-[0.28em] transition-colors
                text-[12px]
                sm:text-[13px]
                md:text-sm
                ${
                  tab === "amplop"
                    ? "text-white underline decoration-white/50 underline-offset-8"
                    : "text-white/45 hover:text-white/75"
                }
              `}
            >
              E-Amplop
            </button>
            <button
              type="button"
              onClick={() => setTab("registry")}
              className={`
                uppercase tracking-[0.28em] transition-colors
                text-[12px]
                sm:text-[13px]
                md:text-sm
                ${
                  tab === "registry"
                    ? "text-white underline decoration-white/50 underline-offset-8"
                    : "text-white/45 hover:text-white/75"
                }
              `}
            >
              Gift Registry
            </button>
          </div>

          <div data-reveal>
            {tab === "amplop" ? (
              <div className="space-y-4 sm:space-y-5">
                {giftAccounts.map((acc) => (
                  <div
                    key={acc.id || acc.number}
                    className="flex items-start justify-between gap-4 border-b border-white/15 pb-4 last:border-0"
                  >
                    <div>
                      <p
                        className="
                          font-medium uppercase tracking-[0.2em] text-white/95
                          text-[12px]
                          sm:text-[13px]
                          md:text-sm
                        "
                      >
                        {acc.bank}
                      </p>
                      <p
                        className="
                          mt-1 font-mono tracking-wide text-white/85
                          text-[14px]
                          sm:text-[15px]
                          md:text-base
                        "
                      >
                        {acc.number}
                      </p>
                      <p
                        className="
                          mt-0.5 text-white/55
                          text-[12px]
                          sm:text-[13px]
                          md:text-sm
                        "
                      >
                        {acc.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyText(acc.number, acc.id || acc.number)}
                      className="
                        flex shrink-0 items-center gap-1.5 rounded-full
                        border border-white/25 bg-black/25 px-3.5 py-1.5
                        uppercase tracking-[0.18em] text-white/80
                        backdrop-blur-sm transition hover:bg-black/40 hover:text-white
                        text-[10px]
                        sm:px-4 sm:py-2 sm:text-[11px]
                        md:text-xs
                      "
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-3.5 w-3.5"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                      {copied === (acc.id || acc.number) ? "Tersalin" : "Salin"}
                    </button>
                  </div>
                ))}

                {(address.name || address.lines.length > 0) && (
                  <div className="flex items-start justify-between gap-4 pt-0.5">
                    <div>
                      {address.name && (
                        <p
                          className="
                            font-medium text-white/95
                            text-[12px]
                            sm:text-[13px]
                            md:text-sm
                          "
                        >
                          {address.name}
                        </p>
                      )}
                      <p
                        className="
                          mt-1 leading-relaxed text-white/55
                          text-[12px]
                          sm:text-[13px]
                          md:text-sm
                        "
                      >
                        {address.lines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        copyText(
                          [address.name, ...address.lines]
                            .filter(Boolean)
                            .join("\n"),
                          "address",
                        )
                      }
                      className="
                        flex shrink-0 items-center gap-1.5 rounded-full
                        border border-white/25 bg-black/25 px-3.5 py-1.5
                        uppercase tracking-[0.18em] text-white/80
                        backdrop-blur-sm transition hover:bg-black/40 hover:text-white
                        text-[10px]
                        sm:px-4 sm:py-2 sm:text-[11px]
                        md:text-xs
                      "
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-3.5 w-3.5"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                      {copied === "address" ? "Tersalin" : "Salin"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-md border border-white/15 bg-black/25 px-5 py-8 text-center backdrop-blur-sm sm:px-6 sm:py-10">
                <p
                  className="
                    leading-relaxed text-white/60
                    text-[13px]
                    sm:text-sm
                    md:text-base
                  "
                >
                  Gift registry belum tersedia.
                  <br />
                  Silakan gunakan E-Amplop untuk mengirim hadiah.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </InvitationSection>
  );
};

export default GiftSection;
