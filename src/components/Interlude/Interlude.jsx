"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import useGSAP from "@/hooks/useGSAP";
import { PHOTOS } from "@/data/photos";
import styles from "./Interlude.module.css";

// Фото-интерлюдия между главами: полноэкранный кадр с лёгким параллаксом
// и короткой подписью. Фото — из data/photos.js (Wikimedia Commons).
export default function Interlude({ photo, eyebrow, title, caption }) {
  const ref = useRef(null);
  const mediaRef = useRef(null);
  const { gsap, ScrollTrigger } = useGSAP();

  useEffect(() => {
    if (!gsap || !ScrollTrigger) return;
    const el = ref.current;
    const media = mediaRef.current;
    if (!el || !media) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        media,
        { yPercent: -9 },
        {
          yPercent: 9,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [gsap, ScrollTrigger]);

  const p = PHOTOS[photo];
  if (!p) return null;

  return (
    <section className={styles.interlude} ref={ref} aria-label={title}>
      <div className={styles.media} ref={mediaRef}>
        <Image src={p.src} alt={p.alt} fill sizes="100vw" quality={74} style={p.pos ? { objectPosition: p.pos } : undefined} />
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.text}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h2 className={styles.title}>{title}</h2>
        {caption && <p className={styles.caption}>{caption}</p>}
      </div>
      <span className={styles.credit}>Фото: {p.author}</span>
    </section>
  );
}
