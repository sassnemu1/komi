import { useEffect } from "react";
import useGSAP from "./useGSAP";

// Скролл-параллакс для слоёв внутри секции.
//
// Любой элемент с [data-parallax="N"] внутри sectionRef едет по вертикали
// от −N % до +N % собственной высоты, пока его «сцена» проходит через экран.
// Сцена — ближайший предок с [data-parallax-scope], иначе вся секция.
// Слой должен быть выше своей сцены (inset: −(N+2)% 0), иначе покажутся края.
// При prefers-reduced-motion ничего не двигаем.
export default function useParallax(sectionRef, { selector = "[data-parallax]", y = 10 } = {}) {
  const { gsap, ScrollTrigger } = useGSAP();

  useEffect(() => {
    if (!gsap || !ScrollTrigger) return;
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layers = root.querySelectorAll(selector);
    if (!layers.length) return;

    const ctx = gsap.context(() => {
      layers.forEach((layer) => {
        const amount = parseFloat(layer.dataset.parallax) || y;
        const scope = layer.closest("[data-parallax-scope]") || root;
        gsap.fromTo(
          layer,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: "none",
            scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [gsap, ScrollTrigger, sectionRef, selector, y]);
}
