// ФАЙЛ: src/components/Hero.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ───── Вступительная анимация (при загрузке) ─────
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.3,
      });

      intro
        .fromTo(
          ".hero-line",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.2 }
        )
        .fromTo(
          ".hero-divider",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power2.inOut" },
          "-=0.7"
        )
        .fromTo(
          ".hero-sub",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.6"
        )
        .fromTo(
          ".hero-cta",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.7"
        )
        .fromTo(
          ".hero-scroll",
          { opacity: 0 },
          { opacity: 0.6, duration: 1 },
          "-=0.4"
        );

      // ───── Медленное «дыхание» световых пятен ─────
      gsap.to(".hero-blob-a", {
        x: 60,
        y: -40,
        duration: 9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".hero-blob-b", {
        x: -50,
        y: 50,
        duration: 11,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // ───── Параллакс при скролле ─────
      const scrollTl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6, // лёгкое сглаживание
        },
      });

      scrollTl
        // Фон: отдаляется (из увеличенного в нормальный масштаб) и чуть опускается
        .fromTo(".hero-bg", { scale: 1.15 }, { scale: 1, yPercent: 15 }, 0)
        // Три слоя контента уходят вверх с разной скоростью
        .to(".hero-p-title", { yPercent: -30 }, 0)
        .to(".hero-p-sub", { yPercent: -50 }, 0)
        .to(".hero-p-cta", { yPercent: -80 }, 0)
        // Контент растворяется
        .to(".hero-content", { opacity: 0 }, 0);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Фон: многослойный градиент */}
      <div className="hero-bg pointer-events-none absolute inset-0 will-change-transform">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(46,79,62,0.55) 0%, rgba(10,10,10,0) 70%), radial-gradient(ellipse 60% 50% at 85% 100%, rgba(46,79,62,0.35) 0%, rgba(10,10,10,0) 70%), linear-gradient(180deg, #0a0a0a 0%, #0d1511 55%, #0a0a0a 100%)",
          }}
        />
        <div className="hero-blob-a absolute -left-32 top-1/4 h-[28rem] w-[28rem] rounded-full bg-[#2e4f3e] opacity-30 blur-[120px]" />
        <div className="hero-blob-b absolute -right-24 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[#3b6a52] opacity-20 blur-[120px]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.8) 100%)",
          }}
        />
      </div>

      {/* Контент */}
      <div className="hero-content relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        {/* Слой 1: логотип */}
        <div className="hero-p-title">
          <h1 aria-label="Family House" className="flex flex-col items-center">
            <span className="block overflow-hidden pb-1">
              <span className="hero-line block pl-[0.6em] font-sans text-[clamp(1.1rem,3.6vw,2.75rem)] font-light uppercase tracking-[0.6em] text-white/90 opacity-0">
                Family
              </span>
            </span>
            <span className="block overflow-hidden pb-3 pt-1">
              <span className="hero-line block pl-[0.1em] font-serif text-[clamp(4rem,15vw,12rem)] font-normal uppercase leading-[0.95] tracking-[0.1em] opacity-0">
                House
              </span>
            </span>
          </h1>
        </div>

        {/* Слой 2: разделитель и подзаголовок */}
        <div className="hero-p-sub flex flex-col items-center">
          <div className="hero-divider mt-8 h-px w-24 origin-center bg-[#2e4f3e] md:w-40" />

          <p className="hero-sub mt-8 text-sm font-light uppercase tracking-[0.35em] text-white/70 opacity-0 md:text-base">
            Премиальная аренда дома в Гродно
          </p>
        </div>

        {/* Слой 3: кнопка */}
        <div className="hero-p-cta">
          <a
            href="#booking"
            className="hero-cta group relative mt-12 inline-flex items-center gap-4 overflow-hidden border border-[#2e4f3e] bg-[#2e4f3e]/20 px-10 py-4 text-xs font-light uppercase tracking-[0.3em] text-white opacity-0 transition-colors duration-500 hover:bg-[#2e4f3e] md:text-sm"
          >
            <span>Забронировать</span>
            <span className="inline-block transition-transform duration-500 group-hover:translate-x-2">
              →
            </span>
          </a>
        </div>
      </div>

      {/* Индикатор скролла */}
      <div className="hero-scroll absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 opacity-0">
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/60">
          Scroll
        </span>
        <span className="block h-10 w-px bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}