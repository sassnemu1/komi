"use client";

import { useRef } from "react";
import Image from "next/image";
import SectionHead from "@/components/SectionHead/SectionHead";
import useReveal from "@/hooks/useReveal";
import styles from "./ExperiencesSection.module.css";
import { INFO_DATA } from "@/data/InfoData";
import { PHOTOS } from "@/data/photos";

// object-position для фото плитки, если оно задано в photos.js
const posOf = (src) => Object.values(PHOTOS).find((p) => p.src === src)?.pos;

const DATA = INFO_DATA.find((c) => c.id === "06");

// Раскладка бенто: «Заповедный рейс» (второй в данных) — большая плитка,
// остальные — по одной ячейке; на узких экранах всё в столбик.
const AREAS = ["b", "a", "c", "d", "e"];

function Tile({ work, area }) {
  const big = area === "a";
  const stats = work.stats ?? [];
  const isProject = work.badge === "В проекте";
  return (
    <article
      className={`${styles.tile} ${big ? styles.tileBig : ""} ${work.image ? styles.tileHasImg : ""}`}
      style={{ gridArea: area, "--tile-bg": work.thumbBg ?? "transparent" }}
      data-reveal
    >
      {work.image && (
        <div className={styles.tileImg} aria-hidden="true">
          <Image
            src={work.image}
            alt=""
            fill
            sizes={big ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"}
            quality={72}
            style={posOf(work.image) ? { objectPosition: posOf(work.image) } : undefined}
          />
        </div>
      )}
      <div className={styles.tileWash} aria-hidden="true" />
      {big && <div className={styles.tileOrnament} aria-hidden="true" />}

      <div className={styles.tileTop}>
        <span className={styles.tileEyebrow}>{work.sub}</span>
        {work.badge && (
          <span className={isProject ? styles.chipProject : styles.chip}>{work.badge}</span>
        )}
      </div>

      <div className={styles.tileBody}>
        <h3 className={styles.tileTitle}>{work.title}</h3>
        {stats.length > 0 && (
          <div className={styles.stats}>
            {stats.map((s) => (
              <div className={styles.stat} key={s.label}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        )}
        {work.desc && <p className={styles.tileDesc}>{work.desc}</p>}
      </div>

      <div className={styles.tileFoot}>
        {work.year && <span className={styles.foot}>{work.year}</span>}
        {work.location && <span className={styles.foot}>· {work.location}</span>}
      </div>
    </article>
  );
}

export default function ExperiencesSection() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, { stagger: 0.08 });

  if (!DATA) return null;

  return (
    <section id="experiences" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <SectionHead
          num="05"
          eyebrow="Впечатления"
          title={"Что\nувидеть"}
          lead={DATA.desc}
        />
        <div className={styles.grid}>
          {DATA.works.map((work, i) => (
            <Tile work={work} area={AREAS[i] ?? "e"} key={`${DATA.id}-${i}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
