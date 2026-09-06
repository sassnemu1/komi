import styles from "./Footer.module.css";
import { PHOTO_CREDITS } from "@/data/photos";

const MAP_URL = process.env.NEXT_PUBLIC_MAP_URL || "https://map.komi.world";

const SECTIONS = [
  { href: "#map",          label: "Карта районов" },
  { href: "#mythology",    label: "Мифология" },
  { href: "#landmarks",    label: "Места" },
  { href: "#stay",         label: "Отели и рестораны" },
  { href: "#experiences",  label: "Впечатления" },
  { href: "#camping",      label: "Кемпинг" },
  { href: "#made-in-komi", label: "Сделано в Коми" },
  { href: "#transport",    label: "Аренда транспорта" },
  { href: "#taxi",         label: "Такси" },
  { href: "#holding",      label: "Холдинг" },
];

const VELES_URL = "https://veles-site-kiselev.vercel.app";
const YORAN_URL = "https://yoran-web.vercel.app";

// Бренды холдинга (по README УК «Велес И К»). Ссылки — на страницы
// брендов сайта завода «Велес» и сайт YÖRAN; у остальных сайтов нет.
const BRANDS = [
  { label: "ПАРМА",       href: `${VELES_URL}/parma.html` },
  { label: "A-Live",      href: `${VELES_URL}/a-live.html` },
  { label: "L'ESSENCE",   href: `${VELES_URL}/l-essence.html` },
  { label: "Нянь Мунам" },
  { label: "Корни Пармы" },
  { label: "Ёр Лайна" },
  { label: "Зарни" },
  { label: "YÖRAN",       href: `${YORAN_URL}/` },
];

// Проекты экосистемы. Живые ссылки — карта преданий и сайты завода и YÖRAN.
const PROJECTS = [
  { label: "Карта преданий", href: MAP_URL, external: true },
  { label: "Завод напитков «Велес»", href: `${VELES_URL}/`, external: true },
  { label: "YÖRAN Sever Technologies", href: `${YORAN_URL}/`, external: true },
  { label: "Коридор Якша — Маньпупунёр", href: "#experiences" },
  { label: "Taiga Taxi", href: "#taxi" },
  { label: "Taigarenda", href: "#transport" },
  { label: "Camping.Komi", href: "#camping" },
];

export default function Footer() {
  return (
    <footer id="contacts" className={styles.footer}>
      <div className={styles.texture} aria-hidden="true" />

      <div className={styles.inner}>
        {/* ── Верх: словомарка ── */}
        <div className={styles.top}>
          <p className={styles.eyebrow}>komi.world</p>
          <h2 className={styles.wordmark}>
            Республика <span className={styles.wordmarkStrong}>Коми</span>
          </h2>
          <p className={styles.tagline}>
            komi.world — портал Республики Коми.<br />
            Проект УК «Велес И К», Сыктывкар.
          </p>
        </div>

        {/* ── Колонки ── */}
        <div className={styles.columns}>
          <nav className={styles.col} aria-label="Разделы">
            <h3 className={styles.colTitle}>Разделы</h3>
            <ul className={styles.list}>
              {SECTIONS.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className={styles.link}>{s.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Бренды</h3>
            <ul className={styles.list}>
              {BRANDS.map((b) =>
                b.href ? (
                  <li key={b.label}>
                    <a href={b.href} className={styles.link} target="_blank" rel="noopener noreferrer">
                      {b.label} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ) : (
                  <li key={b.label} className={styles.plain}>{b.label}</li>
                )
              )}
            </ul>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Проекты</h3>
            <ul className={styles.list}>
              {PROJECTS.map((p) =>
                p.href ? (
                  <li key={p.label}>
                    <a
                      href={p.href}
                      className={styles.link}
                      target={p.external ? "_blank" : undefined}
                      rel={p.external ? "noopener noreferrer" : undefined}
                    >
                      {p.label} {p.external && <span aria-hidden="true">↗</span>}
                    </a>
                  </li>
                ) : (
                  <li key={p.label} className={styles.plain}>{p.label}</li>
                )
              )}
            </ul>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Контакты</h3>
            <ul className={styles.list}>
              <li>
                <a href="mailto:info@komi.world" className={`${styles.link} ${styles.mail}`}>
                  info@komi.world
                </a>
              </li>
              <li className={styles.plain}>Сыктывкар, Республика Коми</li>
              <li className={styles.plain}>УК «Велес И К»</li>
            </ul>
          </div>
        </div>

        {/* ── Низ ── */}
        <div className={styles.bottom}>
          <p className={styles.copy}>© 2026 УК «Велес И К»</p>
          <p className={styles.note}>
            Фольклорные сюжеты — по материалам{" "}
            <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className={styles.noteLink}>
              map.komi.world
            </a>
          </p>
          <p className={styles.credits}>
            Фотографии — Wikimedia Commons, свободные лицензии:{" "}
            {PHOTO_CREDITS.map((c, i) => (
              <span key={c.author}>
                <a href={c.pages[0]} target="_blank" rel="noopener noreferrer" className={styles.noteLink}>
                  {c.author}
                </a>
                {" "}({c.license}){i < PHOTO_CREDITS.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
