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
          <svg className={styles.flake} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M12 2v20M4 7l16 10M4 17L20 7M12 6l-2-2M12 6l2-2M12 18l-2 2M12 18l2 2M7 9.5 5 8.8M7 9.5l.3-2.3M17 14.5l2 .7M17 14.5l-.3 2.3M7 14.5l-2 .7M7 14.5l.3 2.3M17 9.5l2-.7M17 9.5l-.3-2.3" />
          </svg>
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
