"use client";
import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import SplashScreen from "@/components/SplashScreen";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

// Lazy-load heavy sections
const FeaturesSection = dynamic(() => import("@/components/FeaturesSection"), { ssr: false });
const MechanismsSection = dynamic(() => import("@/components/MechanismsSection"), { ssr: false });
const DriversSection = dynamic(() => import("@/components/DriversSection"), { ssr: false });
const ExperienceSection = dynamic(() => import("@/components/ExperienceSection"), { ssr: false });
const FooterSection = dynamic(() => import("@/components/FooterSection"), { ssr: false });

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(false);
  const [navRevealed, setNavRevealed] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  const handleHeroEnter = useCallback(() => {
    // Delay navbar reveal until after video takeover starts (12 seconds as requested)
    setTimeout(() => setNavRevealed(true), 9000);
  }, []);

  return (
    <main style={{ background: "#000", minHeight: "100vh" }}>
      {/* Splash Screen — fixed overlay, exits upward */}
      <AnimatePresence mode="wait">
        {!splashDone && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      {/* Sticky Navbar */}
      <Navbar revealed={navRevealed} />

      {/* Page sections */}
      <div style={{ position: "relative" }}>
        {/* Section 2: Hero */}
        <section style={{ position: "relative" }}>
          <HeroSection onEnter={handleHeroEnter} />
        </section>

        {/* Section 3: Features (horizontal scroll) */}
        <section id="features">
          <FeaturesSection />
        </section>

        {/* Section 4: Mechanisms (scroll-scrub frame animation) */}
        <section id="mechanisms">
          <MechanismsSection />
        </section>

        {/* Section 5: Drivers (3D draggable carousel) */}
        <section id="drivers">
          <DriversSection />
        </section>

        {/* Section 6: Experience (Model Viewer GLB embed) */}
        <section id="experience">
          <ExperienceSection />
        </section>

        {/* Section 7: Footer */}
        <FooterSection />
      </div>
    </main>
  );
}
