import styles from "./SectionHead.module.css";

/**
 * Редакторский заголовок нижних секций: слева eyebrow с чертой, display-
 * заголовок и лид, справа — большой номер главы. Все элементы помечены
 * data-reveal, чтобы секция анимировала их через useReveal.
 *
 * title — строка, переносы "\n" делят на строки.
 * action — { label, href, external } — необязательная ссылка под лидом.
 */
export default function SectionHead({ num, eyebrow, title, lead, action, className = "" }) {
  const lines = String(title).split("\n").map((l) => l.trim()).filter(Boolean);

  return (
    <header className={`${styles.head} ${className}`}>
      <div className={styles.main}>
        <span className={styles.eyebrow} data-reveal>
          Республика Коми <i className={styles.dot} aria-hidden="true" /> {eyebrow}
        </span>
        <h2 className={styles.title} data-reveal>
          {lines.map((line, i) => (
            <span key={i} className={styles.line}>{line}</span>
          ))}
        </h2>
        {lead && <p className={styles.lead} data-reveal>{lead}</p>}
        {action && (
          <a
            className={styles.action}
            href={action.href}
            data-reveal
            {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {action.label}
            <span aria-hidden="true">{action.external ? "↗" : "→"}</span>
          </a>
        )}
      </div>
      {num && <span className={styles.num} aria-hidden="true">{num}</span>}
    </header>
  );
}
