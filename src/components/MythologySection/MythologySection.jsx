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

function splitTitle(title) {
  const [main, sub] = title.split("\n");
  return { main: main?.trim(), sub: sub?.trim() };
}

// ─── Мобильная версия ───────────────────────────────────────────
function MythologyMobile() {
  return (
    <section className={styles.sectionMobile}>
      <header className={styles.mobileHeader}>
        <span className={styles.eyebrow}>Республика Коми &nbsp;·&nbsp; Эпос</span>
        <h2 className={styles.mobileTitle}>Мифология</h2>
        <p className={styles.mobileLead}>
          Пантеон богов, духи стихий и герои коми-зырянских сказаний.
        </p>
        <a className={styles.mapLink} href={MAP_URL}>
          Открыть карту преданий →
        </a>
      </header>

      <div className={styles.mobileList}>
        {CARDS.map((card, i) => {
          const { main, sub } = splitTitle(card.title);
          return (
            <div className={styles.mobileCard} key={i}>
              <div className={styles.mobileCardImage}>
                <Image src={card.image} alt={main} fill sizes="92vw" />
                <div className={styles.mobileCardOverlay} />
                <span className={styles.mobileCardNum}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className={styles.mobileCardBody}>
                <span className={styles.cardTag}>{card.year}</span>
                <h3 className={styles.mobileCardTitle}>{main}</h3>
                {sub && <span className={styles.cardSub}>{sub}</span>}
                <p className={styles.mobileCardDesc}>{card.desc}</p>
              </div>
            </div>
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

    const ctx = gsap.context(() => {
      gsap.set(eyebrowRef.current, { opacity: 0, y: 12 });
      gsap.set(lineRef.current,    { scaleX: 0, transformOrigin: "left center" });
      gsap.set(titleRef.current.children, { yPercent: 110, opacity: 0 });
      gsap.set(leadRef.current,    { opacity: 0, y: 14 });
      gsap.set(mapLinkRef.current, { opacity: 0, y: 14 });
      gsap.set(colRefs.current,    { opacity: 0, y: 28 });

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
        .to(colRefs.current, {
          opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "power3.out",
        }, "-=0.3");
    }, sectionRef);

    return () => ctx.revert();
  }, [gsap, ScrollTrigger]);

  return (
    <section ref={sectionRef} className={styles.section}>
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
          курсор, чтобы открыть раздел.
        </p>
        <a className={styles.mapLink} href={MAP_URL} ref={mapLinkRef}>
          Открыть карту преданий →
        </a>
      </header>

      <div className={styles.columns}>
        {CARDS.map((card, i) => {
          const { main, sub } = splitTitle(card.title);
          const isActive = activeIndex === i;
          return (
            <div
              key={i}
              ref={(el) => { colRefs.current[i] = el; }}
              className={`${styles.column} ${isActive ? styles.columnActive : ""}`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className={styles.columnImage}>
                <Image src={card.image} alt={main} fill sizes="20vw" />
                <div className={styles.columnImageOverlay} />
              </div>

              <div className={styles.columnIdle}>
                <span className={styles.columnNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.columnLabel}>{main}</span>
              </div>

              <div className={styles.columnCard}>
                <span className={styles.cardTag}>{card.year}</span>
                <h3 className={styles.cardTitle}>{main}</h3>
                {sub && <span className={styles.cardSub}>{sub}</span>}
                <p className={styles.cardDesc}>{card.desc}</p>
                <span className={styles.cardNum}>{String(i + 1).padStart(2, "0")}</span>
              </div>
            </div>
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
    setIsMobile(mq.matches);
    const h = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  if (!CARDS.length) return null;
  if (isMobile === null) return null;
  return isMobile ? <MythologyMobile /> : <MythologyDesktop />;
}
