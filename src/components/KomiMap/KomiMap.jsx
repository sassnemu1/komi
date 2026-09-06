"use client";

import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { KOMI_DISTRICTS } from "./komiDistricts";
import { LORE_BY_DISTRICT } from "@/data/districtLore";
import styles from "./KomiMap.module.css";

// Склонение «N сюжетов» — для табло и легенды.
export function pluralStories(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} сюжет`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} сюжета`;
  return `${n} сюжетов`;
}

export const loreCount = (pathId) => LORE_BY_DISTRICT[pathId]?.length ?? 0;

// Интерактивная карта районов Республики Коми: подгружает /komi-map.svg,
// размечает пути районов (data-district, role="button", tabindex),
// заливает форму района его настоящим флагом (где флаг подтверждён —
// см. komiDistricts.js), показывает табло при наведении мышью и
// сообщает наверх о hover / выборе района.
//
// props:
//   selected  — pathId выбранного района (подсветка, остальные приглушены)
//   hovered   — pathId района, подсвеченного извне (легенда)
//   onSelect  — (pathId) => void — клик / Enter / Space
//   onHover   — (pathId | null) => void
//   ref       — { focusDistrict(pathId) } для возврата фокуса
export default function KomiMap({ className, selected, hovered, onSelect, onHover, ref }) {
  const hostRef = useRef(null);
  const pathsRef = useRef(new Map());
  const [ready, setReady] = useState(false);
  const [tooltip, setTooltip] = useState(null); // { x, y, name, type, count }

  // Свежие колбэки для слушателей, навешанных один раз при загрузке SVG.
  const handlersRef = useRef({ onSelect, onHover });
  useEffect(() => {
    handlersRef.current = { onSelect, onHover };
  }, [onSelect, onHover]);

  useImperativeHandle(ref, () => ({
    focusDistrict(pathId) {
      const el = pathsRef.current.get(pathId);
      if (el && typeof el.focus === "function") el.focus({ preventScroll: true });
    },
  }), []);

  useEffect(() => {
    let cancelled = false;
    const cleanupFns = [];
    const paths = pathsRef.current;

    fetch("/komi-map.svg")
      .then((res) => res.text())
      .then((svgText) => {
        const host = hostRef.current;
        if (cancelled || !host) return;

        host.innerHTML = svgText;
        const svg = host.querySelector("svg");
        if (!svg) return;

        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.style.width = "100%";
        svg.style.height = "auto";
        svg.style.display = "block";
        svg.style.overflow = "visible";
        svg.setAttribute("role", "group");
        svg.setAttribute("aria-label", "Карта муниципалитетов Республики Коми");

        // Слой номеров — декоративный: события ему не нужны,
        // иначе он перехватывает hover ровно там, где написана цифра.
        const numbersLayer = svg.querySelector("#layer5");
        if (numbersLayer) {
          numbersLayer.style.pointerEvents = "none";
          numbersLayer.setAttribute("aria-hidden", "true");
        }

        let defs = svg.querySelector("defs");
        if (!defs) {
          defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
          svg.insertBefore(defs, svg.firstChild);
        }

        Object.entries(KOMI_DISTRICTS).forEach(([id, info]) => {
          const path = svg.querySelector(`#${id}`);
          if (!path) return;

          const count = loreCount(id);

          path.setAttribute("data-district", info.name);
          path.setAttribute("data-path-id", id);
          path.setAttribute("role", "button");
          path.setAttribute("tabindex", "0");
          path.setAttribute(
            "aria-label",
            `Район ${info.num}: ${info.name}, ${info.type.toLowerCase()}, ${pluralStories(count)}`
          );
          paths.set(id, path);

          // Настоящий флаг района — заливаем форму района им самим
          // через SVG-pattern, "cover"-кадрированием по bbox фигуры.
          if (info.flag) {
            path.setAttribute("data-has-flag", "true");
            const bbox = path.getBBox();
            const patternId = `flag-pattern-${id}`;

            const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
            pattern.setAttribute("id", patternId);
            pattern.setAttribute("patternUnits", "userSpaceOnUse");
            pattern.setAttribute("x", bbox.x);
            pattern.setAttribute("y", bbox.y);
            pattern.setAttribute("width", bbox.width);
            pattern.setAttribute("height", bbox.height);

            const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
            image.setAttribute("href", info.flag);
            image.setAttribute("x", "0");
            image.setAttribute("y", "0");
            image.setAttribute("width", bbox.width);
            image.setAttribute("height", bbox.height);
            image.setAttribute("preserveAspectRatio", "xMidYMid slice");

            pattern.appendChild(image);
            defs.appendChild(pattern);

            path.style.fill = `url(#${patternId})`;
          }

          // Табло якорится на точку входа курсора и не дёргается за
          // pointermove. На touch табло не показываем — там тап сразу
          // открывает панель района.
          const onEnter = (e) => {
            handlersRef.current.onHover?.(id);
            if (e.pointerType === "touch") return;
            const rect = host.getBoundingClientRect();
            setTooltip({
              name: info.name,
              type: info.type,
              count,
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          };
          const onLeave = () => {
            handlersRef.current.onHover?.(null);
            setTooltip(null);
          };
          const onClick = () => {
            setTooltip(null);
            handlersRef.current.onSelect?.(id);
          };
          const onKey = (e) => {
            if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
              e.preventDefault();
              handlersRef.current.onSelect?.(id);
            }
          };
          const onFocus = () => handlersRef.current.onHover?.(id);
          const onBlur = () => handlersRef.current.onHover?.(null);

          path.addEventListener("pointerenter", onEnter);
          path.addEventListener("pointerleave", onLeave);
          path.addEventListener("click", onClick);
          path.addEventListener("keydown", onKey);
          path.addEventListener("focus", onFocus);
          path.addEventListener("blur", onBlur);

          cleanupFns.push(() => {
            path.removeEventListener("pointerenter", onEnter);
            path.removeEventListener("pointerleave", onLeave);
            path.removeEventListener("click", onClick);
            path.removeEventListener("keydown", onKey);
            path.removeEventListener("focus", onFocus);
            path.removeEventListener("blur", onBlur);
          });
        });

        setReady(true);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => fn());
      paths.clear();
    };
  }, []);

  // Синхронизация выбранного / подсвеченного района с DOM SVG.
  useEffect(() => {
    if (!ready) return;
    const host = hostRef.current;
    if (!host) return;

    if (selected) host.setAttribute("data-has-selection", "true");
    else host.removeAttribute("data-has-selection");

    pathsRef.current.forEach((path, id) => {
      if (id === selected) {
        path.setAttribute("data-selected", "true");
        path.setAttribute("aria-pressed", "true");
      } else {
        path.removeAttribute("data-selected");
        path.setAttribute("aria-pressed", "false");
      }
      if (id === hovered) path.setAttribute("data-hovered", "true");
      else path.removeAttribute("data-hovered");
    });
  }, [ready, selected, hovered]);

  return (
    <div className={styles.wrap}>
      <div ref={hostRef} className={`${styles.svgHost} ${className ?? ""}`} />

      {tooltip && (
        <div className={styles.tooltip} style={{ left: tooltip.x, top: tooltip.y }}>
          <span className={styles.tooltipType}>{tooltip.type}</span>
          <span className={styles.tooltipName}>{tooltip.name}</span>
          <span className={styles.tooltipCount}>{pluralStories(tooltip.count)}</span>
        </div>
      )}
    </div>
  );
}
