import styles from "./SnowEdge.module.css";

// Снежная кромка между главами: две волны сугроба с мягкой подсветкой
// сверху. Чистый SVG, без JS; tone="soft" — тише, для тёмных стыков.
export default function SnowEdge({ tone = "soft" }) {
  return (
    <div className={`${styles.edge} ${tone === "bright" ? styles.bright : ""}`} aria-hidden="true">
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className={styles.svg}>
        <path className={styles.back} d="M0,52 C160,26 300,70 470,46 C640,22 790,66 960,44 C1120,24 1290,58 1440,40 L1440,90 L0,90 Z" />
        <path className={styles.front} d="M0,70 C200,48 340,86 520,66 C700,46 860,84 1040,64 C1220,46 1330,78 1440,62 L1440,90 L0,90 Z" />
      </svg>
    </div>
  );
}
