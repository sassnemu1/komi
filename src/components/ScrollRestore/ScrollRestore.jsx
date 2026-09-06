"use client";

import { useEffect } from "react";
import useGSAP from "@/hooks/useGSAP";

// Надёжная перезагрузка страницы с пинами.
//
// Проблема: браузер восстанавливает scrollY до того, как ScrollTrigger добавит
// pin-spacer'ы (hero 400vh, гараж), а Lenis посчитает высоту — в итоге после
// перезагрузки страница «уезжает» в чужую секцию в полу-анимированном
// состоянии, и часть элементов выглядит пропавшей.
//
// Решение: scrollRestoration = manual; позицию пишем в sessionStorage сами и
// возвращаем её только когда GSAP загружен, шрифты готовы, а ScrollTrigger
// пересчитан. Заодно — страховка для reveal-анимаций: всё, что через 2,5 с
// после загрузки всё ещё скрыто, но уже в кадре или выше, показываем.
const KEY = "komi:scroll";

export default function ScrollRestore() {
  const { gsap, ScrollTrigger } = useGSAP();

  // Пишем позицию (через rAF, не чаще кадра)
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    let raf = 0;
    const save = () => {
      raf = 0;
      try { sessionStorage.setItem(KEY, String(Math.round(window.scrollY))); } catch {}
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(save); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", save);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", save);
    };
  }, []);

  // Восстанавливаем, когда всё готово
  useEffect(() => {
    if (!gsap || !ScrollTrigger) return;
    let cancelled = false;
    let stored = 0;
    try { stored = parseInt(sessionStorage.getItem(KEY) || "0", 10) || 0; } catch {}

    const settle = async () => {
      if (document.fonts?.ready) { try { await document.fonts.ready; } catch {} }
      if (document.readyState !== "complete") {
        await new Promise((r) => window.addEventListener("load", r, { once: true }));
      }
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (cancelled) return;
      ScrollTrigger.refresh();

      // Якорь в адресе ведёт Header; иначе — возвращаем сохранённую позицию
      if (!window.location.hash && stored > 0) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const top = Math.min(stored, Math.max(0, max));
        if (window.__lenis) window.__lenis.scrollTo(top, { immediate: true, force: true });
        else window.scrollTo(0, top);
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        if (cancelled) return;
        ScrollTrigger.refresh();
      }

      // Страховка reveal: скрытое, но уже в кадре — показать
      setTimeout(() => {
        if (cancelled) return;
        const vh = window.innerHeight;
        const stuck = [...document.querySelectorAll("[data-reveal]")].filter((el) => {
          if (parseFloat(getComputedStyle(el).opacity) > 0.05) return false;
          const b = el.getBoundingClientRect();
          return b.width > 0 && b.top < vh;
        });
        if (stuck.length) gsap.to(stuck, { opacity: 1, y: 0, duration: 0.5, clearProps: "transform", overwrite: "auto" });
      }, 2500);
    };
    settle();
    return () => { cancelled = true; };
  }, [gsap, ScrollTrigger]);

  return null;
}
