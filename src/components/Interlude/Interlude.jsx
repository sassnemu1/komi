"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import useGSAP from "@/hooks/useGSAP";
import { PHOTOS } from "@/data/photos";
import styles from "./Interlude.module.css";

// Фото-интерлюдия между главами: полноэкранный кадр с многослойным
// параллаксом. Пока секция проходит через экран (scrub):
//   фото   — едет медленнее страницы (±SHIFT % своей высоты) и слегка
//            «наезжает» при входе (scale 1.1 → 1);
//   текст  — идёт навстречу (быстрее страницы) и проявляется в первой трети.
//
// depth (0…1) масштабирует амплитуду: 1 — пейзажи, ~0.7 — кадры с людьми,
// где сильный сдвиг кадра режет фигуры.
//
// focus="top" — для кадров, где сюжет у верхней кромки (лица). На телефоне
// узкое окно показывает лишь середину высокого слоя, поэтому там слой
// смещаем вниз (.mediaTop: запас снизу, а не сверху) и ход уменьшаем —
// в кадре остаётся верх снимка; глубину добирают наезд и движение текста.
const SHIFT = 15;       // % высоты слоя; слой выше секции на 2 × 26 %
const ZOOM = 0.1;
const TEXT_IN = 90;     // px — откуда приходит текст
const TEXT_OUT = -70;   // px — куда уходит
const TOP_SHIFT = 3.5;  // % высоты слоя .mediaTop (запас сверху 6 % секции)
const TOP_ZOOM = 0.06;

export default function Interlude({ photo, eyebrow, title, caption, depth = 1, focus = "center" }) {
  const ref = useRef(null);
  const mediaRef = useRef(null);
  const textRef = useRef(null);
  const { gsap, ScrollTrigger } = useGSAP();

  useEffect(() => {
    if (!gsap || !ScrollTrigger) return;
    const el = ref.current;
    const media = mediaRef.current;
    const text = textRef.current;
    if (!el || !media) return;

    // gsap.matchMedia пересоздаёт анимацию при смене брейкпоинта и
    // сам убирает её при prefers-reduced-motion.
    const mm = gsap.matchMedia();
    mm.add(
      {
        narrow: "(max-width: 767px)",
        wide: "(min-width: 768px)",
        reduce: "(prefers-reduced-motion: reduce)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { narrow, reduce } = ctx.conditions;
        if (reduce) return;

        const topFocus = narrow && focus === "top";
        const shift = (topFocus ? TOP_SHIFT : SHIFT) * depth;
        const zoom = (topFocus ? TOP_ZOOM : ZOOM) * depth;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });

        tl.fromTo(
          media,
          { yPercent: -shift, scale: 1 + zoom },
          { yPercent: shift, scale: 1, duration: 1 },
          0
        );

        if (text) {
          tl.fromTo(text, { y: TEXT_IN * depth }, { y: TEXT_OUT * depth, duration: 1 }, 0)
            .fromTo(text, { opacity: 0 }, { opacity: 1, duration: 0.22 }, 0.14);
        }
      },
      el
    );

    return () => mm.revert();
  }, [gsap, ScrollTrigger, depth, focus]);

  const p = PHOTOS[photo];
  if (!p) return null;

  return (
    <section className={styles.interlude} ref={ref} aria-label={title}>
      <div
        className={`${styles.media} ${focus === "top" ? styles.mediaTop : ""}`}
        ref={mediaRef}
      >
        <Image
          src={p.src}
          alt={p.alt}
          fill
          sizes="100vw"
          quality={74}
          placeholder={p.blur ? "blur" : "empty"}
          blurDataURL={p.blur}
          style={p.pos ? { objectPosition: p.pos } : undefined}
        />
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.text} ref={textRef}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h2 className={styles.title}>{title}</h2>
        {caption && <p className={styles.caption}>{caption}</p>}
      </div>
      <span className={styles.credit}>Фото: {p.author}</span>
    </section>
  );
}
