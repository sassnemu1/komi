"use client";

import { useEffect, useRef, useState } from "react";
import useGSAP from "@/hooks/useGSAP";
import styles from "./LandmarksSection.module.css";

// ─── Точки маршрута ─────────────────────────────────────────────
const POS_STEP     = 720; // px скролла на одну точку
const PIN_DISTANCE = 2900; // общая длина скролла пина секции

const STOPS = [
  {
    id: "01",
    name: "Маньпупунёр",
    location: "Печоро-Илычский заповедник",
    badge: "Объект ЮНЕСКО",
    stat: { value: "42 м", label: "высота столбов" },
    desc: "Семь каменных исполинов на вершине безлесого плато — одно из самых узнаваемых природных чудес России. По легенде коми — окаменевшие великаны.",
    quote: "«Семь братьев-великанов, превращённых в камень, чтобы не тронуть священную землю» — легенда манси и коми",
    image: "https://avatars.mds.yandex.net/get-vertis-journal/4465444/1_1.jpg_1742117587126/orig",
  },
  {
    id: "02",
    name: "Парк «Югыд ва»",
    location: "Северный Урал",
    badge: "Объект ЮНЕСКО",
    stat: { value: "1,89 млн га", label: "площадь парка" },
    desc: "Самый большой в Европе массив первичных бореальных лесов — нетронутая тайга, горные хребты и десятки рек ледникового происхождения.",
    quote: "«Югыд ва» переводится с коми как «светлая вода»",
    image: "https://avatars.mds.yandex.net/get-altay/19720204/2a0000019d5dfc37cb62cd45c0eb569211c9/XXXL",
  },
  {
    id: "03",
    name: "Река Печора",
    location: "От Урала до Баренцева моря",
    badge: "Главная артерия региона",
    stat: { value: "1 809 км", label: "длина реки" },
    desc: "Одна из крупнейших рек Европы, берущая начало на Северном Урале. Веками связывала охотничьи угодья, торговые пути и сёла коми.",
    quote: "Печора впадает в Баренцево море, образуя обширную дельту",
    image: "https://geoglob.ru/wp-content/uploads/2023/01/reka-pechora.webp",
  },
  {
    id: "04",
    name: "Хальмер-Ю",
    location: "За Полярным кругом",
    badge: "Город-призрак",
    stat: { value: "1993", label: "год эвакуации" },
    desc: "Шахтёрский посёлок, покинутый после закрытия угольной шахты. Сегодня — пустые дома среди тундры и полигон для авиаучений.",
    quote: "Название переводится как «мёртвая река» — с ненецкого «хальмер»",
    image: "https://nashural.ru/assets/uploads/halmer-yu08.jpg",
  },
];

// ─── Мобильная версия ───────────────────────────────────────────
function LandmarksMobile() {
  return (
    <section className={styles.sectionMobile}>
      <header className={styles.mobileHeader}>
        <span className={styles.eyebrow}>Республика Коми &nbsp;·&nbsp; Достопримечательности</span>
        <h2 className={styles.mobileTitle}>Куда поехать</h2>
        <p className={styles.mobileLead}>
          Четыре точки, без которых нельзя представить Коми — от каменных
          исполинов до заброшенного посёлка за Полярным кругом.
        </p>
      </header>

      <div className={styles.mobileList}>
        {STOPS.map((stop) => {
          const mapHref = `https://yandex.ru/maps/?text=${encodeURIComponent(`${stop.name} Республика Коми`)}`;
          return (
            <div
              className={styles.mobileCard}
              key={stop.id}
              style={{ backgroundImage: `url(${stop.image})` }}
            >
              <div className={styles.mobileCardOverlay} />
              <span className={styles.mobileCardNum}>{stop.id}</span>
              <div className={styles.mobileCardBody}>
                <span className={styles.badge}>{stop.badge}</span>
                <h3 className={styles.mobileCardTitle}>{stop.name}</h3>
                <span className={styles.location}>{stop.location}</span>
                <p className={styles.mobileCardDesc}>{stop.desc}</p>
                <div className={styles.row}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{stop.stat.value}</span>
                    <span className={styles.statLabel}>{stop.stat.label}</span>
                  </div>
                  <a
                    className={styles.ctaBtn}
                    href={mapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Маршрут
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor"
                        strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
                <p className={styles.quote}>{stop.quote}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Десктопная версия ──────────────────────────────────────────
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
      // без провала в чёрный фон между ними (это и читалось как «моргание»).
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

          // ── Фон: плавный перекрывающийся кроссфейд (без провала в чёрное) ──
          let bgPresence = 1;
          if (i > 0)     bgPresence = Math.min(bgPresence, clamp01((totalPx - (segStart - BG_FADE)) / (BG_FADE * 2)));
          if (i < N - 1) bgPresence = Math.min(bgPresence, clamp01(((segEnd + BG_FADE) - totalPx) / (BG_FADE * 2)));

          // ── Текст: уход быстрее входа, без наложения ──
          const enterP = i === 0 ? 1 : clamp01((totalPx - segStart) / ENTER_LEN);
          const exitP  = i === N - 1 ? 0 : clamp01((totalPx - (segEnd - EXIT_LEN)) / EXIT_LEN);
          const presence = enterP * (1 - exitP);
          // Направление смещения: уход — вверх, вход — снизу.
          const nameOffset = exitP > 0 ? -exitP * 110 : (1 - enterP) * 110;
          const yOffset     = exitP > 0 ? -exitP * 14  : (1 - enterP) * 14;

          gsap.set(bgRefs.current[i],   { opacity: bgPresence });
          gsap.set(dotRefs.current[i],  { scale: 0.5 + 0.5 * bgPresence, opacity: 0.35 + 0.65 * bgPresence });
          gsap.set(nameRefs.current[i], { yPercent: nameOffset, opacity: presence });

          const rest = [
            numRefs.current[i], badgeRefs.current[i], locRefs.current[i],
            descRefs.current[i], statRefs.current[i], ctaRefs.current[i],
          ];
          gsap.set(rest.filter(Boolean), { y: yOffset, opacity: presence });
          gsap.set(quoteRefs.current[i], { opacity: presence });
        }
      };

      // Начальное состояние — до первого скролла (progress = 0)
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

  return (
    <section ref={sectionRef} className={styles.section}>

      {/* ── ФОНЫ ── */}
      <div className={styles.bgStack}>
        {STOPS.map((stop, i) => (
          <div
            key={stop.id}
            ref={(el) => { bgRefs.current[i] = el; }}
            className={styles.bgLayer}
            style={{ backgroundImage: `url(${stop.image})` }}
          />
        ))}
        <div className={styles.overlay} />
      </div>

      {/* ── УГЛОВАЯ МЕТКА ── */}
      <span className={styles.cornerLabel}>
        Республика Коми &nbsp;&nbsp;·&nbsp;&nbsp; Достопримечательности
      </span>

      {/* ── МАРШРУТ (ИНДИКАТОР) ── */}
      <aside className={styles.route}>
        <div className={styles.routeTrack} ref={lineRef} />
        {STOPS.map((stop, i) => (
          <div
            key={stop.id}
            className={`${styles.routeStop} ${active === i ? styles.routeStopActive : ""}`}
            style={{ top: `${(i / (STOPS.length - 1)) * 100}%` }}
          >
            <span className={styles.routeName}>{stop.name}</span>
            <span className={styles.routeDot} ref={(el) => { dotRefs.current[i] = el; }} />
          </div>
        ))}
      </aside>

      {/* ── ТЕКСТ ── */}
      <div className={styles.textLayer}>
        {STOPS.map((stop, i) => {
          const mapHref = `https://yandex.ru/maps/?text=${encodeURIComponent(`${stop.name} Республика Коми`)}`;
          return (
            <div className={styles.block} key={stop.id}>
              <div className={styles.meta}>
                <span className={styles.blockNum} ref={(el) => { numRefs.current[i] = el; }}>
                  {stop.id} / {STOPS.length.toString().padStart(2, "0")}
                </span>
                <span className={styles.badge} ref={(el) => { badgeRefs.current[i] = el; }}>
                  {stop.badge}
                </span>
              </div>

              <div className={styles.nameClip}>
                <h2 className={styles.name} ref={(el) => { nameRefs.current[i] = el; }}>
                  {stop.name}
                </h2>
              </div>

              <span className={styles.location} ref={(el) => { locRefs.current[i] = el; }}>
                {stop.location}
              </span>

              <p className={styles.desc} ref={(el) => { descRefs.current[i] = el; }}>
                {stop.desc}
              </p>

              <div className={styles.row}>
                <div className={styles.stat} ref={(el) => { statRefs.current[i] = el; }}>
                  <span className={styles.statValue}>{stop.stat.value}</span>
                  <span className={styles.statLabel}>{stop.stat.label}</span>
                </div>

                <a
                  className={styles.ctaBtn}
                  ref={(el) => { ctaRefs.current[i] = el; }}
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Маршрут до точки
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor"
                      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>

              <p className={styles.quote} ref={(el) => { quoteRefs.current[i] = el; }}>
                {stop.quote}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Root ────────────────────────────────────────────────────────
export default function LandmarksSection() {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const h = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  if (isMobile === null) return null;
  return isMobile ? <LandmarksMobile /> : <LandmarksDesktop />;
}
