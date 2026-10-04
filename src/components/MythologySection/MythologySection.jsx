"use client";

import { useRef } from "react";
import Image from "next/image";
import SectionHead from "@/components/SectionHead/SectionHead";
import useReveal from "@/hooks/useReveal";
import { INFO_DATA } from "@/data/InfoData";
import { photoBySrc } from "@/data/photos";
import styles from "./MythologySection.module.css";

const CARDS = INFO_DATA.find((chapter) => chapter.id === "02")?.works ?? [];
const MAP_URL = process.env.NEXT_PUBLIC_MAP_URL || "https://map.komi.world";

export default function MythologySection() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, { stagger: 0.055 });
  if (!CARDS.length) return null;

  return (
    <section id="mythology" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <SectionHead
          num="02"
          eyebrow="Мифология"
          title={"Там, где живут\nпредания"}
          lead="Боги и духи, герои и хранители леса. Познакомьтесь с миром коми-зырянских сказаний — от древних сюжетов до преданий отдельных деревень."
          action={{ label: "Карта преданий", href: MAP_URL, external: true }}
        />
        <div className={styles.grid}>
          {CARDS.map((card, index) => {
            const [title, subtitle] = card.title.split("\n");
            const photo = card.image ? photoBySrc(card.image) : null;
            return (
              <a className={styles.card} href={card.href || MAP_URL} target="_blank" rel="noopener noreferrer" key={card.href || index} data-reveal>
                <div className={styles.media}>
                  {card.image ? (
                    <Image src={card.image} alt={title} fill sizes="(max-width: 480px) 100vw, (max-width: 1000px) 50vw, 25vw" quality={75} placeholder={photo?.blur ? "blur" : "empty"} blurDataURL={photo?.blur} />
                  ) : <span className={styles.initial} aria-hidden="true">{title.charAt(0)}</span>}
                  <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.arrow} aria-hidden="true">↗</span>
                </div>
                <div className={styles.body}>
                  {(card.genre || card.year) && <span className={styles.tag}>{card.genre || card.year}</span>}
                  <h3 className={styles.title}>{title}</h3>
                  {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
                  {card.desc && <p className={styles.desc}>{card.desc}</p>}
                  <span className={styles.link}>Читать предание <span aria-hidden="true">→</span></span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
