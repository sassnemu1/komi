"use client";

import { useRef } from "react";
import SectionHead from "@/components/SectionHead/SectionHead";
import useReveal from "@/hooks/useReveal";
import styles from "./HoldingSection.module.css";
import { INFO_DATA } from "@/data/InfoData";

const DATA = INFO_DATA.find((c) => c.id === "11");

// Заключительная глава: кто стоит за komi.world. Четыре части экосистемы
// холдинга «Велес И К» — завод напитков, арктическая техника, туристический
// коридор и цифровой контур — с фактами из README холдинга и сайтов брендов.
export default function HoldingSection() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, { stagger: 0.08 });

  if (!DATA) return null;

  return (
    <section id="holding" ref={sectionRef} className={styles.section}>
      <div className={styles.texture} aria-hidden="true" />
      <div className={styles.inner}>
        <SectionHead
          num="10"
          eyebrow="Холдинг"
          title={DATA.title}
          lead={DATA.desc}
        />

        <ul className={styles.grid} aria-label="Части экосистемы холдинга">
          {DATA.works.map((work, i) => {
            const external = /^https?:\/\//.test(work.site?.href ?? "");
            return (
              <li
                className={styles.card}
                key={work.title}
                style={{ "--card-bg": work.thumbBg ?? "transparent" }}
                data-reveal
              >
                <div className={styles.cardWash} aria-hidden="true" />
                <div className={styles.cardHead}>
                  <span className={styles.cardIdx}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.cardCat}>{work.sub}</span>
                </div>
                <h3 className={styles.cardTitle}>{work.title}</h3>
                <p className={styles.cardDesc}>{work.desc}</p>

                {work.facts?.length > 0 && (
                  <dl className={styles.facts}>
                    {work.facts.map(([label, value]) => (
                      <div className={styles.fact} key={label}>
                        <dt className={styles.factLabel}>{label}</dt>
                        <dd className={styles.factValue}>{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {work.site && (
                  <a
                    className={styles.cardLink}
                    href={work.site.href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {work.site.label} <span aria-hidden="true">{external ? "↗" : "→"}</span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        <p className={styles.note}>
          УК «Велес И К» · Сыктывкар, Республика Коми ·{" "}
          <a href="mailto:info@komi.world" className={styles.noteLink}>info@komi.world</a>
        </p>
      </div>
    </section>
  );
}
