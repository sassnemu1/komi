"use client";

import { KOMI_DISTRICTS } from "./komiDistricts";
import { loreCount } from "./KomiMap";
import styles from "./DistrictLegend.module.css";

const ITEMS = Object.entries(KOMI_DISTRICTS)
  .map(([pathId, info]) => ({ pathId, ...info, count: loreCount(pathId) }))
  .sort((a, b) => a.num - b.num);

// Легенда карты районов (desktop): 19 муниципалитетов, hover ⇄ карта,
// клик открывает панель района.
export default function DistrictLegend({ selected, hovered, onHover, onSelect, className, ref }) {
  return (
    <aside ref={ref} className={`${styles.legend} ${className ?? ""}`} aria-label="Легенда карты районов">
      <header className={styles.head}>
        <span className={styles.eyebrow}>Республика Коми</span>
        <span className={styles.line} aria-hidden="true" />
        <h2 className={styles.title}>
          <span className={styles.titleNum}>19</span> муниципалитетов
        </h2>
        <p className={styles.hint}>Нажмите на район</p>
      </header>

      <ul className={styles.list} onMouseLeave={() => onHover?.(null)}>
        {ITEMS.map((d) => {
          const isSelected = d.pathId === selected;
          const isHovered = d.pathId === hovered;
          return (
            <li key={d.pathId}>
              <button
                type="button"
                data-legend-item={d.pathId}
                className={[
                  styles.item,
                  isSelected ? styles.itemSelected : "",
                  isHovered ? styles.itemHovered : "",
                ].join(" ")}
                onMouseEnter={() => onHover?.(d.pathId)}
                onFocus={() => onHover?.(d.pathId)}
                onBlur={() => onHover?.(null)}
                onClick={() => onSelect?.(d.pathId)}
                aria-pressed={isSelected}
                aria-label={`Район ${d.num}: ${d.name}, ${d.type.toLowerCase()}`}
              >
                <span className={styles.num}>{d.num}</span>
                <span className={styles.name}>{d.name}</span>
                <span className={styles.count} title="Сюжетов на карте преданий">
                  {d.count > 0 ? d.count : "·"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
