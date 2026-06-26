"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HeroSection.module.css";

import useGSAP from "@/hooks/useGSAP.js";
import KomiMap from "@/components/KomiMap/KomiMap";

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


export default function HeroSection() {
  const heroRef        = useRef(null);
  const stickyRef      = useRef(null);
  const mapWrapRef     = useRef(null);
  const mapTitleRef    = useRef(null);
  const bgTextRef      = useRef(null);
  const bgImageRef     = useRef(null);
  const navRef         = useRef(null);
  const socialLeftRef  = useRef(null);
  const socialRightRef = useRef(null);
  const lettersRef     = useRef([]);
  const designRef      = useRef(null);
  const taglineRef     = useRef(null);
  const scrollCueRef   = useRef(null);

  const { gsap, ScrollTrigger } = useGSAP();
  const scrollTriggerRef = useRef(null);
  const introPlayedRef   = useRef(false);

  // ── Ken Burns drift ───────────────────────────────────────────
  useEffect(() => {
    if (!gsap) return;
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
  //  hero = 300vh  →  sticky = 100vh  →  200vh рельсы
  //  0–33%   : текст уходит
  //  33–66%  : карта + подпись «История» появляются
  //  66–100% : карта висит, пользователь изучает
  useEffect(() => {
    if (!gsap || !ScrollTrigger) return;

    const hero     = heroRef.current;
    const mapWrap  = mapWrapRef.current;
    const mapTitle = mapTitleRef.current;
    if (!hero || !mapWrap) return;

    // Начальные состояния
    gsap.set(navRef.current,         { y: -48, opacity: 0 });
    gsap.set(lettersRef.current,     { y: 110, opacity: 0, rotateX: -55, filter: "blur(6px)" });
    gsap.set(designRef.current,      { y: 200, scale: 1.22, opacity: 0, filter: "blur(10px)" });
    gsap.set([socialLeftRef.current, socialRightRef.current], { opacity: 0, x: (i) => (i === 0 ? -36 : 36) });
    gsap.set(bgTextRef.current,      { opacity: 0 });
    gsap.set(taglineRef.current,     { opacity: 0, y: 12 });
    gsap.set(scrollCueRef.current,   { opacity: 0 });
    // Карта и подпись — изначально скрыты
    gsap.set(mapWrap,                { opacity: 0, scale: 0.88, transformOrigin: "50% 50%" });
    if (mapTitle) gsap.set(mapTitle, { opacity: 0, y: 18 });

    const scrollY         = window.scrollY;
    const shouldPlayIntro = scrollY < 100;

    const createScrollTL = () => {
      if (scrollTriggerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1.4,
          invalidateOnRefresh: true,
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
        .to(navRef.current,         { y: -48, opacity: 0, duration: 0.25 },                                     0.02)

      // ── АКТ 2: 33–66% — карта + подпись появляются ───────────
        .fromTo(mapWrap,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1,   duration: 0.3, ease: "none" },
          0.33
        )
        // mapTitle — в потоке внутри mapWrap, GSAP анимирует отдельно
        .fromTo(
          mapTitle,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0,  duration: 0.22, ease: "none" },
          0.45
        )

      // ── АКТ 3: 66–100% — пауза, карта висит ───────────────────
        .to({}, { duration: 0.34 }, 0.96);

      scrollTriggerRef.current = tl.scrollTrigger;
    };

    // ── Intro-анимация ────────────────────────────────────────────
    if (shouldPlayIntro && !introPlayedRef.current) {
      introPlayedRef.current = true;

      const enterTL = gsap.timeline({
        defaults:   { ease: "power3.out" },
        onComplete: () => { createScrollTL(); },
      });

      enterTL
        .fromTo(navRef.current,
          { y: -48, opacity: 0 },
          { y: 0,   opacity: 1, duration: 0.9 }
        )
        .fromTo(lettersRef.current,
          { y: 110, opacity: 0, rotateX: -55, filter: "blur(6px)" },
          { y: 0,   opacity: 1, rotateX: 0,   filter: "blur(0px)", stagger: 0.042, duration: 0.85, ease: "power4.out" },
          "-=0.45"
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
      gsap.set(navRef.current,         { y: 0, opacity: 1 });
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
      if (scrollTriggerRef.current) scrollTriggerRef.current.kill();
    };
  }, [gsap, ScrollTrigger]);

  const main_title = "Республика".split("");

  return (
    <section ref={heroRef} className={styles.hero}>
      <div className={styles.sticky} ref={stickyRef}>

        {/* ── BACKGROUND ── */}
        <div className={styles.bgImageKomi}>
          <div className={styles.bgZoom} ref={bgImageRef}>
            <Image src="/komi.png" alt="Флаг Республики Коми" fill priority sizes="100vw" />
          </div>
          <div className={styles.bgOverlay} />
          <div className={styles.bgGlow}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.bgGrain} />
          <div className={styles.bgFrame} />
        </div>

        {/* ── GHOST TEXT ── */}
        <div className={styles.bgText} ref={bgTextRef}>
          РОССИЯ
        </div>

        {/* ── SVG MAP ── */}
        <div className={styles.mapWrap} ref={mapWrapRef}>
          <KomiMap className={styles.mapSvg} />
          {/* Подпись появляется вместе с картой */}
          <div className={styles.mapTitle} ref={mapTitleRef}>
            <span className={styles.mapTitleTag}>Республика</span>
            <span className={styles.mapTitleName}>КОМИ</span>
            <span className={styles.mapTitleSub}>ИСТОРИЯ</span>
          </div>
        </div>

        {/* NAV */}
        <nav className={styles.nav} ref={navRef}>
          <ul className={styles.navLinks}>
            <li><a href="#info-01">История</a></li>
            <li><a href="#info-03">Природа</a></li>
            <li><a href="#info-08">Коми</a></li>
            <li><Link href="/work">Portfolio</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </nav>

        {/* SOCIAL LEFT */}
        <div className={styles.socialLeft} ref={socialLeftRef}>
          <div className={styles.dot}>
            <a href="#info-01"><FaBookOpen /></a>
            <div className={styles.tooltip}>История</div>
          </div>
          <div className={styles.dot}>
            <a href="#info-02"><GiColombianStatue /></a>
            <div className={styles.tooltip}>Мифология</div>
          </div>
          <div className={styles.dot}>
            <a href="#info-03"><PiMountainsFill /></a>
            <div className={styles.tooltip}>Достопримечательности</div>
          </div>
          <div className={styles.dot}>
            <a href="#info-04"><MdHotel /></a>
            <div className={styles.tooltip}>Отели</div>
          </div>
          <div className={styles.dot}>
            <a href="#info-05"><IoIosRestaurant /></a>
            <div className={styles.tooltip}>Рестораны</div>
          </div>
        </div>

        {/* SOCIAL RIGHT */}
        <div className={styles.socialRight} ref={socialRightRef}>
          <div className={styles.dot}>
            <a href="#info-06"><GiNightSky /></a>
            <div className={styles.tooltip}>Впечатления</div>
          </div>
          <div className={styles.dot}>
            <a href="#info-07"><PiTentFill /></a>
            <div className={styles.tooltip}>Кемпинг</div>
          </div>
          <div className={styles.dot}>
            <a href="#info-08"><GiHammerSickle /></a>
            <div className={styles.tooltip}>Сделано в Коми</div>
          </div>
          <div className={styles.dot}>
            <a href="#info-09"><MdOutlineSnowmobile /></a>
            <div className={styles.tooltip}>Аренда транспорта</div>
          </div>
          <div className={styles.dot}>
            <a href="#info-10"><FaTaxi /></a>
            <div className={styles.tooltip}>Такси</div>
          </div>
        </div>

        {/* TITLE */}
        <div className={styles.titleWrap}>
          <div className={styles.titlePerspective}>
            <div className={styles.titleTop}>
              {main_title.map((char, i) => (
                <span
                  key={i}
                  className={styles.letter}
                  ref={(el) => { lettersRef.current[i] = el; }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.titleBottom} ref={designRef}>
            <span className={styles.designText}>КОМИ.</span>
          </div>

          <p className={styles.tagline} ref={taglineRef}>
            История · Мифология · Достопримечательности · Отели · Рестораны ·<br />
            Впечатления · Кемпинг · Сделано в Коми · Аренда транспорта · Такси
          </p>
        </div>

        {/* SCROLL CUE */}
        {/* <div className={styles.scrollCue} ref={scrollCueRef}>
          <div className={styles.scrollCueLine} />
        </div> */}

      </div>
    </section>
  );
}