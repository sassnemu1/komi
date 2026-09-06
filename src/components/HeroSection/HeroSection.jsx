"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";
import HeroBackdrop from "./HeroBackdrop";
import {
  IconCompass, IconTree, IconPillars, IconIzba, IconBowl,
  IconSun, IconChum, IconMark, IconSled, IconTaxi,
} from "./HeroIcons";

import useGSAP from "@/hooks/useGSAP.js";
import KomiMap from "@/components/KomiMap/KomiMap";
import DistrictLegend from "@/components/KomiMap/DistrictLegend";
import DistrictPanel from "@/components/DistrictPanel/DistrictPanel";

// Боковые рельсы: левый — «где мы», правый — «что делать».
// Ссылка на #map ведёт к стадии карты через scrollToMap (см. ниже).
const RAIL_LEFT = [
  { href: "#map",       label: "Карта районов",         Icon: IconCompass, map: true },
  { href: "#mythology", label: "Мифология",             Icon: IconTree },
  { href: "#landmarks", label: "Достопримечательности", Icon: IconPillars },
  { href: "#stay",      label: "Отели",                 Icon: IconIzba },
  { href: "#stay",      label: "Рестораны",             Icon: IconBowl },
];
const RAIL_RIGHT = [
  { href: "#experiences",  label: "Впечатления",    Icon: IconSun },
  { href: "#camping",      label: "Кемпинг",        Icon: IconChum },
  { href: "#made-in-komi", label: "Сделано в Коми", Icon: IconMark },
  { href: "#transport",    label: "Транспорт",      Icon: IconSled },
  { href: "#taxi",         label: "Такси",          Icon: IconTaxi },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Доля высоты hero, на которой карта уже полностью раскрыта.
// Тот же коэффициент использует Header для ссылки «Карта районов».
export const MAP_STAGE_RATIO = 0.55;

export default function HeroSection() {
  const heroRef        = useRef(null);
  const stickyRef      = useRef(null);
  const mapWrapRef     = useRef(null);
  const legendRef      = useRef(null);
  const mapHintRef     = useRef(null);
  const bgImageRef     = useRef(null);
  const socialLeftRef  = useRef(null);
  const socialRightRef = useRef(null);
  const lettersRef     = useRef([]);
  const designRef      = useRef(null);
  const taglineRef     = useRef(null);
  const scrollCueRef   = useRef(null);
  const mapRef         = useRef(null);

  const { gsap, ScrollTrigger } = useGSAP();
  const scrollTLRef      = useRef(null);
  const enterTLRef       = useRef(null);
  const introPlayedRef   = useRef(false);

  // ── Состояние карты: выбранный и подсвеченный район ──────────
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered]   = useState(null);

  const handleSelect = useCallback((pathId) => {
    setSelected(pathId);
  }, []);

  const handleHover = useCallback((pathId) => {
    setHovered(pathId);
  }, []);

  // Закрытие панели: снимаем выбор и возвращаем фокус на район
  const handlePanelClose = useCallback((pathId) => {
    setSelected(null);
    mapRef.current?.focusDistrict(pathId);
  }, []);

  // ── Скролл к стадии карты (ссылка «Карта районов») ────────────
  const scrollToMap = useCallback((e) => {
    const hero = heroRef.current;
    if (!hero) return;
    e.preventDefault();
    const top = hero.offsetTop + hero.offsetHeight * MAP_STAGE_RATIO;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, []);

  // ── Ken Burns drift ───────────────────────────────────────────
  useEffect(() => {
    if (!gsap) return;
    if (prefersReducedMotion()) return;
    const el = bgImageRef.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { scale: 1, xPercent: 0, yPercent: 0 },
      {
        scale: 1.06,
        xPercent: -1,
        yPercent: 1,
        duration: 26,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }
    );

    return () => tween.kill();
  }, [gsap]);

  // ── Параллакс от курсора ─────────────────────────────────────
  // Слои сцены с data-depth (px) уезжают за курсором на разную глубину:
  // фото — чуть, ближний лес — сильнее, заголовок — навстречу (отрицательная
  // глубина). Только для устройств с hover и без reduced-motion.
  useEffect(() => {
    if (!gsap) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const sticky = stickyRef.current;
    if (!sticky) return;

    const layers = [...sticky.querySelectorAll("[data-depth]")].map((el) => ({
      depth: parseFloat(el.dataset.depth) || 0,
      x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power2.out" }),
      y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power2.out" }),
    }));
    if (!layers.length) return;

    const onMove = (e) => {
      const r = sticky.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      for (const l of layers) {
        l.x(nx * l.depth * 2);
        l.y(ny * l.depth);
      }
    };
    const onLeave = () => { for (const l of layers) { l.x(0); l.y(0); } };

    sticky.addEventListener("pointermove", onMove, { passive: true });
    sticky.addEventListener("pointerleave", onLeave);
    return () => {
      sticky.removeEventListener("pointermove", onMove);
      sticky.removeEventListener("pointerleave", onLeave);
    };
  }, [gsap]);

  // ── Scroll choreographer ──────────────────────────────────────
  //  hero = 400vh  →  sticky = 100svh  →  300vh рельсы
  //  0–33%   : текст уходит
  //  33–66%  : карта + легенда появляются
  //  66–100% : карта висит, пользователь изучает
  useEffect(() => {
    if (!gsap || !ScrollTrigger) return;

    const hero    = heroRef.current;
    const sticky  = stickyRef.current;
    const mapWrap = mapWrapRef.current;
    const legend  = legendRef.current;
    const mapHint = mapHintRef.current;
    if (!hero || !mapWrap) return;

    const reduced = prefersReducedMotion();
    const mapAside = [legend, mapHint].filter(Boolean);

    // Слои сцены (HeroBackdrop)
    const scene  = sticky?.querySelector("[data-layer=scene]");
    const trees  = sticky ? [...sticky.querySelectorAll("[data-layer=trees]")] : [];
    const bands  = sticky ? [...sticky.querySelectorAll("[data-layer=band]")] : [];
    const night  = sticky?.querySelector("[data-layer=night]");
    const sky    = sticky?.querySelector("[data-layer=sky]");

    // Начальные состояния
    gsap.set(lettersRef.current,     { y: 110, opacity: 0, rotateX: -55, filter: "blur(6px)" });
    gsap.set(designRef.current,      { y: 200, scale: 1.22, opacity: 0, filter: "blur(10px)" });
    gsap.set([socialLeftRef.current, socialRightRef.current], { opacity: 0, x: (i) => (i === 0 ? -36 : 36) });
    gsap.set(taglineRef.current,     { opacity: 0, y: 12 });
    gsap.set(scrollCueRef.current,   { opacity: 0 });
    if (scene) gsap.set(scene, { scale: 1.08, transformOrigin: "50% 60%" });
    if (trees.length) gsap.set(trees, { yPercent: 16 });
    if (bands.length) gsap.set(bands, { opacity: 0 });
    if (sky) gsap.set(sky, { opacity: 0 });
    // Карта и легенда — изначально скрыты
    gsap.set(mapWrap,                { opacity: 0, scale: 0.88, transformOrigin: "50% 50%" });
    if (mapAside.length) gsap.set(mapAside, { opacity: 0, x: -16 });

    const scrollY         = window.scrollY;
    const shouldPlayIntro = scrollY < 100 && !reduced;

    const createScrollTL = () => {
      if (scrollTLRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: reduced ? true : 1.4,
          invalidateOnRefresh: true,
          // На стадии карты включаем ей события мыши, боковые точки выключаем
          onUpdate: (self) => {
            if (!sticky) return;
            sticky.classList.toggle(styles.mapActive, self.progress > 0.45);
          },
          // Ушли ниже hero — панель района закрываем
          onLeave: () => setSelected(null),
        },
      });

      // ── АКТ 1: 0–33% — текст и UI уходят ──────────────────────
      tl
        .to(scrollCueRef.current,   { opacity: 0, duration: 0.1 },                                              0)
        .to(taglineRef.current,     { opacity: 0, y: -10, duration: 0.18 },                                     0)
        .to(socialLeftRef.current,  { x: -70, opacity: 0, duration: 0.28 },                                     0)
        .to(socialRightRef.current, { x: 70,  opacity: 0, duration: 0.28 },                                     0)
        .to(lettersRef.current,     { y: -80, opacity: 0, filter: "blur(4px)", stagger: 0.015, duration: 0.3 }, 0)
        .to(designRef.current,      { y: -60, scale: 0.94, opacity: 0, filter: "blur(6px)", duration: 0.3 },    0.04);

      // Сцена: лес оседает, поднимается ночь — карте нужен тёмный фон
      if (trees.length) tl.to(trees, { yPercent: 14, duration: 0.5, ease: "none" }, 0);
      if (night)        tl.to(night, { opacity: 1, duration: 0.4, ease: "none" }, 0.06);

      // ── АКТ 2: 33–66% — карта + легенда появляются ────────────
      tl.fromTo(mapWrap,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1,   duration: 0.3, ease: "none" },
          0.33
        );

      if (mapAside.length) {
        tl.fromTo(
          mapAside,
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: 0.22, ease: "none" },
          0.45
        );
      }

      // ── АКТ 3: 66–100% — пауза, карта висит ───────────────────
      tl.to({}, { duration: 0.34 }, 0.96);

      scrollTLRef.current = tl;
    };

    // ── Intro-анимация ────────────────────────────────────────────
    if (shouldPlayIntro && !introPlayedRef.current) {
      introPlayedRef.current = true;

      const enterTL = gsap.timeline({
        defaults:   { ease: "power3.out" },
        onComplete: () => { createScrollTL(); },
      });
      enterTLRef.current = enterTL;

      if (scene)        enterTL.to(scene, { scale: 1, duration: 2.2, ease: "expo.out" }, 0);
      if (bands.length) enterTL.to(bands, { opacity: 1, duration: 1.4, stagger: 0.16, ease: "power2.out" }, 0.1);
      if (trees.length) enterTL.to(trees, { yPercent: 0, duration: 1.6, stagger: 0.12, ease: "power3.out" }, 0.15);
      if (sky)          enterTL.to(sky, { opacity: 1, duration: 2.4, ease: "power2.out" }, 0.6);

      enterTL
        .fromTo(lettersRef.current,
          { y: 110, opacity: 0, rotateX: -55, filter: "blur(6px)" },
          { y: 0,   opacity: 1, rotateX: 0,   filter: "blur(0px)", stagger: 0.042, duration: 0.85, ease: "power4.out" },
          0.35
        )
        .fromTo(designRef.current,
          { y: 200, scale: 1.22, opacity: 0, filter: "blur(10px)" },
          { y: 0,   scale: 1,    opacity: 1, filter: "blur(0px)",  duration: 1.05, ease: "expo.out" },
          "-=0.45"
        )
        .fromTo([socialLeftRef.current, socialRightRef.current],
          { opacity: 0, x: (i) => (i === 0 ? -36 : 36) },
          { opacity: 1, x: 0, duration: 0.9, stagger: 0.08 },
          "-=0.65"
        )
        .fromTo(taglineRef.current,   { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=1.2")
        .fromTo(scrollCueRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 },                          "-=0.2");
    } else {
      // Без интро (reduced-motion или страница открыта не с верха) —
      // всё сразу в финальном состоянии.
      gsap.set(lettersRef.current,     { y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)" });
      gsap.set(designRef.current,      { y: 0, scale: 1,  opacity: 1, filter: "blur(0px)" });
      gsap.set([socialLeftRef.current, socialRightRef.current], { opacity: 1, x: 0 });
      gsap.set(taglineRef.current,     { opacity: 1, y: 0 });
      gsap.set(scrollCueRef.current,   { opacity: 1 });
      if (scene) gsap.set(scene, { scale: 1 });
      if (trees.length) gsap.set(trees, { yPercent: 0 });
      if (bands.length) gsap.set(bands, { opacity: 1 });
      if (sky) gsap.set(sky, { opacity: 1 });

      createScrollTL();
    }

    const refresh = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    };

    refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      // Убиваем ОБА таймлайна и сбрасываем флаг интро: иначе в dev (StrictMode
      // запускает эффект дважды) второй запуск создаёт scroll-таймлайн, который
      // спорит с ещё живым интро и оставляет заголовок в скрытом состоянии.
      if (enterTLRef.current) {
        enterTLRef.current.kill();
        enterTLRef.current = null;
        introPlayedRef.current = false;
      }
      if (scrollTLRef.current) {
        scrollTLRef.current.kill();
        scrollTLRef.current = null;
      }
    };
  }, [gsap, ScrollTrigger]);

  const main_title = "Республика".split("");

  return (
    <section ref={heroRef} className={styles.hero} id="hero">
      {/* Якорь стадии карты — по нему ходят навигация и боковые точки */}
      <div id="map" className={styles.mapAnchor} aria-hidden="true" />

      <div className={styles.sticky} ref={stickyRef}>

        {/* ── BACKGROUND: тайга под полупрозрачным флагом ── */}
        <div className={styles.bgImageKomi}>
          <div className={styles.bgZoom} ref={bgImageRef}>
            <HeroBackdrop photo="taiga-fog" />
          </div>
          <div className={styles.bgGrain} />
          <div className={styles.bgOrnament} aria-hidden="true" />
          <div className={styles.bgFrame} />
        </div>

        {/* ── КАРТА РАЙОНОВ: легенда + SVG ── */}
        <div className={styles.mapWrap} ref={mapWrapRef}>
          <DistrictLegend
            ref={legendRef}
            className={styles.legend}
            selected={selected}
            hovered={hovered}
            onHover={handleHover}
            onSelect={handleSelect}
          />

          <div className={styles.mapCol}>
            <div className={styles.mapFit}>
              <KomiMap
                ref={mapRef}
                className={styles.mapSvg}
                selected={selected}
                hovered={hovered}
                onSelect={handleSelect}
                onHover={handleHover}
              />
            </div>
            <p className={styles.mapHint} ref={mapHintRef}>Нажмите на район</p>
          </div>
        </div>

        {/* ── ПАНЕЛЬ РАЙОНА ── */}
        {selected && (
          <DistrictPanel pathId={selected} onClose={handlePanelClose} />
        )}

        {/* ── РЕЛЬСЫ РАЗДЕЛОВ ── */}
        <nav className={styles.socialLeft} ref={socialLeftRef} aria-label="Разделы: где мы">
          {RAIL_LEFT.map(({ href, label, Icon, map }) => (
            <div className={styles.dot} key={label}>
              <a href={href} onClick={map ? scrollToMap : undefined} aria-label={label}>
                <span className={styles.dotIcon}><Icon /></span>
              </a>
              <div className={styles.tooltip}>{label}</div>
            </div>
          ))}
        </nav>

        <nav className={styles.socialRight} ref={socialRightRef} aria-label="Разделы: что делать">
          {RAIL_RIGHT.map(({ href, label, Icon }) => (
            <div className={styles.dot} key={label}>
              <a href={href} aria-label={label}>
                <span className={styles.dotIcon}><Icon /></span>
              </a>
              <div className={styles.tooltip}>{label}</div>
            </div>
          ))}
        </nav>

        {/* TITLE */}
        <div className={styles.titleWrap} data-depth="-9">
          <div className={styles.titlePerspective}>
            <h1 className={styles.titleTop} aria-label="Республика Коми">
              {main_title.map((char, i) => (
                <span
                  key={i}
                  className={styles.letter}
                  aria-hidden="true"
                  ref={(el) => { lettersRef.current[i] = el; }}
                >
                  {char}
                </span>
              ))}
            </h1>
          </div>

          <div className={styles.titleBottom} ref={designRef}>
            <span className={styles.designText}>КОМИ.</span>
          </div>
        </div>

        {/* Подпись — на белой полосе, чернилами */}
        <p className={styles.tagline} ref={taglineRef}>
          Карта районов · Мифология · Достопримечательности · Отели и рестораны ·<br />
          Впечатления · Кемпинг · Сделано в Коми · Транспорт · Такси
        </p>

        {/* SCROLL CUE */}
        <div className={styles.scrollCue} ref={scrollCueRef} aria-hidden="true">
          <div className={styles.scrollCueLine} />
        </div>

      </div>
    </section>
  );
}
