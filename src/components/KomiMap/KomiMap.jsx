"use client";

import { useEffect, useRef, useState } from "react";
import { KOMI_DISTRICTS } from "./komiDistricts";
import styles from "./KomiMap.module.css";

// Интерактивная карта районов Республики Коми: подгружает /komi-map.svg,
// размечает пути районов атрибутом data-district (под уже существующий
// hover-стиль в HeroSection.module.css), заливает форму района его
// настоящим флагом (где флаг подтверждён реально существующим — см.
// komiDistricts.js) и показывает табло с названием при наведении.
export default function KomiMap({ className }) {
  const hostRef = useRef(null);
  const [tooltip, setTooltip] = useState(null); // { x, y, name, type }

  useEffect(() => {
    let cancelled = false;
    const cleanupFns = [];

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
        // Через inline-стиль, а не CSS-модуль — надёжнее для динамически
        // вставленного через innerHTML <svg> (без зависимости от того,
        // как именно CSS-модуль заскоупит селектор для чужой разметки).
        svg.style.width = "100%";
        svg.style.height = "auto";
        svg.style.display = "block";
        svg.style.overflow = "visible";

        // Цифры-номера лежат поверх контуров районов и, если их не
        // выключить, перехватывают hover ровно в той точке, где
        // написан номер. Слой чисто декоративный, события ему не нужны.
        const numbersLayer = svg.querySelector("#layer5");
        if (numbersLayer) numbersLayer.style.pointerEvents = "none";

        let defs = svg.querySelector("defs");
        if (!defs) {
          defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
          svg.insertBefore(defs, svg.firstChild);
        }

        Object.entries(KOMI_DISTRICTS).forEach(([id, info]) => {
          const path = svg.querySelector(`#${id}`);
          if (!path) return;

          path.setAttribute("data-district", info.name);

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

          // Позиция фиксируется один раз при входе курсора — табло
          // не должно дёргаться за каждым pointermove. Якорим на
          // точку входа.
          const showTooltip = (e) => {
            const rect = host.getBoundingClientRect();
            setTooltip({
              name: info.name,
              type: info.type,
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          };
          const hideTooltip = () => setTooltip(null);

          path.addEventListener("pointerenter", showTooltip);
          path.addEventListener("pointerleave", hideTooltip);

          cleanupFns.push(() => {
            path.removeEventListener("pointerenter", showTooltip);
            path.removeEventListener("pointerleave", hideTooltip);
          });
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <div ref={hostRef} className={`${styles.svgHost} ${className ?? ""}`} />

      {tooltip && (
        <div className={styles.tooltip} style={{ left: tooltip.x, top: tooltip.y }}>
          <span className={styles.tooltipType}>{tooltip.type}</span>
          <span className={styles.tooltipName}>{tooltip.name}</span>
        </div>
      )}
    </div>
  );
}
