import React from "react";
import { ShowcaseNavbar, ShowcaseFooter } from "./components/ShowcaseHeaderFooter";
import HeroVideoSection from "./components/HeroVideoSection";
import RotatingEarthSection from "./components/RotatingEarthSection";
import SystemArchitecture3D from "./components/SystemArchitecture3D";
import FeatureShowcaseSection from "./components/FeatureShowcaseSection";
import BenefitsSection from "./components/BenefitsSection";
import ScienceReferencesSection from "./components/ScienceReferencesSection";
import "./styles/showcase.css";

export default function App() {
  const handleScrollToEarth = () => {
    const el = document.getElementById("earth");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="showcase-app">
      <ShowcaseNavbar />
      <main>
        <HeroVideoSection onExploreClick={handleScrollToEarth} />
        <RotatingEarthSection />
        <SystemArchitecture3D />
        <FeatureShowcaseSection />
        <BenefitsSection />
        <ScienceReferencesSection />
      </main>
      <ShowcaseFooter />
    </div>
  );
}
