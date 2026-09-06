"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionHead from "@/components/SectionHead/SectionHead";
import useGSAP from "@/hooks/useGSAP";
import useReveal from "@/hooks/useReveal";
import useParallax from "@/hooks/useParallax";
import { photoBySrc } from "@/data/photos";
import { INFO_DATA } from "@/data/InfoData";
import styles from "./MadeInKomiSection.module.css";

// Глава 07 · Сделано в Коми — витрина на двух полках. Каждая полка — доска,
// на которой стоят предметы: напитки завода «Велес» — вырезки бутылок и банок
// на прозрачном фоне (с сайта завода), остальное — открытки-визуализации из
// презентаций холдинга (помечены), в паспарту и с лёгким наклоном. Под каждым
// предметом на доске — табличка с названием; клик открывает ящик досье под
// полкой (на узких экранах — сразу под предметом). Факты — InfoData 08.
// Арктическая техника YÖRAN живёт в главе «Транспорт», здесь её нет.

const DATA = INFO_DATA.find((c) => c.id === "08");
const TILTS = [-1.6, 1.1, -0.9, 1.4, -1.2, 0.8, -1.5];

const initialOf = (name = "") => name.replace(/^[«"'\s]+/, "").charAt(0);
const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── Предмет на полке + табличка ─────────────────────────────────────
// Подпись таблички: категория + цифра, без повторов («Мебель · Мебель»)
function labelMeta(work) {
  const head = (work.sub || "").split(" · ")[0];
  const tail = work.year && work.year.toLowerCase() !== head.toLowerCase() ? work.year : work.location;
  return tail && tail.toLowerCase() !== head.toLowerCase() ? `${head} · ${tail}` : head;
}

function Tile({ work, index, active, onToggle }) {
  const photo = work.image ? photoBySrc(work.tileImage || work.image) : null;
  const tilt = TILTS[index % TILTS.length];
  return (
    <button
      type="button"
      className={`${styles.tile} ${work.cutout ? styles.tileStand : styles.tileFrame} ${work.light ? styles.tileLight : ""} ${active ? styles.tileActive : ""}`}
      aria-expanded={active}
      aria-controls="madein-drawer"
      aria-label={`${active ? "Закрыть" : "Открыть"} досье: ${work.title}`}
      onClick={onToggle}
      data-parallax-scope
      data-reveal
    >
      <span className={styles.object} style={{ "--tilt": `${tilt}deg` }}>
        {work.cutout && photo && (
          <span className={styles.stand}>
            <span className={styles.product}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 900px) 46vw, 360px" quality={76} className={styles.contain} />
            </span>
            <span className={styles.contact} aria-hidden="true" />
          </span>
        )}
        {!work.cutout && photo && (
          <span className={styles.frame}>
            <span className={styles.frameMedia} data-parallax="4">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 900px) 46vw, 300px"
                quality={72}
                placeholder={photo.blur ? "blur" : "empty"}
                blurDataURL={photo.blur}
                style={{ objectPosition: work.tilePos || photo.pos || "center" }}
              />
            </span>
            {photo.render && <span className={styles.render}>Визуализация</span>}
            <span className={styles.frameShadow} aria-hidden="true" />
          </span>
        )}
      </span>

      <span className={styles.label}>
        <span className={styles.labelText}>
          <span className={styles.labelName}>{work.title}</span>
          <span className={styles.labelMeta}>{labelMeta(work)}</span>
        </span>
        <span className={styles.plus} aria-hidden="true">+</span>
      </span>
    </button>
  );
}

// ── Досье ───────────────────────────────────────────────────────────
function Dossier({ work, index }) {
  const facts = work.facts ?? [];
  return (
    <div className={styles.dossier}>
      <div className={styles.dossierHead}>
        <span className={styles.dossierIdx}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.dossierCat}>{work.sub}</span>
      </div>
      <h3 className={styles.dossierName} id="madein-drawer-title">{work.title}</h3>
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
        <span className={styles.dossierLinks}>
          {work.href && (
            <a className={styles.dossierLink} href={work.href} target="_blank" rel="noopener noreferrer">
              Читать на карте преданий <span aria-hidden="true">↗</span>
            </a>
          )}
          {work.site && (
            <a className={styles.dossierLink} href={work.site.href} target="_blank" rel="noopener noreferrer">
              {work.site.label} <span aria-hidden="true">↗</span>
            </a>
          )}
        </span>
      </div>
    </div>
  );
}

// ── Ящик под полкой ─────────────────────────────────────────────────
function Drawer({ work, index, onClose, narrow, gsap, ScrollTrigger }) {
  const ref = useRef(null);
  const photo = work.image ? photoBySrc(work.image) : null;
  const extraPhoto = work.extra ? photoBySrc(work.extra.image) : null;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!gsap || prefersReduced()) { ScrollTrigger?.refresh(); return; }
    const tl = gsap.timeline({
      onComplete: () => {
        el.style.height = "auto";
        ScrollTrigger?.refresh();
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        if (r.bottom > vh) {
          const delta = Math.min(r.bottom - vh + 24, Math.max(0, r.top - 96));
          if (delta > 0) {
            const top = window.scrollY + delta;
            if (window.__lenis) window.__lenis.scrollTo(top, { duration: 0.9 });
            else window.scrollTo({ top, behavior: "smooth" });
          }
        }
      },
    });
    tl.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.55, ease: "power3.out" });
    tl.fromTo(el.querySelectorAll("[data-drawer-row]"), { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.03, ease: "power3.out" }, 0.15);
    return () => { tl.kill(); ScrollTrigger?.refresh(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [work.title, gsap]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className={`${styles.drawer} ${narrow ? styles.drawerInline : ""}`}
      id="madein-drawer"
      role="region"
      aria-labelledby="madein-drawer-title"
      ref={ref}
      style={{ "--brand-bg": work.thumbBg ?? "transparent" }}
    >
      <div className={styles.drawerWash} aria-hidden="true" />
      <span className={styles.dossierLetter} aria-hidden="true">{initialOf(work.title)}</span>
      <div className={styles.dossierOrnament} aria-hidden="true" />
      <button type="button" className={styles.close} onClick={onClose}>Закрыть <span aria-hidden="true">×</span></button>

      <div className={styles.drawerGrid}>
        <div className={styles.stageCol} data-drawer-row>
          {work.cutout && photo ? (
            <div className={styles.stageStand}>
              <div className={styles.stageProduct}>
                <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 900px) 92vw, 480px" quality={76} className={styles.contain} />
              </div>
              <div className={styles.stageReflect} aria-hidden="true">
                <Image src={photo.src} alt="" fill sizes="(max-width: 900px) 92vw, 480px" quality={72} className={styles.contain} />
              </div>
              <span className={styles.stageLine} aria-hidden="true" />
              <span className={styles.stageCaption}>{photo.caption}</span>
            </div>
          ) : photo && (
            <div className={`${styles.stagePostcard} ${work.title === "Ёр Лайна" ? styles.stageTall : ""}`}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 900px) 92vw, 480px" quality={76} placeholder={photo.blur ? "blur" : "empty"} blurDataURL={photo.blur} style={{ objectPosition: photo.pos || "center" }} />
              {photo.render ? (
                <span className={`${styles.render} ${styles.onStage}`}>Визуализация</span>
              ) : (
                photo.caption && <span className={styles.stageCaptionTop}>{photo.caption}</span>
              )}
            </div>
          )}

          {work.extra && extraPhoto && (
            <div className={styles.extra} data-drawer-row>
              <span className={styles.extraImg}>
                <Image src={extraPhoto.src} alt={extraPhoto.alt} width={120} height={150} sizes="120px" quality={72} placeholder="blur" blurDataURL={extraPhoto.blur} />
              </span>
              <div>
                <span className={styles.extraEyebrow}>{work.extra.eyebrow}</span>
                <p className={styles.extraText}>{work.extra.text}</p>
              </div>
            </div>
          )}

          {work.maker && (
            <p className={styles.maker} data-drawer-row>
              Завод «Велес», Химки · линия стекла 0,45 л, баночная линия, кеги.{" "}
              <a href="https://veles-site-kiselev.vercel.app/zavod.html" target="_blank" rel="noopener noreferrer">Сайт завода ↗</a>
            </p>
          )}
        </div>

        <div data-drawer-row>
          <Dossier work={work} index={index} />
        </div>
      </div>
    </div>
  );
}

// ── Полоса завода ───────────────────────────────────────────────────
function FactoryBand({ factory }) {
  const p = photoBySrc(factory.image);
  return (
    <div className={styles.band} data-reveal data-parallax-scope>
      <div className={styles.bandMedia} data-parallax="8">
        {p && <Image src={p.src} alt={p.alt} fill sizes="(max-width: 900px) 100vw, 1144px" quality={72} placeholder={p.blur ? "blur" : "empty"} blurDataURL={p.blur} style={{ objectPosition: "center 55%" }} />}
      </div>
      <div className={styles.bandWash} aria-hidden="true" />
      {p?.caption && <span className={styles.stageCaptionTop}>{p.caption}</span>}
      <div className={styles.bandText}>
        <span className={styles.bandEyebrow}>{factory.eyebrow}</span>
        <h3 className={styles.bandTitle}>{factory.title}</h3>
        <p className={styles.bandLine}>{factory.line}</p>
        <a className={styles.dossierLink} href={factory.site.href} target="_blank" rel="noopener noreferrer">
          {factory.site.label} <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className={styles.bandStats}>
        {factory.stats.map((s) => (
          <div className={styles.bandStat} key={s.label}>
            <span className={styles.bandValue}>{s.value}</span>
            <span className={styles.bandLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Секция ──────────────────────────────────────────────────────────
export default function MadeInKomiSection() {
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const shelf0Ref = useRef(null);
  const shelf1Ref = useRef(null);
  const ledgerRef = useRef(null);
  const shelfRefs = [shelf0Ref, shelf1Ref];
  const [active, setActive] = useState(null);
  const [narrow, setNarrow] = useState(false);
  const [live, setLive] = useState("");
  const { gsap, ScrollTrigger } = useGSAP();

  useReveal(headRef, { stagger: 0.06, start: "top 80%" });
  useReveal(shelf0Ref, { stagger: 0.08, start: "top 80%" });
  useReveal(shelf1Ref, { stagger: 0.08, start: "top 80%" });
  useReveal(ledgerRef, { stagger: 0.06, start: "top 85%" });
  useParallax(sectionRef);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const compute = () => { setNarrow(mq.matches); setActive(null); };
    compute();
    mq.addEventListener("change", compute);
    return () => mq.removeEventListener("change", compute);
  }, []);

  const toggle = useCallback((i) => {
    setActive((cur) => {
      const next = cur === i ? null : i;
      setLive(next === null ? "Досье закрыто" : `Досье: ${DATA.works[next].title}`);
      return next;
    });
  }, []);

  const close = useCallback(() => { setActive(null); setLive("Досье закрыто"); }, []);

  if (!DATA) return null;
  const works = DATA.works;
  const shelfOf = (i) => DATA.shelves.findIndex((s) => s.includes(i));

  const drawer = active !== null && (
    <Drawer work={works[active]} index={active} onClose={close} narrow={narrow} gsap={gsap} ScrollTrigger={ScrollTrigger} />
  );

  return (
    <section id="made-in-komi" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <div ref={headRef}>
          <SectionHead num="07" eyebrow="Сделано в Коми" title={"Сделано\nв Коми"} lead={DATA.desc} />
        </div>

        <div className={styles.shelves} data-parallax-scope>
          <div className={styles.wall} data-parallax="5" aria-hidden="true" />

          {DATA.shelves.map((shelf, si) => (
            <div className={styles.shelf} key={si} ref={shelfRefs[si]}>
              <span className={styles.shelfLabel} data-reveal>{DATA.shelfLabels[si]}</span>
              <ul className={`${styles.row} ${styles[`row${si + 1}`]}`}>
                {shelf.flatMap((wi) => {
                  const items = [
                    <li key={works[wi].title} className={styles.cell}>
                      <Tile work={works[wi]} index={wi} active={active === wi} onToggle={() => toggle(wi)} />
                    </li>,
                  ];
                  if (narrow && active === wi) items.push(<li key="drawer" className={styles.inlineDrawer}>{drawer}</li>);
                  return items;
                })}
              </ul>
              <div className={styles.plankShadow} aria-hidden="true" />
              {!narrow && active !== null && shelfOf(active) === si && drawer}
              {si === 0 && DATA.factory && <FactoryBand factory={DATA.factory} />}
            </div>
          ))}
        </div>

        <div ref={ledgerRef}>
          {DATA.stats?.length > 0 && (
            <dl className={styles.stats}>
              {DATA.stats.map((s) => (
                <div className={styles.stat} key={s.label} data-reveal>
                  <dt className={styles.statLabel}>{s.label}</dt>
                  <dd className={styles.statValue}>{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {DATA.showLegal && DATA.legal && <p className={styles.legal} data-reveal>{DATA.legal}</p>}
        </div>

        <span className={styles.srOnly} aria-live="polite">{live}</span>
      </div>
    </section>
  );
}
