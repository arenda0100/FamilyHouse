// ФАЙЛ: src/app/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Amenities from "@/components/Amenities";
import Pricing from "@/components/Pricing";
import Booking from "@/components/Booking";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

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
        duration: 1.6,
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

  // Без собственного фона: сквозь секции виден анимированный градиент из globals.css
  return (
    <main ref={siteRef} className="min-h-screen text-white opacity-0">
      <Hero />
      <Features />
      <Amenities />
      <Pricing />
      <Booking />
      <Contact />
      <FAQ />
      <Footer />
    </main>
  );
}