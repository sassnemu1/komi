import { useEffect, useState } from "react";

export default function useGSAP() {
  const [gsap, setGsap] = useState(null);
  const [ScrollTrigger, setScrollTrigger] = useState(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const gsapModule = await import("gsap");
      const scrollModule = await import("gsap/ScrollTrigger");

      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      if (!mounted) return;

      setGsap(() => gsap);
      setScrollTrigger(() => ScrollTrigger);
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  return { gsap, ScrollTrigger };
}