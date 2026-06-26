"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import useGSAP from "@/hooks/useGSAP";

import ServicesHeader from "./ServicesHeader/ServicesHeader";
import ServicesTrack  from "./ServicesTrack/ServicesTrack";
import ServicesNav    from "./ServicesNav/ServicesNav";
import DetailOverlay  from "./DetailOverlay/DetailOverlay";

import "./ServicesSlider.css";

export default function ServicesSlider({
  sliderInfo,
  services: servicesProp,
  sectionId          = "services",
  ctaLabel           = "View work",
  statLabel          = "Projects",
  secondaryStatLabel,
  secondaryStatValue,
  worksCtaLabel      = "See all work",
  worksCtaHref       = "/work",
  showWorksCta       = true,
  showStats          = true,
}) {
  const sectionRef    = useRef(null);
  const viewportRef   = useRef(null);
  const trackRef      = useRef(null);
  const navRowRef     = useRef(null);
  const titleRef      = useRef(null);
  const counterRef    = useRef(null);
  const cardRefs      = useRef([]);
  const detailRef     = useRef(null);
  const portfolioRef  = useRef(null);
  const detailCardRef = useRef(null);
  const closeBtnRef   = useRef(null);
  const workItemRefs  = useRef([]);

  const isAnimatingRef  = useRef(false);
  const originRectRef   = useRef(null);
  const openRafRef      = useRef(null);
  const isMobileRef     = useRef(false);
  const savedScrollYRef = useRef(0);

  // ── Drag state ────────────────────────────────────────────────
  const boundsRef         = useRef({ min: 0, max: 0 });
  const stepRef           = useRef(0);
  const dragRef           = useRef({ dragging: false, startX: 0, startTx: 0, moved: false, pointerId: null });
  const suppressClickRef  = useRef(false);

  const [activeIndex,     setActiveIndex]     = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [detailVisible,   setDetailVisible]   = useState(false);

  const { gsap, ScrollTrigger } = useGSAP();

  const services = servicesProp ?? [];

  // ── Scroll lock ───────────────────────────────────────────────
  const lockBodyScroll = useCallback(() => {
    savedScrollYRef.current = window.scrollY;

    const section = sectionRef.current;
    if (section) {
      Array.from(document.body.children).forEach(el => {
        if (!el.contains(section) && el !== section) {
          el.dataset.hiddenByServices = el.style.visibility || "";
          el.style.visibility = "hidden";
        }
      });
    }

    document.body.style.position = "fixed";
    document.body.style.top      = `-${savedScrollYRef.current}px`;
    document.body.style.left     = "0";
    document.body.style.right    = "0";
    document.body.style.overflow = "hidden";
  }, []);

  const unlockBodyScroll = useCallback(() => {
    Array.from(document.body.children).forEach(el => {
      if ("hiddenByServices" in el.dataset) {
        el.style.visibility = el.dataset.hiddenByServices;
        delete el.dataset.hiddenByServices;
      }
    });

    document.body.style.position = "";
    document.body.style.top      = "";
    document.body.style.left     = "";
    document.body.style.right    = "";
    document.body.style.overflow = "";
    window.scrollTo({ top: savedScrollYRef.current, behavior: "instant" });
  }, []);

  // ── Detect mobile ─────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    isMobileRef.current = mq.matches;
    const onChange = (e) => { isMobileRef.current = e.matches; };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // ── Measure ───────────────────────────────────────────────────
  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track    = trackRef.current;
    if (!viewport || !track) return;

    const cards = cardRefs.current.filter(Boolean);
    let step = 0;
    if (cards.length > 1) {
      step = cards[1].offsetLeft - cards[0].offsetLeft;
    } else if (cards.length === 1) {
      step = cards[0].offsetWidth;
    }
    stepRef.current = step;

    const min = Math.min(0, viewport.clientWidth - track.scrollWidth);
    boundsRef.current = { min, max: 0 };
  }, []);

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  // ── Go to slide ───────────────────────────────────────────────
  const goTo = useCallback((index) => {
    const count   = services.length;
    const clamped = Math.max(0, Math.min(count - 1, index));
    setActiveIndex(clamped);

    if (!gsap || !trackRef.current) return;
    const target = clamp(-clamped * stepRef.current, boundsRef.current.min, boundsRef.current.max);
    gsap.to(trackRef.current, { x: target, duration: 0.6, ease: "power3.out" });
  }, [gsap, services.length]);

  // ── Keyboard navigation ───────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (detailVisible) {
        if (e.key === "Escape") closeDetail();
        return;
      }
      if (document.activeElement && document.activeElement !== document.body) {
        // Если фокус внутри другого поля — не перехватываем
        const tag = document.activeElement.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      }
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(activeIndex + 1); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); goTo(activeIndex - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goTo, activeIndex, detailVisible]);

  // ── Pointer drag ──────────────────────────────────────────────
  const onPointerDown = useCallback((e) => {
    if (!gsap || !trackRef.current) return;
    const track = trackRef.current;
    measure();

    dragRef.current = {
      dragging:  true,
      startX:    e.clientX,
      startTx:   gsap.getProperty(track, "x"),
      moved:     false,
      pointerId: e.pointerId,
    };

    gsap.killTweensOf(track);
    try { track.setPointerCapture(e.pointerId); } catch {}
  }, [gsap, measure]);

  const onPointerMove = useCallback((e) => {
    const d = dragRef.current;
    if (!d.dragging || !trackRef.current) return;
    e.preventDefault();

    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;

    const next = clamp(d.startTx + dx, boundsRef.current.min, boundsRef.current.max);
    gsap.set(trackRef.current, { x: next });
  }, [gsap]);

  const onPointerUp = useCallback((e) => {
    const d = dragRef.current;
    if (!d.dragging) return;
    d.dragging = false;

    try { trackRef.current?.releasePointerCapture(e.pointerId); } catch {}

    const step     = stepRef.current || 1;
    const currentX = gsap.getProperty(trackRef.current, "x");
    const idx      = Math.round(-currentX / step);

    suppressClickRef.current = d.moved;
    goTo(idx);
  }, [gsap, goTo]);

  // ── Trackpad wheel ────────────────────────────────────────────
  const wheelSnapRef = useRef(null);

  const onWheel = useCallback((e) => {
    if (!gsap || !trackRef.current) return;
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();

    gsap.killTweensOf(trackRef.current);
    const current = gsap.getProperty(trackRef.current, "x");
    const next    = clamp(current - e.deltaX, boundsRef.current.min, boundsRef.current.max);
    gsap.set(trackRef.current, { x: next });

    clearTimeout(wheelSnapRef.current);
    wheelSnapRef.current = setTimeout(() => {
      const step = stepRef.current || 1;
      const x    = gsap.getProperty(trackRef.current, "x");
      goTo(Math.round(-x / step));
    }, 120);
  }, [gsap, goTo]);

  useEffect(() => () => clearTimeout(wheelSnapRef.current), []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  // ── Reveal-on-scroll + measure ────────────────────────────────
  useEffect(() => {
    if (!gsap || !ScrollTrigger) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      measure();

      gsap.timeline({ scrollTrigger: { trigger: section, start: "top 80%" } })
        .fromTo(titleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
        )
        .fromTo(counterRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(navRowRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.75, ease: "power2.out" },
          "-=0.45"
        )
        .fromTo(
          cardRefs.current.filter(Boolean),
          { opacity: 0, y: 60, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.95, ease: "power3.out" },
          "-=0.55"
        );
    }, sectionRef);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        measure();
        ScrollTrigger.refresh();
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [gsap, ScrollTrigger, measure]);

  // ── Open detail ───────────────────────────────────────────────
  const openDetail = useCallback((service, cardEl) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (!gsap || isAnimatingRef.current || detailVisible) return;
    isAnimatingRef.current = true;

    const detail    = detailRef.current;
    const portfolio = portfolioRef.current;
    const closeBtn  = closeBtnRef.current;

    if (isMobileRef.current) {
      gsap.set(detail,    { display: "flex", opacity: 0 });
      gsap.set(portfolio, { opacity: 0, y: 28 });
      gsap.set(closeBtn,  { opacity: 0 });

      setSelectedService(service);
      setDetailVisible(true);
      lockBodyScroll();

      cancelAnimationFrame(openRafRef.current);
      openRafRef.current = requestAnimationFrame(() => {
        openRafRef.current = requestAnimationFrame(() => {
          const validWorkItems = workItemRefs.current.filter(Boolean);
          gsap.set(validWorkItems, { opacity: 0, y: 18 });

          gsap.timeline({
            defaults:   { ease: "expo.out" },
            onComplete: () => { isAnimatingRef.current = false; },
          })
            .to(detail,         { opacity: 1,  duration: 0.3 }, 0)
            .to(portfolio,      { opacity: 1, y: 0, duration: 0.5 }, 0.08)
            .to(closeBtn,       { opacity: 1,  duration: 0.3 }, 0.18)
            .to(validWorkItems, { opacity: 1, y: 0, stagger: 0.055, duration: 0.45 }, 0.22);
        });
      });
      return;
    }

    lockBodyScroll();

    const rect        = cardEl.getBoundingClientRect();
    const sectionRect = sectionRef.current.getBoundingClientRect();
    originRectRef.current = rect;

    const detailCard = detailCardRef.current;
    const otherCards = cardRefs.current.filter(c => c && c !== cardEl);

    gsap.set(detail,     { display: "flex", opacity: 0 });
    gsap.set(detailCard, {
      position:     "absolute",
      top:          rect.top  - sectionRect.top,
      left:         rect.left - sectionRect.left,
      width:        rect.width,
      height:       rect.height,
      borderRadius: 20,
      opacity:      1,
      clearProps:   "scale,xPercent,yPercent",
    });
    gsap.set(portfolio, { opacity: 0, x: -52 });
    gsap.set(closeBtn,  { opacity: 0, y: -18 });

    setSelectedService(service);
    setDetailVisible(true);

    cancelAnimationFrame(openRafRef.current);
    openRafRef.current = requestAnimationFrame(() => {
      openRafRef.current = requestAnimationFrame(() => {
        const validWorkItems = workItemRefs.current.filter(Boolean);
        gsap.set(validWorkItems, { opacity: 0, x: -40 });

        gsap.timeline({
          defaults:   { ease: "expo.out" },
          onComplete: () => { isAnimatingRef.current = false; },
        })
          .to(otherCards,     { opacity: 0, scale: 0.88, y: 20, stagger: 0.03, duration: 0.38, ease: "power2.in" }, 0)
          .to(detail,         { opacity: 1, duration: 0.28, ease: "power2.out" }, 0.06)
          .to(detailCard,     {
            top: 0, left: "50%", width: "50%", height: "100%", borderRadius: 0,
            duration: 0.85, ease: "expo.inOut",
          }, 0.1)
          .to(portfolio,      { opacity: 1, x: 0, duration: 0.6 }, 0.42)
          .to(closeBtn,       { opacity: 1, y: 0, duration: 0.38, ease: "power3.out" }, 0.48)
          .to(validWorkItems, { opacity: 1, x: 0, stagger: 0.06, duration: 0.52 }, 0.54);
      });
    });
  }, [gsap, detailVisible, lockBodyScroll]);

  // ── Close detail ──────────────────────────────────────────────
  const closeDetail = useCallback(() => {
    if (!gsap || isAnimatingRef.current || !detailVisible) return;
    isAnimatingRef.current = true;
    cancelAnimationFrame(openRafRef.current);

    const detail         = detailRef.current;
    const portfolio      = portfolioRef.current;
    const closeBtn       = closeBtnRef.current;
    const validWorkItems = workItemRefs.current.filter(Boolean);

    if (isMobileRef.current) {
      gsap.timeline({
        onComplete: () => {
          gsap.set(detail, { display: "none" });
          setDetailVisible(false);
          setSelectedService(null);
          isAnimatingRef.current = false;
          unlockBodyScroll();
        },
      })
        .to(validWorkItems, { opacity: 0, y: 12, stagger: 0.025, duration: 0.2,  ease: "power2.in" }, 0)
        .to(portfolio,      { opacity: 0, y: 18,                  duration: 0.22, ease: "power2.in" }, 0.04)
        .to(detail,         { opacity: 0,                          duration: 0.22 }, 0.14);
      return;
    }

    const detailCard = detailCardRef.current;
    const allCards   = cardRefs.current.filter(Boolean);

    const sectionRect = sectionRef.current.getBoundingClientRect();
    const origin      = originRectRef.current;
    const flipTop     = origin ? origin.top  - sectionRect.top  : "50%";
    const flipLeft    = origin ? origin.left - sectionRect.left : "50%";
    const flipW       = origin ? origin.width  : 400;
    const flipH       = origin ? origin.height : 460;

    gsap.timeline({
      defaults:   { ease: "expo.inOut" },
      onComplete: () => {
        gsap.set(detail, { display: "none" });
        setDetailVisible(false);
        setSelectedService(null);
        isAnimatingRef.current = false;
        originRectRef.current  = null;
        unlockBodyScroll();
      },
    })
      .to(validWorkItems, { opacity: 0, x: -30, stagger: 0.025, duration: 0.26, ease: "power2.in" }, 0)
      .to(closeBtn,       { opacity: 0, y: -16,                  duration: 0.2,  ease: "power2.in" }, 0)
      .to(portfolio,      { opacity: 0, x: -52,                  duration: 0.32, ease: "power2.in" }, 0.03)
      .to(detailCard,     { top: flipTop, left: flipLeft, width: flipW, height: flipH, borderRadius: 20, duration: 1.6, clearProps: "xPercent,yPercent" }, 0.06)
      .to(detail,         { opacity: 0,                           duration: 1.1,  ease: "power2.in" }, 0.48)
      .to(allCards,       { opacity: 1, scale: 1, y: 0, stagger: 0.04, duration: 0.55, ease: "power3.out" }, 0.42);
  }, [gsap, detailVisible, unlockBodyScroll]);

  // ── Cleanup ───────────────────────────────────────────────────
  useEffect(() => () => cancelAnimationFrame(openRafRef.current), []);

  useEffect(() => {
    return () => {
      if (document.body.style.position === "fixed") {
        unlockBodyScroll();
      }
    };
  }, [unlockBodyScroll]);

  // ── Render ────────────────────────────────────────────────────
  return (
    <section className="services nav-dark-zone" ref={sectionRef} id={sectionId}>
      <ServicesHeader
        titleRef={titleRef}
        counterRef={counterRef}
        total={services.length}
        current={activeIndex + 1}
        title={sliderInfo?.title}
        desc={sliderInfo?.desc}
      />

      <ServicesTrack
        viewportRef={viewportRef}
        trackRef={trackRef}
        services={services}
        activeIndex={activeIndex}
        cardRefs={cardRefs}
        onCardClick={openDetail}
        ctaLabel={ctaLabel}
        dragHandlers={{ onPointerDown, onPointerMove, onPointerUp }}
      />

      <ServicesNav
        navRef={navRowRef}
        total={services.length}
        activeIndex={activeIndex}
        onPrev={() => goTo(activeIndex - 1)}
        onNext={() => goTo(activeIndex + 1)}
        onDotClick={goTo}
      />

      <DetailOverlay
        detailRef={detailRef}
        portfolioRef={portfolioRef}
        detailCardRef={detailCardRef}
        closeBtnRef={closeBtnRef}
        workItemRefs={workItemRefs}
        selectedService={selectedService}
        onClose={closeDetail}
        statLabel={statLabel}
        secondaryStatLabel={secondaryStatLabel}
        secondaryStatValue={secondaryStatValue}
        worksCtaLabel={worksCtaLabel}
        worksCtaHref={worksCtaHref}
        showWorksCta={showWorksCta}
        showStats={showStats}
      />
    </section>
  );
}