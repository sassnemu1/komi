import CarRental from "@/components/CarRental/CarRental";
import HeroSection from "@/components/HeroSection/HeroSection";
import LandmarksSection from "@/components/LandmarksSection/LandmarksSection";
import MythologySection from "@/components/MythologySection/MythologySection";
import ServicesSlider from "@/components/Slider/ServicesSlider";
import StayDineSection from "@/components/StayDineSection/StayDineSection";
import TaxiSection from "@/components/TaxiSection/TaxiSection";
import { INFO_DATA, getCategorySlides } from "@/data/InfoData";

const EXCLUDED_IDS = ["02", "03", "04", "05"];

export default function Home() {
  return (
    <div>
      <main>

        <HeroSection />

        <MythologySection />

        <LandmarksSection />

        <StayDineSection />

        {INFO_DATA.filter((category) => !EXCLUDED_IDS.includes(category.id)).map((category) => (
          <ServicesSlider
            key={category.id}
            sectionId={`info-${category.id}`}
            services={getCategorySlides(category)}
            sliderInfo={{
              title: category.tag,
              desc: category.desc,
            }}
            ctaLabel="Подробнее"
            showWorksCta={false}
            showStats={false}
          />
        ))}

        <CarRental />

        <TaxiSection videoSrc="/video-komi-taxi.mp4" />

      </main>
    </div>
  );
}
