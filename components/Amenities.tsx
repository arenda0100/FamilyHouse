// ФАЙЛ: src/components/Amenities.tsx
"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Amenity = { title: string; icon: ReactNode };

// Все иконки: 24x24, тонкая линия, цвет берётся из currentColor
const amenities: Amenity[] = [
  {
    title: "Горячая купель с массажем",
    icon: (
      <>
        <path d="M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3z" />
        <path d="M8 8c0-1 1-1 1-2s-1-1-1-2" />
        <path d="M12 8c0-1 1-1 1-2s-1-1-1-2" />
        <path d="M16 8c0-1 1-1 1-2s-1-1-1-2" />
      </>
    ),
  },
  {
    title: "Баня",
    icon: (
      <>
        <path d="M10 4a2 2 0 0 1 4 0v9.2a4 4 0 1 1-4 0z" />
        <path d="M12 9v6" />
      </>
    ),
  },
  {
    title: "Бассейн (летний сезон)",
    icon: (
      <>
        <path d="M8 14V5a2 2 0 0 1 4 0" />
        <path d="M15 14V5a2 2 0 0 1 4 0" />
        <path d="M8 9h7" />
        <path d="M3 17c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1" />
      </>
    ),
  },
  {
    title: "Застеклённая терраса с камином",
    icon: (
      <path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z" />
    ),
  },
  {
    title: "Велосипеды",
    icon: (
      <>
        <circle cx="6" cy="16" r="3.5" />
        <circle cx="18" cy="16" r="3.5" />
        <path d="M6 16l4-8h5l3 8" />
        <path d="M10 8l3 8" />
        <path d="M8.5 6H11" />
      </>
    ),
  },
  {
    title: "Качели",
    icon: (
      <>
        <path d="M4 3h16" />
        <path d="M8 3l-1 11" />
        <path d="M16 3l1 11" />
        <rect x="5" y="14" width="14" height="2.5" rx="0.5" />
      </>
    ),
  },
  {
    title: "Костровая зона",
    icon: (
      <>
        <path d="M12 3c.8 2.2 3.5 3.5 3.5 7a3.5 3.5 0 0 1-7 0c0-1.4.7-2.2 1.5-3 0 1.4.7 2 1.5 2 0-2-.5-4 .5-6z" />
        <path d="M5 21l14-4" />
        <path d="M19 21L5 17" />
      </>
    ),
  },
  {
    title: "Мангальная зона",
    icon: (
      <>
        <path d="M4 11h16a8 8 0 0 1-16 0z" />
        <path d="M8 19l-2 3" />
        <path d="M16 19l2 3" />
        <path d="M9 7c0-1 1-1 1-2" />
        <path d="M14 7c0-1 1-1 1-2" />
      </>
    ),
  },
  {
    title: "Дрова",
    icon: (
      <>
        <circle cx="7" cy="17" r="3" />
        <circle cx="14" cy="17" r="3" />
        <circle cx="10.5" cy="10.5" r="3" />
        <circle cx="7" cy="17" r="0.6" />
        <circle cx="14" cy="17" r="0.6" />
        <circle cx="10.5" cy="10.5" r="0.6" />
      </>
    ),
  },
  {
    title: "Музыкальная колонка",
    icon: (
      <>
        <rect x="7" y="3" width="10" height="18" rx="2" />
        <circle cx="12" cy="15" r="3" />
        <circle cx="12" cy="8" r="1" />
      </>
    ),
  },
  {
    title: "Халаты и тапочки",
    icon: (
      <>
        <path d="M8 3l4 4 4-4 3 3-2 4v11H7V10L5 6z" />
        <path d="M12 7v14" />
      </>
    ),
  },
  {
    title: "Приватный паркинг на 3 авто",
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M10 17V8h3a2.5 2.5 0 0 1 0 5h-3" />
      </>
    ),
  },
];

const gradients = [
  "linear-gradient(135deg, rgba(46,79,62,0.55) 0%, rgba(10,10,10,0) 70%)",
  "linear-gradient(225deg, rgba(46,79,62,0.45) 0%, rgba(10,10,10,0) 70%)",
  "linear-gradient(45deg, rgba(59,106,82,0.4) 0%, rgba(10,10,10,0) 70%)",
  "linear-gradient(315deg, rgba(46,79,62,0.5) 0%, rgba(10,10,10,0) 70%)",
];

export default function Amenities() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ───── Заголовок ─────
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: ".amenities-head",
            start: "top 80%",
            once: true,
          },
        })
        .fromTo(
          ".amenities-label",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        )
        .fromTo(
          ".amenities-title-inner",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1 },
          "-=0.5"
        )
        .fromTo(
          ".amenities-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power2.inOut" },
          "-=0.6"
        )
        .fromTo(
          ".amenities-text",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          "-=0.6"
        );

      // ───── Карточки: по очереди (stagger), выезжают снизу ─────
      const cards = gsap.utils.toArray<HTMLElement>(".amenity-card");
      gsap.set(cards, { opacity: 0, y: 50 });

      ScrollTrigger.batch(cards, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            overwrite: true,
          }),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="amenities"
      className="relative overflow-hidden bg-[#0a0a0a] px-6 py-28 md:px-12 md:py-40"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[60rem] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(46,79,62,0.18) 0%, rgba(10,10,10,0) 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="amenities-head mb-16 md:mb-24">
          <p className="amenities-label mb-6 text-xs font-light uppercase tracking-[0.4em] text-[#5f8f78] opacity-0">
            Комфорт
          </p>
          <h2 className="overflow-hidden pb-2 text-4xl font-light uppercase leading-tight tracking-[0.04em] md:text-6xl">
            <span className="amenities-title-inner block opacity-0">
              Удобства
            </span>
          </h2>
          <div className="amenities-line mt-8 h-px w-24 origin-left bg-[#2e4f3e] md:w-40" />
          <p className="amenities-text mt-8 max-w-xl text-base font-light leading-relaxed text-white/60 opacity-0">
            Всё необходимое для отдыха семьи и друзей в любое время года —
            продумано до мелочей.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {amenities.map((item, i) => (
            <div
              key={item.title}
              className="amenity-card group relative flex min-h-[230px] flex-col justify-between overflow-hidden bg-[#0a0a0a] p-8 opacity-0 transition-colors duration-500 hover:bg-[#0d1511]"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: gradients[i % gradients.length] }}
              />
              <span className="absolute bottom-0 left-0 h-px w-0 bg-[#2e4f3e] transition-all duration-700 group-hover:w-full" />

              <div className="relative flex items-start justify-between">
                <svg
                  viewBox="0 0 24 24"
                  className="h-10 w-10 text-[#5f8f78] transition-all duration-500 group-hover:scale-110 group-hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {item.icon}
                </svg>
                <span className="text-xs font-light tracking-[0.3em] text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="relative mt-10 text-lg font-light leading-snug tracking-wide text-white transition-transform duration-500 group-hover:translate-x-1 md:text-xl">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}