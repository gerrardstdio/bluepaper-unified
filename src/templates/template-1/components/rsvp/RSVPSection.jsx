// RsvpSection.jsx
import { useState } from "react";
import InvitationSection from "../layout/InvitationSection";
import { addRsvpEntry, notifyRsvpUpdated } from "../../hooks/useRSVPStorage";
import { useWedding } from "../../../../context/WeddingContext";

const initialForm = {
  nama: "",
  ucapan: "",
  kehadiran: "hadir",
  jumlahTamu: 1,
};

const RsvpSection = ({ isOpen, scrollRoot, onNavigateToWishes }) => {
  const { backgrounds: BACKGROUNDS, customerSlug, slug } = useWedding();

  // live → customerSlug / slug URL; demo → "demo" atau slug demo
  const storageKey = customerSlug || slug || "demo";

  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastEntry, setLastEntry] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "jumlahTamu" ? Math.max(1, Number(value) || 1) : value,
    }));
  };

  const goToWishes = () => {
    if (typeof onNavigateToWishes === "function") {
      onNavigateToWishes();
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setErrorMsg("");
    setStatus("loading");

    const nama = form.nama.trim();
    const ucapan = form.ucapan.trim();

    if (!nama) {
      setErrorMsg("Nama wajib diisi.");
      setStatus("error");
      return;
    }
    if (!ucapan) {
      setErrorMsg("Ucapan & doa wajib diisi.");
      setStatus("error");
      return;
    }

    try {
      const payload = {
        nama,
        ucapan,
        kehadiran: form.kehadiran,
        jumlahTamu: form.kehadiran === "hadir" ? form.jumlahTamu : 0,
      };

      const list = await addRsvpEntry(payload, storageKey);
      notifyRsvpUpdated(list, storageKey);

      setLastEntry(list[0] ?? payload);
      setForm(initialForm);
      setStatus("success");

      window.setTimeout(() => {
        goToWishes();
      }, 200);
    } catch (err) {
      setErrorMsg(err?.message || "Gagal menyimpan. Coba lagi.");
      setStatus("error");
    }
  };

  return (
    <InvitationSection
      id="rsvp"
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
          src={BACKGROUNDS.rsvp}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-neutral-950/45" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/30 via-transparent to-neutral-950/55" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)]" />

        <div
          className="
            relative z-10 w-full max-w-sm
            md:max-w-md
            lg:max-w-sm
          "
        >
          <div className="text-center">
            <p
              data-reveal
              className="
                text-[9px] uppercase tracking-[0.45em] text-white/80 drop-shadow-sm
                sm:text-[10px]
                md:text-[12px]
                lg:text-[9px]
              "
            >
              RSVP
            </p>
            <h2
              data-reveal
              className="
                mt-3 font-serif font-normal tracking-tight drop-shadow-md
                text-3xl
                sm:mt-4 sm:text-[2rem]
                md:text-5xl
                lg:text-3xl
              "
            >
              Konfirmasi
              <br />
              Kehadiran
            </h2>
            <div
              data-reveal
              className="mx-auto mt-5 h-px w-10 bg-white/50 sm:mt-6 md:mt-8 md:w-12 lg:mt-6 lg:w-10"
            />
            <p
              data-reveal
              className="
                mt-5 leading-relaxed text-white/85 drop-shadow-sm
                text-[11px]
                sm:mt-6 sm:text-[12px]
                md:text-[15px]
                lg:text-[11px]
              "
            >
              Mohon konfirmasi kehadiran Anda dan tinggalkan doa terbaik untuk
              kami.
            </p>
          </div>

          <div data-reveal className="mt-8 sm:mt-10 md:mt-12 lg:mt-10">
            {status === "success" && lastEntry ? (
              <div className="flex flex-col items-center gap-5 text-center sm:gap-6">
                <p className="text-[11px] text-emerald-300/90 md:text-[14px] lg:text-[11px]">
                  Terima kasih! Ucapan Anda telah tersimpan.
                </p>
                <blockquote className="w-full border border-white/15 bg-black/20 px-4 py-5 backdrop-blur-sm md:px-6 md:py-6">
                  <p className="font-serif leading-relaxed text-white/85 text-[13px] md:text-[16px] lg:text-[13px]">
                    “{lastEntry.ucapan}”
                  </p>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/55 md:text-[12px] lg:text-[10px]">
                    — {lastEntry.nama}
                  </p>
                </blockquote>
                <button
                  type="button"
                  onClick={goToWishes}
                  className="
                    w-full border border-white/30 bg-white py-3.5
                    uppercase tracking-[0.3em] text-neutral-950
                    transition hover:bg-white/90
                    text-[10px]
                    md:py-4 md:text-[12px]
                    lg:py-3.5 lg:text-[10px]
                  "
                >
                  Lihat semua ucapan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setLastEntry(null);
                  }}
                  className="text-[9px] uppercase tracking-[0.25em] text-white/50 transition hover:text-white/75 md:text-[11px] lg:text-[9px]"
                >
                  Kirim ucapan lain
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 md:gap-6 lg:gap-5"
                noValidate
              >
                <label className="block">
                  <span className="mb-2 block text-[9px] uppercase tracking-[0.28em] text-white/60 md:text-[11px] lg:text-[9px]">
                    Nama
                  </span>
                  <input
                    type="text"
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    placeholder="Nama lengkap"
                    autoComplete="name"
                    disabled={status === "loading"}
                    className="
                      w-full rounded-none border-0 border-b border-white/30
                      bg-transparent px-0 py-2.5 text-white
                      placeholder:text-white/35 outline-none transition
                      focus:border-white/60 disabled:opacity-50
                      text-[13px]
                      md:py-3 md:text-[15px]
                      lg:py-2.5 lg:text-[13px]
                    "
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[9px] uppercase tracking-[0.28em] text-white/60 md:text-[11px] lg:text-[9px]">
                    Ucapan & Doa
                  </span>
                  <textarea
                    name="ucapan"
                    value={form.ucapan}
                    onChange={handleChange}
                    placeholder="Tulis doa dan ucapan untuk pengantin…"
                    rows={3}
                    disabled={status === "loading"}
                    className="
                      w-full resize-none rounded-none border-0 border-b border-white/30
                      bg-transparent px-0 py-2.5 leading-relaxed text-white
                      placeholder:text-white/35 outline-none transition
                      focus:border-white/60 disabled:opacity-50
                      text-[13px]
                      md:py-3 md:text-[15px]
                      lg:py-2.5 lg:text-[13px]
                    "
                  />
                </label>

                <fieldset>
                  <legend className="mb-3 text-[9px] uppercase tracking-[0.28em] text-white/60 md:text-[11px] lg:text-[9px]">
                    Konfirmasi Kehadiran
                  </legend>
                  <div className="flex gap-3">
                    {[
                      { value: "hadir", label: "Hadir" },
                      { value: "tidak", label: "Tidak Hadir" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`
                          flex flex-1 cursor-pointer items-center justify-center
                          border py-2.5 uppercase tracking-[0.2em] backdrop-blur-sm transition
                          text-[10px]
                          md:py-3 md:text-[12px]
                          lg:py-2.5 lg:text-[10px]
                          ${
                            form.kehadiran === opt.value
                              ? "border-white/50 bg-white/10 text-white"
                              : "border-white/20 bg-black/15 text-white/55 hover:border-white/35"
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="kehadiran"
                          value={opt.value}
                          checked={form.kehadiran === opt.value}
                          onChange={handleChange}
                          disabled={status === "loading"}
                          className="sr-only"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {form.kehadiran === "hadir" && (
                  <label className="block">
                    <span className="mb-2 block text-[9px] uppercase tracking-[0.28em] text-white/60 md:text-[11px] lg:text-[9px]">
                      Jumlah Tamu
                    </span>
                    <input
                      type="number"
                      name="jumlahTamu"
                      min={1}
                      max={20}
                      value={form.jumlahTamu}
                      onChange={handleChange}
                      disabled={status === "loading"}
                      className="
                        w-full rounded-none border-0 border-b border-white/30
                        bg-transparent px-0 py-2.5 text-white outline-none
                        transition focus:border-white/60 disabled:opacity-50
                        text-[13px]
                        md:py-3 md:text-[15px]
                        lg:py-2.5 lg:text-[13px]
                      "
                    />
                  </label>
                )}

                {status === "error" && errorMsg && (
                  <p className="text-center text-[11px] text-red-300/90 md:text-[13px] lg:text-[11px]">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  className="
                    mt-2 w-full border border-white/30 bg-white py-3.5
                    uppercase tracking-[0.3em] text-neutral-950
                    transition hover:bg-white/90 active:scale-[0.99]
                    disabled:opacity-60
                    text-[10px]
                    md:py-4 md:text-[12px]
                    lg:py-3.5 lg:text-[10px]
                  "
                >
                  {status === "loading" ? "Menyimpan…" : "Kirim"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </InvitationSection>
  );
};

export default RsvpSection;
