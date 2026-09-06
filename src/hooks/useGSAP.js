import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// GSAP подключён статически: раньше он приезжал отдельным чанком после
// гидратации, и на медленной сети hero стоял без хореографии — рельса
// 400vh прокручивалась без карты, а интро запускалось с задержкой. Теперь
// модули в основном бандле и готовы к первому эффекту. Регистрация плагина —
// только в браузере (на сервере эффекты не выполняются, но модуль импортируется).
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Только в dev: доступ к триггерам из консоли и тестовых проб
  if (process.env.NODE_ENV !== "production") window.__gsapST = ScrollTrigger;
}

export default function useGSAP() {
  return { gsap, ScrollTrigger };
}
