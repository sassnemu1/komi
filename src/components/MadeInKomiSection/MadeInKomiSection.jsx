"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionHead from "@/components/SectionHead/SectionHead";
import useGSAP from "@/hooks/useGSAP";
import useReveal from "@/hooks/useReveal";
import useParallax from "@/hooks/useParallax";
import { photoBySrc, PHOTOS } from "@/data/photos";
import { INFO_DATA } from "@/data/InfoData";
import { MACHINES, loreUrl } from "@/data/yoranLineup";
import styles from "./MadeInKomiSection.module.css";

// Глава 07 · Сделано в Коми — витрина: восемь брендов холдинга стоят на трёх
// полках. Напитки завода «Велес» — вырезки бутылок и банок на прозрачном
// фоне (с сайта завода), остальное — открытки-визуализации из презентаций
// холдинга (помечены). Клик по бренду открывает «ящик» досье под полкой
// (на узких экранах — сразу под плиткой). Полка III — YÖRAN с рельсом семи
// машин: наведение подменяет картинку, клик открывает досье на этой ступени.
// Все факты — InfoData 08 (README холдинга + сайты завода и YÖRAN).

const DATA = INFO_DATA.find((c) => c.id === "08");
const STEP_DEFAULT = 2; // III Йиркап

const initialOf = (name = "") => name.replace(/^[«"'\s]+/, "").charAt(0);
const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── Кроссфейд двух слоёв: prev гаснет, cur проявляется ───────────────
function Crossfade({ photo, pos, sizes, quality = 76, className }) {
  const [layers, setLayers] = useState({ cur: photo, prev: null });
  // Новое фото пришло пропом — переводим текущий слой в «уходящий» прямо в
  // рендере (паттерн «состояние из предыдущего рендера»), а гасим его таймером.
  if (photo && layers.cur?.src !== photo.src) {
    setLayers({ cur: photo, prev: layers.cur });
  }
  useEffect(() => {
    if (!layers.prev) return;
    const t = setTimeout(() => setLayers((l) => (l.prev ? { ...l, prev: null } : l)), 480);
    return () => clearTimeout(t);
  }, [layers.prev]);
  const render = (p, isPrev) => p && (
    <div className={`${styles.xfLayer} ${isPrev ? styles.xfPrev : styles.xfCur}`} key={(isPrev ? "p" : "c") + p.src}>
      <Image
        src={p.src}
        alt={isPrev ? "" : p.alt}
        fill
        sizes={sizes}
        quality={quality}
        placeholder={p.blur ? "blur" : "empty"}
        blurDataURL={p.blur}
        style={{ objectPosition: pos || p.pos || "center" }}
      />
    </div>
  );
  return (
    <div className={`${styles.xf} ${className || ""}`}>
      {render(layers.prev, true)}
      {render(layers.cur, false)}
    </div>
  );
}

// ── Плитка бренда ───────────────────────────────────────────────────
function Tile({ work, active, onToggle, preview }) {
  const photo = work.image ? photoBySrc(work.image) : null;
  const isYoran = work.title === "YÖRAN";
  const frame = !work.cutout;
  const shown = isYoran && preview ? preview : photo;
  return (
    <button
      type="button"
      className={`${styles.tile} ${work.cutout ? styles.tileStand : styles.tileFrame} ${isYoran ? styles.tileYoran : ""} ${active ? styles.tileActive : ""}`}
      aria-expanded={active}
      aria-controls="madein-drawer"
      aria-label={`${active ? "Закрыть" : "Открыть"} досье: ${work.title}`}
      onClick={onToggle}
      data-parallax-scope
      data-reveal
    >
      <span className={styles.tileTop}>
        <span className={styles.tileEyebrow}>{work.sub}</span>
        {photo?.render && <span className={`${styles.render} ${work.title === "L'ESSENCE" ? styles.renderDark : ""}`}>Визуализация</span>}
      </span>
      <span className={styles.tileHead}>
        <span className={styles.tileName}>{work.title}</span>
        {work.year && <span className={styles.tileMeta}>{work.year}</span>}
      </span>
      <span className={styles.plus} aria-hidden="true">+</span>

      {work.cutout && photo && (
        <span className={styles.stand}>
          <span className={styles.product}>
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 900px) 92vw, 440px" quality={76} className={styles.contain} />
          </span>
          <span className={styles.reflect} aria-hidden="true">
            <Image src={photo.src} alt="" fill sizes="(max-width: 900px) 92vw, 440px" quality={72} className={styles.contain} />
          </span>
          <span className={styles.contact} aria-hidden="true" />
        </span>
      )}

      {frame && shown && (
        <span className={`${styles.frame} ${isYoran ? styles.frameWide : ""}`}>
          {isYoran ? (
            <Crossfade photo={shown} sizes="(max-width: 900px) 92vw, 480px" />
          ) : (
            <span className={styles.frameMedia} data-parallax="4">
              <Image
                src={shown.src}
                alt={shown.alt}
                fill
                sizes="(max-width: 900px) 46vw, 300px"
                quality={72}
                placeholder={shown.blur ? "blur" : "empty"}
                blurDataURL={shown.blur}
                style={{ objectPosition: work.tilePos || shown.pos || "center" }}
              />
            </span>
          )}
        </span>
      )}
    </button>
  );
}

// ── Рельс семи машин (полка III) ────────────────────────────────────
function Rail({ onPreview, onPick, note, title }) {
  return (
    <div className={styles.railTile} data-reveal>
      <div className={styles.railHead}>
        <span className={styles.tileEyebrow}>{title}</span>
        <span className={styles.render}>Визуализации · YÖRAN</span>
      </div>
      <ol className={styles.railGrid}>
        {MACHINES.map((m, i) => {
          const p = PHOTOS[m.photo];
          return (
            <li key={m.step}>
              <button
                type="button"
                className={styles.railStep}
                aria-label={`${m.name} — ${m.type.toLowerCase()}, ${m.year}, план`}
                onMouseEnter={() => onPreview(i)}
                onFocus={() => onPreview(i)}
                onMouseLeave={() => onPreview(null)}
                onBlur={() => onPreview(null)}
                onClick={() => onPick(i)}
              >
                <span className={styles.railRoman}>{m.roman}</span>
                <span className={styles.railThumb}>
                  <Image src={p.src} alt="" fill sizes="(max-width: 900px) 132px, 150px" quality={72} style={{ objectPosition: p.pos || "center" }} />
                </span>
                <span className={styles.railName}>{m.name}</span>
                <span className={styles.railYear}>{m.year} · план</span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className={styles.railNote}>{note}</p>
    </div>
  );
}

// ── Досье (правая часть ящика) ──────────────────────────────────────
function Dossier({ work, index, step, onStep, onPreview }) {
  const facts = work.facts ?? [];
  const isYoran = work.title === "YÖRAN";
  return (
    <div className={styles.dossier}>
      <div className={styles.dossierHead}>
        <span className={styles.dossierIdx}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.dossierCat}>{work.sub}</span>
      </div>
      <h3 className={styles.dossierName} id="madein-drawer-title">{work.title}</h3>
      {work.desc && <p className={styles.dossierDesc}>{work.desc}</p>}

      {isYoran && (
        <div className={styles.lineup}>
          <span className={styles.lineupTitle}>{work.lineupTitle}</span>
          <ol className={styles.steps}>
            {MACHINES.map((m, i) => {
              const p = PHOTOS[m.photo];
              return (
                <li key={m.step}>
                  <button
                    type="button"
                    className={`${styles.step} ${i === step ? styles.stepActive : ""}`}
                    aria-pressed={i === step}
                    aria-label={`${m.name} — ${m.type.toLowerCase()}, ${m.year}, план`}
                    onMouseEnter={() => onPreview(i)}
                    onMouseLeave={() => onPreview(null)}
                    onFocus={() => onPreview(i)}
                    onBlur={() => onPreview(null)}
                    onClick={() => onStep(i)}
                  >
                    <span className={styles.stepNum}>{m.roman}</span>
                    <span className={styles.stepThumb}>
                      <Image src={p.src} alt="" fill sizes="96px" quality={72} style={{ objectPosition: p.pos || "center" }} />
                    </span>
                    <span className={styles.stepText}>
                      <span className={styles.stepName}>{m.name}</span>
                      <span className={styles.stepType}>{m.type}</span>
                    </span>
                    <span className={styles.stepYear}>{m.year} · план</span>
                  </button>
                </li>
              );
            })}
          </ol>
          {MACHINES[step]?.lore && (
            <p className={styles.lineupLore}>
              {MACHINES[step].lore.gloss}{" "}
              <a href={loreUrl(MACHINES[step])} target="_blank" rel="noopener noreferrer">Читать на карте преданий ↗</a>
            </p>
          )}
        </div>
      )}

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
function Drawer({ work, index, step, preview, onStep, onPreview, onClose, narrow, gsap, ScrollTrigger }) {
  const ref = useRef(null);
  const photo = work.image ? photoBySrc(work.image) : null;
  const isYoran = work.title === "YÖRAN";
  const stagePhoto = isYoran ? PHOTOS[MACHINES[preview ?? step].photo] : photo;
  const extraPhoto = work.extra ? photoBySrc(work.extra.image) : null;

  // Открытие: высота 0 → auto, потом refresh ScrollTrigger и подтягиваем в кадр
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!gsap || prefersReduced()) { ScrollTrigger?.refresh(); return; }
    const tl = gsap.timeline({
      onComplete: () => {
        el.style.height = "auto";
        ScrollTrigger?.refresh();
        const r = el.getBoundingClientRect();
        const headerH = 72;
        const vh = window.innerHeight;
        if (r.bottom > vh) {
          const delta = Math.min(r.bottom - vh + 24, Math.max(0, r.top - headerH - 24));
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
          ) : (
            <div className={`${styles.stagePostcard} ${isYoran ? styles.stageWide : work.title === "Ёр Лайна" ? styles.stageTall : ""}`}>
              <Crossfade photo={stagePhoto} sizes="(max-width: 900px) 92vw, 480px" />
              {stagePhoto?.render ? (
                <span className={`${styles.render} ${styles.onStage}`}>Визуализация</span>
              ) : (
                stagePhoto?.caption && <span className={styles.stageCaptionTop}>{stagePhoto.caption}</span>
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
          <Dossier work={work} index={index} step={step} onStep={onStep} onPreview={onPreview} />
        </div>
      </div>
    </div>
  );
}

// ── Полоса завода под полкой I ──────────────────────────────────────
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
  const shelf2Ref = useRef(null);
  const ledgerRef = useRef(null);
  const shelfRefs = [shelf0Ref, shelf1Ref, shelf2Ref];
  const [active, setActive] = useState(null);      // индекс бренда
  const [step, setStep] = useState(STEP_DEFAULT);   // ступень YÖRAN
  const [preview, setPreview] = useState(null);     // наведение на рельс/ступень
  const [narrow, setNarrow] = useState(false);
  const [live, setLive] = useState("");
  const { gsap, ScrollTrigger } = useGSAP();

  useReveal(headRef, { stagger: 0.06, start: "top 80%" });
  useReveal(shelf0Ref, { stagger: 0.06, start: "top 80%" });
  useReveal(shelf1Ref, { stagger: 0.06, start: "top 80%" });
  useReveal(shelf2Ref, { stagger: 0.06, start: "top 80%" });
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

  const close = useCallback(() => {
    setActive(null);
    setLive("Досье закрыто");
  }, []);

  const pickStep = useCallback((i) => {
    setStep(i);
    const yi = DATA.works.findIndex((w) => w.title === "YÖRAN");
    setActive(yi);
    setLive("Досье: YÖRAN");
  }, []);

  if (!DATA) return null;
  const works = DATA.works;
  const yoranIdx = works.findIndex((w) => w.title === "YÖRAN");
  const previewPhoto = preview !== null ? PHOTOS[MACHINES[preview].photo] : (active === yoranIdx ? PHOTOS[MACHINES[step].photo] : null);
  const shelfOf = (i) => DATA.shelves.findIndex((s) => s.includes(i));

  const drawer = active !== null && (
    <Drawer
      work={works[active]}
      index={active}
      step={step}
      preview={preview}
      onStep={setStep}
      onPreview={setPreview}
      onClose={close}
      narrow={narrow}
      gsap={gsap}
      ScrollTrigger={ScrollTrigger}
    />
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
                    <li key={works[wi].title} className={styles.cell} style={{ "--brand-bg": works[wi].thumbBg ?? "transparent" }}>
                      <Tile
                        work={works[wi]}
                        active={active === wi}
                        onToggle={() => toggle(wi)}
                        preview={works[wi].title === "YÖRAN" ? previewPhoto : null}
                      />
                    </li>,
                  ];
                  // На узких экранах ящик — отдельная строка полки на всю ширину, сразу под плиткой
                  if (narrow && active === wi) items.push(<li key="drawer" className={styles.inlineDrawer}>{drawer}</li>);
                  return items;
                })}
                {si === 2 && (
                  <li className={`${styles.cell} ${styles.cellRail}`}>
                    <Rail
                      title={works[yoranIdx].lineupTitle}
                      note={works[yoranIdx].lineupNote}
                      onPreview={setPreview}
                      onPick={pickStep}
                    />
                  </li>
                )}
              </ul>
              <div className={styles.shelfEdge} data-reveal aria-hidden="true" />
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
