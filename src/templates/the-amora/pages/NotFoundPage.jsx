// src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";
import { COUPLE } from "../data/couple";

const NotFoundPage = () => {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-neutral-950 px-6 text-center text-white">
      <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
        404
      </p>
      <h1 className="mt-4 font-serif text-3xl tracking-tight md:text-4xl">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/55">
        Tautan undangan tidak valid atau sudah tidak tersedia.
      </p>
      <Link
        to={`/${COUPLE.slug}`}
        className="mt-10 rounded-full border border-white/30 px-6 py-3 text-[10px] uppercase tracking-[0.25em] text-white/80 transition hover:border-white/60 hover:text-white"
      >
        Kembali
      </Link>
    </main>
  );
};

export default NotFoundPage;
