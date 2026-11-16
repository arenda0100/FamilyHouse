// ФАЙЛ: src/components/Features.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { prefix: "До", value: "6", label: "гостей с ночевкой" },
  { prefix: "", value: "2", label: "отдельные комнаты" },
];

const features = [
  "Кухня, совмещённая с гостиной",
  "2 двуспальные кровати",
  "1 большой раскладной диван",
  "Ванная, стиральная и сушильная машина",
  "Большой телевизор",
  "Холодильник",
];

export default function Features() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ───── Заголовок ─────
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: ".features-head",
            start: "top 80%",
            once: true,
          },
        })
        .fromTo(
          ".features-label",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        )
        .fromTo(
          ".features-title-inner",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1 },
          "-=0.5"
        )
        .fromTo(
          ".features-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power2.inOut" },
          "-=0.6"
        );

      // ───── Крупные карточки: по очереди, снизу вверх ─────
      const statCards = gsap.utils.toArray<HTMLElement>(".feature-stat");
      gsap.set(statCards, { opacity: 0, y: 50 });
      ScrollTrigger.batch(statCards, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.2,
            overwrite: true,
          }),
      });

      // ───── Строки списка: по очереди, снизу вверх ─────
      const rows = gsap.utils.toArray<HTMLElement>(".feature-row");
      gsap.set(rows, { opacity: 0, y: 50 });
      ScrollTrigger.batch(rows, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            overwrite: true,
          }),
      });

      // ───── Линии-разделители «прорисовываются» ─────
      gsap.utils.toArray<HTMLElement>(".feature-row-line").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power2.inOut",
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="features"
      className="relative overflow-hidden bg-[#0a0a0a] px-6 py-28 md:px-12 md:py-40"
    >
      <div
        className="pointer-events-none absolute -right-40 top-20 h-[36rem] w-[36rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(46,79,62,0.22) 0%, rgba(10,10,10,0) 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Заголовок */}
        <div className="features-head mb-16 md:mb-24">
          <p className="features-label mb-6 text-xs font-light uppercase tracking-[0.4em] text-[#5f8f78] opacity-0">
            Дом
          </p>
          <h2 className="overflow-hidden pb-2 text-4xl font-light uppercase leading-tight tracking-[0.04em] md:text-6xl">
            <span className="features-title-inner block opacity-0">
              Особенности
            </span>
          </h2>
          <div className="features-line mt-8 h-px w-24 origin-left bg-[#2e4f3e] md:w-40" />
        </div>

        {/* Крупные показатели */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:mb-24 md:grid-cols-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="feature-stat relative overflow-hidden border border-white/10 p-10 opacity-0 md:p-14"
              style={{
                background:
                  "linear-gradient(135deg, rgba(46,79,62,0.35) 0%, rgba(10,10,10,0) 75%)",
              }}
            >
              <div className="flex items-baseline gap-4">
                {s.prefix && (
                  <span className="text-sm font-light uppercase tracking-[0.3em] text-white/60">
                    {s.prefix}
                  </span>
                )}
                <span className="text-[clamp(5rem,12vw,9rem)] font-extralight leading-none">
                  {s.value}
                </span>
              </div>
              <p className="mt-4 text-sm font-light uppercase tracking-[0.3em] text-[#5f8f78] md:text-base">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Список */}
        <div className="grid grid-cols-1 gap-x-16 md:grid-cols-2">
          {features.map((text, i) => (
            <div key={text} className="feature-row opacity-0">
              <div className="flex items-center gap-6 py-7">
                <span className="text-xs font-light tracking-[0.3em] text-[#5f8f78]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-lg font-light tracking-wide text-white/90 md:text-xl">
                  {text}
                </span>
              </div>
              <div className="feature-row-line h-px w-full origin-left bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}