// Hero.jsx
export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background sky - full bleed from top */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/Hero Background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/10 via-transparent to-sky-100/30" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-5 pb-24 pt-28 text-center sm:px-8 sm:pt-32">
        {/* Small label */}
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/90 drop-shadow-sm sm:text-[12px]">
         Bluepaper Invitation
        </p>

        {/* Main headline */}
        <h1 className="mt-5 font-serif text-[clamp(2.4rem,7vw,4.5rem)] font-normal leading-[1.1] tracking-tight text-white drop-shadow-md">
          Bring personality
          <br />
          to every page
        </h1>

        {/* Subtext */}
        <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-white/90 drop-shadow-sm sm:text-base">
          Pilih template, isi data pasangan & acara, lalu bagikan link ke tamu —
          lengkap dengan RSVP dan ucapan.
        </p>

        {/* CTA */}
        <div className="mt-10">
          <a
            href="#templates"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-[14.5px] font-medium text-sky-700 shadow-lg transition hover:bg-sky-50 hover:shadow-xl"
          >
            Jelajahi template
          </a>
        </div>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {[
            { n: "Mudah", d: "Tanpa coding" },
            { n: "RSVP", d: "Terkumpul otomatis" },
            { n: "Link", d: "Siap di-share WA" },
          ].map((item) => (
            <div
              key={item.n}
              className="rounded-full border border-white/40 bg-white/20 px-5 py-2.5 backdrop-blur-sm"
            >
              <p className="text-[13px] font-medium text-white">{item.n}</p>
              <p className="text-[11px] text-white/80">{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
