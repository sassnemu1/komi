"use client";

import { useEffect, useRef } from "react";
import SectionHead from "@/components/SectionHead/SectionHead";
import useReveal from "@/hooks/useReveal";
import styles from "./TaxiSection.module.css";
import { INFO_DATA } from "@/data/InfoData";

const DATA = INFO_DATA.find((c) => c.id === "10");
const REDUCED_MQ = "(prefers-reduced-motion: reduce)";

// Видео играет, пока секция в кадре, и стоит на паузе вне его (экономит
// батарею). Пауза, которую Chrome ставит при переносе <video> в DOM,
// снимается повторным play(). При prefers-reduced-motion видео не
// запускается вовсе.
function useVideoInView(sectionRef, videoRef) {
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reduced = window.matchMedia(REDUCED_MQ);
    let visible = false;

    const sync = () => {
      if (!video.isConnected) return;
      if (visible && !reduced.matches) video.play().catch(() => {});
      else video.pause();
    };

    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; sync(); },
      { threshold: 0.05 }
    );
    io.observe(section);

    const onPause = () => { if (visible && !reduced.matches) setTimeout(sync, 0); };
    video.addEventListener("pause", onPause);
    reduced.addEventListener("change", sync);

    return () => {
      io.disconnect();
      video.removeEventListener("pause", onPause);
      reduced.removeEventListener("change", sync);
    };
  }, [sectionRef, videoRef]);
}

// Полоса такси: видео-фон без пина, слева — заголовок и CTA, справа —
// два сервиса из портфеля (Taiga Taxi и Flying Taxi «в проекте»).
export default function TaxiSection({ videoSrc = "/video-komi-taxi.mp4" }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  useVideoInView(sectionRef, videoRef);
  useReveal(sectionRef, { stagger: 0.08 });

  if (!DATA) return null;

  return (
    <section id="taxi" ref={sectionRef} className={styles.section}>
      <video
        ref={videoRef}
        className={styles.video}
        src={videoSrc}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <span className={styles.chapter} aria-hidden="true">09</span>

      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.main}>
            <SectionHead
              eyebrow="Такси"
              title={"Такси\nпо республике"}
              lead={DATA.desc}
              className={styles.head}
            />
            <a className={styles.cta} href="#contacts" data-reveal>
              Заказать такси <span aria-hidden="true">→</span>
            </a>
            <span className={styles.ctaSub} data-reveal>Заказ через контакты komi.world</span>
          </div>

          <ul className={styles.services}>
            {DATA.works.map((work, i) => {
              const isProject = work.badge === "В проекте";
              return (
                <li className={styles.service} key={`${DATA.id}-${i}`} data-reveal>
                  <span className={styles.serviceIdx}>{String(i + 1).padStart(2, "0")}</span>
                  <div className={styles.serviceBody}>
                    <h3 className={styles.serviceName}>{work.title}</h3>
                    {work.sub && <span className={styles.serviceSub}>{work.sub}</span>}
                    {work.desc && <p className={styles.serviceDesc}>{work.desc}</p>}
                    {work.badge && (
                      <span className={isProject ? styles.chipProject : styles.chip}>{work.badge}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
