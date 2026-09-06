import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Interlude from "@/components/Interlude/Interlude";
import SnowEdge from "@/components/SnowEdge/SnowEdge";

import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection/HeroSection";
import MythologySection from "@/components/MythologySection/MythologySection";
import StayDineSection from "@/components/StayDineSection/StayDineSection";
import ExperiencesSection from "@/components/ExperiencesSection/ExperiencesSection";
import CampingSection from "@/components/CampingSection/CampingSection";
import HoldingSection from "@/components/HoldingSection/HoldingSection";

// Тяжёлые главы ниже сгиба — отдельными чанками: HTML рендерится на сервере
// как обычно, а их JS не задерживает первый интерактив hero и карты.
const LandmarksSection = dynamic(() => import("@/components/LandmarksSection/LandmarksSection"));
const MadeInKomiSection = dynamic(() => import("@/components/MadeInKomiSection/MadeInKomiSection"));
const TransportSection = dynamic(() => import("@/components/TransportSection/TransportSection"));

// Порядок глав. Якоря секции ставят сами:
// #hero (#map — стадия карты) → #mythology → #landmarks → #stay →
// #experiences → #camping → #made-in-komi → #transport (внутри — #rental и
// #taxi) → #holding → #contacts
// Между главами — фото-интерлюдии (Wikimedia Commons, авторы в подвале).
export default function Home() {
  return (
    <>
      <Header />

      <main>
        <HeroSection />
        <MythologySection />


        <LandmarksSection />
        <SnowEdge />
        <StayDineSection />

        <Interlude
          photo="tundra"
          eyebrow="Заполярье"
          title="Большеземельская тундра"
          caption="Север республики — Воркута, Инта, Усинск: тундра, оленеводство и полярное сияние."
        />

        <ExperiencesSection />
        <SnowEdge />
        <CampingSection />
        <SnowEdge />
        <MadeInKomiSection />

        <Interlude
          photo="ski-valley"
          eyebrow="Приполярный Урал"
          title="Долина Манараги"
          caption="Национальный парк «Югыд ва» зимой — там, куда не доедет обычная машина."
        />

        <TransportSection />
        <SnowEdge />
        <HoldingSection />
      </main>

      <Footer />
    </>
  );
}
