export default function CTA() {
  return (
    <section className="border-y border-sky-100 bg-sky-50 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
        <p className="font-serif text-[1.75rem] text-sky-800 sm:text-[2rem]">
          Bluepaper
        </p>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.35em] text-sky-600">
          Invitation
        </p>
        <h2 className="mt-6 font-serif text-[clamp(1.5rem,3.5vw,2rem)] font-normal text-slate-900">
          Siap bagikan undangan yang pantas dikenang?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-slate-600">
          Mulai dari template favorit, sesuaikan, lalu kirim link ke orang
          tersayang.
        </p>
        <a
          href="#templates"
          className="mt-8 inline-flex rounded-full bg-sky-600 px-8 py-3.5 text-[14.5px] font-medium text-white transition hover:bg-sky-700"
        >
          Buat undangan
        </a>
      </div>
    </section>
  );
}
