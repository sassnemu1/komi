"use client";

import { useRef, useState } from "react";
import SectionHead from "@/components/SectionHead/SectionHead";
import useReveal from "@/hooks/useReveal";
import styles from "./MadeInKomiSection.module.css";
import { INFO_DATA } from "@/data/InfoData";

const DATA = INFO_DATA.find((c) => c.id === "08");

const initialOf = (name = "") => name.replace(/^[«"'\s]+/, "").charAt(0);

// Досье бренда — справа на desktop, под активной строкой на mobile.
function Dossier({ work, index }) {
  const facts = work.facts ?? [];
  return (
    <div className={styles.dossier} style={{ "--brand-bg": work.thumbBg ?? "transparent" }}>
      <div className={styles.dossierWash} aria-hidden="true" />
      <span className={styles.dossierLetter} aria-hidden="true">{initialOf(work.title)}</span>
      <div className={styles.dossierOrnament} aria-hidden="true" />

      <div className={styles.dossierHead}>
        <span className={styles.dossierIdx}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.dossierCat}>{work.sub}</span>
      </div>

      <h3 className={styles.dossierName}>{work.title}</h3>
      {work.desc && <p className={styles.dossierDesc}>{work.desc}</p>}

      {facts.length > 0 && (
        <dl className={styles.facts}>
          {facts.map(([label, value]) => (
            <div className={styles.fact} key={label}>
              <dt className={styles.factLabel}>{label}</dt>
              <dd className={styles.factValue}>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className={styles.dossierFoot}>
        {work.location && <span className={styles.chip}>{work.location}</span>}
        {work.badge && <span className={styles.chip}>{work.badge}</span>}
        {work.href && (
          <a className={styles.dossierLink} href={work.href} target="_blank" rel="noopener noreferrer">
            Читать на карте преданий <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </div>
  );
}

// Каталог: слева — указатель брендов, справа — досье активного.
export default function MadeInKomiSection() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);

  useReveal(sectionRef, { stagger: 0.05 });

  if (!DATA) return null;
  const works = DATA.works;
  const current = works[active] ?? works[0];

  return (
    <section id="made-in-komi" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <SectionHead
          num="07"
          eyebrow="Сделано в Коми"
          title={"Сделано\nв Коми"}
          lead={DATA.desc}
        />

        <div className={styles.layout}>
          <ol className={styles.index} aria-label="Бренды холдинга">
            {works.map((work, i) => {
              const isActive = i === active;
              return (
                <li key={`${DATA.id}-${i}`} data-reveal>
                  <button
                    type="button"
                    className={`${styles.row} ${isActive ? styles.rowActive : ""}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-expanded={isActive}
                  >
                    <span className={styles.rowIdx}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.rowName}>{work.title}</span>
                    <span className={styles.rowCat}>{work.sub}</span>
                    <span className={styles.rowArrow} aria-hidden="true">→</span>
                  </button>
                  {/* Мобайл: досье раскрывается под строкой */}
                  <div className={styles.inline} hidden={!isActive}>
                    <Dossier work={work} index={i} />
                  </div>
                </li>
              );
            })}
          </ol>

          <aside className={styles.panel} data-reveal>
            <Dossier work={current} index={active} key={active} />
          </aside>
        </div>
      </div>
    </section>
  );
}
