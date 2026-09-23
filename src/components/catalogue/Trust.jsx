export default function Trust() {
  const points = [
    {
      title: "Respon cepat",
      text: "Tim siap membalas pertanyaan dan permintaan Anda dengan tanggap.",
    },
    {
      title: "Kelola tamu mudah",
      text: "Bagikan link, centang yang sudah dikirim, pantau RSVP di satu halaman.",
    },
    {
      title: "Revisi gratis selama aktif",
      text: "Konsultasi & perbaikan konten tidak dibatasi selama masa aktif undangan.",
    },
  ];

  return (
    <section id="jaminan" className="bg-white py-20 sm:py-24 md:py-28 lg:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[12px] font-medium tracking-[0.2em] text-sky-600 uppercase">
            Komitmen kami
          </p>
          <h2 className="mt-4 font-serif text-[clamp(1.8rem,4vw,2.75rem)] font-normal leading-[1.15] tracking-tight text-slate-900">
            Tenang memesan.
            <br />
            Nyaman memakai.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-slate-500 sm:text-[16px]">
            Dukungan jelas dari konsultasi awal hingga undangan live di tangan
            tamu. Revisi konten tidak dibatasi selama undangan masih aktif.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-3 sm:gap-6 md:mt-20">
          {points.map((item, i) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-[1.5rem] bg-slate-50/80 px-6 py-8 transition-all duration-500 hover:bg-white hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.08)] sm:px-7 sm:py-9"
            >
              {/* Number */}
              <span className="block font-serif text-[2.75rem] leading-none tracking-tight text-slate-200 transition-colors duration-500 group-hover:text-sky-200 sm:text-[3rem]">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Content */}
              <div className="mt-6">
                <h3 className="text-[16px] font-medium tracking-tight text-slate-900 sm:text-[17px]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-500 sm:text-[14px]">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
