"use client";

import { useEffect } from "react";
import useGSAP from "@/hooks/useGSAP";

// Плавный скролл (Lenis) поверх нативного. Сглаживает колесо и трекпад,
// touch оставляет нативным (syncTouch: false) — на телефоне ничего не
// меняется. Кадры считает gsap.ticker (один rAF на весь сайт), а
// ScrollTrigger обновляется из события scroll самого Lenis, поэтому
// пины и scrub-параллаксы идут синхронно с плавным скроллом.
//
// Экземпляр лежит в window.__lenis — для программного скролла из шапки
// (стадия карты, логотип) и стоп/старт при открытом меню.
// Якорные ссылки ведём сами через lenis.scrollTo — он учитывает
// scroll-margin-top цели (запас под шапку из globals.css), поэтому
// дополнительный offset не нужен. #map и #hero — хореография Header.
// При prefers-reduced-motion не включается вовсе.
const HANDLED_BY_HEADER = new Set(["map", "hero"]);

export default function SmoothScroll() {
  const { gsap, ScrollTrigger } = useGSAP();

  useEffect(() => {
    if (!gsap || !ScrollTrigger) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis = null;
    let tick = null;
    let cancelled = false;

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      if (!id || HANDLED_BY_HEADER.has(id)) return;
      const target = document.getElementById(id);
      if (!target || !lenis) return;
      e.preventDefault();
      lenis.scrollTo(target, { duration: 1.25 });
      if (history.replaceState) history.replaceState(null, "", `#${id}`);
    };

    (async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
      });

      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      window.__lenis = lenis;
      document.addEventListener("click", onClick);
    })();

    return () => {
      cancelled = true;
      document.removeEventListener("click", onClick);
      if (tick) gsap.ticker.remove(tick);
      if (lenis) {
        if (window.__lenis === lenis) delete window.__lenis;
        lenis.destroy();
      }
    };
  }, [gsap, ScrollTrigger]);

  return null;
}
