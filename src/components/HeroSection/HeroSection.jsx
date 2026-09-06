"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PHOTOS } from "@/data/photos";
import styles from "./HeroSection.module.css";

import useGSAP from "@/hooks/useGSAP.js";
import KomiMap from "@/components/KomiMap/KomiMap";
import DistrictLegend from "@/components/KomiMap/DistrictLegend";
import DistrictPanel from "@/components/DistrictPanel/DistrictPanel";

import { FaBookOpen } from "react-icons/fa";
import { GiColombianStatue } from "react-icons/gi";
import { PiMountainsFill } from "react-icons/pi";
import { MdHotel } from "react-icons/md";
import { IoIosRestaurant } from "react-icons/io";
import { GiNightSky } from "react-icons/gi";
import { PiTentFill } from "react-icons/pi";
import { GiHammerSickle } from "react-icons/gi";
import { FaTaxi } from "react-icons/fa";
import { MdOutlineSnowmobile } from "react-icons/md";

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
  const bgTextRef      = useRef(null);
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
        scale: 1.12,
        xPercent: -2,
        yPercent: 2,
        duration: 24,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }
    );

    return () => tween.kill();
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

    // Начальные состояния
    gsap.set(lettersRef.current,     { y: 110, opacity: 0, rotateX: -55, filter: "blur(6px)" });
    gsap.set(designRef.current,      { y: 200, scale: 1.22, opacity: 0, filter: "blur(10px)" });
    gsap.set([socialLeftRef.current, socialRightRef.current], { opacity: 0, x: (i) => (i === 0 ? -36 : 36) });
    gsap.set(bgTextRef.current,      { opacity: 0 });
    gsap.set(taglineRef.current,     { opacity: 0, y: 12 });
    gsap.set(scrollCueRef.current,   { opacity: 0 });
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
        .to(bgTextRef.current,      { opacity: 0, duration: 0.22 },                                             0)
        .to(socialLeftRef.current,  { x: -70, opacity: 0, duration: 0.28 },                                     0)
        .to(socialRightRef.current, { x: 70,  opacity: 0, duration: 0.28 },                                     0)
        .to(lettersRef.current,     { y: -80, opacity: 0, filter: "blur(4px)", stagger: 0.015, duration: 0.3 }, 0)
        .to(designRef.current,      { y: -60, scale: 0.94, opacity: 0, filter: "blur(6px)", duration: 0.3 },    0.04)

      // ── АКТ 2: 33–66% — карта + легенда появляются ────────────
        .fromTo(mapWrap,
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
        .fromTo(bgTextRef.current,    { opacity: 0 }, { opacity: 1, duration: 2.5 },                          "-=1.8")
        .fromTo(taglineRef.current,   { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=1.2")
        .fromTo(scrollCueRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 },                          "-=0.2");
    } else {
      // Без интро (reduced-motion или страница открыта не с верха) —
      // всё сразу в финальном состоянии.
      gsap.set(lettersRef.current,     { y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)" });
      gsap.set(designRef.current,      { y: 0, scale: 1,  opacity: 1, filter: "blur(0px)" });
      gsap.set([socialLeftRef.current, socialRightRef.current], { opacity: 1, x: 0 });
      gsap.set(bgTextRef.current,      { opacity: 1 });
      gsap.set(taglineRef.current,     { opacity: 1, y: 0 });
      gsap.set(scrollCueRef.current,   { opacity: 1 });

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

        {/* ── BACKGROUND ── */}
        <div className={styles.bgImageKomi}>
          <div className={styles.bgZoom} ref={bgImageRef}>
            <Image
              src={PHOTOS["hero-manpupuner"].src}
              alt={PHOTOS["hero-manpupuner"].alt}
              fill
              priority
              sizes="100vw"
              quality={78}
            />
          </div>
          <div className={styles.bgOverlay} />
          <div className={styles.bgGlow}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.bgGrain} />
          <div className={styles.bgOrnament} aria-hidden="true" />
          <div className={styles.bgFrame} />
        </div>

        {/* ── GHOST TEXT ── */}
        <div className={styles.bgText} ref={bgTextRef}>
          РОССИЯ
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

        {/* SOCIAL LEFT */}
        <div className={styles.socialLeft} ref={socialLeftRef}>
          <div className={styles.dot}>
            <a href="#map" onClick={scrollToMap} aria-label="Карта районов"><FaBookOpen /></a>
            <div className={styles.tooltip}>Карта районов</div>
          </div>
          <div className={styles.dot}>
            <a href="#mythology" aria-label="Мифология"><GiColombianStatue /></a>
            <div className={styles.tooltip}>Мифология</div>
          </div>
          <div className={styles.dot}>
            <a href="#landmarks" aria-label="Достопримечательности"><PiMountainsFill /></a>
            <div className={styles.tooltip}>Достопримечательности</div>
          </div>
          <div className={styles.dot}>
            <a href="#stay" aria-label="Отели"><MdHotel /></a>
            <div className={styles.tooltip}>Отели</div>
          </div>
          <div className={styles.dot}>
            <a href="#stay" aria-label="Рестораны"><IoIosRestaurant /></a>
            <div className={styles.tooltip}>Рестораны</div>
          </div>
        </div>

        {/* SOCIAL RIGHT */}
        <div className={styles.socialRight} ref={socialRightRef}>
          <div className={styles.dot}>
            <a href="#experiences" aria-label="Впечатления"><GiNightSky /></a>
            <div className={styles.tooltip}>Впечатления</div>
          </div>
          <div className={styles.dot}>
            <a href="#camping" aria-label="Кемпинг"><PiTentFill /></a>
            <div className={styles.tooltip}>Кемпинг</div>
          </div>
          <div className={styles.dot}>
            <a href="#made-in-komi" aria-label="Сделано в Коми"><GiHammerSickle /></a>
            <div className={styles.tooltip}>Сделано в Коми</div>
          </div>
          <div className={styles.dot}>
            <a href="#transport" aria-label="Транспорт"><MdOutlineSnowmobile /></a>
            <div className={styles.tooltip}>Транспорт</div>
          </div>
          <div className={styles.dot}>
            <a href="#taxi" aria-label="Такси"><FaTaxi /></a>
            <div className={styles.tooltip}>Такси</div>
          </div>
        </div>

        {/* TITLE */}
        <div className={styles.titleWrap}>
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

          <p className={styles.tagline} ref={taglineRef}>
            Карта районов · Мифология · Достопримечательности · Отели и рестораны ·<br />
            Впечатления · Кемпинг · Сделано в Коми · Транспорт · Такси
          </p>
        </div>

        {/* SCROLL CUE */}
        <div className={styles.scrollCue} ref={scrollCueRef} aria-hidden="true">
          <div className={styles.scrollCueLine} />
        </div>

      </div>
    </section>
  );
}
