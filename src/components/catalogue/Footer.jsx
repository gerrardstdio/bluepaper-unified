export default function Footer() {
  return (
    <footer className="border-t border-sky-100 bg-white pb-8 pt-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 pb-12 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="#" className="inline-flex flex-col leading-none">
              <span className="font-serif text-2xl text-sky-700">Bluepaper</span>
              <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.35em] text-sky-500">
                Invitation
              </span>
            </a>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-slate-500">
              Undangan digital elegan untuk momen yang berarti.
            </p>
          </div>

          <div>
            <h5 className="text-[12px] font-semibold uppercase tracking-wide text-slate-800">
              Jelajahi
            </h5>
            <ul className="mt-4 flex list-none flex-col gap-2.5">
              {[
                ["#templates", "Templates"],
                ["#pricing", "Harga"],
                ["#faq", "FAQ"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-[13.5px] text-slate-500 hover:text-sky-700"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-[12px] font-semibold uppercase tracking-wide text-slate-800">
              Perusahaan
            </h5>
            <ul className="mt-4 flex list-none flex-col gap-2.5">
              {["Tentang", "Instagram", "Kontak"].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-[13.5px] text-slate-500 hover:text-sky-700"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-[12px] font-semibold uppercase tracking-wide text-slate-800">
              Bantuan
            </h5>
            <ul className="mt-4 flex list-none flex-col gap-2.5">
              {["Bantuan", "Syarat", "Privasi"].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-[13.5px] text-slate-500 hover:text-sky-700"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-sky-100 pt-6 text-center text-[12px] text-slate-400 sm:flex-row sm:text-left">
          <span>© 2026 Bluepaper Invitation</span>
          <span>Untuk cerita yang layak dikenang.</span>
        </div>
      </div>
    </footer>
  );
}
