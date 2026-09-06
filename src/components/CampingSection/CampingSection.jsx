"use client";

import { useRef } from "react";
import Image from "next/image";
import { PHOTOS } from "@/data/photos";
import SectionHead from "@/components/SectionHead/SectionHead";
import useReveal from "@/hooks/useReveal";
import styles from "./CampingSection.module.css";
import { INFO_DATA } from "@/data/InfoData";

const DATA = INFO_DATA.find((c) => c.id === "07");

// Тропа: три остановки на одной линии — глэмпинг, кордон, сервис.
export default function CampingSection() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, { stagger: 0.1 });

  if (!DATA) return null;

  return (
    <section id="camping" ref={sectionRef} className={styles.section}>
      <div className={styles.bg} aria-hidden="true">
        <Image src={PHOTOS["forest-lake"].src} alt="" fill sizes="100vw" quality={70} />
      </div>
      <div className={styles.inner}>
        <SectionHead
          num="06"
          eyebrow="Кемпинг"
          title={"Кемпинг\nи тайга"}
          lead={DATA.desc}
        />

        <ol className={styles.trail}>
          {DATA.works.map((work, i) => {
            const isProject = work.badge === "В проекте";
            return (
              <li className={styles.stop} key={`${DATA.id}-${i}`} data-reveal>
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.stopNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.stopTitle}>{work.title}</h3>
                {work.sub && <span className={styles.stopSub}>{work.sub}</span>}
                {work.desc && <p className={styles.stopDesc}>{work.desc}</p>}
                <div className={styles.chips}>
                  {work.year && <span className={styles.chip}>{work.year}</span>}
                  {work.location && <span className={styles.chip}>{work.location}</span>}
                  {work.badge && (
                    <span className={isProject ? styles.chipProject : styles.chip}>{work.badge}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
