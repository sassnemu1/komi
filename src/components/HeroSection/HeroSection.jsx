"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";
import HeroBackdrop from "./HeroBackdrop";
import Image from "next/image";
import { PHOTOS } from "@/data/photos";

import useGSAP from "@/hooks/useGSAP.js";
import KomiMap from "@/components/KomiMap/KomiMap";
import DistrictLegend from "@/components/KomiMap/DistrictLegend";
import DistrictPanel from "@/components/DistrictPanel/DistrictPanel";

const CHAPTERS = [
  { href: "#mythology", label: "Предания" },
  { href: "#landmarks", label: "Места силы" },
  { href: "#stay", label: "Гостеприимство" },
  { href: "#experiences", label: "Впечатления" },
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
  const titleWrapRef   = useRef(null);
  const mapRef         = useRef(null);

  const { gsap, ScrollTrigger } = useGSAP();

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
    if (window.__lenis) {
      window.__lenis.scrollTo(top, { duration: 1.2 });
    } else {
      window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
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
      layers.forEach((layer) => {
        layer.x.tween.kill();
        layer.y.tween.kill();
      });
    };
  }, [gsap]);

  // Вступление идёт в CSS на внутренних обёртках с первого кадра.
  // GSAP сразу управляет внешними обёртками по скроллу: загрузка JS
  // не прячет уже показанный текст и не перезапускает вступление.
  useLayoutEffect(() => {
    const hero = heroRef.current;
    const sticky = stickyRef.current;
    const mapWrap = mapWrapRef.current;
    if (!hero || !sticky || !mapWrap) return;

    const reduced = prefersReducedMotion();
    const mapAside = [legendRef.current, mapHintRef.current].filter(Boolean);
    const trees = [...sticky.querySelectorAll("[data-layer=trees]")];
    const night = sticky.querySelector("[data-layer=night]");
    const syncMapInteraction = () => {
      sticky.classList.toggle(styles.mapActive, Number(gsap.getProperty(mapWrap, "opacity")) > 0.8);
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: reduced ? true : 0.65,
          invalidateOnRefresh: true,
          // Refresh восстанавливает progress без вызова timeline.onUpdate.
          onRefresh: syncMapInteraction,
          onLeave: () => setSelected(null),
        },
        // Кликабельность следует за видимой картой, включая scrub и refresh.
        onUpdate: syncMapInteraction,
      });

      tl
        .fromTo(titleWrapRef.current, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.34 }, 0)
        .fromTo(scrollCueRef.current, { opacity: 1 }, { opacity: 0, duration: 0.1 }, 0)
        .fromTo(taglineRef.current, { opacity: 1, y: 0 }, { opacity: 0, y: reduced ? 0 : -10, duration: 0.18 }, 0)
        .fromTo(socialLeftRef.current, { x: 0, opacity: 1 }, { x: reduced ? 0 : -70, opacity: 0, duration: 0.28 }, 0)
        .fromTo(socialRightRef.current, { x: 0, opacity: 1 }, { x: reduced ? 0 : 70, opacity: 0, duration: 0.28 }, 0)
        .fromTo(lettersRef.current, { y: 0, opacity: 1 }, { y: reduced ? 0 : -80, opacity: 0, stagger: 0.015, duration: 0.3 }, 0)
        .fromTo(designRef.current, { y: 0, scale: 1, opacity: 1 }, { y: reduced ? 0 : -60, scale: reduced ? 1 : 0.94, opacity: 0, duration: 0.3 }, 0.04);

      if (trees.length && !reduced) tl.fromTo(trees, { yPercent: 0 }, { yPercent: 14, duration: 0.5 }, 0);
      if (night) tl.fromTo(night, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.06);

      tl.fromTo(mapWrap,
        { opacity: 0, scale: reduced ? 1 : 0.9 },
        { opacity: 1, scale: 1, duration: 0.3 },
        0.33
      );
      if (mapAside.length) {
        tl.fromTo(mapAside, { opacity: 0, x: reduced ? 0 : -16 }, { opacity: 1, x: 0, duration: 0.22 }, 0.45);
      }
      tl.to({}, { duration: 0.34 }, 0.96);
      sticky.classList.add(styles.jsReady);
      // Прямой якорь / восстановленная позиция сразу получают нужный кадр.
      tl.progress(tl.scrollTrigger.progress);
      syncMapInteraction();
    }, hero);

    return () => {
      ctx.revert();
      sticky.classList.remove(styles.jsReady, styles.mapActive);
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

        <nav className={styles.socialLeft} ref={socialLeftRef} aria-label="Начать знакомство с Коми">
          <span className={styles.chapterLabel}>Откройте для себя</span>
          {CHAPTERS.map(({ href, label }, i) => (
            <a href={href} key={href}><span className={styles.chapterNum}>0{i + 1}</span>{label}<span aria-hidden="true">↗</span></a>
          ))}
        </nav>

        <a href="#landmarks" className={styles.socialRight} ref={socialRightRef}>
          <div className={styles.featureImage}>
            <Image src={PHOTOS["manpupuner-summer"].src} alt={PHOTOS["manpupuner-summer"].alt} fill sizes="(max-width: 1000px) 1px, 24vw" quality={76} placeholder="blur" blurDataURL={PHOTOS["manpupuner-summer"].blur} />
            <span className={styles.featureIndex}>Из атласа Коми · 01</span>
            <span className={styles.featureArrow} aria-hidden="true">↗</span>
          </div>
          <div className={styles.featureCaption}><span>Каменные великаны</span><strong>Маньпупунёр</strong></div>
        </a>

        {/* TITLE */}
        <div className={styles.titleWrap} ref={titleWrapRef} data-depth="-6">
          <span className={styles.introEyebrow}><i aria-hidden="true" />Север, который ближе</span>
          <div className={styles.titlePerspective}>
            <h1 className={styles.titleTop} aria-label="Республика Коми">
              {main_title.map((char, i) => (
                <span
                  key={i}
                  className={styles.letter}
                  aria-hidden="true"
                  ref={(el) => { lettersRef.current[i] = el; }}
                >
                  <span className={styles.letterIntro} style={{ "--letter-index": i }}>{char}</span>
                </span>
              ))}
            </h1>
          </div>

          <div className={styles.titleBottom} ref={designRef}>
            <span className={styles.designText}>КОМИ<span className={styles.titleDot}>.</span></span>
          </div>
          <div className={styles.tagline} ref={taglineRef}>
            <p>Бескрайняя тайга, древние предания<br className={styles.desktopBreak} /> и места, которые остаются с вами.</p>
            <div className={styles.heroActions}>
              <a href="#map" onClick={scrollToMap} className={styles.primaryAction}>Исследовать Коми <span aria-hidden="true">↗</span></a>
              <a href="#landmarks" className={styles.secondaryAction}>Найти своё место <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>

        {/* SCROLL CUE */}
        <div className={styles.scrollCue} ref={scrollCueRef} aria-hidden="true">
          <span>Листайте — впереди целый край</span><span className={styles.scrollCueLine}>↓</span>
        </div>

      </div>
    </section>
  );
}
