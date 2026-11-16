// ФАЙЛ: src/components/Footer.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ADDRESS = "Гродно, а/г Ратичи, улица Центральная 125";
const PHONE_DISPLAY = "+375 29 287-37-74";
const PHONE_LINK = "tel:+375292873774";
const INSTAGRAM_URL = "https://www.instagram.com/familyhouse.grodno";
const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  ADDRESS
)}`;

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            once: true,
          },
        })
        .fromTo(
          ".footer-label",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        )
        .fromTo(
          ".footer-title-inner",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1 },
          "-=0.5"
        )
        .fromTo(
          ".footer-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power2.inOut" },
          "-=0.6"
        )
        .fromTo(
          ".footer-col",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.15 },
          "-=0.5"
        )
        .fromTo(
          ".footer-bottom",
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          "-=0.3"
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={root}
      id="booking"
      className="relative overflow-hidden bg-[#0a0a0a] px-6 pb-10 pt-28 md:px-12 md:pt-40"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[32rem]"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 100%, rgba(46,79,62,0.4) 0%, rgba(10,10,10,0) 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <p className="footer-label mb-6 text-xs font-light uppercase tracking-[0.4em] text-[#5f8f78] opacity-0">
          Бронирование
        </p>

        <h2 className="overflow-hidden pb-2 text-[clamp(2.5rem,8vw,6.5rem)] font-light uppercase leading-[1] tracking-[0.04em]">
          <span className="footer-title-inner block opacity-0">
            Забронируйте дом
          </span>
        </h2>

        <div className="footer-line mt-10 h-px w-24 origin-left bg-[#2e4f3e] md:w-40" />

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          <div className="footer-col opacity-0">
            <p className="mb-4 text-xs font-light uppercase tracking-[0.35em] text-[#5f8f78]">
              Телефон
            </p>
            <a
              href={PHONE_LINK}
              className="text-2xl font-light tracking-wide transition-colors duration-300 hover:text-[#5f8f78] md:text-3xl"
            >
              {PHONE_DISPLAY}
            </a>
          </div>

          <div className="footer-col opacity-0">
            <p className="mb-4 text-xs font-light uppercase tracking-[0.35em] text-[#5f8f78]">
              Адрес
            </p>
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-light leading-relaxed tracking-wide text-white/80 transition-colors duration-300 hover:text-[#5f8f78] md:text-xl"
            >
              {ADDRESS}
            </a>
          </div>

          <div className="footer-col opacity-0">
            <p className="mb-4 text-xs font-light uppercase tracking-[0.35em] text-[#5f8f78]">
              Instagram
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-lg font-light tracking-wide text-white/80 transition-colors duration-300 hover:text-[#5f8f78] md:text-xl"
            >
              <span>@familyhouse.grodno</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </a>
          </div>
        </div>

        <div className="footer-bottom mt-24 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs font-light uppercase tracking-[0.3em] text-white/40 opacity-0 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Family House</span>
          <span>Гродно · Ратичи</span>
        </div>
      </div>
    </footer>
  );
}