"use client";

import { useEffect, useRef, useState } from "react";
import useGSAP from "@/hooks/useGSAP";
import styles from "./TaxiSection.module.css";

// ─── Позиции появления текста ───────────────────────────────────────
const POS_BLOCK_1  = 0;
const POS_CTA      = 1900;
const PIN_DISTANCE = 2600; // общая длина скролла пина секции, px

const CTA_HREF   = "#contacts";
const REDUCED_MQ = "(prefers-reduced-motion: reduce)";

// ─── Контент блоков ───────────────────────────────────────────────
// Taiga Taxi — сервис такси холдинга «Велес И К» (см. README холдинга).
const BLOCKS = [
  {
    id: "01",
    pos: POS_BLOCK_1,
    eyebrow: "Taiga Taxi",
    headline: ["Такси по", "республике —"],
    accent: "город и межгород.",
    body: "Taiga Taxi — сервис такси холдинга «Велес И К»: поездки по городу и между городами Республики Коми.",
    stat: { value: "2 формата", label: "город · межгород" },
  },
];

const MOBILE_BODY =
  "Taiga Taxi — сервис такси холдинга «Велес И К»: поездки по городу и между городами Республики Коми.";

// Видео играет, пока секция в кадре, и стоит на паузе вне его (экономит
// батарею). Пауза, которую Chrome ставит при переносе <video> в pin-spacer
// ScrollTrigger (removeChild/appendChild на каждом refresh), снимается
// повторным play(). При prefers-reduced-motion видео не запускается вовсе.
function useVideoInView(sectionRef, videoRef) {
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reduced = window.matchMedia(REDUCED_MQ);
    let visible = false;

    const sync = () => {
      if (!video.isConnected) return;
      if (visible && !reduced.matches) video.play().catch(() => {});
      else video.pause();
    };

    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; sync(); },
      { threshold: 0.05 }
    );
    io.observe(section);

    // Пауза не по нашей воле (перенос в DOM) — вернуть воспроизведение.
    const onPause = () => { if (visible && !reduced.matches) setTimeout(sync, 0); };
    video.addEventListener("pause", onPause);
    reduced.addEventListener("change", sync);

    return () => {
      io.disconnect();
      video.removeEventListener("pause", onPause);
      reduced.removeEventListener("change", sync);
    };
  }, [sectionRef, videoRef]);
}

// ─── Статичная / мобильная версия ────────────────────────────────
function TaxiStatic({ videoSrc, wide = false }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  useVideoInView(sectionRef, videoRef);

  return (
    <section
      id="taxi"
      ref={sectionRef}
      className={`${styles.sectionMobile} ${wide ? styles.sectionStatic : ""}`}
    >
      <video
        ref={videoRef}
        className={styles.mobileVideo}
        src={videoSrc}
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className={styles.mobileOverlay} />
      <div className={styles.mobileContent}>
        <span className={styles.mobileEyebrow}>Taiga Taxi</span>
        <h2 className={styles.mobileTitle}>
          Такси по республике —<br />
          <span className={styles.mobileAccent}>город и межгород.</span>
        </h2>
        <p className={styles.mobileBody}>{MOBILE_BODY}</p>
        <a href={CTA_HREF} className={styles.mobileCta}>
          Заказать такси
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor"
              strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  );
}

// ─── Десктопная версия (видео-фон + текст по позициям скролла) ────
function TaxiDesktop({ videoSrc }) {
  const sectionRef = useRef(null);
  const videoRef    = useRef(null);

  const lineRef     = useRef(null);
  const ctaRef      = useRef(null);
  const eyebrowRefs = useRef([]);
  const hRefs       = useRef([]); // [i*2 + li]
  const accentRefs  = useRef([]);
  const bodyRefs    = useRef([]);
  const statRefs    = useRef([]);
  const dotRefs     = useRef([]);

  const { gsap, ScrollTrigger } = useGSAP();

  useVideoInView(sectionRef, videoRef);

  useEffect(() => {
    if (!gsap || !ScrollTrigger) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const pinST = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${PIN_DISTANCE}`,
        pin: true,
        pinSpacing: true,
      });

      // Начальные состояния текста
      gsap.set(hRefs.current.filter(Boolean),       { yPercent: 108, rotateX: -10, opacity: 0 });
      gsap.set(accentRefs.current.filter(Boolean),  { yPercent: 108, opacity: 0 });
      gsap.set(eyebrowRefs.current.filter(Boolean), { opacity: 0, y: 10 });
      gsap.set(bodyRefs.current.filter(Boolean),    { opacity: 0, y: 14 });
      gsap.set(statRefs.current.filter(Boolean),    { opacity: 0, y: 14 });
      gsap.set(dotRefs.current.filter(Boolean),     { scale: 0, opacity: 0 });
      gsap.set(lineRef.current,                      { scaleY: 0, transformOrigin: "top center" });
      gsap.set(ctaRef.current,                       { opacity: 0, y: 22 });

      // Линия индикатора — растёт со скроллом
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${PIN_DISTANCE}`,
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(lineRef.current, { scaleY: self.progress });
        },
      });

      // Текстовый блок появляется на своей позиции (block.pos) и остаётся
      // виден до конца секции. Числом от начала пина, а не строкой
      // "top+=Npx top" — для запиненного элемента такая строка считается
      // от позиции ПОСЛЕ окончания пина.
      BLOCKS.forEach((block, i) => {
        const hLines = [
          hRefs.current[i * 2],
          hRefs.current[i * 2 + 1],
        ].filter(Boolean);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: () => pinST.start + block.pos,
            toggleActions: "play none none reverse",
          },
        });

        tl.to(dotRefs.current[i],    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }, 0)
          .to(eyebrowRefs.current[i],{ opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.06)
          .to(hLines,                { yPercent: 0, rotateX: 0, opacity: 1, stagger: 0.09, duration: 0.75, ease: "power4.out" }, 0.12)
          .to(accentRefs.current[i], { yPercent: 0, opacity: 1, duration: 0.65, ease: "power4.out" }, 0.28)
          .to(bodyRefs.current[i],   { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0.4)
          .to(statRefs.current[i],   { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.5);
      });

      // CTA — появляется на POS_CTA и остаётся до конца пина
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: () => pinST.start + POS_CTA,
          toggleActions: "play none none reverse",
        },
      }).to(ctaRef.current, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" });
    }, sectionRef);

    return () => ctx.revert();
  }, [gsap, ScrollTrigger]);

  return (
    <section id="taxi" ref={sectionRef} className={styles.section}>

      {/* Видео-фон */}
      <video
        ref={videoRef}
        className={styles.video}
        src={videoSrc}
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* Overlay */}
      <div className={styles.overlay} />

      {/* Угловая метка */}
      <span className={styles.cornerLabel}>
        Республика Коми&nbsp;&nbsp;·&nbsp;&nbsp;Taiga Taxi
      </span>

      {/* Вертикальный индикатор */}
      <aside className={styles.indicator}>
        <div className={styles.indicatorTrack} ref={lineRef} />
        {BLOCKS.map((_, i) => (
          <div
            key={i}
            className={styles.indicatorDot}
            ref={(el) => { dotRefs.current[i] = el; }}
            style={{ top: `${BLOCKS.length > 1 ? (i / (BLOCKS.length - 1)) * 80 + 10 : 50}%` }}
          />
        ))}
      </aside>

      {/* Текстовый слой */}
      <div className={styles.textLayer}>
        {BLOCKS.map((block, i) => (
          <div key={block.id} className={styles.block}>
            <div className={styles.meta}>
              <span className={styles.blockNum}>{block.id}</span>
              <span className={styles.eyebrow} ref={(el) => { eyebrowRefs.current[i] = el; }}>
                {block.eyebrow}
              </span>
            </div>

            <div className={styles.headlineWrap}>
              {block.headline.map((line, li) => (
                <div key={li} className={styles.lineClip}>
                  <h2
                    className={styles.hLine}
                    ref={(el) => { hRefs.current[i * 2 + li] = el; }}
                  >
                    {line}
                  </h2>
                </div>
              ))}
              <div className={styles.lineClip}>
                <h2
                  className={`${styles.hLine} ${styles.hAccent}`}
                  ref={(el) => { accentRefs.current[i] = el; }}
                >
                  {block.accent}
                </h2>
              </div>
            </div>

            <p className={styles.body} ref={(el) => { bodyRefs.current[i] = el; }}>
              {block.body}
            </p>

            <div className={styles.stat} ref={(el) => { statRefs.current[i] = el; }}>
              <span className={styles.statValue}>{block.stat.value}</span>
              <span className={styles.statLabel}>{block.stat.label}</span>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className={styles.ctaWrap} ref={ctaRef}>
          <a href={CTA_HREF} className={styles.ctaBtn}>
            Заказать такси
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M3 7.5h9M8.5 3.5l4 4-4 4" stroke="currentColor"
                strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <p className={styles.ctaSub}>Город и межгород · заказ через контакты komi.world</p>
        </div>
      </div>

    </section>
  );
}

// ─── Root — mobile / static (reduced motion) / desktop ───────────
export default function TaxiSection({ videoSrc = "/video-komi-taxi.mp4" }) {
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const mqMobile  = window.matchMedia("(max-width: 767px)");
    const mqReduced = window.matchMedia(REDUCED_MQ);
    const compute = () =>
      setMode(mqMobile.matches ? "mobile" : mqReduced.matches ? "static" : "desktop");
    compute();
    mqMobile.addEventListener("change", compute);
    mqReduced.addEventListener("change", compute);
    return () => {
      mqMobile.removeEventListener("change", compute);
      mqReduced.removeEventListener("change", compute);
    };
  }, []);

  if (mode === null) return null;               // избегаем hydration mismatch
  if (mode === "mobile") return <TaxiStatic videoSrc={videoSrc} />;
  if (mode === "static") return <TaxiStatic videoSrc={videoSrc} wide />;
  return <TaxiDesktop videoSrc={videoSrc} />;
}
