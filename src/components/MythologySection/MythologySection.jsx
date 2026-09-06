"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import SectionHead from "@/components/SectionHead/SectionHead";
import useReveal from "@/hooks/useReveal";
import styles from "./MythologySection.module.css";
import { INFO_DATA } from "@/data/InfoData";

const MYTH = INFO_DATA.find((c) => c.id === "02");
const CHAPTERS = MYTH?.works ?? [];

// Фольклорная карта живёт отдельным приложением (репозиторий komi-map).
// В разработке подменяется через NEXT_PUBLIC_MAP_URL=http://localhost:8936
const MAP_URL = process.env.NEXT_PUBLIC_MAP_URL || "https://map.komi.world";

function splitTitle(title) {
  const [main, sub] = String(title).split("\n");
  return { main: main?.trim(), sub: sub?.trim() };
}

// Оглавление: слева — восемь глав списком, справа — иллюстрация и текст
// той главы, на которой курсор или фокус. Каждая глава — ссылка на
// соответствующую запись карты преданий.
export default function MythologySection() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);

  useReveal(sectionRef);

  if (!CHAPTERS.length) return null;
  const current = CHAPTERS[active] ?? CHAPTERS[0];
  const currentTitle = splitTitle(current.title);

  return (
    <section id="mythology" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <SectionHead
          num="02"
          eyebrow="Мифология"
          title={"Мифология\nкоми"}
          lead={MYTH.desc}
          action={{ label: "Открыть карту преданий", href: MAP_URL, external: true }}
        />

        <div className={styles.layout}>
          <ol className={styles.list} aria-label="Главы мифологии коми">
            {CHAPTERS.map((chapter, i) => {
              const { main, sub } = splitTitle(chapter.title);
              const isActive = i === active;
              return (
                <li key={chapter.href ?? i} data-reveal>
                  <a
                    className={`${styles.row} ${isActive ? styles.rowActive : ""}`}
                    href={chapter.href ?? MAP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span className={styles.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.rowThumb} aria-hidden="true">
                      <Image src={chapter.image} alt="" fill sizes="64px" />
                    </span>
                    <span className={styles.rowText}>
                      <span className={styles.rowTitle}>{main}</span>
                      {sub && <span className={styles.rowSub}>{sub}</span>}
                    </span>
                    <span className={styles.rowGenre}>{chapter.year}</span>
                    <span className={styles.rowArrow} aria-hidden="true">↗</span>
                  </a>
                </li>
              );
            })}
          </ol>

          <div className={styles.stage} data-reveal>
            <div className={styles.frame}>
              {CHAPTERS.map((chapter, i) => (
                <div
                  key={chapter.href ?? i}
                  className={`${styles.frameImg} ${i === active ? styles.frameImgOn : ""}`}
                  aria-hidden={i !== active}
                >
                  <Image
                    src={chapter.image}
                    alt={i === active ? splitTitle(chapter.title).main : ""}
                    fill
                    sizes="(max-width: 900px) 100vw, 42vw"
                  />
                </div>
              ))}
              <div className={styles.frameShade} aria-hidden="true" />
              <div className={styles.frameOrnament} aria-hidden="true" />
              <span className={styles.frameNum} aria-hidden="true">
                {String(active + 1).padStart(2, "0")}
              </span>
            </div>

            <div className={styles.stageText} key={active}>
              <span className={styles.stageGenre}>{current.year}</span>
              <h3 className={styles.stageTitle}>{currentTitle.main}</h3>
              {currentTitle.sub && <span className={styles.stageSub}>{currentTitle.sub}</span>}
              <p className={styles.stageDesc}>{current.desc}</p>
              <a
                className={styles.stageLink}
                href={current.href ?? MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Читать на карте преданий <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
