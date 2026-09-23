import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const useInvitationReveal = ({
  isOpen,
  scrollRoot,
  animation = "fade",
  trigger = "scroll",
  delay = 0,
  customSetup,
}) => {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      if (!isOpen) return;

      const section = sectionRef.current;
      if (!(section instanceof Element)) return;

      const root = scrollRoot?.current;
      if (scrollRoot && !(root instanceof Element)) return;

      const stBase = {
        trigger: section,
        scroller: root || undefined,
        // sedikit lebih rendah → animasi tidak langsung “nyala” saat section baru masuk
        start: "top 72%",
        end: "bottom 22%",
        toggleActions: "play reverse play reverse",
        invalidateOnRefresh: true,
      };

      if (typeof customSetup === "function") {
        const anim = customSetup(section, gsap);
        if (anim) {
          if (typeof anim.pause === "function") anim.pause(0);

          if (trigger === "open") {
            const openDelay = delay > 0 ? delay : 1.3;
            gsap.delayedCall(openDelay, () => anim.play(0));
            ScrollTrigger.create({
              ...stBase,
              animation: anim,
              toggleActions: "none reverse play reverse",
            });
          } else {
            ScrollTrigger.create({
              ...stBase,
              animation: anim,
            });
          }
        }

        requestAnimationFrame(() => ScrollTrigger.refresh());
        return;
      }

      const items = section.querySelectorAll("[data-reveal]");
      if (!items.length) return;

      gsap.set(items, {
        opacity: 0,
        y: 28,
        force3D: true,
      });

      // Medium-slow: lebih lama + stagger lebih longgar
      const tween = gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 1.45, // sebelumnya 1.15 → lebih lambat
        ease: "power3.out",
        stagger: 0.2, // sebelumnya 0.14 → jeda antar item lebih terasa
        force3D: true,
        paused: true,
      });

      if (trigger === "open") {
        const openDelay = delay > 0 ? delay : 1.3;
        gsap.delayedCall(openDelay, () => {
          tween.play(0);
        });

        ScrollTrigger.create({
          ...stBase,
          animation: tween,
          toggleActions: "none reverse play reverse",
        });
      } else {
        ScrollTrigger.create({
          ...stBase,
          animation: tween,
        });
      }

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    },
    {
      dependencies: [
        isOpen,
        scrollRoot,
        animation,
        trigger,
        delay,
        customSetup,
      ],
      scope: sectionRef,
      revertOnUpdate: true,
    },
  );

  return sectionRef;
};

export default useInvitationReveal;
