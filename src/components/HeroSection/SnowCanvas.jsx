"use client";

import { useEffect, useRef } from "react";

// Снегопад на canvas поверх сцены hero. Лёгкий: ~110 хлопьев на десктопе,
// 50 на телефоне, один rAF; останавливается, когда hero не виден или
// вкладка скрыта; при prefers-reduced-motion не рисуется вовсе.
// snowLine — доля высоты, ниже которой хлопья рисуются голубоватыми
// (на белой полосе флага белые не видны).
export default function SnowCanvas({ snowLine = 0.667, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = 1;
    let flakes = [];
    let raf = 0;
    let running = false;
    let visible = true;

    const rand = (a, b) => a + Math.random() * (b - a);

    const make = () => {
      const narrow = W < 768;
      const n = narrow ? 50 : 110;
      flakes = Array.from({ length: n }, () => ({
        x: rand(0, W),
        y: rand(-H, H),
        r: rand(0.7, narrow ? 2 : 2.6),
        v: rand(0.35, 1.1),
        drift: rand(-0.25, 0.25),
        phase: rand(0, Math.PI * 2),
        a: rand(0.45, 0.95),
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      make();
    };

    let t = 0;
    const frame = () => {
      if (!running) return;
      t += 0.012;
      ctx.clearRect(0, 0, W, H);
      const line = H * snowLine;
      for (const f of flakes) {
        f.y += f.v;
        f.x += f.drift + Math.sin(t + f.phase) * 0.35;
        if (f.y > H + 6) { f.y = -6; f.x = rand(0, W); }
        if (f.x < -6) f.x = W + 6;
        if (f.x > W + 6) f.x = -6;
        const below = f.y > line;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = below
          ? `rgba(120, 150, 190, ${f.a * 0.55})`
          : `rgba(255, 255, 255, ${f.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    start();

    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, [snowLine]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
