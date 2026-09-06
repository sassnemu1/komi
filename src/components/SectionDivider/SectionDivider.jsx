import styles from "./SectionDivider.module.css";

/**
 * Тонкая полоса орнамента коми между крупными секциями.
 * tone: "dark" — подложка #07070a (основная поверхность),
 *       "light" — подложка #0b1214 (полярная ночь, чуть зеленее).
 */
export default function SectionDivider({ tone = "dark", className = "" }) {
  return (
    <div
      className={`${styles.divider} ${tone === "light" ? styles.light : styles.dark} ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      <div className={styles.strip} />
    </div>
  );
}
