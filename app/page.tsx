// ФАЙЛ: src/app/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Amenities from "@/components/Amenities";
import Pricing from "@/components/Pricing";
import TimeZone from "@/components/TimeZone";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

// Leaflet обращается к window, поэтому грузим карту только в браузере
const MapSection = dynamic(() => import("@/components/MapSection"), {
  ssr: false,
  loading: () => <div className="h-[40rem] bg-[#0a0a0a]" aria-hidden="true" />,
});

export default function Home() {
  const [isEntered, setIsEntered] = useState(false);
  const siteRef = useRef<HTMLElement>(null);

  // Плавное появление сайта после входа
  useEffect(() => {
    if (!isEntered) return;

    window.scrollTo(0, 0);

    const tween = gsap.fromTo(
      siteRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.4,
        ease: "power2.out",
        onComplete: () => ScrollTrigger.refresh(),
      }
    );

    ScrollTrigger.refresh();

    return () => {
      tween.kill();
    };
  }, [isEntered]);

  if (!isEntered) {
    return <Preloader onEnter={() => setIsEntered(true)} />;
  }

  return (
    <main
      ref={siteRef}
      className="min-h-screen bg-[#0a0a0a] text-white opacity-0"
    >
      <Hero />
      <Features />
      <Amenities />
      <Pricing />
      <MapSection />
      <TimeZone />
      <Footer />
    </main>
  );
}