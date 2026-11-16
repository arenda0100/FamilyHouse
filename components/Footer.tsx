// ФАЙЛ: src/components/Footer.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV = [
  { label: "Особенности", href: "#features" },
  { label: "Удобства", href: "#amenities" },
  { label: "Цены", href: "#pricing" },
  { label: "Бронирование", href: "#booking" },
  { label: "Контакты", href: "#contact" },
  { label: "Вопросы", href: "#faq" },
];

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root.current, start: "top 95%", once: true },
        })
        .fromTo(
          ".footer-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: "power2.inOut" }
        )
        .fromTo(
          ".footer-item",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
          "-=0.6"
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={root} className="relative px-6 pb-10 pt-16 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="footer-line h-px w-full origin-left bg-gradient-to-r from-[#d4af37]/60 via-white/10 to-transparent" />

        <div className="mt-12 flex flex-col justify-between gap-10 md:flex-row md:items-center">
          <div className="footer-item opacity-0">
            <p className="text-[11px] font-light uppercase tracking-[0.6em] text-white/80">
              Family
            </p>
            <p className="font-serif text-4xl uppercase tracking-[0.1em]">
              House
            </p>
          </div>

          <nav
            aria-label="Навигация"
            className="footer-item flex flex-wrap gap-x-8 gap-y-3 opacity-0"
          >
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-xs font-light uppercase tracking-[0.3em] text-white/60 transition-colors duration-300 hover:text-[#d4af37]"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer-item mt-12 flex flex-col items-start justify-between gap-3 text-[11px] font-light uppercase tracking-[0.3em] text-white/40 opacity-0 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Family House</span>
          <span>Гродно · Ратичи</span>
        </div>
      </div>
    </footer>
  );
}