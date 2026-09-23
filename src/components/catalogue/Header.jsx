// Header.jsx
import { useState, useEffect } from "react";

const WA_NUMBER = "6285739211076";

function openConsultationWa() {
  const text = encodeURIComponent(
    `Assalamualaikum / Selamat siang,\n\n` +
      `Perkenalkan, saya tertarik dengan layanan undangan digital Bluepaper Invitation.\n\n` +
      `Apakah saya boleh berkonsultasi mengenai paket, template, dan proses pemesanannya?\n\n` +
      `Terima kasih.`,
  );
  window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank", "noopener");
}

/* ========== Logo Image Component ========== */
function Logo({ scrolled = false }) {
  return (
    <img
      src="/Logo/android-chrome-192x192.png"
      alt="Bluepaper Invitation"
      className={`rounded-full object-cover transition-all duration-300 ${
        scrolled ? "h-10 w-10" : "h-11 w-11"
      }`}
    />
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.7);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#templates", label: "Templates" },
    { href: "#features", label: "Fitur" },
    { href: "#faq", label: "FAQ" },
  ];

  const handleNavClick = () => setMenuOpen(false);

  const handleConsult = (e) => {
    e.preventDefault();
    handleNavClick();
    openConsultationWa();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 ${
        scrolled ? "bg-white/95 shadow-sm backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-center px-5 sm:h-[4.5rem] sm:px-8">
        {/* ===== Desktop Navbar ===== */}
        <div
          className={`hidden w-full items-center justify-between transition-all duration-300 md:flex ${
            scrolled
              ? "max-w-none rounded-none bg-transparent px-0 py-0 shadow-none"
              : "max-w-3xl rounded-full bg-white/80 px-5 py-2.5 shadow-lg backdrop-blur-md"
          }`}
        >
          {/* Logo Image */}
          <a
            href="#"
            onClick={handleNavClick}
            className="flex shrink-0 items-center"
          >
            <Logo scrolled={scrolled} />
          </a>

          {/* Nav links */}
          <nav>
            <ul className="flex list-none items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[13.5px] font-medium text-slate-700 transition-colors hover:text-sky-600"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA */}
          <button
            type="button"
            onClick={handleConsult}
            className="rounded-full bg-slate-900 px-5 py-2 text-[13px] font-medium text-white transition hover:bg-slate-800"
          >
            Konsultasi
          </button>
        </div>

        {/* ===== Mobile header ===== */}
        <div className="flex w-full items-center justify-between md:hidden">
          <a href="#" onClick={handleNavClick} className="flex items-center">
            <Logo scrolled={scrolled || menuOpen} />
          </a>

          <button
            type="button"
            className="relative z-110 flex h-9 w-9 items-center justify-center"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((p) => !p)}
          >
            <div className="relative h-4 w-5">
              <span
                className={`absolute left-0 right-0 h-[1.5px] rounded-full bg-slate-800 transition-all ${
                  menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 right-0 top-1/2 h-[1.5px] -translate-y-1/2 rounded-full bg-slate-800 transition-all ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 right-0 h-[1.5px] rounded-full bg-slate-800 transition-all ${
                  menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-105 md:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-slate-900/40 transition-opacity ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute left-0 right-0 top-0 bg-white/95 shadow-lg backdrop-blur-md transition-transform duration-300 ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="px-5 pb-8 pt-20">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href} className="border-b border-sky-100">
                  <a
                    href={link.href}
                    onClick={handleNavClick}
                    className="block py-4 text-[16px] font-medium text-slate-800"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleConsult}
              className="mt-6 flex w-full items-center justify-center rounded-full bg-slate-900 py-3.5 text-[15px] font-medium text-white"
            >
              Konsultasi Sekarang
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
