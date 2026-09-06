"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import useGSAP from "@/hooks/useGSAP";
import styles from "./MythologySection.module.css";
import { INFO_DATA } from "@/data/InfoData";

const MYTH = INFO_DATA.find((c) => c.id === "02");
const CARDS = MYTH?.works ?? [];

// Фольклорная карта живёт отдельным приложением (репозиторий komi-map).
// В разработке подменяется через NEXT_PUBLIC_MAP_URL=http://localhost:8936
const MAP_URL = process.env.NEXT_PUBLIC_MAP_URL || "https://map.komi.world";

const LINK_LABEL = "Читать на карте преданий";

function splitTitle(title = "") {
  const [main, sub] = title.split("\n");
  return { main: main?.trim(), sub: sub?.trim() };
}

// href записи: агент контента может положить прямую ссылку на map.komi.world,
// иначе ведём на корень карты.
const hrefOf = (card) => card.href || MAP_URL;
const chipOf = (card) => card.genre || card.year;
const chipStyle = (card) => (card.genreColor ? { "--chip": card.genreColor } : undefined);
const initialOf = (name = "") => name.replace(/^[«"'\s]+/, "").charAt(0);

function CardVisual({ card, alt, sizes, className }) {
  if (card.image) {
    return <Image src={card.image} alt={alt} fill sizes={sizes} className={className} />;
  }
  return (
    <div
      className={styles.poster}
      style={card.thumbBg ? { background: card.thumbBg } : undefined}
    >
      <div className={styles.ornament} aria-hidden="true" />
      <span className={styles.posterLetter} aria-hidden="true">{initialOf(alt)}</span>
    </div>
  );
}

// ─── Мобильная версия ───────────────────────────────────────────
function MythologyMobile() {
  return (
    <section id="mythology" className={styles.sectionMobile}>
      <header className={styles.mobileHeader}>
        <span className={styles.eyebrow}>Республика Коми &nbsp;·&nbsp; Эпос</span>
        <h2 className={styles.mobileTitle}>Мифология</h2>
        <p className={styles.mobileLead}>
          Пантеон богов, духи стихий и герои коми-зырянских сказаний.
        </p>
        <a className={styles.mapLink} href={MAP_URL} target="_blank" rel="noopener noreferrer">
          Открыть карту преданий →
        </a>
      </header>

      <div className={styles.mobileList}>
        {CARDS.map((card, i) => {
          const { main, sub } = splitTitle(card.title);
          return (
            <a
              className={styles.mobileCard}
              key={card.href ?? i}
              href={hrefOf(card)}
              target="_blank"
              rel="noopener noreferrer"
              style={chipStyle(card)}
            >
              <div className={styles.mobileCardImage}>
                <CardVisual card={card} alt={main} sizes="92vw" />
                <div className={styles.mobileCardOverlay} />
                <span className={styles.mobileCardNum}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className={styles.mobileCardBody}>
                {chipOf(card) && <span className={styles.cardTag}>{chipOf(card)}</span>}
                <h3 className={styles.mobileCardTitle}>{main}</h3>
                {sub && <span className={styles.cardSub}>{sub}</span>}
                {card.desc && <p className={styles.mobileCardDesc}>{card.desc}</p>}
                <span className={styles.mobileCardLink}>{LINK_LABEL} ↗</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

// ─── Десктопная версия ──────────────────────────────────────────
function MythologyDesktop() {
  const sectionRef  = useRef(null);
  const eyebrowRef  = useRef(null);
  const titleRef    = useRef(null);
  const leadRef     = useRef(null);
  const lineRef     = useRef(null);
  const mapLinkRef  = useRef(null);
  const colRefs     = useRef([]);

  const [activeIndex, setActiveIndex] = useState(null);

  const { gsap, ScrollTrigger } = useGSAP();

  useEffect(() => {
    if (!gsap || !ScrollTrigger) return;
    const section = sectionRef.current;
    if (!section) return;
    // prefers-reduced-motion: элементы уже в финальном состоянии
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cols = colRefs.current.filter(Boolean);

      gsap.set(eyebrowRef.current, { opacity: 0, y: 12 });
      gsap.set(lineRef.current,    { scaleX: 0, transformOrigin: "left center" });
      gsap.set(titleRef.current.children, { yPercent: 110, opacity: 0 });
      gsap.set(leadRef.current,    { opacity: 0, y: 14 });
      gsap.set(mapLinkRef.current, { opacity: 0, y: 14 });
      gsap.set(cols,               { opacity: 0, y: 28 });

      gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 80%" },
      })
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
        .to(lineRef.current,    { scaleX: 1, duration: 0.6, ease: "power3.out" }, "-=0.35")
        .to(titleRef.current.children, {
          yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.7, ease: "power4.out",
        }, "-=0.4")
        .to(leadRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.45")
        .to(mapLinkRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.35")
        .to(cols, {
          opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "power3.out",
        }, "-=0.3");
    }, sectionRef);

    return () => ctx.revert();
  }, [gsap, ScrollTrigger]);

  return (
    <section id="mythology" ref={sectionRef} className={styles.section}>
      <div className={styles.vignette} />

      <header className={styles.header}>
        <span className={styles.eyebrow} ref={eyebrowRef}>
          Республика Коми &nbsp;·&nbsp; Эпос
        </span>
        <div className={styles.titleLineWrap}>
          <div className={styles.titleLine} ref={lineRef} />
        </div>
        <h2 className={styles.title} ref={titleRef}>
          <span>Мифология</span>
        </h2>
        <p className={styles.lead} ref={leadRef}>
          Пантеон богов, духи стихий и герои коми-зырянских сказаний — наведите
          курсор, чтобы открыть раздел, и перейдите к записи на карте преданий.
        </p>
        <a
          className={styles.mapLink}
          href={MAP_URL}
          ref={mapLinkRef}
          target="_blank"
          rel="noopener noreferrer"
        >
          Открыть карту преданий →
        </a>
      </header>

      <div className={styles.columns}>
        {CARDS.map((card, i) => {
          const { main, sub } = splitTitle(card.title);
          const isActive = activeIndex === i;
          return (
            <a
              key={card.href ?? i}
              href={hrefOf(card)}
              target="_blank"
              rel="noopener noreferrer"
              ref={(el) => { colRefs.current[i] = el; }}
              className={`${styles.column} ${isActive ? styles.columnActive : ""}`}
              style={chipStyle(card)}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex(null)}
              aria-label={`${main} — ${LINK_LABEL}`}
            >
              <div className={styles.columnImage}>
                <CardVisual card={card} alt={main} sizes="20vw" />
                <div className={styles.columnImageOverlay} />
              </div>

              <div className={styles.columnIdle}>
                <span className={styles.columnNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.columnLabel}>{main}</span>
              </div>

              <div className={styles.columnCard}>
                {chipOf(card) && <span className={styles.cardTag}>{chipOf(card)}</span>}
                <h3 className={styles.cardTitle}>{main}</h3>
                {sub && <span className={styles.cardSub}>{sub}</span>}
                {card.desc && <p className={styles.cardDesc}>{card.desc}</p>}
                <span className={styles.cardLink}>
                  {LINK_LABEL}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3 9L9 3M4.5 3H9v4.5" stroke="currentColor"
                      strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className={styles.cardNum}>{String(i + 1).padStart(2, "0")}</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

// ─── Root ────────────────────────────────────────────────────────
export default function MythologySection() {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const compute = () => setIsMobile(mq.matches);
    compute();
    mq.addEventListener("change", compute);
    return () => mq.removeEventListener("change", compute);
  }, []);

  if (!CARDS.length) return null;
  if (isMobile === null) return null;
  return isMobile ? <MythologyMobile /> : <MythologyDesktop />;
}
