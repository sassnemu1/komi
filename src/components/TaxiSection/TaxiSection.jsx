"use client";

import { useEffect, useRef, useState } from "react";
import useGSAP from "@/hooks/useGSAP";
import styles from "./TaxiSection.module.css";

// ─── Позиции появления текста ───────────────────────────────────────
const POS_BLOCK_1  = 0;
const POS_CTA      = 1900;
const PIN_DISTANCE = 2600; // общая длина скролла пина секции, px

// ─── Контент блоков ───────────────────────────────────────────────
const BLOCKS = [
  {
    id: "01",
    pos: POS_BLOCK_1,
    eyebrow: "Такси",
    headline: ["Такси по", "республике"],
    accent: "в любую точку.",
    body: "Городские поездки и трансферы между Сыктывкаром, Ухтой и Воркутой — быстро и без забот.",
    stat: { value: "24/7", label: "доступность" },
  },
];

// ─── Мобильная версия (статичное видео-превью) ────────────────────
function TaxiMobile({ videoSrc }) {
  return (
    <section className={styles.sectionMobile}>
      <video
        className={styles.mobileVideo}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className={styles.mobileOverlay} />
      <div className={styles.mobileContent}>
        <span className={styles.mobileEyebrow}>Такси</span>
        <h2 className={styles.mobileTitle}>
          Такси по республике<br />
          <span className={styles.mobileAccent}>в любую точку.</span>
        </h2>
        <p className={styles.mobileBody}>
          Городские поездки и трансферы между Сыктывкаром, Ухтой и Воркутой —
          быстро и без забот.
        </p>
        <a href="#info-10" className={styles.mobileCta}>
          Заказать такси
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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

  // Видео крутится фоном независимо от скролла
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

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

      // Текстовый блок появляется на своей позиции (block.pos) и
      // остаётся виден до конца секции (как и CTA ниже) — никуда не
      // уступает место, скрывается только если проскроллить обратно
      // выше точки появления.
      // Числом от начала пина, а не строкой "top+=Npx top" — для
      // запиненного элемента такая строка считается от позиции ПОСЛЕ
      // окончания пина, а не от его начала (известная особенность GSAP).
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
    <section ref={sectionRef} className={styles.section}>

      {/* Видео-фон */}
      <video
        ref={videoRef}
        className={styles.video}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay */}
      <div className={styles.overlay} />

      {/* Угловая метка */}
      <span className={styles.cornerLabel}>
        Республика Коми&nbsp;&nbsp;·&nbsp;&nbsp;Такси
      </span>

      {/* Вертикальный индикатор */}
      <aside className={styles.indicator}>
        <div className={styles.indicatorTrack} ref={lineRef} />
        {BLOCKS.map((_, i) => (
          <div
            key={i}
            className={styles.indicatorDot}
            ref={(el) => { dotRefs.current[i] = el; }}
            style={{ top: `${(i / (BLOCKS.length - 1)) * 80 + 10}%` }}
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
          <a href="#info-10" className={styles.ctaBtn}>
            Заказать такси
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M3 7.5h9M8.5 3.5l4 4-4 4" stroke="currentColor"
                strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <p className={styles.ctaSub}>Городские поездки и межгород · 24 / 7</p>
        </div>
      </div>

    </section>
  );
}

// ─── Root — выбирает mobile / desktop ────────────────────────────
export default function TaxiSection({ videoSrc = "/taxi-komi.mp4" }) {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const h = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  if (isMobile === null) return null;          // избегаем hydration mismatch
  return isMobile ? <TaxiMobile videoSrc={videoSrc} /> : <TaxiDesktop videoSrc={videoSrc} />;
}
