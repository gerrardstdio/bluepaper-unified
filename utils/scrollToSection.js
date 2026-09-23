export function scrollToSection(scrollRef, sectionId) {
  const root = scrollRef?.current;
  const el = document.getElementById(sectionId);

  if (!el) {
    console.warn(`[scroll] #${sectionId} tidak ditemukan`);
    return;
  }

  if (!(root instanceof Element)) {
    el.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  const getTop = () =>
    el.getBoundingClientRect().top -
    root.getBoundingClientRect().top +
    root.scrollTop;

  const hadSnapY = root.classList.contains("snap-y");
  const hadSnapMandatory = root.classList.contains("snap-mandatory");
  const hadSmooth = root.classList.contains("scroll-smooth");

  // Matikan snap + smooth
  root.classList.remove("snap-y", "snap-mandatory", "scroll-smooth");
  root.classList.add("snap-none");
  root.style.scrollSnapType = "none";
  root.style.scrollBehavior = "auto";

  root.scrollTop = Math.max(0, getTop());

  // Tunggu layout stabil, kunci lagi, baru hidupkan snap
  window.setTimeout(() => {
    root.scrollTop = Math.max(0, getTop());

    requestAnimationFrame(() => {
      root.scrollTop = Math.max(0, getTop());

      root.classList.remove("snap-none");
      if (hadSnapY) root.classList.add("snap-y");
      if (hadSnapMandatory) root.classList.add("snap-mandatory");
      if (hadSmooth) root.classList.add("scroll-smooth");
      root.style.scrollSnapType = "";
      root.style.scrollBehavior = "";

      requestAnimationFrame(() => {
        root.scrollTop = Math.max(0, getTop());
      });
    });
  }, 120);
}
