import { useEffect } from "react";

const REDUCED_MQ = "(prefers-reduced-motion: reduce)";

// Перенесён из бывшей TaxiSection.
// Видео играет, пока секция в кадре, и стоит на паузе вне его (экономит
// батарею). Пауза, которую Chrome ставит при переносе <video> в DOM,
// снимается повторным play(). При prefers-reduced-motion видео не
// запускается вовсе.
export default function useVideoInView(sectionRef, videoRef) {
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reduced = window.matchMedia(REDUCED_MQ);
    let visible = false;

    const sync = () => {
      if (!video.isConnected) return;
      if (visible && !reduced.matches) video.play().catch(() => {});
      else video.pause();
    };

    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; sync(); },
      { threshold: 0.05 }
    );
    io.observe(section);

    const onPause = () => { if (visible && !reduced.matches) setTimeout(sync, 0); };
    video.addEventListener("pause", onPause);
    reduced.addEventListener("change", sync);

    return () => {
      io.disconnect();
      video.removeEventListener("pause", onPause);
      reduced.removeEventListener("change", sync);
    };
  }, [sectionRef, videoRef]);
}
