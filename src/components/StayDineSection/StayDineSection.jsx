"use client";

import { useEffect, useRef } from "react";
import { MdHotel } from "react-icons/md";
import { IoIosRestaurant } from "react-icons/io";
import useGSAP from "@/hooks/useGSAP";
import styles from "./StayDineSection.module.css";
import { INFO_DATA } from "@/data/InfoData";

const HOTELS      = INFO_DATA.find((c) => c.id === "04");
const RESTAURANTS = INFO_DATA.find((c) => c.id === "05");

function Column({ data, Icon }) {
  return (
    <div className={styles.column}>
      <div className={styles.columnHead}>
        <Icon className={styles.columnIcon} />
        <span className={styles.columnLabel}>{data.tag}</span>
      </div>

      <p className={styles.columnLead}>{data.desc}</p>

      <div className={styles.grid}>
        {data.works.map((work, i) => (
          <div
            className={styles.row}
            key={i}
            style={{ backgroundImage: `url(${work.image})` }}
          >
            <div className={styles.rowOverlay} />
            <div className={styles.rowBody}>
              <span className={styles.rowTag}>{work.year}</span>
              <h3 className={styles.rowTitle}>{work.sub}</h3>
              <p className={styles.rowDesc}>{work.desc}</p>
            </div>
          </div>
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
    <section ref={sectionRef} className={styles.section}>
      <header className={styles.header}>
        <span className={styles.eyebrow} ref={eyebrowRef}>
          Республика Коми &nbsp;·&nbsp; Сервис
        </span>
        <div className={styles.titleLineWrap}>
          <div className={styles.titleLine} ref={lineRef} />
        </div>
        <h2 className={styles.title} ref={titleRef}>
          <span>Где остановиться</span>
          <span>и куда сходить поесть</span>
        </h2>
        <p className={styles.lead} ref={leadRef}>
          От деловых отелей в Сыктывкаре до таёжных эко-домиков и кафе
          с традиционной кухней зырян — подборка проверенных мест.
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
