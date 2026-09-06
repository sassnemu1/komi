import { useEffect } from "react";
import useGSAP from "./useGSAP";

// Единый reveal-on-scroll для нижних секций: всё, что помечено
// [data-reveal] внутри sectionRef, появляется снизу с небольшим stagger,
// когда секция входит в кадр. При prefers-reduced-motion ничего не прячем.
export default function useReveal(sectionRef, { selector = "[data-reveal]", start = "top 78%", stagger = 0.06, y = 22 } = {}) {
  const { gsap, ScrollTrigger } = useGSAP();

  useEffect(() => {
    if (!gsap || !ScrollTrigger) return;
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = root.querySelectorAll(selector);
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger,
        scrollTrigger: { trigger: root, start },
      });
    }, root);

    return () => ctx.revert();
  }, [gsap, ScrollTrigger, sectionRef, selector, start, stagger, y]);
}
