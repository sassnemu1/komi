"use client";

import { useEffect, useRef } from "react";
import { MdHotel } from "react-icons/md";
import { IoIosRestaurant } from "react-icons/io";
import useGSAP from "@/hooks/useGSAP";
import styles from "./StayDineSection.module.css";
import { INFO_DATA } from "@/data/InfoData";

const HOTELS      = INFO_DATA.find((c) => c.id === "04");
const RESTAURANTS = INFO_DATA.find((c) => c.id === "05");

// Название карточки: если title совпадает с названием категории
// («Отели», «Рестораны») — это шаблонная заглушка, показываем sub.
function cardName(work, tag) {
  const title = (work.title ?? "").trim();
  if (!title || title === tag) return { name: work.sub, sub: null };
  return { name: title, sub: work.sub };
}

const initialOf = (name = "") => name.replace(/^[«"'\s]+/, "").charAt(0);

function Card({ work, tag }) {
  const { name, sub } = cardName(work, tag);
  const hasImage = Boolean(work.image);
  const Tag = work.href ? "a" : "div";
  const linkProps = work.href
    ? { href: work.href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  const style = hasImage
    ? { backgroundImage: `url(${work.image})` }
    : work.thumbBg
      ? { background: work.thumbBg }
      : undefined;

  return (
    <Tag
      className={`${styles.row} ${hasImage ? "" : styles.rowPoster}`}
      style={style}
      {...linkProps}
    >
      {!hasImage && (
        <>
          <div className={styles.ornament} aria-hidden="true" />
          <span className={styles.posterLetter} aria-hidden="true">
            {initialOf(name)}
          </span>
        </>
      )}
      <div className={styles.rowOverlay} />
      <div className={styles.rowBody}>
        <div className={styles.rowMeta}>
          {work.year && <span className={styles.rowTag}>{work.year}</span>}
          {work.badge && <span className={styles.rowBadge}>{work.badge}</span>}
        </div>
        <h3 className={styles.rowTitle}>{name}</h3>
        {sub && <span className={styles.rowSub}>{sub}</span>}
        {work.location && (
          <span className={styles.rowLocation}>
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            {work.location}
          </span>
        )}
        {work.desc && <p className={styles.rowDesc}>{work.desc}</p>}
        {work.href && <span className={styles.rowLink}>Перейти на сайт ↗</span>}
      </div>
    </Tag>
  );
}

function Column({ data, Icon }) {
  return (
    <div className={styles.column}>
      <div className={styles.columnHead}>
        <Icon className={styles.columnIcon} />
        <span className={styles.columnLabel}>{data.tag}</span>
      </div>

      {data.desc && <p className={styles.columnLead}>{data.desc}</p>}

      <div className={styles.grid}>
        {data.works.map((work, i) => (
          <Card work={work} tag={data.tag} key={work.href ?? `${data.id}-${i}`} />
        ))}
      </div>
    </div>
  );
}

export default function StayDineSection() {
  const sectionRef = useRef(null);
  const eyebrowRef  = useRef(null);
  const titleRef    = useRef(null);
  const leadRef     = useRef(null);
  const lineRef     = useRef(null);

  const { gsap, ScrollTrigger } = useGSAP();

  useEffect(() => {
    if (!gsap || !ScrollTrigger) return;
    const section = sectionRef.current;
    if (!section) return;
    // prefers-reduced-motion: элементы уже в финальном состоянии — ничего не прячем
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const rows = section.querySelectorAll(`.${styles.row}`);

      gsap.set(eyebrowRef.current, { opacity: 0, y: 12 });
      gsap.set(lineRef.current,    { scaleX: 0, transformOrigin: "left center" });
      gsap.set(titleRef.current.children, { yPercent: 110, opacity: 0 });
      gsap.set(leadRef.current,    { opacity: 0, y: 14 });
      gsap.set(rows,                { opacity: 0, y: 16 });

      gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 82%" },
      })
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
        .to(lineRef.current,    { scaleX: 1, duration: 0.6, ease: "power3.out" }, "-=0.35")
        .to(titleRef.current.children, {
          yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.7, ease: "power4.out",
        }, "-=0.4")
        .to(leadRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.45")
        .to(rows, { opacity: 1, y: 0, stagger: 0.06, duration: 0.55, ease: "power3.out" }, "-=0.3");
    }, sectionRef);

    return () => ctx.revert();
  }, [gsap, ScrollTrigger]);

  if (!HOTELS || !RESTAURANTS) return null;

  return (
    <section id="stay" ref={sectionRef} className={styles.section}>
      <header className={styles.header}>
        <span className={styles.eyebrow} ref={eyebrowRef}>
          Республика Коми &nbsp;·&nbsp; Отели и рестораны
        </span>
        <div className={styles.titleLineWrap}>
          <div className={styles.titleLine} ref={lineRef} />
        </div>
        <h2 className={styles.title} ref={titleRef}>
          <span>Где остановиться</span>
          <span>и куда сходить поесть</span>
        </h2>
        <p className={styles.lead} ref={leadRef}>
          Отели и рестораны холдинга «Велес И К» — от Сыктывкара до таёжной Якши.
        </p>
      </header>

      <div className={styles.columns}>
        <Column data={HOTELS} Icon={MdHotel} />
        <div className={styles.divider} />
        <Column data={RESTAURANTS} Icon={IoIosRestaurant} />
      </div>
    </section>
  );
}
