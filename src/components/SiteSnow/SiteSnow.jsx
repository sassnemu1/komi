"use client";

import { useEffect, useRef } from "react";
import styles from "./SiteSnow.module.css";

// Снег по всему сайту: один фиксированный canvas поверх страницы.
// Лёгкий по замыслу:
//   • 90 хлопьев на десктопе, 45 на телефоне и слабых устройствах
//     (deviceMemory ≤ 4 или ≤ 4 ядер), DPR не выше 1.5;
//   • один rAF; на телефоне рисуем через кадр (~30 fps);
//   • пауза в скрытой вкладке; при prefers-reduced-motion не рисуется;
//   • хлопья — круги с едва заметной голубой обводкой, чтобы читались
//     и на белой полосе флага.
// Взаимодействие: курсор (и палец) мягко расталкивает хлопья в радиусе
// ~130 px, быстрое движение даёт им «ветер»; скролл — короткий вертикальный
// импульс, будто снег отстаёт от страницы. Всё — арифметика на ~90 точек.
const RADIUS = 130;

export default function SiteSnow() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    const weak = (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency || 8) <= 4;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const skipFrames = coarse || weak; // ~30 fps там, где экономим

    let W = 0, H = 0, dpr = 1;
    let flakes = [];
    let raf = 0;
    let running = false;
    let frameNo = 0;
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, t: 0 };
    let windY = 0;      // импульс от скролла
    let lastScroll = window.scrollY;

    const rand = (a, b) => a + Math.random() * (b - a);

    const make = () => {
      const n = coarse || weak ? 45 : 90;
      flakes = Array.from({ length: n }, () => ({
        x: rand(0, W), y: rand(0, H),
        r: rand(0.8, coarse ? 2 : 2.6),
        v: rand(0.3, 1.0),
        drift: rand(-0.2, 0.2),
        phase: rand(0, Math.PI * 2),
        a: rand(0.4, 0.9),
        px: 0, py: 0,          // «толчок» от курсора, гаснет сам
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      make();
    };

    let t = 0;
    const frame = () => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (skipFrames && (frameNo++ & 1)) return;
      t += 0.012;
      windY *= 0.9;
      pointer.vx *= 0.85; pointer.vy *= 0.85;

      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 0.8;
      for (const f of flakes) {
        // курсор: расталкивание + ветер от движения
        const dx = f.x - pointer.x, dy = f.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < RADIUS * RADIUS) {
          const d = Math.sqrt(d2) || 1;
          const k = (1 - d / RADIUS) * 0.9;
          f.px += (dx / d) * k + pointer.vx * 0.12 * k;
          f.py += (dy / d) * k + pointer.vy * 0.12 * k;
        }
        f.px *= 0.9; f.py *= 0.9;

        f.x += f.drift + Math.sin(t + f.phase) * 0.35 + f.px;
        f.y += f.v + f.py - windY * f.v;
        if (f.y > H + 8) { f.y = -8; f.x = rand(0, W); }
        if (f.y < -40) { f.y = H + 8; f.x = rand(0, W); }
        if (f.x < -8) f.x = W + 8; else if (f.x > W + 8) f.x = -8;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${f.a})`;
        ctx.strokeStyle = `rgba(90,120,170,${f.a * 0.35})`;
        ctx.fill();
        ctx.stroke();
      }
    };

    const start = () => { if (running || document.hidden) return; running = true; raf = requestAnimationFrame(frame); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const onPointer = (e) => {
      const now = performance.now();
      const dt = Math.max(16, now - pointer.t);
      if (pointer.t) {
        pointer.vx = Math.max(-40, Math.min(40, (e.clientX - pointer.x) / dt * 16));
        pointer.vy = Math.max(-40, Math.min(40, (e.clientY - pointer.y) / dt * 16));
      }
      pointer.x = e.clientX; pointer.y = e.clientY; pointer.t = now;
    };
    const onPointerOut = () => { pointer.x = -9999; pointer.y = -9999; pointer.t = 0; };
    const onScroll = () => {
      const y = window.scrollY;
      windY = Math.max(-6, Math.min(6, windY + (y - lastScroll) * 0.02));
      lastScroll = y;
    };
    const onVis = () => (document.hidden ? stop() : start());

    resize();
    start();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    document.addEventListener("pointerleave", onPointerOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("pointerleave", onPointerOut);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className={styles.snow} aria-hidden="true" />;
}
