"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import useGSAP from "@/hooks/useGSAP";
import styles from "./CarRental.module.css";

// ─── Константы ────────────────────────────────────────────────────
const FRAME_COUNT      = 240;
const SCROLL_PX        = 18;          // px скролла на один кадр
const MAX_CONCURRENT   = 16;          // параллельных fetch
const PRELOAD_RADIUS   = 30;          // кадров вперёд/назад для предзагрузки
const PRELOAD_BOOST    = 20;          // дополнительный радиус при быстром скролле
const frameUrl = (i) =>
  `/video/frame_${String(i).padStart(3, "0")}.webp`;

const CTA_HREF = "#contacts";

// ─── Кадры появления текста ─────────────────────────────────────────
// Номер кадра (1…FRAME_COUNT), на котором должен появиться каждый
// текстовый блок. Каждый блок виден до кадра следующей константы
// (последний — до CTA, CTA — до конца, т.е. до FRAME_COUNT).
const FRAME_BLOCK_1 = 1;
const FRAME_BLOCK_2 = 83;
const FRAME_BLOCK_3 = 131;
const FRAME_CTA     = 181; // до FRAME_COUNT (240) — 40 кадров на CTA

// ─── Контент блоков ───────────────────────────────────────────────
// Факты — только из README холдинга «Велес И К» и README коридора
// Якша—Маньпупунёр: Taigarenda — сервис проката холдинга, часть
// цифровой экосистемы komi.world; зимняя программа фуникулёра
// «Якша Skyview» планируется на снегоходах YÖRAN. Цифр о парке,
// сезоне и графике в источниках нет — их здесь и не приводим.
const BLOCKS = [
  {
    id: "01",
    frame: FRAME_BLOCK_1,
    eyebrow: "Taigarenda · Аренда транспорта",
    headline: ["Куда не", "доедет"],
    accent: "обычная машина.",
    body: "Taigarenda — сервис проката холдинга «Велес И К»: снегоходы, вездеходы и внедорожники для маршрутов по тайге Республики Коми.",
    stat: { value: "Taigarenda", label: "сервис проката холдинга" },
  },
  {
    id: "02",
    frame: FRAME_BLOCK_2,
    eyebrow: "Зимние маршруты",
    headline: ["Тайга и", "замёрзшие реки —"],
    accent: "ваш путь.",
    body: "Снегоходные маршруты по зимней тайге. Зимняя программа фуникулёра «Якша Skyview» в коридоре Якша—Маньпупунёр планируется на снегоходах YÖRAN.",
    stat: { value: "YÖRAN", label: "арктическая техника холдинга" },
  },
  {
    id: "03",
    frame: FRAME_BLOCK_3,
    eyebrow: "Экосистема komi.world",
    headline: ["Техника", "и маршрут —"],
    accent: "по запросу.",
    body: "Taigarenda входит в цифровую экосистему komi.world. Условия проката, подача техники и маршруты — по запросу через контакты.",
    stat: { value: "komi.world", label: "цифровая экосистема" },
  },
];

// Кадр, на котором появляется финальный CTA-блок (виден до конца, FRAME_COUNT).
const CTA_FRAME = FRAME_CTA;

// ─── Priority pool ────────────────────────────────────────────────
function createPool(concurrency) {
  let active = 0;
  const hi = [], lo = [];

  function drain() {
    while (active < concurrency) {
      const job = hi.shift() || lo.shift();
      if (!job) break;
      active++;
      job().finally(() => { active--; drain(); });
    }
  }
  return {
    high:   (fn) => { hi.push(fn); drain(); },
    normal: (fn) => { lo.push(fn); drain(); },
  };
}

// ─── Загрузчик кадра ──────────────────────────────────────────────
async function fetchBitmap(url) {
  const res = await fetch(url, { priority: "high" });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return createImageBitmap(await res.blob());
}

// ─── Статичная версия (мобайл и prefers-reduced-motion) ──────────
function CarRentalStatic({ wide = false }) {
  return (
    <section
      id="transport"
      className={`${styles.sectionMobile} ${wide ? styles.sectionStatic : ""}`}
    >
      <img
        src={frameUrl(1)}
        alt="Аренда транспорта в Коми"
        className={styles.mobileBg}
      />
      <div className={styles.mobileOverlay} />
      <div className={styles.mobileContent}>
        <span className={styles.mobileEyebrow}>Taigarenda · Аренда транспорта</span>
        <h2 className={styles.mobileTitle}>
          Куда не доедет<br />
          <span className={styles.mobileAccent}>обычная машина.</span>
        </h2>
        <p className={styles.mobileBody}>
          Taigarenda — сервис проката холдинга «Велес И К»: снегоходы,
          вездеходы и внедорожники для маршрутов по тайге Республики Коми.
        </p>
        <a href={CTA_HREF} className={styles.mobileCta}>
          Арендовать транспорт
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor"
              strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  );
}

// ─── Десктопная версия (canvas + frame sequence) ──────────────────
function CarRentalDesktop() {
  const sectionRef  = useRef(null);
  const canvasRef   = useRef(null);
  const ctxRef      = useRef(null);

  // Frame engine
  const cache       = useRef(new Map());   // index → ImageBitmap
  const inflight    = useRef(new Set());   // index — в процессе загрузки
  const pool        = useRef(null);
  const progress    = useRef(0);
  const prevProgress= useRef(-1);
  const shownFrame  = useRef(0);
  const tickerFn    = useRef(null);

  // Text animation refs
  const lineRef     = useRef(null);
  const ctaRef      = useRef(null);
  const blockRefs   = useRef([]);
  const eyebrowRefs = useRef([]);
  const hRefs       = useRef([]);          // [i*2 + li]
  const accentRefs  = useRef([]);
  const bodyRefs    = useRef([]);
  const statRefs    = useRef([]);
  const dotRefs     = useRef([]);

  const [ready, setReady] = useState(false);

  const { gsap, ScrollTrigger } = useGSAP();

  // ── Canvas ─────────────────────────────────────────────────────
  const initCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
    ctxRef.current = c.getContext("2d", { alpha: false, desynchronized: true });
  }, []);

  const paint = useCallback((bitmap) => {
    const ctx = ctxRef.current;
    const c   = canvasRef.current;
    if (!ctx || !c || !bitmap) return;

    const vw = c.width, vh = c.height;
    const vr = vw / vh;
    const ir = bitmap.width / bitmap.height;
    let dw, dh, dx, dy;

    if (ir > vr) {                         // шире — обрезаем по бокам
      dh = vh; dw = dh * ir;
      dx = (vw - dw) / 2; dy = 0;
    } else {                               // выше — обрезаем сверху/снизу
      dw = vw; dh = dw / ir;
      dx = 0; dy = (vh - dh) / 2;
    }
    ctx.drawImage(bitmap, dx, dy, dw, dh);
  }, []);

  // ── Preload ────────────────────────────────────────────────────
  const load = useCallback((idx, prio = "normal") => {
    if (!pool.current) return;                         // pool ещё не создан
    if (idx < 1 || idx > FRAME_COUNT) return;
    if (cache.current.has(idx) || inflight.current.has(idx)) return;
    inflight.current.add(idx);
    const task = async () => {
      try {
        const bm = await fetchBitmap(frameUrl(idx));
        cache.current.set(idx, bm);
      } catch { /* ignore — 404 и т.п. */ }
      finally { inflight.current.delete(idx); }
    };
    pool.current[prio](task);
  }, []);

  const preload = useCallback((center, vel) => {
    const r   = PRELOAD_RADIUS + Math.min(PRELOAD_BOOST, Math.floor(vel * 80));
    const from = Math.max(1, center - r);
    const to   = Math.min(FRAME_COUNT, center + r);
    for (let i = from; i <= to; i++) load(i, i >= center ? "high" : "normal");
  }, [load]);

  // ── Ticker: запускается после mount ───────────────────────────
  const startTicker = useCallback(() => {
    if (tickerFn.current || !gsap) return;

    tickerFn.current = () => {
      const p = progress.current;
      if (p === prevProgress.current) return;
      const vel = Math.abs(p - prevProgress.current);
      prevProgress.current = p;

      const target = Math.max(1, Math.min(FRAME_COUNT,
        Math.round(1 + p * (FRAME_COUNT - 1))
      ));

      if (target !== shownFrame.current) {
        const bm = cache.current.get(target);
        if (bm) { paint(bm); shownFrame.current = target; }
        else load(target, "high");           // запрашиваем если нет в кэше
      }
      preload(target, vel);
    };

    gsap.ticker.add(tickerFn.current);
  }, [gsap, paint, load, preload]);

  // ── Init ───────────────────────────────────────────────────────
  useEffect(() => {
    // pool ПЕРВЫМ — load() зависит от него. В StrictMode (dev) этот
    // эффект выполняется дважды подряд; ref переживает оба вызова.
    pool.current = pool.current ?? createPool(MAX_CONCURRENT);
    initCanvas();

    // Первый кадр грузим напрямую и ставим ready по факту готовности.
    let cancelled = false;
    fetchBitmap(frameUrl(1))
      .then((bm) => {
        cache.current.set(1, bm);
        if (cancelled) return;
        paint(bm);
        shownFrame.current = 1;
        setReady(true);
      })
      .catch(() => {
        // Не блокируем интерфейс навечно, если первый кадр не загрузился
        if (!cancelled) setReady(true);
      });

    // Остальные кадры — фоном, не блокируют первую отрисовку
    for (let i = 2; i <= Math.min(FRAME_COUNT, 20); i++) load(i, "normal");

    const onResize = () => {
      initCanvas();
      const bm = cache.current.get(shownFrame.current);
      if (bm) paint(bm);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      if (tickerFn.current) {
        try { gsap.ticker.remove(tickerFn.current); } catch {}
        tickerFn.current = null;
      }
      // НЕ чистим cache/pool при unmount в StrictMode —
      // второй mount должен найти уже загруженные кадры
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── GSAP: ScrollTrigger + текстовые анимации ──────────────────
  useEffect(() => {
    if (!gsap || !ScrollTrigger || !ready) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {

      // Canvas scrub — ScrollTrigger вдоль всей секции
      startTicker();

      const pinST = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${FRAME_COUNT * SCROLL_PX}`,
        pin: true,
        pinSpacing: true,
        scrub: false,
        onUpdate: (self) => { progress.current = self.progress; },
      });

      // Начальные состояния текста
      gsap.set(hRefs.current.filter(Boolean),       { yPercent: 108, rotateX: -10, opacity: 0 });
      gsap.set(accentRefs.current.filter(Boolean),  { yPercent: 108, opacity: 0 });
      gsap.set(eyebrowRefs.current.filter(Boolean), { opacity: 0, y: 10 });
      gsap.set(bodyRefs.current.filter(Boolean),    { opacity: 0, y: 14 });
      gsap.set(statRefs.current.filter(Boolean),    { opacity: 0, y: 14 });
      gsap.set(dotRefs.current.filter(Boolean),     { scale: 0, opacity: 0 });
      gsap.set(lineRef.current,                      { scaleY: 0, transformOrigin: "top center" });
      gsap.set(ctaRef.current,                       { opacity: 0, y: 22 });

      // Линия индикатора — растёт со скроллом
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${FRAME_COUNT * SCROLL_PX}`,
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(lineRef.current, { scaleY: self.progress });
        },
      });

      // Текстовые блоки — появляются на конкретном кадре (block.frame)
      // и уступают место следующему; toggleActions скрывает блок при
      // выходе из диапазона в обе стороны.
      BLOCKS.forEach((block, i) => {
        const startPx  = (block.frame - 1) * SCROLL_PX;
        const nextFrame = BLOCKS[i + 1]?.frame ?? CTA_FRAME;
        const endPx    = (nextFrame - 1) * SCROLL_PX;

        const hLines = [
          hRefs.current[i * 2],
          hRefs.current[i * 2 + 1],
        ].filter(Boolean);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            // Числом от начала пина, а не строкой "top+=Npx top" — для
            // запиненного элемента такая строка считается от позиции
            // ПОСЛЕ окончания пина, а не от его начала.
            start: () => pinST.start + startPx,
            end:   () => pinST.start + endPx,
            toggleActions: "play reverse play reverse",
          },
        });

        tl.to(dotRefs.current[i],    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }, 0)
          .to(eyebrowRefs.current[i],{ opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.06)
          .to(hLines,                { yPercent: 0, rotateX: 0, opacity: 1, stagger: 0.09, duration: 0.75, ease: "power4.out" }, 0.12)
          .to(accentRefs.current[i], { yPercent: 0, opacity: 1, duration: 0.65, ease: "power4.out" }, 0.28)
          .to(bodyRefs.current[i],   { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0.4)
          .to(statRefs.current[i],   { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.5);
      });

      // CTA — появляется на кадре CTA_FRAME
      const ctaPx = (CTA_FRAME - 1) * SCROLL_PX;
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: () => pinST.start + ctaPx,
          toggleActions: "play none none reverse",
        },
      }).to(ctaRef.current, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" });

    }, sectionRef);

    return () => ctx.revert();
  }, [gsap, ScrollTrigger, ready, startTicker]);

  return (
    <section id="transport" ref={sectionRef} className={styles.section}>

      {/* Лоадер — тонкая строка + линия, без спиннера */}
      {!ready && (
        <div className={styles.loader} aria-live="polite">
          <span className={styles.loaderText}>Загружаем кадры</span>
          <span className={styles.loaderLine} aria-hidden="true" />
        </div>
      )}

      {/* Canvas */}
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Overlay */}
      <div className={styles.overlay} />

      {/* Угловая метка */}
      <span className={styles.cornerLabel}>
        Республика Коми&nbsp;&nbsp;·&nbsp;&nbsp;Транспорт
      </span>

      {/* Вертикальный индикатор */}
      <aside className={styles.indicator}>
        <div className={styles.indicatorTrack} ref={lineRef} />
        {BLOCKS.map((_, i) => (
          <div
            key={i}
            className={styles.indicatorDot}
            ref={(el) => { dotRefs.current[i] = el; }}
            style={{ top: `${BLOCKS.length > 1 ? (i / (BLOCKS.length - 1)) * 80 + 10 : 50}%` }}
          />
        ))}
      </aside>

      {/* Текстовый слой */}
      <div className={styles.textLayer}>
        {BLOCKS.map((block, i) => (
          <div
            key={block.id}
            className={styles.block}
            ref={(el) => { blockRefs.current[i] = el; }}
          >
            {/* Номер и eyebrow прячем вместе — иначе номера трёх блоков
                висят на экране одновременно до появления текста */}
            <div className={styles.meta} ref={(el) => { eyebrowRefs.current[i] = el; }}>
              <span className={styles.blockNum}>{block.id}</span>
              <span className={styles.eyebrow}>{block.eyebrow}</span>
            </div>

            <div className={styles.headlineWrap}>
              {block.headline.map((line, li) => (
                <div key={li} className={styles.lineClip}>
                  <h2
                    className={styles.hLine}
                    ref={(el) => { hRefs.current[i * 2 + li] = el; }}
                  >
                    {line}
                  </h2>
                </div>
              ))}
              <div className={styles.lineClip}>
                <h2
                  className={`${styles.hLine} ${styles.hAccent}`}
                  ref={(el) => { accentRefs.current[i] = el; }}
                >
                  {block.accent}
                </h2>
              </div>
            </div>

            <p className={styles.body} ref={(el) => { bodyRefs.current[i] = el; }}>
              {block.body}
            </p>

            <div className={styles.stat} ref={(el) => { statRefs.current[i] = el; }}>
              <span className={styles.statValue}>{block.stat.value}</span>
              <span className={styles.statLabel}>{block.stat.label}</span>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className={styles.ctaWrap} ref={ctaRef}>
          <div className={styles.lineClip}>
            <h2 className={`${styles.hLine} ${styles.ctaTitle}`}>Тайга ждёт.</h2>
          </div>
          <a href={CTA_HREF} className={styles.ctaBtn}>
            Арендовать транспорт
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M3 7.5h9M8.5 3.5l4 4-4 4" stroke="currentColor"
                strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <p className={styles.ctaSub}>Заказ через контакты komi.world</p>
        </div>
      </div>

    </section>
  );
}

// ─── Root — mobile / static (reduced motion) / desktop ───────────
export default function CarRental() {
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const mqMobile  = window.matchMedia("(max-width: 767px)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compute = () =>
      setMode(mqMobile.matches ? "mobile" : mqReduced.matches ? "static" : "desktop");
    compute();
    mqMobile.addEventListener("change", compute);
    mqReduced.addEventListener("change", compute);
    return () => {
      mqMobile.removeEventListener("change", compute);
      mqReduced.removeEventListener("change", compute);
    };
  }, []);

  if (mode === null) return null;               // избегаем hydration mismatch
  if (mode === "mobile") return <CarRentalStatic />;
  if (mode === "static") return <CarRentalStatic wide />;
  return <CarRentalDesktop />;
}
