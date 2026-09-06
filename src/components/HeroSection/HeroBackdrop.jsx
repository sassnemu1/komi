"use client";

import Image from "next/image";
import { PHOTOS } from "@/data/photos";
import styles from "./HeroBackdrop.module.css";

// Сцена hero — «три полосы, три стихии». Снизу вверх:
//   фото тайги (Печоро-Илычский заповедник) — дальний план;
//   три ряда силуэтов елей — средние и ближний планы (свой параллакс у каждого);
//   кромка снега у подножия леса;
//   полупрозрачный флаг Коми — три полосы тонируют сцену: небо в синь,
//   тайгу в зелень, туман и снег в белизну;
//   сугробы на белой полосе;
//   ночь — тёмная пелена, которую GSAP поднимает по скроллу под карту;
//   небо — звёзды и северное сияние (над ночью: на стадии карты остаются);
//   снегопад — общий слой сайта (components/SiteSnow), он ложится и сюда.
// data-depth — амплитуда параллакса от курсора (px); data-layer — слои,
// которыми управляют таймлайны HeroSection (trees, night, sky, band).
// Силуэты и звёзды генерируются детерминированно (сидированный PRNG) —
// одинаковы на сервере и клиенте.

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

// Ель: голый ствол снизу, затем ярусы-«лапы» слева и справа — каждый
// ярус чуть уже предыдущего, вырез между ярусами неглубокий, макушка
// острая. Основание — y=base; лёгкая асимметрия от rnd, чтобы ряд не
// выглядел штампованным.
function spruce(x, base, h, w, rnd) {
  const tiers = 5 + Math.floor(h / 55);
  const trunk = h * 0.1;               // голый ствол
  const crown = h - trunk;
  const left = [];
  const right = [];
  for (let i = 0; i < tiers; i++) {
    const f = i / tiers;
    const yBottom = base - trunk - crown * f;
    const yTop = base - trunk - crown * (f + 0.7 / tiers);
    const half = (w / 2) * (1 - f * 0.82) * (0.92 + rnd() * 0.16);
    left.push(`${(x - half).toFixed(1)},${yBottom.toFixed(1)}`, `${(x - half * 0.58).toFixed(1)},${yTop.toFixed(1)}`);
    right.unshift(`${(x + half).toFixed(1)},${yBottom.toFixed(1)}`, `${(x + half * 0.58).toFixed(1)},${yTop.toFixed(1)}`);
  }
  const t = Math.max(1.2, w * 0.045);  // полуширина ствола
  return `M${(x - t).toFixed(1)},${base} L${(x - t).toFixed(1)},${(base - trunk).toFixed(1)} L${left.join(" ")} L${x},${(base - h).toFixed(1)} L${right.join(" ")} L${(x + t).toFixed(1)},${(base - trunk).toFixed(1)} L${(x + t).toFixed(1)},${base} Z`;
}

// Ряд леса шириной 1440 (viewBox 1440×400, основание y=400).
function treeline(seed, count, hMin, hMax, wMin, wMax) {
  const rnd = mulberry32(seed);
  const step = 1440 / count;
  let d = "";
  for (let i = 0; i < count; i++) {
    const x = i * step + rnd() * step;
    const h = hMin + rnd() * (hMax - hMin);
    const w = wMin + rnd() * (wMax - wMin);
    d += spruce(x, 400, h, w, rnd) + " ";
  }
  return d.trim();
}

const TREES_FAR  = treeline(11, 84, 46, 124, 16, 30);
const TREES_MID  = treeline(23, 52, 90, 196, 24, 46);
const TREES_NEAR = treeline(37, 32, 150, 270, 38, 68);

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

// Северный олень: силуэт из примитивов (тело, шея, голова, рога, ноги) —
// на снежной кромке читается как стадо, деталей на 40 px не нужно.
function Reindeer({ x, scale = 1, flip = false }) {
  return (
    <g transform={`translate(${x} 0) scale(${flip ? -scale : scale} ${scale}) ${flip ? "translate(-120 0)" : ""}`} fill="currentColor" stroke="currentColor">
      <ellipse cx="55" cy="44" rx="26" ry="13" stroke="none" />
      <polygon points="74,36 84,18 93,21 84,42" stroke="none" />
      <ellipse cx="93" cy="19" rx="9" ry="5.5" transform="rotate(-14 93 19)" stroke="none" />
      <circle cx="102" cy="22" r="3" stroke="none" />
      <path d="M90 14 L86 3 M86 3 L79 1 M88 8 L82 5 M95 14 L99 2 M99 2 L106 1 M97 8 L103 6" fill="none" strokeWidth="1.8" strokeLinecap="round" />
      <polygon points="30,37 24,34 27,41" stroke="none" />
      <polygon points="36,52 39,52 37,78 33,78" stroke="none" />
      <polygon points="42,53 45,53 47,78 43,78" stroke="none" />
      <polygon points="68,53 71,53 74,78 70,78" stroke="none" />
      <polygon points="74,52 77,52 81,78 77,78" stroke="none" />
    </g>
  );
}

const HERD = [
  { x: 0, scale: 0.85 },
  { x: 120, scale: 1 },
  { x: 250, scale: 0.7, flip: true },
  { x: 330, scale: 0.95 },
  { x: 470, scale: 0.8 },
];

// Снежинка для углов рамки: шесть лучей с веточками
function Snowflake({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      {[0, 60, 120].map((a) => (
        <g key={a} transform={`rotate(${a} 32 32)`}>
          <path d="M32 4v56M32 12l-5-5M32 12l5-5M32 52l-5 5M32 52l5 5M32 22l-4-4M32 22l4-4M32 42l-4 4M32 42l4 4" />
        </g>
      ))}
    </svg>
  );
}

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

      {/* Лес — три плана силуэтов */}
      <svg className={`${styles.trees} ${styles.treesFar}`} data-depth="11" data-layer="trees" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice">
        <path d={TREES_FAR} />
      </svg>
      <svg className={`${styles.trees} ${styles.treesMid}`} data-depth="17" data-layer="trees" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice">
        <path d={TREES_MID} />
      </svg>
      <svg className={`${styles.trees} ${styles.treesNear}`} data-depth="26" data-layer="trees" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice">
        <path d={TREES_NEAR} />
      </svg>

      {/* Флаг — полупрозрачные полосы поверх сцены */}
      <div className={styles.flag}>
        <span className={`${styles.band} ${styles.bandBlue}`} data-layer="band" />
        <span className={`${styles.band} ${styles.bandGreen}`} data-layer="band" />
        <span className={`${styles.band} ${styles.bandWhite}`} data-layer="band" />
      </div>

      {/* Кромка снега у подножия леса и сугробы на белой полосе */}
      <svg className={styles.ground} data-depth="30" data-layer="trees" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,58 C120,34 230,78 360,56 C480,36 560,74 700,52 C830,32 930,70 1060,50 C1180,32 1290,64 1440,44 L1440,120 L0,120 Z" />
      </svg>
      <svg className={styles.drifts} viewBox="0 0 1440 300" preserveAspectRatio="none">
        <path className={styles.driftShade} d="M0,150 C200,120 320,190 520,160 C700,132 820,196 1010,164 C1180,136 1300,182 1440,150 L1440,300 L0,300 Z" />
        <path className={styles.driftLight} d="M0,190 C160,160 300,226 480,196 C660,166 800,230 980,198 C1150,168 1290,224 1440,190 L1440,300 L0,300 Z" />
        <path className={styles.driftLight} d="M0,250 C220,226 380,272 560,246 C740,220 900,268 1100,242 C1260,222 1360,254 1440,240 L1440,300 L0,300 Z" />
      </svg>

      {/* Стадо оленей на снежной кромке и сугроб на переднем плане */}
      <svg className={styles.herd} data-depth="22" data-layer="trees" viewBox="0 0 600 80" preserveAspectRatio="xMidYMax meet">
        {HERD.map((d, i) => <Reindeer key={i} {...d} />)}
      </svg>
      <svg className={styles.bank} data-depth="34" data-layer="trees" viewBox="0 0 1440 160" preserveAspectRatio="none">
        <path d="M0,90 C180,50 320,120 520,84 C700,52 860,118 1040,86 C1220,56 1340,96 1440,74 L1440,160 L0,160 Z" />
      </svg>

      {/* Виньетка — темнее по краям, сцена глубже */}
      <div className={styles.vignette} />

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
        <span className={styles.moon} />
        <span className={`${styles.wind} ${styles.wind1}`} />
        <span className={`${styles.wind} ${styles.wind2}`} />
        <span className={`${styles.wind} ${styles.wind3}`} />
      </div>

      {/* Иней в углах рамки */}
      <Snowflake className={`${styles.frost} ${styles.frostTL}`} />
      <Snowflake className={`${styles.frost} ${styles.frostTR}`} />
      <div className={`${styles.frostGlow} ${styles.frostBL}`} />
      <div className={`${styles.frostGlow} ${styles.frostBR}`} />

    </div>
  );
}
