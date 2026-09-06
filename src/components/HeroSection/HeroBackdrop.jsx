"use client";

import Image from "next/image";
import { PHOTOS } from "@/data/photos";
import styles from "./HeroBackdrop.module.css";

// Сцена hero — «три полосы, три стихии». Снизу вверх:
//   фото тайги (Печоро-Илычский заповедник) — дальний план;
//   три иллюстрации леса — дальний, средний и ближний планы (свой параллакс);
//   полупрозрачный флаг Коми — три полосы тонируют сцену: небо в синь,
//   тайгу в зелень, туман и снег в белизну;
//   сугробы на белой полосе;
//   ночь — тёмная пелена, которую GSAP поднимает по скроллу под карту;
//   небо — звёзды и северное сияние (над ночью: на стадии карты остаются);
//   снегопад — общий слой сайта (components/SiteSnow), он ложится и сюда.
// data-depth — амплитуда параллакса от курсора (px); data-layer — слои,
// которыми управляют таймлайны HeroSection (trees, night, sky, band).
// Звёзды генерируются детерминированно (сидированный PRNG) — одинаковы на
// сервере и клиенте.

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Слои леса — три иллюстрации с прозрачным фоном (материалы заказчика):
// дальний туманный ряд, средний лес с «окном» по центру, ближний тёмный
// ряд, обрамляющий сцену. Каждый — свой план параллакса.
const FOREST = [
  { key: "far",  src: "/photos/forest-far.webp",  depth: 8,  alt: "" },
  { key: "mid",  src: "/photos/forest-mid.webp",  depth: 15, alt: "" },
  { key: "near", src: "/photos/forest-near.webp", depth: 28, alt: "" },
];

// Звёзды: 96 точек, 40 из них мерцают (класс twinkle с разными задержками).
const STARS = (() => {
  const rnd = mulberry32(7);
  return Array.from({ length: 96 }, (_, i) => ({
    cx: +(rnd() * 1440).toFixed(1),
    cy: +(rnd() * 320).toFixed(1),
    r: +(0.5 + rnd() * 1.2).toFixed(2),
    o: +(0.35 + rnd() * 0.6).toFixed(2),
    twinkle: i % 5 < 2,
    delay: +(rnd() * 6).toFixed(2),
  }));
})();

export default function HeroBackdrop({ photo = "taiga-fog" }) {
  const p = PHOTOS[photo];

  return (
    <div className={styles.scene} data-layer="scene" aria-hidden="true">
      {/* Дальний план — фото тайги */}
      <div className={styles.photo} data-depth="7">
        {p && (
          <Image
            src={p.src}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={76}
            placeholder={p.blur ? "blur" : "empty"}
            blurDataURL={p.blur}
            style={p.pos ? { objectPosition: p.pos } : undefined}
          />
        )}
      </div>

      {/* Лес — три плана иллюстраций с прозрачным фоном */}
      {FOREST.map((f) => (
        <div className={`${styles.forest} ${styles[`forest_${f.key}`]}`} data-depth={f.depth} data-layer="trees" key={f.key}>
          <Image src={f.src} alt={f.alt} fill sizes="110vw" quality={78} priority={f.key === "mid"} />
        </div>
      ))}

      {/* Флаг — полупрозрачные полосы поверх сцены */}
      <div className={styles.flag}>
        <span className={`${styles.band} ${styles.bandBlue}`} data-layer="band" />
        <span className={`${styles.band} ${styles.bandGreen}`} data-layer="band" />
        <span className={`${styles.band} ${styles.bandWhite}`} data-layer="band" />
      </div>

      {/* Ночь — поднимается по скроллу под карту */}
      <div className={styles.night} data-layer="night" />

      {/* Небо — звёзды и сияние над всем, включая ночь */}
      <div className={styles.sky} data-depth="4" data-layer="sky">
        <svg className={styles.stars} viewBox="0 0 1440 320" preserveAspectRatio="xMidYMin slice">
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              opacity={s.o}
              className={s.twinkle ? styles.twinkle : undefined}
              style={s.twinkle ? { animationDelay: `${s.delay}s` } : undefined}
            />
          ))}
        </svg>
        <span className={`${styles.aurora} ${styles.aurora1}`} />
        <span className={`${styles.aurora} ${styles.aurora2}`} />
        <span className={`${styles.aurora} ${styles.aurora3}`} />
      </div>

    </div>
  );
}
