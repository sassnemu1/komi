import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import SectionDivider from "@/components/SectionDivider/SectionDivider";

import HeroSection from "@/components/HeroSection/HeroSection";
import MythologySection from "@/components/MythologySection/MythologySection";
import LandmarksSection from "@/components/LandmarksSection/LandmarksSection";
import StayDineSection from "@/components/StayDineSection/StayDineSection";
import ExperiencesSection from "@/components/ExperiencesSection/ExperiencesSection";
import CampingSection from "@/components/CampingSection/CampingSection";
import MadeInKomiSection from "@/components/MadeInKomiSection/MadeInKomiSection";
import CarRental from "@/components/CarRental/CarRental";
import TaxiSection from "@/components/TaxiSection/TaxiSection";

// Порядок глав. Якоря секции ставят сами:
// #hero (#map — стадия карты) → #mythology → #landmarks → #stay →
// #experiences → #camping → #made-in-komi → #transport → #taxi → #contacts
export default function Home() {
  return (
    <>
      <Header />

      <main>
        <HeroSection />
        <MythologySection />

        <SectionDivider tone="dark" />

        <LandmarksSection />
        <StayDineSection />

        <SectionDivider tone="light" />

        <ExperiencesSection />
        <CampingSection />
        <MadeInKomiSection />

        <SectionDivider tone="dark" />

        <CarRental />
        <TaxiSection videoSrc="/video-komi-taxi.mp4" />
      </main>

      <Footer />
    </>
  );
}
