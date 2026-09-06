"use client";

import { useRef } from "react";
import Image from "next/image";
import { PHOTOS } from "@/data/photos";
import { MdHotel } from "react-icons/md";
import { IoIosRestaurant } from "react-icons/io";
import SectionHead from "@/components/SectionHead/SectionHead";
import useReveal from "@/hooks/useReveal";
import styles from "./StayDineSection.module.css";
import { INFO_DATA } from "@/data/InfoData";

const HOTELS      = INFO_DATA.find((c) => c.id === "04");
const RESTAURANTS = INFO_DATA.find((c) => c.id === "05");

// У пяти ресторанов в источнике нет ничего, кроме названия; их общий
// desc «Ресторан холдинга…» уже сказан бейджем и заголовком группы —
// повторять его пять раз в строках незачем.
const GENERIC_DESC = /^Ресторан холдинга «Велес И К»\.?$/;

function Row({ work, index }) {
  const desc = work.desc && !GENERIC_DESC.test(work.desc.trim()) ? work.desc : null;
  const isProject = work.badge === "В проекте";
  return (
    <li className={`${styles.row} ${isProject ? styles.rowProject : ""}`} data-reveal>
      <span className={styles.rowIdx}>{String(index + 1).padStart(2, "0")}</span>
      <div className={styles.rowMain}>
        <h3 className={styles.rowName}>{work.title}</h3>
        {work.sub && <span className={styles.rowSub}>{work.sub}</span>}
        {desc && <p className={styles.rowDesc}>{desc}</p>}
      </div>
      <div className={styles.rowMeta}>
        {work.location && (
          <span className={styles.chipLocation}>
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            {work.location}
          </span>
        )}
        {work.badge && (
          <span className={isProject ? styles.chipProject : styles.chip}>{work.badge}</span>
        )}
        {work.year && !work.badge && <span className={styles.chip}>{work.year}</span>}
      </div>
    </li>
  );
}

function Group({ data, Icon }) {
  return (
    <div className={styles.group}>
      <div className={styles.groupHead} data-reveal>
        <span className={styles.groupIcon}><Icon /></span>
        <h3 className={styles.groupTitle}>{data.tag}</h3>
        {data.desc && <p className={styles.groupLead}>{data.desc}</p>}
      </div>
      <ol className={styles.rows}>
        {data.works.map((work, i) => (
          <Row work={work} index={i} key={`${data.id}-${i}`} />
        ))}
      </ol>
    </div>
  );
}

// Реестр: слева — счётчики и сноска, справа — две группы строками.
export default function StayDineSection() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, { stagger: 0.05 });

  if (!HOTELS || !RESTAURANTS) return null;

  return (
    <section id="stay" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <SectionHead
          num="04"
          eyebrow="Отели и рестораны"
          title={"Где остановиться\nи где поесть"}
          lead="Отели и рестораны холдинга «Велес И К» — от сети гостиниц до ресторана на фуникулёре над тайгой."
        />

        <div className={styles.layout}>
          <aside className={styles.side}>
            <div className={styles.counter} data-reveal>
              <span className={styles.counterNum}>{HOTELS.works.length}</span>
              <span className={styles.counterLabel}>отелей</span>
            </div>
            <div className={styles.counter} data-reveal>
              <span className={styles.counterNum}>{RESTAURANTS.works.length}</span>
              <span className={styles.counterLabel}>ресторанов</span>
            </div>
            <p className={styles.sideNote} data-reveal>
              Все объекты — бренды холдинга. Позиции с пометкой «в проекте» —
              фазы коридора Якша—Маньпупунёр.
            </p>
            <figure className={styles.sidePhoto} data-reveal>
              <Image
                src={PHOTOS.syktyvkar.src}
                alt={PHOTOS.syktyvkar.alt}
                fill
                sizes="(max-width: 900px) 100vw, 260px"
                quality={72}
                style={PHOTOS.syktyvkar.pos ? { objectPosition: PHOTOS.syktyvkar.pos } : undefined}
              />
              <figcaption className={styles.sideCaption}>Сыктывкар с высоты</figcaption>
            </figure>
          </aside>

          <div className={styles.groups}>
            <Group data={HOTELS} Icon={MdHotel} />
            <Group data={RESTAURANTS} Icon={IoIosRestaurant} />
          </div>
        </div>
      </div>
    </section>
  );
}
