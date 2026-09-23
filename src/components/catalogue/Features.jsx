export default function Features() {
  const items = [
    {
      title: "Desain rapi",
      text: "Template siap pakai dengan tipografi dan layout yang sudah ditata — tinggal isi data Anda.",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z"
          />
        </svg>
      ),
    },
    {
      title: "Isi cepat",
      text: "Nama, tanggal, foto, rekening, dan daftar tamu diatur lewat panel sederhana.",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      ),
    },
    {
      title: "RSVP & ucapan",
      text: "Tamu konfirmasi hadir dan kirim doa. Hasil bisa dipantau di halaman kelola.",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1m0-4V6a2 2 0 012-2h6a2 2 0 012 2v2"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-sky-600">
            Fitur
          </p>
          <h2 className="mt-2 font-serif text-[clamp(1.6rem,3.5vw,2.25rem)] font-normal text-slate-900">
            Semua yang Anda butuhkan
          </h2>
          <p className="mt-3 text-[15px] text-slate-500">
            Ringkas, jelas, tanpa proses rumit.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-10">
          {items.map((item) => (
            <div key={item.title} className="text-center sm:text-left">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 sm:mx-0">
                {item.icon}
              </div>
              <h3 className="mt-4 font-serif text-xl text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
