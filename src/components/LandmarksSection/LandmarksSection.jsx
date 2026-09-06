"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import useGSAP from "@/hooks/useGSAP";
import styles from "./LandmarksSection.module.css";
import { STOPS } from "@/data/landmarks";
import { photoBySrc } from "@/data/photos";

// ─── Хореография ────────────────────────────────────────────────
// Длина пина считается от числа точек: на каждую — POS_STEP px скролла
// плюс небольшой «хвост», чтобы последняя точка успела дочитаться.
const POS_STEP     = 720;
const PIN_TAIL     = 20;
const PIN_DISTANCE = POS_STEP * Math.max(1, STOPS.length) + PIN_TAIL;

const mapHrefFor = (stop) =>
  `https://yandex.ru/maps/?text=${encodeURIComponent(`${stop.name} Республика Коми`)}`;

const total = () => String(STOPS.length).padStart(2, "0");

// Позиция точки на вертикальном маршруте, % — для любого N ≥ 1
const routeTop = (i) =>
  STOPS.length > 1 ? (i / (STOPS.length - 1)) * 100 : 50;

// ─── Статичная версия (мобайл и prefers-reduced-motion) ─────────
function LandmarksStatic({ wide = false }) {
  return (
    <section
      id="landmarks"
      className={`${styles.sectionMobile} ${wide ? styles.sectionStatic : ""}`}
    >
      <header className={styles.mobileHeader}>
        <span className={styles.eyebrow}>Республика Коми &nbsp;·&nbsp; Достопримечательности</span>
        <h2 className={styles.mobileTitle}>Куда поехать</h2>
        <p className={styles.mobileLead}>
          Места, без которых нельзя представить Коми, — от Северного Урала
          до Полярного круга.
        </p>
      </header>

      <div className={styles.mobileList}>
        {STOPS.map((stop) => (
          <div
            className={`${styles.mobileCard} ${stop.image ? "" : styles.mobileCardNoImage}`}
            key={stop.id}
          >
            {stop.image && (
              <Image
                src={stop.image}
                alt={stop.name}
                fill
                sizes="(max-width: 767px) 100vw, 60vw"
                placeholder={photoBySrc(stop.image)?.blur ? "blur" : "empty"}
                blurDataURL={photoBySrc(stop.image)?.blur}
                className={styles.bgImg}
              />
            )}
            {!stop.image && (
              <>
                <div className={styles.ornament} aria-hidden="true" />
                <span className={styles.posterLetter} aria-hidden="true">
                  {stop.name.replace(/^[«"']/, "").charAt(0)}
                </span>
              </>
            )}
            <div className={styles.mobileCardOverlay} />
            <span className={styles.mobileCardNum}>{stop.id}</span>
            <div className={styles.mobileCardBody}>
              {stop.badge && <span className={styles.badge}>{stop.badge}</span>}
              <h3 className={styles.mobileCardTitle}>{stop.name}</h3>
              {stop.location && <span className={styles.location}>{stop.location}</span>}
              {stop.desc && <p className={styles.mobileCardDesc}>{stop.desc}</p>}
              <div className={styles.row}>
                {stop.stat && (
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{stop.stat.value}</span>
                    <span className={styles.statLabel}>{stop.stat.label}</span>
                  </div>
                )}
                <a
                  className={styles.ctaBtn}
                  href={mapHrefFor(stop)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Маршрут
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor"
                      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                {stop.href && (
                  <a
                    className={styles.loreLink}
                    href={stop.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Предание на карте ↗
                  </a>
                )}
              </div>
              {stop.quote && <p className={styles.quote}>{stop.quote}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Десктопная версия (pinned, scrub) ──────────────────────────
function LandmarksDesktop() {
  const sectionRef = useRef(null);
  const bgRefs      = useRef([]);
  const lineRef     = useRef(null);
  const dotRefs     = useRef([]);
  const nameRefs    = useRef([]);
  const numRefs     = useRef([]);
  const badgeRefs   = useRef([]);
  const locRefs     = useRef([]);
  const descRefs    = useRef([]);
  const statRefs    = useRef([]);
  const ctaRefs     = useRef([]);
  const loreRefs    = useRef([]);
  const quoteRefs   = useRef([]);

  const [active, setActive] = useState(0);

  const { gsap, ScrollTrigger } = useGSAP();

  useEffect(() => {
    if (!gsap || !ScrollTrigger) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${PIN_DISTANCE}`,
        pin: true,
        pinSpacing: true,
        // refreshPriority включает сортировку триггеров по позиции в
        // документе: чанки секций гидрируются в произвольном порядке, а
        // GSAP учитывает pin-spacer соседей только для триггеров выше по
        // списку. Без этого пин ниже по странице «паркуется» на 2900px раньше.
        refreshPriority: 1,
      });

      const N = STOPS.length;
      // Длины переходов в пикселях скролла. Уход (EXIT_LEN) короче входа
      // (ENTER_LEN) — старый текст исчезает быстрее, чем появляется новый.
      // Оба отрезка — чистая функция позиции скролла (totalPx), без
      // независимых по времени твинов, поэтому наложение текста при быстром
      // или обратном скролле невозможно: на любой позиции скролла состояние
      // однозначно вычисляется заново.
      const EXIT_LEN  = 150;
      const ENTER_LEN = 320;
      // Кроссфейд фоновых фото — отдельная, ПЕРЕКРЫВАЮЩАЯСЯ функция:
      // в момент перехода старое и новое фото в сумме дают ~100% яркости,
      // без провала в чёрный фон между ними.
      const BG_FADE = 220;

      const clamp01 = (v) => Math.max(0, Math.min(1, v));
      const lastIdxRef = { current: -1 };

      const applyProgress = (progress) => {
        const totalPx = progress * PIN_DISTANCE;

        gsap.set(lineRef.current, { scaleY: progress });

        const activeIdx = Math.max(0, Math.min(N - 1, Math.round(totalPx / POS_STEP)));
        if (activeIdx !== lastIdxRef.current) {
          lastIdxRef.current = activeIdx;
          setActive(activeIdx);
        }

        for (let i = 0; i < N; i++) {
          const segStart = i * POS_STEP;
          const segEnd   = (i + 1) * POS_STEP;

          // ── Фон: плавный перекрывающийся кроссфейд ──
          let bgPresence = 1;
          if (i > 0)     bgPresence = Math.min(bgPresence, clamp01((totalPx - (segStart - BG_FADE)) / (BG_FADE * 2)));
          if (i < N - 1) bgPresence = Math.min(bgPresence, clamp01(((segEnd + BG_FADE) - totalPx) / (BG_FADE * 2)));

          // ── Текст: уход быстрее входа, без наложения ──
          const enterP = i === 0 ? 1 : clamp01((totalPx - segStart) / ENTER_LEN);
          const exitP  = i === N - 1 ? 0 : clamp01((totalPx - (segEnd - EXIT_LEN)) / EXIT_LEN);
          const presence = enterP * (1 - exitP);
          const nameOffset = exitP > 0 ? -exitP * 110 : (1 - enterP) * 110;
          const yOffset     = exitP > 0 ? -exitP * 14  : (1 - enterP) * 14;

          gsap.set(bgRefs.current[i],   { opacity: bgPresence });
          gsap.set(dotRefs.current[i],  { scale: 0.5 + 0.5 * bgPresence, opacity: 0.35 + 0.65 * bgPresence });
          gsap.set(nameRefs.current[i], { yPercent: nameOffset, opacity: presence });

          const rest = [
            numRefs.current[i], badgeRefs.current[i], locRefs.current[i],
            descRefs.current[i], statRefs.current[i], ctaRefs.current[i],
            loreRefs.current[i],
          ].filter(Boolean);
          gsap.set(rest, { y: yOffset, opacity: presence });
          if (quoteRefs.current[i]) gsap.set(quoteRefs.current[i], { opacity: presence });
        }
      };

      applyProgress(0);

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${PIN_DISTANCE}`,
        scrub: true,
        onUpdate: (self) => applyProgress(self.progress),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [gsap, ScrollTrigger]);

  const routeHeight = Math.max(220, (STOPS.length - 1) * 64);

  return (
    <section id="landmarks" ref={sectionRef} className={styles.section}>

      {/* ── ФОНЫ ── */}
      <div className={styles.bgStack}>
        {STOPS.map((stop, i) => (
          <div
            key={stop.id}
            ref={(el) => { bgRefs.current[i] = el; }}
            className={`${styles.bgLayer} ${stop.image ? "" : styles.bgLayerNoImage}`}
          >
            {stop.image && (
              <Image
                src={stop.image}
                alt=""
                fill
                sizes="100vw"
                priority={i === 0}
                quality={76}
                placeholder={photoBySrc(stop.image)?.blur ? "blur" : "empty"}
                blurDataURL={photoBySrc(stop.image)?.blur}
                className={styles.bgImg}
              />
            )}
            {!stop.image && (
              <>
                <div className={styles.ornament} aria-hidden="true" />
                <span className={styles.posterLetter} aria-hidden="true">
                  {stop.name.replace(/^[«"']/, "").charAt(0)}
                </span>
              </>
            )}
          </div>
        ))}
        <div className={styles.overlay} />
      </div>

      {/* ── УГЛОВАЯ МЕТКА ── */}
      <span className={styles.cornerLabel}>
        Республика Коми &nbsp;&nbsp;·&nbsp;&nbsp; Достопримечательности
      </span>

      {/* ── МАРШРУТ (ИНДИКАТОР) ── */}
      <aside className={styles.route} style={{ height: routeHeight }}>
        <div className={styles.routeTrack} ref={lineRef} />
        {STOPS.map((stop, i) => (
          <div
            key={stop.id}
            className={`${styles.routeStop} ${active === i ? styles.routeStopActive : ""}`}
            style={{ top: `${routeTop(i)}%` }}
          >
            <span className={styles.routeName}>{stop.name}</span>
            <span className={styles.routeDot} ref={(el) => { dotRefs.current[i] = el; }} />
          </div>
        ))}
      </aside>

      {/* ── ТЕКСТ ── */}
      <div className={styles.textLayer}>
        {STOPS.map((stop, i) => (
          <div className={styles.block} key={stop.id}>
            <div className={styles.meta}>
              <span className={styles.blockNum} ref={(el) => { numRefs.current[i] = el; }}>
                {stop.id} / {total()}
              </span>
              {stop.badge && (
                <span className={styles.badge} ref={(el) => { badgeRefs.current[i] = el; }}>
                  {stop.badge}
                </span>
              )}
            </div>

            <div className={styles.nameClip}>
              <h2 className={styles.name} ref={(el) => { nameRefs.current[i] = el; }}>
                {stop.name}
              </h2>
            </div>

            {stop.location && (
              <span className={styles.location} ref={(el) => { locRefs.current[i] = el; }}>
                {stop.location}
              </span>
            )}

            {stop.desc && (
              <p className={styles.desc} ref={(el) => { descRefs.current[i] = el; }}>
                {stop.desc}
              </p>
            )}

            <div className={styles.row}>
              {stop.stat && (
                <div className={styles.stat} ref={(el) => { statRefs.current[i] = el; }}>
                  <span className={styles.statValue}>{stop.stat.value}</span>
                  <span className={styles.statLabel}>{stop.stat.label}</span>
                </div>
              )}

              <a
                className={styles.ctaBtn}
                ref={(el) => { ctaRefs.current[i] = el; }}
                href={mapHrefFor(stop)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Маршрут до точки
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor"
                    strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>

              {stop.href && (
                <a
                  className={styles.loreLink}
                  ref={(el) => { loreRefs.current[i] = el; }}
                  href={stop.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Предание на карте ↗
                </a>
              )}
            </div>

            {stop.quote && (
              <p className={styles.quote} ref={(el) => { quoteRefs.current[i] = el; }}>
                {stop.quote}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Root ────────────────────────────────────────────────────────
export default function LandmarksSection() {
  const [mode, setMode] = useState(null); // "mobile" | "static" | "desktop"

  useEffect(() => {
    const mqMobile  = window.matchMedia("(max-width: 767px)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
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

  if (!STOPS.length) return null;
  if (mode === null) return null;
  if (mode === "mobile") return <LandmarksStatic />;
  if (mode === "static") return <LandmarksStatic wide />;
  return <LandmarksDesktop />;
}
