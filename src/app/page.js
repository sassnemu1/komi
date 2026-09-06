import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Interlude from "@/components/Interlude/Interlude";

import HeroSection from "@/components/HeroSection/HeroSection";
import MythologySection from "@/components/MythologySection/MythologySection";
import LandmarksSection from "@/components/LandmarksSection/LandmarksSection";
import StayDineSection from "@/components/StayDineSection/StayDineSection";
import ExperiencesSection from "@/components/ExperiencesSection/ExperiencesSection";
import CampingSection from "@/components/CampingSection/CampingSection";
import MadeInKomiSection from "@/components/MadeInKomiSection/MadeInKomiSection";
import CarRental from "@/components/CarRental/CarRental";
import TaxiSection from "@/components/TaxiSection/TaxiSection";
import HoldingSection from "@/components/HoldingSection/HoldingSection";

// Порядок глав. Якоря секции ставят сами:
// #hero (#map — стадия карты) → #mythology → #landmarks → #stay →
// #experiences → #camping → #made-in-komi → #transport → #taxi → #holding →
// #contacts
// Между главами — фото-интерлюдии (Wikimedia Commons, авторы в подвале).
export default function Home() {
  return (
    <>
      <Header />

      <main>
        <HeroSection />
        <MythologySection />


        <LandmarksSection />
        <StayDineSection />

        <Interlude
          photo="tundra"
          eyebrow="Заполярье"
          title="Большеземельская тундра"
          caption="Север республики — Воркута, Инта, Усинск: тундра, оленеводство и полярное сияние."
        />

        <ExperiencesSection />
        <CampingSection />
        <MadeInKomiSection />

        <Interlude
          photo="ski-valley"
          eyebrow="Приполярный Урал"
          title="Долина Манараги"
          caption="Национальный парк «Югыд ва» зимой — там, куда не доедет обычная машина."
        />

        <CarRental />
        <TaxiSection videoSrc="/video-komi-taxi.mp4" />
        <HoldingSection />
      </main>

      <Footer />
    </>
  );
}
