"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionHead from "@/components/SectionHead/SectionHead";
import useGSAP from "@/hooks/useGSAP";
import useReveal from "@/hooks/useReveal";
import useParallax from "@/hooks/useParallax";
import useVideoInView from "@/hooks/useVideoInView";
import { PHOTOS } from "@/data/photos";
import { INFO_DATA } from "@/data/InfoData";
import { MACHINES, RENTAL_MAP, loreUrl } from "@/data/yoranLineup";
import styles from "./TransportSection.module.css";

// Глава 08 · YÖRAN — транспорт. Три части:
//   Гараж — шоурум семи машин линейки YÖRAN: сцена с машиной, полоса ступеней
//           I–VII (на десктопе гараж пинится и ступени листаются скроллом),
//           паспорт машины справа;
//   Панели — YÖRAN Taxi (сервис Taiga Taxi) и YÖRAN Прокат (Taigarenda):
//           тексты — из InfoData 09/10, машины — из yoranLineup.js;
//   Лента  — «Тайга ждёт.» с двумя кнопками на контакты.
// Факты — README холдинга и сайт YÖRAN; все сроки линейки — план (сайт YÖRAN
// помечен как прототип-концепция). Золото гаража — --chapter-accent.

const YORAN_URL = "https://yoran-web.vercel.app/";
const RENTAL = INFO_DATA.find((c) => c.id === "09");
const TAXI = INFO_DATA.find((c) => c.id === "10");
const STEPS = MACHINES.length;

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function photoOf(m) {
  return PHOTOS[m.photo];
}

// ── Сцена: пластины машин, крупная цифра ступени, имя ────────────────
function Stage({ idx, touch }) {
  const m = MACHINES[idx];
  return (
    <div className={styles.stage} id="garage-stage" role="tabpanel" aria-labelledby={`garage-tab-${idx}`}>
      <div className={styles.stageGrain} aria-hidden="true" />
      <div className={styles.plates} aria-hidden="true">
        {MACHINES.map((mm, i) => {
          const p = photoOf(mm);
          return (
            <div className={`${styles.plateWrap} ${i === idx ? styles.plateActive : ""}`} key={mm.step}>
              <div className={styles.plate}>
                <Image
                  src={p.src}
                  alt=""
                  width={p.w}
                  height={p.h}
                  sizes="(max-width: 767px) 84vw, (max-width: 1023px) 92vw, 60vw"
                  quality={78}
                  placeholder={p.blur ? "blur" : "empty"}
                  blurDataURL={p.blur}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.stageWash} aria-hidden="true" />
      <div className={styles.stageStrip} aria-hidden="true" />

      <span className={styles.stageChip}>Визуализация · YÖRAN</span>
      <span className={styles.stageRoman} aria-hidden="true">{m.roman}</span>

      <div className={styles.stageText} key={m.step}>
        <span className={styles.lineClip}><span className={styles.stageName}>{m.name}</span></span>
        <span className={styles.lineClip}><span className={styles.stageType}>{m.type}</span></span>
        <span className={styles.stageKicker}>{m.element}</span>
      </div>

      <div className={styles.stageYear}>
        <span className={styles.stageYearNum}>{m.year}</span>
        <span className={styles.planChip}>План</span>
      </div>

      <a
        className={styles.stageLink}
        href={YORAN_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Сайт YÖRAN, открывается в новой вкладке"
      >
        {touch ? "yoran-web" : ""} <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}

// ── Паспорт машины ───────────────────────────────────────────────────
function Passport({ m, inline }) {
  const lore = loreUrl(m);
  return (
    <div className={`${styles.card} ${inline ? styles.cardInline : ""}`} key={m.step}>
      <div className={styles.cardHead}>
        <span className={styles.cardIdx}>{m.roman} / VII</span>
        <span className={styles.chip}>Ступень {m.roman}</span>
        <span className={styles.planChip}>План</span>
      </div>
      <h3 className={styles.cardName}>{m.name}</h3>
      <p className={styles.cardType}>{m.type}</p>

      <dl className={styles.ledger}>
        <div className={styles.row}><dt>Тип</dt><dd>{m.type}</dd></div>
        <div className={styles.row}><dt>Срок</dt><dd>план · {m.year}</dd></div>
        <div className={styles.row}><dt>Ступень</dt><dd>{m.roman} из VII — от простой сборки к сложной, от лёгкой сертификации к тяжёлой</dd></div>
        <div className={`${styles.row} ${styles.rowSplit}`}><dt>Завод</dt><dd>Ухта, 65 995 м², собственный ж/д тупик, тактовая линия на десять постов</dd></div>
        <div className={styles.row}><dt>Полигон</dt><dd>до −50 °C: болота, снег, тайга, Приполярный Урал; коридор Якша — Маньпупунёр</dd></div>
        <div className={styles.row}><dt>Локализация</dt><dd>SKD → CKD → собственный российский бренд с патентами</dd></div>
        {m.lore && (
          <div className={styles.row}>
            <dt>Имя из эпоса</dt>
            <dd>
              {m.lore.gloss}{" "}
              <a href={lore} target="_blank" rel="noopener noreferrer" className={styles.loreLink}>
                Читать на карте преданий <span aria-hidden="true">↗</span>
              </a>
            </dd>
          </div>
        )}
        {m.eco && (
          <div className={styles.row}><dt>В экосистеме</dt><dd>{m.eco}</dd></div>
        )}
      </dl>

      <div className={styles.cardFoot}>
        <span className={styles.chip}>Ухта</span>
        <span className={styles.chip}>Бренд холдинга</span>
        <a className={styles.cardLink} href={YORAN_URL} target="_blank" rel="noopener noreferrer">
          Сайт YÖRAN <span aria-hidden="true">↗</span>
        </a>
      </div>
      <p className={styles.cardNote}>
        Каждая машина названа именем из эпоса коми и вводится своей ступенью. Сроки — план: сайт YÖRAN помечен как прототип-концепция.
      </p>
    </div>
  );
}

// ── Панель такси ─────────────────────────────────────────────────────
function TaxiPanel({ onShow, lit }) {
  const ref = useRef(null);
  const videoRef = useRef(null);
  useVideoInView(ref, videoRef);
  const poster = PHOTOS["cgi-komi-taxi"];
  const works = TAXI?.works ?? [];
  return (
    <article id="taxi" ref={ref} className={`${styles.panel} ${styles.panelTaxi} ${lit ? styles.panelLit : ""}`} data-reveal>
      <video
        ref={videoRef}
        className={styles.panelVideo}
        src="/video-komi-taxi.mp4"
        poster={poster?.src}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className={styles.panelWash} aria-hidden="true" />
      <span className={styles.panelChip}>Визуализация</span>
      <div className={styles.panelTop}>
        <span className={styles.panelLabel}>YÖRAN Taxi</span>
        <span className={styles.panelEyebrow}>Taiga Taxi · сервис холдинга «Велес И К»</span>
        <h3 className={styles.panelTitle}>Такси<br />по республике</h3>
        <span className={styles.chip}>Бренд холдинга</span>
      </div>
      <ol className={styles.tickets}>
        {works.map((w, i) => (
          <li className={styles.ticket} key={w.title}>
            <span className={styles.ticketIdx}>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h4 className={styles.ticketName}>{w.title}</h4>
              <span className={styles.ticketSub}>{w.sub}</span>
              <p className={styles.ticketDesc}>{i === 0 ? "Поездки по городу и между городами республики." : "Сервис из портфеля холдинга; подробностей пока нет."}</p>
              {w.badge === "В проекте" && <span className={styles.chipProject}>В проекте</span>}
            </div>
          </li>
        ))}
      </ol>
      <div className={styles.bridge}>
        <span>Аэротакси в линейке YÖRAN — Войпель, ступень VII, план 2035–2036</span>
        <button type="button" className={styles.showBtn} onClick={() => onShow(6)} aria-controls="garage-stage">
          Показать в гараже <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className={styles.panelFoot}>
        <a className={styles.ctaWhite} href="#contacts">Заказать такси <span aria-hidden="true">→</span></a>
        <span className={styles.ctaSub}>Заказ через контакты komi.world</span>
      </div>
    </article>
  );
}

// ── Панель проката ───────────────────────────────────────────────────
function RentalPanel({ onShow }) {
  const map = PHOTOS["cgi-komi-map"];
  const gondola = PHOTOS["render-gondola"];
  return (
    <article id="rental" className={`${styles.panel} ${styles.panelRental}`} data-reveal data-parallax-scope>
      <div className={styles.panelBg} data-parallax="6">
        <Image src={map.src} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" quality={72} placeholder="blur" blurDataURL={map.blur} />
      </div>
      <div className={styles.panelWash} aria-hidden="true" />
      <span className={styles.panelChip}>Визуализация</span>
      <div className={styles.panelTop}>
        <span className={styles.panelLabel}>YÖRAN Прокат</span>
        <span className={styles.panelEyebrow}>Taigarenda · сервис проката холдинга</span>
        <h3 className={styles.panelTitle}>Куда не доедет<br />обычная машина</h3>
        <span className={styles.chip}>Бренд холдинга</span>
      </div>

      <dl className={styles.rentLedger}>
        {RENTAL_MAP.map((r) => {
          const m = MACHINES[r.step - 1];
          return (
            <div className={styles.rentRow} key={r.label}>
              <dt><span className={styles.rentLabel}>{r.label}</span><span className={styles.rentNote}>{r.note}</span></dt>
              <dd>
                <span className={styles.rentMachine}>{m.roman} {m.name} · план {m.year}</span>
                <button type="button" className={styles.showBtn} onClick={() => onShow(r.step - 1)} aria-controls="garage-stage">
                  Показать в гараже <span aria-hidden="true">→</span>
                </button>
              </dd>
            </div>
          );
        })}
        <div className={styles.rentRow}>
          <dt><span className={styles.rentLabel}>Условия и маршруты</span></dt>
          <dd><span className={styles.rentMachine}>по запросу через контакты</span></dd>
        </div>
      </dl>
      <p className={styles.rentNoteFoot}>Справа — какая машина плановой линейки YÖRAN отвечает классу; это соответствие с планом, а не сегодняшний парк.</p>

      <div className={styles.skyview}>
        <div className={styles.inset}>
          <Image src={gondola.src} alt={gondola.alt} width={112} height={160} sizes="112px" quality={72} placeholder="blur" blurDataURL={gondola.blur} />
          <span className={styles.insetChip}>Визуализация</span>
        </div>
        <div>
          <p className={styles.skyText}>Зимний сезон фуникулёра «Якша Skyview» планируется на снегоходах YÖRAN.</p>
          <p className={styles.skyText}>{RENTAL?.works?.[0]?.desc}</p>
        </div>
      </div>

      <div className={styles.panelFoot}>
        <a className={styles.ctaOutline} href="#contacts">Арендовать транспорт <span aria-hidden="true">→</span></a>
        <span className={styles.ctaSub}>Заказ через контакты komi.world</span>
      </div>
    </article>
  );
}

// ── Секция ───────────────────────────────────────────────────────────
export default function TransportSection() {
  const sectionRef = useRef(null);
  const garageRef = useRef(null);
  const fillRef = useRef(null);
  const railRef = useRef(null);
  const pinRef = useRef(null);
  const idxRef = useRef(0);
  const [idx, setIdxState] = useState(0);
  const [mode, setMode] = useState("desktop"); // desktop | tablet | mobile
  const [touch, setTouch] = useState(false);
  const [lit, setLit] = useState(false);
  const { gsap, ScrollTrigger } = useGSAP();

  const setIdx = useCallback((i) => {
    const n = Math.max(0, Math.min(STEPS - 1, i));
    if (idxRef.current === n) return;
    idxRef.current = n;
    setIdxState(n);
  }, []);

  useReveal(sectionRef, { stagger: 0.06, start: "top 80%" });
  useParallax(sectionRef);

  // Режим раскладки + touch
  useEffect(() => {
    const mqDesk = window.matchMedia("(min-width: 1024px)");
    const mqMob = window.matchMedia("(max-width: 767px)");
    const mqTouch = window.matchMedia("(hover: none)");
    const compute = () => {
      setMode(mqDesk.matches ? "desktop" : mqMob.matches ? "mobile" : "tablet");
      setTouch(mqTouch.matches);
    };
    compute();
    [mqDesk, mqMob, mqTouch].forEach((mq) => mq.addEventListener("change", compute));
    return () => [mqDesk, mqMob, mqTouch].forEach((mq) => mq.removeEventListener("change", compute));
  }, []);

  // Пин гаража на десктопе: прогресс рельсы листает ступени
  useEffect(() => {
    if (!gsap || !ScrollTrigger || mode !== "desktop" || prefersReduced()) return;
    if (window.innerHeight < 720) return; // низкое окно: гараж не пинится, ступени — табы
    const garage = garageRef.current;
    if (!garage) return;
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 72;
    const st = ScrollTrigger.create({
      trigger: garage,
      start: () => `top top+=${headerH + 16}`,
      end: "+=320%",
      pin: true,
      pinSpacing: true,
      scrub: true,
      // См. LandmarksSection: сортировка триггеров по положению в документе
      refreshPriority: 0,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (fillRef.current) gsap.set(fillRef.current, { scaleX: p });
        setIdx(Math.min(STEPS - 1, Math.floor(p * STEPS)));
      },
    });
    pinRef.current = st;
    // Секции выше могли добавить свои пины после нашего измерения — пересчёт
    ScrollTrigger.refresh();
    return () => { st.kill(); pinRef.current = null; };
  }, [gsap, ScrollTrigger, mode, setIdx]);

  // Мобильная лента: активная машина — та, что в кадре
  useEffect(() => {
    if (mode !== "mobile") return;
    const rail = railRef.current;
    if (!rail) return;
    const slides = [...rail.querySelectorAll("[data-slide]")];
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setIdx(+e.target.dataset.slide); }); },
      { root: rail, threshold: 0.6 }
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [mode, setIdx]);

  // Переход к ступени: при пине — скролл по рельсе, иначе просто выбор
  const goTo = useCallback((i) => {
    const st = pinRef.current;
    if (st && typeof window !== "undefined") {
      const target = st.start + ((i + 0.5) / STEPS) * (st.end - st.start);
      if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.1 });
      else window.scrollTo({ top: target, behavior: "smooth" });
      return;
    }
    setIdx(i);
    if (mode === "mobile" && railRef.current) {
      const slide = railRef.current.querySelector(`[data-slide="${i}"]`);
      if (slide) railRef.current.scrollTo({ left: slide.offsetLeft - 24, behavior: "smooth" });
    } else if (garageRef.current) {
      const top = garageRef.current.getBoundingClientRect().top + window.scrollY - 96;
      if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1 });
      else window.scrollTo({ top, behavior: "smooth" });
    }
  }, [mode, setIdx]);

  const onKey = (e) => {
    const map = { ArrowRight: idx + 1, ArrowDown: idx + 1, ArrowLeft: idx - 1, ArrowUp: idx - 1, Home: 0, End: STEPS - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const n = Math.max(0, Math.min(STEPS - 1, map[e.key]));
    goTo(n);
    e.currentTarget.parentElement?.querySelector(`#garage-tab-${n}`)?.focus();
  };

  const m = MACHINES[idx];

  return (
    <section id="transport" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <SectionHead
          num="08"
          eyebrow="YÖRAN · Транспорт"
          title={"Гараж\nYÖRAN"}
          lead="Арктическая техника холдинга и два его транспортных сервиса. Семь машин YÖRAN названы именами из эпоса коми и вводятся ступенями — от гидроцикла 2029 года до аэротакси 2035–2036, сроки — план. Taiga Taxi возит по городу и между городами республики, Taigarenda даёт напрокат снегоходы, вездеходы и внедорожники."
          action={{ label: "Сайт YÖRAN", href: YORAN_URL, external: true }}
        />

        <dl className={styles.stats}>
          {[
            ["I–VII", "ступеней линейки YÖRAN: семь машин"],
            ["2029", "первая машина — гидроцикл Вакуль, план"],
            ["2035–2036", "аэротакси Войпель eVTOL, план"],
            ["−50 °C", "полигон YÖRAN: болота, снег, тайга, Приполярный Урал"],
          ].map(([v, l]) => (
            <div className={styles.stat} key={l} data-reveal>
              <dt className={styles.statLabel}>{l}</dt>
              <dd className={styles.statValue}>{v}</dd>
            </div>
          ))}
        </dl>

        {/* ── Гараж. Обёртка нужна ScrollTrigger: пин заворачивает гараж в
            .pin-spacer, и у его родителя не должно быть других детей, иначе
            React при перестановке соседей падает (insertBefore/removeChild). */}
        <div className={styles.garageWrap}>
        <div className={styles.garage} ref={garageRef} data-garage data-mode={mode}>
          <div className={styles.garageMain}>
            {mode === "mobile" ? (
              <div className={styles.rail} ref={railRef} id="garage-stage" role="tabpanel" aria-labelledby={`garage-tab-${idx}`}>
                {MACHINES.map((mm, i) => {
                  const p = photoOf(mm);
                  return (
                    <div className={`${styles.slide} ${i === idx ? styles.slideActive : ""}`} key={mm.step} data-slide={i}>
                      <div className={styles.stageGrain} aria-hidden="true" />
                      <div className={styles.slidePlate}>
                        <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="84vw" quality={76} placeholder={p.blur ? "blur" : "empty"} blurDataURL={p.blur} />
                      </div>
                      <div className={styles.stageWash} aria-hidden="true" />
                      <span className={styles.stageChip}>Визуализация · YÖRAN</span>
                      <span className={styles.stageRoman} aria-hidden="true">{mm.roman}</span>
                      <div className={styles.stageText}>
                        <span className={styles.stageName}>{mm.name}</span>
                        <span className={styles.stageType}>{mm.type}</span>
                      </div>
                      <div className={styles.stageYear}><span className={styles.stageYearNum}>{mm.year}</span><span className={styles.planChip}>План</span></div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Stage idx={idx} touch={touch} />
            )}

            {/* Полоса ступеней; хвост «→ Такси» — вне tablist */}
            <div className={styles.stripWrap}>
            <a className={styles.stripTail} href="#taxi" onMouseEnter={() => setLit(true)} onMouseLeave={() => setLit(false)} onFocus={() => setLit(true)} onBlur={() => setLit(false)}>
              → Такси
            </a>
            <div className={styles.strip} role="tablist" aria-label="Ступени линейки YÖRAN">
              <span className={styles.stripFill} ref={fillRef} aria-hidden="true" />
              <span className={styles.stripMark} style={{ left: `${((idx + 0.5) / STEPS) * 100}%` }} aria-hidden="true" />
              {MACHINES.map((mm, i) => {
                const p = photoOf(mm);
                const state = i === idx ? styles.stepActive : i < idx ? styles.stepPast : styles.stepFuture;
                return (
                  <button
                    type="button"
                    role="tab"
                    id={`garage-tab-${i}`}
                    key={mm.step}
                    className={`${styles.step} ${state}`}
                    aria-selected={i === idx}
                    aria-controls="garage-stage"
                    tabIndex={i === idx ? 0 : -1}
                    onClick={() => goTo(i)}
                    onKeyDown={onKey}
                  >
                    <span className={styles.stepThumb}>
                      <Image src={p.src} alt="" width={128} height={80} sizes="128px" quality={72} />
                    </span>
                    <span className={styles.stepRoman}>{mm.roman}</span>
                    <span className={styles.stepName}>{mm.name}</span>
                    <span className={styles.stepKicker}>{mm.element}</span>
                    <span className={styles.stepYear}>{mm.year} <span className={styles.stepPlan}>план</span></span>
                  </button>
                );
              })}
            </div>
            </div>
          </div>

          <aside className={styles.garageAside}>
            <Passport m={m} />
          </aside>
        </div>
        </div>

        {/* ── Сервисы ── */}
        <div className={styles.panels}>
          <TaxiPanel onShow={goTo} lit={lit} />
          <RentalPanel onShow={goTo} />
        </div>

        {/* ── Лента ── */}
        <div className={styles.band} data-reveal>
          <h3 className={styles.bandTitle}>Тайга ждёт.</h3>
          <div className={styles.bandBtns}>
            <a className={styles.ctaWhite} href="#contacts">Заказать такси <span aria-hidden="true">→</span></a>
            <a className={styles.ctaOutline} href="#contacts">Арендовать транспорт <span aria-hidden="true">→</span></a>
          </div>
          <span className={styles.ctaSub}>Заказ через контакты komi.world</span>
        </div>
      </div>
    </section>
  );
}
