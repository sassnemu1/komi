import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import SectionDivider from "@/components/SectionDivider/SectionDivider";

import HeroSection from "@/components/HeroSection/HeroSection";
import MythologySection from "@/components/MythologySection/MythologySection";
import LandmarksSection from "@/components/LandmarksSection/LandmarksSection";
import StayDineSection from "@/components/StayDineSection/StayDineSection";
import ServicesSlider from "@/components/Slider/ServicesSlider";
import CarRental from "@/components/CarRental/CarRental";
import TaxiSection from "@/components/TaxiSection/TaxiSection";

import { INFO_DATA, getCategorySlides } from "@/data/InfoData";

// Категории карточек-слайдеров и их якоря (см. якоря секций в README)
const SLIDERS = [
  { id: "06", sectionId: "experiences" },
  { id: "07", sectionId: "camping" },
  { id: "08", sectionId: "made-in-komi" },
];

function findCategory(id) {
  return INFO_DATA.find((category) => category.id === id) ?? null;
}

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* #hero / #map — стадия карты внутри hero (конец его скролл-рельсы) */}
        <HeroSection />

        {/* #mythology, #landmarks, #stay — секции ставят id сами */}
        <MythologySection />

        <SectionDivider tone="dark" />

        <LandmarksSection />

        <StayDineSection />

        <SectionDivider tone="dark" />

        {SLIDERS.map(({ id, sectionId }) => {
          const category = findCategory(id);
          if (!category) return null;
          return (
            <ServicesSlider
              key={id}
              sectionId={sectionId}
              services={getCategorySlides(category)}
              sliderInfo={{
                title: category.tag,
                desc: category.desc,
              }}
              ctaLabel="Подробнее"
              showWorksCta={false}
              showStats={false}
            />
          );
        })}

        <SectionDivider tone="dark" />

        {/* #transport, #taxi — секции ставят id сами */}
        <CarRental />
        <TaxiSection videoSrc="/video-komi-taxi.mp4" />
      </main>

      <Footer />
    </>
  );
}
