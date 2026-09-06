"use client";

import { useEffect } from "react";
import useGSAP from "@/hooks/useGSAP";

// Надёжная перезагрузка страницы с пинами.
//
// Проблема: браузер восстанавливает scrollY до того, как ScrollTrigger добавит
// pin-spacer'ы (hero 400vh, Landmarks, гараж), а Lenis посчитает высоту — в
// итоге после перезагрузки страница «уезжает» в чужую секцию.
//
// Решение: scrollRestoration = manual; запоминаем не абсолютный scrollY, а
// якорь — секцию наверху экрана и смещение внутри неё (в sessionStorage).
// Возвращаем позицию, когда GSAP загружен, шрифты готовы, страница
// загружена, а высота документа перестала меняться; если пины появились ещё
// позже (динамические чанки), повторяем восстановление, пока пользователь сам
// не начал скроллить. Заодно — страховка для reveal-анимаций.
const KEY = "komi:scroll";
const ANCHORS = "main > section[id], main > div[id], footer[id]";

function currentAnchor() {
  const y = window.scrollY;
  let best = null;
  document.querySelectorAll(ANCHORS).forEach((el) => {
    const top = el.getBoundingClientRect().top + y;
    if (top <= y + 1) best = { id: el.id, offset: y - top };
  });
  return best || { id: "", offset: y };
}

function anchorTop(anchor) {
  if (!anchor) return 0;
  const el = anchor.id ? document.getElementById(anchor.id) : null;
  const base = el ? el.getBoundingClientRect().top + window.scrollY : 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.min(Math.max(0, base + anchor.offset), Math.max(0, max));
}

function scrollNow(top) {
  if (window.__lenis) window.__lenis.scrollTo(top, { immediate: true, force: true });
  else window.scrollTo(0, top);
}

export default function ScrollRestore() {
  const { gsap, ScrollTrigger } = useGSAP();

  // Пишем якорь (через rAF, не чаще кадра)
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    let raf = 0;
    const save = () => {
      raf = 0;
      try { sessionStorage.setItem(KEY, JSON.stringify(currentAnchor())); } catch {}
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

  // Высота документа меняется после первого пересчёта: динамические главы
  // монтируются в произвольном порядке, и пин, созданный раньше, чем секция
  // выше него добавила свой pin-spacer, остаётся со старыми координатами
  // (гараж «паркуется» в конце рельсы). Следим за высотой body и пересчитываем.
  useEffect(() => {
    if (!ScrollTrigger || typeof ResizeObserver === "undefined") return;
    let t = 0;
    let lastH = document.body.scrollHeight;
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight;
      if (h === lastH) return;
      lastH = h;
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 180);
    });
    ro.observe(document.body);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [ScrollTrigger]);

  // Восстанавливаем, когда всё готово
  useEffect(() => {
    if (!gsap || !ScrollTrigger) return;
    let cancelled = false;
    let userScrolled = false;
    let anchor = null;
    try { anchor = JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch {}
    const markUser = () => { userScrolled = true; };
    ["wheel", "touchstart", "keydown"].forEach((e) => window.addEventListener(e, markUser, { passive: true }));

    const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const stableHeight = async (ms = 240, max = 3000) => {
      const t0 = performance.now();
      let last = document.documentElement.scrollHeight;
      let lastChange = t0;
      while (performance.now() - t0 < max) {
        await new Promise((r) => setTimeout(r, 60));
        const h = document.documentElement.scrollHeight;
        if (h !== last) { last = h; lastChange = performance.now(); }
        else if (performance.now() - lastChange >= ms) break;
      }
    };

    const settle = async () => {
      if (document.fonts?.ready) { try { await document.fonts.ready; } catch {} }
      if (document.readyState !== "complete") {
        await new Promise((r) => window.addEventListener("load", r, { once: true }));
      }
      await stableHeight();
      if (cancelled) return;
      ScrollTrigger.refresh();
      await nextFrame();

      // Восстанавливаем только при перезагрузке и назад/вперёд — не при новом заходе
      const navType = performance.getEntriesByType?.("navigation")?.[0]?.type || "navigate";
      const restoring = navType === "reload" || navType === "back_forward";
      const hashTarget = window.location.hash && window.location.hash !== "#map" && window.location.hash !== "#hero"
        ? document.getElementById(window.location.hash.slice(1)) : null;
      if (hashTarget && !userScrolled) {
        // Якорь из адреса: браузер прыгнул до пинов — ставим точно, под шапку
        scrollNow(Math.max(0, hashTarget.getBoundingClientRect().top + window.scrollY - 72));
        await nextFrame();
        ScrollTrigger.refresh();
      }
      const wanted = restoring && !window.location.hash && anchor && (anchor.id || anchor.offset > 0);
      if (wanted && !userScrolled) {
        scrollNow(anchorTop(anchor));
        await nextFrame();
        ScrollTrigger.refresh();
        // Пины из динамических чанков могли появиться позже — держим якорь ещё 2,5 с
        const until = performance.now() + 2500;
        let lastH = document.documentElement.scrollHeight;
        while (performance.now() < until && !cancelled && !userScrolled) {
          await new Promise((r) => setTimeout(r, 120));
          const h = document.documentElement.scrollHeight;
          if (h !== lastH) {
            lastH = h;
            ScrollTrigger.refresh();
            await nextFrame();
            scrollNow(anchorTop(anchor));
          }
        }
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
    return () => {
      cancelled = true;
      ["wheel", "touchstart", "keydown"].forEach((e) => window.removeEventListener(e, markUser));
    };
  }, [gsap, ScrollTrigger]);

  return null;
}
