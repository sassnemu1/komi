"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import useGSAP from "@/hooks/useGSAP.js";
import { KOMI_DISTRICTS } from "@/components/KomiMap/komiDistricts";
import { pluralStories } from "@/components/KomiMap/KomiMap";
import { DISTRICT_FACTS } from "@/data/districtFacts";
import {
  LORE_BY_DISTRICT,
  LORE_GENRES,
  loreEntryUrl,
  loreDistrictUrl,
} from "@/data/districtLore";
import styles from "./DistrictPanel.module.css";

// Формат чисел: пробелы по тысячам (узкий неразрывный пробел).
function formatNumber(n) {
  if (typeof n !== "number" || !Number.isFinite(n)) return null;
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const isMobile = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Панель района. Desktop — фиксированная колонка справа (440px),
// mobile — bottom-sheet. Живёт внутри sticky-оболочки hero, поэтому
// уезжает вместе с ним; закрывается по ×, Esc и клику по подложке.
//
// props: pathId, onClose(pathId) — вызывается ПОСЛЕ анимации закрытия.
export default function DistrictPanel({ pathId, onClose }) {
  const rootRef = useRef(null);
  const sheetRef = useRef(null);
  const backdropRef = useRef(null);
  const closingRef = useRef(false);
  const { gsap } = useGSAP();

  const info = KOMI_DISTRICTS[pathId];
  const facts = DISTRICT_FACTS?.[pathId] ?? {};
  const lore = LORE_BY_DISTRICT[pathId] ?? [];

  // Закрытие с анимацией
  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;
    if (!gsap || prefersReducedMotion() || !sheet) {
      onClose?.(pathId);
      return;
    }
    const axis = isMobile() ? { yPercent: 100 } : { xPercent: 100 };
    gsap.to(backdrop, { opacity: 0, duration: 0.3, ease: "power2.out" });
    gsap.to(sheet, {
      ...axis,
      opacity: 0.6,
      duration: 0.35,
      ease: "power3.in",
      onComplete: () => onClose?.(pathId),
    });
  }, [gsap, onClose, pathId]);

  // Появление: slide-in .5s power3.out (при reduced-motion — без анимации)
  useEffect(() => {
    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;
    if (!sheet) return;

    // Фокус на панель при открытии
    sheet.focus({ preventScroll: true });

    if (!gsap || prefersReducedMotion()) {
      if (backdrop) backdrop.style.opacity = "1";
      sheet.style.transform = "none";
      sheet.style.opacity = "1";
      return;
    }

    const axisFrom = isMobile() ? { yPercent: 100 } : { xPercent: 100 };
    const axisTo = isMobile() ? { yPercent: 0 } : { xPercent: 0 };
    const tl = gsap.timeline();
    tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
      .fromTo(sheet, { ...axisFrom, opacity: 0.6 }, { ...axisTo, opacity: 1, duration: 0.5, ease: "power3.out" }, 0);

    return () => tl.kill();
    // Анимация — только при монтировании; смена района обновляет контент на месте.
  }, [gsap]);

  // Esc + клик по подложке (вне панели). Клик по другому району или по
  // пункту легенды панель не закрывает — он просто переключает район.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
      }
    };
    const onPointerDown = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (sheetRef.current?.contains(target)) return;
      if (target.closest("[data-district], [data-legend-item]")) return;
      requestClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [requestClose]);

  // При смене района — скролл содержимого наверх
  useEffect(() => {
    const body = rootRef.current?.querySelector(`.${styles.body}`);
    if (body) body.scrollTop = 0;
  }, [pathId]);

  if (!info) return null;

  const area = formatNumber(facts.areaKm2);
  const population = formatNumber(facts.population);
  const hasFacts = Boolean(facts.center || area || population);
  const titleId = `district-panel-title-${pathId}`;

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={styles.backdrop} ref={backdropRef} aria-hidden="true" />

      <section
        className={styles.sheet}
        ref={sheetRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className={styles.handle} aria-hidden="true" />

        <button
          type="button"
          className={styles.close}
          onClick={requestClose}
          aria-label="Закрыть панель района"
        >
          ×
        </button>

        <div className={styles.body}>
          {/* ── Шапка ── */}
          <header className={styles.head}>
            {info.flag && (
              <span className={styles.flag}>
                <Image
                  src={info.flag}
                  alt={`Флаг: ${info.name}`}
                  width={44}
                  height={30}
                  sizes="44px"
                />
              </span>
            )}
            <span className={styles.eyebrow}>
              {info.type} &nbsp;·&nbsp; № {info.num}
            </span>
            <h2 className={styles.title} id={titleId}>{info.name}</h2>
            {facts.komiName && (
              <span className={styles.komiName} lang="kv">{facts.komiName}</span>
            )}
          </header>

          {/* ── Факты ── */}
          {hasFacts && (
            <dl className={styles.facts}>
              {facts.center && (
                <div className={styles.fact}>
                  <dt className={styles.factLabel}>Центр</dt>
                  <dd className={styles.factValueText}>{facts.center}</dd>
                </div>
              )}
              {area && (
                <div className={styles.fact}>
                  <dt className={styles.factLabel}>Площадь</dt>
                  <dd className={styles.factValue}>
                    {area} <span className={styles.factUnit}>км²</span>
                  </dd>
                </div>
              )}
              {population && (
                <div className={styles.fact}>
                  <dt className={styles.factLabel}>
                    Население{facts.populationYear ? ` (${facts.populationYear})` : ""}
                  </dt>
                  <dd className={styles.factValue}>{population}</dd>
                </div>
              )}
            </dl>
          )}
          {hasFacts && facts.source && (
            <p className={styles.source}>
              Источник:{" "}
              {/^https?:\/\//.test(facts.source) ? (
                <a href={facts.source} target="_blank" rel="noopener noreferrer">
                  {facts.source.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
              ) : (
                facts.source
              )}
            </p>
          )}

          {/* ── Предания и промыслы ── */}
          <div className={styles.loreBlock}>
            <div className={styles.loreHead}>
              <span className={styles.loreEyebrow}>Предания и промыслы</span>
              <span className={styles.loreCount}>{pluralStories(lore.length)}</span>
            </div>

            {lore.length === 0 ? (
              <p className={styles.empty}>
                На карте преданий у этого района пока нет записей.
              </p>
            ) : (
              <ul className={styles.loreList}>
                {lore.map((entry) => {
                  const genre = LORE_GENRES[entry.genre];
                  return (
                    <li key={entry.id}>
                      <a
                        className={styles.loreItem}
                        href={loreEntryUrl(entry.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className={styles.loreMeta}>
                          {genre && (
                            <span
                              className={styles.chip}
                              style={{ "--chip": genre.color }}
                            >
                              {genre.label}
                            </span>
                          )}
                          {entry.verified === "review" && (
                            <span className={styles.review}>привязка уточняется</span>
                          )}
                        </span>
                        <span className={styles.loreTitleRow}>
                          <span className={styles.loreTitle}>{entry.title}</span>
                          <span className={styles.arrow} aria-hidden="true">→</span>
                        </span>
                        {entry.lead && <span className={styles.loreLead}>{entry.lead}</span>}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <footer className={styles.foot}>
          <a
            className={styles.cta}
            href={loreDistrictUrl(pathId)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Открыть район на карте преданий <span aria-hidden="true">→</span>
          </a>
        </footer>
      </section>
    </div>
  );
}
