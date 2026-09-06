"use client";

import { useRef } from "react";
import Image from "next/image";
import { photoBySrc } from "@/data/photos";
import SectionHead from "@/components/SectionHead/SectionHead";
import useReveal from "@/hooks/useReveal";
import useParallax from "@/hooks/useParallax";
import PartnerForm from "./PartnerForm";
import styles from "./StayDineSection.module.css";
import { INFO_DATA } from "@/data/InfoData";

const HOTELS      = INFO_DATA.find((c) => c.id === "04");
const RESTAURANTS = INFO_DATA.find((c) => c.id === "05");

// У пяти ресторанов в источнике нет ничего, кроме названия; общий desc
// «Ресторан холдинга…» уже сказан бейджем — на карточке его не повторяем.
const GENERIC_DESC = /^Ресторан холдинга «Велес И К»\.?$/;

// Открытка объекта: снимок места или визуализация из меморандума холдинга
// (помечена), имя, подзаголовок, чипы. Подпись места — из photos.js.
function Card({ work, index, wide }) {
  const photo = work.image ? photoBySrc(work.image) : null;
  const desc = work.desc && !GENERIC_DESC.test(work.desc.trim()) ? work.desc : null;
  const isProject = work.badge === "В проекте";
  return (
    <li
      className={`${styles.card} ${wide ? styles.cardWide : styles.cardTall} ${isProject ? styles.cardProject : ""}`}
      style={{ "--card-bg": work.thumbBg ?? "transparent" }}
      data-reveal
      data-parallax-scope
    >
      <div className={styles.media} data-parallax={wide ? "6" : "8"}>
        {photo ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={wide ? "(max-width: 640px) 70vw, (max-width: 1100px) 50vw, 33vw" : "(max-width: 640px) 70vw, (max-width: 1100px) 33vw, 20vw"}
            quality={72}
            placeholder={photo.blur ? "blur" : "empty"}
            blurDataURL={photo.blur}
            style={photo.pos ? { objectPosition: photo.pos } : undefined}
          />
        ) : (
          <div className={styles.poster} aria-hidden="true" />
        )}
      </div>
      <div className={styles.wash} aria-hidden="true" />

      <div className={styles.top}>
        <span className={styles.idx}>{String(index + 1).padStart(2, "0")}</span>
        {photo?.render && <span className={styles.render}>Визуализация</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{work.title}</h3>
        {work.sub && <span className={styles.sub}>{work.sub}</span>}
        {desc && <p className={styles.desc}>{desc}</p>}
        <div className={styles.chips}>
          {work.location && <span className={styles.chipLocation}>{work.location}</span>}
          {work.badge && (
            <span className={isProject ? styles.chipProject : styles.chip}>{work.badge}</span>
          )}
        </div>
      </div>

      {photo?.caption && !photo.render && <span className={styles.caption}>{photo.caption}</span>}
    </li>
  );
}

function Group({ data, wide, label }) {
  return (
    <div className={styles.group}>
      <div className={styles.groupHead} data-reveal>
        <h3 className={styles.groupTitle}>
          <span className={styles.groupCount}>{data.works.length}</span> {label}
        </h3>
        {data.desc && <p className={styles.groupLead}>{data.desc}</p>}
      </div>
      <ul className={`${styles.cards} ${wide ? styles.cardsWide : styles.cardsTall}`}>
        {data.works.map((work, i) => (
          <Card work={work} index={i} wide={wide} key={`${data.id}-${i}`} />
        ))}
      </ul>
    </div>
  );
}

// Глава 04: открытки отелей и ресторанов холдинга + приглашение партнёрам.
export default function StayDineSection() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, { stagger: 0.05 });
  useParallax(sectionRef);

  if (!HOTELS || !RESTAURANTS) return null;

  return (
    <section id="stay" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <SectionHead
          num="04"
          eyebrow="Отели и рестораны"
          title={"Где остановиться\nи где поесть"}
          lead="Отели и рестораны холдинга «Велес И К» — от сети гостиниц до ресторана на фуникулёре над тайгой. На открытках — места, где они задуманы, и визуализации из меморандума холдинга."
        />

        <Group data={HOTELS} label="отелей" />
        <Group data={RESTAURANTS} label="ресторанов" wide />

        {/* ── Партнёрство ── */}
        <div className={styles.partner} id="partner" data-reveal>
          <div className={styles.partnerTexture} aria-hidden="true" />
          <div className={styles.partnerText}>
            <span className={styles.partnerEyebrow}>Партнёрство</span>
            <h3 className={styles.partnerTitle}>Стать партнёром komi.world</h3>
            <p className={styles.partnerLead}>
              Мы собираем на одном портале всё, ради чего едут в Коми. Если у вас
              отель, гостевой дом, глэмпинг, ресторан или кафе в республике —
              расскажите о себе. Карточка объекта появится в разделах портала,
              а условия сотрудничества обсудим напрямую.
            </p>
            <ul className={styles.partnerPoints}>
              <li>
                <span className={styles.pointNum}>01</span>
                <span><strong>Карточка на портале</strong> — фото, описание, контакты и ссылка на бронирование в разделах «Отели» и «Рестораны», а дальше — в одноимённых разделах экосистемы komi.world.</span>
              </li>
              <li>
                <span className={styles.pointNum}>02</span>
                <span><strong>Аудитория коридора</strong> — ориентир холдинга по коридору Якша—Маньпупунёр: 70 000+ туристов в год к 2035-му.</span>
              </li>
              <li>
                <span className={styles.pointNum}>03</span>
                <span><strong>Единый бренд</strong> — Komi Wilderness, международный туристический бренд коридора, и общие маршруты республики.</span>
              </li>
            </ul>
            <a className={styles.partnerMail} href="mailto:info@komi.world?subject=%D0%9F%D0%B0%D1%80%D1%82%D0%BD%D1%91%D1%80%D1%81%D1%82%D0%B2%D0%BE%20komi.world">
              info@komi.world
            </a>
          </div>
          <PartnerForm />
        </div>
      </div>
    </section>
  );
}
