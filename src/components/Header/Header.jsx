"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";

const MAP_URL = process.env.NEXT_PUBLIC_MAP_URL || "https://map.komi.world";

// Пункты навигации: id — якорь секции, к которому ведёт ссылка.
const NAV = [
  { id: "map",          label: "Карта" },
  { id: "mythology",    label: "Мифология" },
  { id: "landmarks",    label: "Места" },
  { id: "stay",         label: "Отели и рестораны" },
  { id: "experiences",  label: "Впечатления" },
  { id: "made-in-komi", label: "Сделано в Коми" },
  { id: "transport",    label: "Транспорт" },
];

// Секции, у которых нет собственного пункта меню, подсвечивают соседний.
const ACTIVE_ALIAS = {
  camping: "experiences",
  taxi:    "transport",
};

const OBSERVED_IDS = [
  "mythology", "landmarks", "stay", "experiences",
  "camping", "made-in-komi", "transport", "taxi",
];

const SCROLLED_AT     = 80;  // px — после этого шапка становится «стеклом»
const HIDE_THRESHOLD  = 8;   // px — порог, чтобы шапка не дёргалась
const HIDE_AFTER      = 140; // px — выше этого шапку не прячем
const NAV_LOCK_MS     = 1100; // после клика по ссылке шапку не прячем

function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getHero() {
  return document.getElementById("hero") || document.querySelector("main > section");
}

// Программный скролл: через Lenis, если плавный скролл включён
// (components/SmoothScroll), иначе нативно.
function scrollWindowTo(top, behavior) {
  const smooth = behavior ? behavior === "smooth" : !prefersReducedMotion();
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(top, smooth ? { duration: 1.4 } : { immediate: true });
    return;
  }
  window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
}

// Стадия карты в hero: конец его скролл-рельсы (~55 % высоты).
function scrollToMapStage(behavior) {
  const hero = getHero();
  if (!hero) return false;
  const top = hero.offsetTop + hero.offsetHeight * 0.55;
  scrollWindowTo(top, behavior);
  return true;
}

function KomiMark() {
  return (
    <svg
      className={styles.mark}
      viewBox="0 0 200 200"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M100 24 130 54 100 84 70 54ZM100 35 119 54 100 73 81 54ZM146 70 176 100 146 130 116 100ZM146 81 165 100 146 119 127 100ZM100 116 130 146 100 176 70 146ZM100 127 119 146 100 165 81 146ZM54 70 84 100 54 130 24 100ZM54 81 73 100 54 119 35 100ZM100 91 109 100 100 109 91 100Z"
      />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden,   setHidden]   = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active,   setActive]   = useState(null);

  const lastYRef      = useRef(0);
  const tickingRef    = useRef(false);
  const navLockRef    = useRef(0);
  const burgerRef     = useRef(null);
  const closeBtnRef   = useRef(null);
  const menuOpenRef   = useRef(false);

  useEffect(() => { menuOpenRef.current = menuOpen; }, [menuOpen]);

  // ── Скролл: стекло + скрытие/показ ────────────────────────────
  useEffect(() => {
    lastYRef.current = window.scrollY;

    const update = () => {
      tickingRef.current = false;
      const y = window.scrollY;
      setScrolled(y > SCROLLED_AT);

      // В hero подсвечиваем «Карта», когда рельса дошла до стадии карты
      const hero = getHero();
      if (hero) {
        const heroBottom = hero.offsetTop + hero.offsetHeight - window.innerHeight * 0.6;
        const mapStart   = hero.offsetTop + hero.offsetHeight * 0.3;
        if (y >= mapStart && y < heroBottom) setActive("map");
        else if (y < mapStart) setActive(null);
      }

      if (menuOpenRef.current) { lastYRef.current = y; return; }

      const delta = y - lastYRef.current;
      if (Math.abs(delta) < HIDE_THRESHOLD) return;

      const locked = Date.now() < navLockRef.current;
      if (delta > 0 && y > HIDE_AFTER && !locked) setHidden(true);
      else setHidden(false);

      lastYRef.current = y;
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    const raf = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // ── Активная секция ───────────────────────────────────────────
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const targets = OBSERVED_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Берём самую «видимую» из пересекающих середину экрана
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const id = visible.target.id;
        setActive(ACTIVE_ALIAS[id] || id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5] }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // ── Глобальный перехват ссылок на #map (шапка, футер, иконки hero) ─
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a[href="#map"]');
      if (!a) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (scrollToMapStage()) {
        e.preventDefault();
        navLockRef.current = Date.now() + NAV_LOCK_MS;
        if (history.replaceState) history.replaceState(null, "", "#map");
      }
    };
    document.addEventListener("click", onClick);

    // Прямой заход по адресу /#map — сразу к карте
    if (window.location.hash === "#map") {
      const t = setTimeout(() => scrollToMapStage("auto"), 60);
      return () => { clearTimeout(t); document.removeEventListener("click", onClick); };
    }
    return () => document.removeEventListener("click", onClick);
  }, []);

  // ── Мобильное меню: Esc, scroll-lock, фокус ───────────────────
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    burgerRef.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();

    const onKey = (e) => { if (e.key === "Escape") closeMenu(); };
    window.addEventListener("keydown", onKey);

    const raf = requestAnimationFrame(() => closeBtnRef.current?.focus?.());

    const mq = window.matchMedia("(min-width: 900px)");
    const onWide = (e) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener("change", onWide);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
      document.body.style.overflow = prevOverflow;
      window.__lenis?.start();
    };
  }, [menuOpen, closeMenu]);

  const onNavClick = () => {
    navLockRef.current = Date.now() + NAV_LOCK_MS;
    setHidden(false);
    if (menuOpenRef.current) setMenuOpen(false);
  };

  const onLogoClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onNavClick();
    scrollWindowTo(0);
    if (history.replaceState) history.replaceState(null, "", window.location.pathname);
  };

  const headerClass = [
    styles.header,
    scrolled ? styles.scrolled : "",
    hidden && !menuOpen ? styles.hidden : "",
    menuOpen ? styles.menuOpen : "",
  ].join(" ");

  return (
    <header className={headerClass} data-menu-open={menuOpen ? "true" : undefined}>
      <div className={styles.bar}>
        <a href="#hero" className={styles.logo} aria-label="komi.world — на главную" onClick={onLogoClick}>
          <KomiMark />
          <span className={styles.wordmark}>KOMI.WORLD</span>
        </a>

        <nav className={styles.nav} aria-label="Разделы сайта">
          <ul className={styles.navList}>
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`${styles.navLink} ${active === item.id ? styles.navLinkActive : ""}`}
                  aria-current={active === item.id ? "location" : undefined}
                  onClick={onNavClick}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a
            href={MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.pill}
          >
            Карта преданий <span aria-hidden="true">↗</span>
          </a>

          <button
            ref={burgerRef}
            type="button"
            className={styles.burger}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => { setHidden(false); setMenuOpen((v) => !v); }}
          >
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </button>
        </div>
      </div>

      {/* ── Полноэкранное меню (mobile) ── */}
      <div
        id="site-menu"
        className={styles.menu}
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
        hidden={!menuOpen}
      >
        <div className={styles.menuInner}>
          <div className={styles.menuTop}>
            <span className={styles.menuEyebrow}>Республика Коми</span>
            <button
              ref={closeBtnRef}
              type="button"
              className={styles.menuClose}
              aria-label="Закрыть меню"
              onClick={closeMenu}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <ul className={styles.menuList}>
            {NAV.map((item, i) => (
              <li key={item.id} style={{ "--i": i }}>
                <a
                  href={`#${item.id}`}
                  className={`${styles.menuLink} ${active === item.id ? styles.menuLinkActive : ""}`}
                  onClick={onNavClick}
                >
                  <span className={styles.menuNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.menuBottom}>
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.pill} ${styles.pillLarge}`}
              onClick={onNavClick}
            >
              Карта преданий <span aria-hidden="true">↗</span>
            </a>
            <a href="#contacts" className={styles.menuContacts} onClick={onNavClick}>
              Контакты
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
