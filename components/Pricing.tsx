// ФАЙЛ: src/components/Pricing.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mainPrices = [
  { label: "Дом для двоих", period: "Воскресенье — Четверг", price: 300 },
  {
    label: "Дом для двоих",
    period: "Пятница — Суббота",
    price: 400,
    accent: true,
  },
];

const extras = [
  { label: "Каждый последующий гость", price: "50 р" },
  { label: "Горячая купель", price: "100 р" },
  { label: "Баня", price: "100 р" },
];

const kids = [
  { label: "Дети до 6 лет", price: "Бесплатно" },
  { label: "Дети 6–16 лет", price: "30 р" },
];

export default function Pricing() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ───── Заголовок ─────
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: ".pricing-head",
            start: "top 80%",
            once: true,
          },
        })
        .fromTo(
          ".pricing-label",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        )
        .fromTo(
          ".pricing-title-inner",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1 },
          "-=0.5"
        )
        .fromTo(
          ".pricing-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power2.inOut" },
          "-=0.6"
        );

      // ───── Блоки с ценами: scale 0.9 → 1 ─────
      const blocks = gsap.utils.toArray<HTMLElement>(
        ".price-card, .price-panel"
      );
      gsap.set(blocks, {
        opacity: 0,
        scale: 0.9,
        y: 30,
        transformOrigin: "50% 50%",
      });

      ScrollTrigger.batch(blocks, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.15,
            overwrite: true,
          }),
      });

      // ───── Строки внутри панелей ─────
      const rows = gsap.utils.toArray<HTMLElement>(".price-row");
      gsap.set(rows, { opacity: 0, y: 24 });
      ScrollTrigger.batch(rows, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            overwrite: true,
          }),
      });

      // ───── Счётчик: цена «набегает» от 0 до значения при скролле ─────
      gsap.utils.toArray<HTMLElement>(".price-number").forEach((el) => {
        const target = Number(el.dataset.value);
        const counter = { v: 0 };
        el.textContent = "0";

        gsap.to(counter, {
          v: target,
          duration: 2,
          delay: 0.3, // даём карточке успеть появиться
          ease: "power2.out",
          snap: { v: 1 }, // только целые числа
          onUpdate: () => {
            el.textContent = String(counter.v);
          },
          onComplete: () => {
            // Небольшой «пульс» в конце счёта
            gsap.fromTo(
              el,
              { scale: 1.08 },
              { scale: 1, duration: 0.6, ease: "power2.out" }
            );
          },
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="pricing"
      className="relative overflow-hidden px-6 py-28 md:px-12 md:py-40"
    >
      <div
        className="pointer-events-none absolute -left-40 bottom-0 h-[36rem] w-[36rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(46,79,62,0.22) 0%, rgba(10,10,10,0) 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Заголовок */}
        <div className="pricing-head mb-16 md:mb-24">
          <p className="pricing-label mb-6 text-xs font-light uppercase tracking-[0.4em] text-[#5f8f78] opacity-0">
            Стоимость
          </p>
          <h2 className="overflow-hidden pb-2 text-4xl font-light uppercase leading-tight tracking-[0.04em] md:text-6xl">
            <span className="pricing-title-inner block opacity-0">
              Цены и правила
            </span>
          </h2>
          <div className="pricing-line mt-8 h-px w-24 origin-left bg-[#2e4f3e] md:w-40" />
        </div>

        {/* Основные цены */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {mainPrices.map((p) => (
            <div
              key={p.period}
              className="price-card relative overflow-hidden border border-white/10 p-10 opacity-0 md:p-14"
              style={{
                background: p.accent
                  ? "linear-gradient(135deg, rgba(46,79,62,0.6) 0%, rgba(10,10,10,0) 80%)"
                  : "linear-gradient(135deg, rgba(46,79,62,0.2) 0%, rgba(10,10,10,0) 80%)",
              }}
            >
              <p className="text-xs font-light uppercase tracking-[0.35em] text-[#5f8f78]">
                {p.label}
              </p>
              <p className="mt-3 text-lg font-light tracking-wide text-white/80">
                {p.period}
              </p>
              <div className="mt-10 flex items-baseline gap-3">
                <span
                  className="price-number inline-block origin-left text-[clamp(4.5rem,10vw,8rem)] font-extralight leading-none tabular-nums"
                  data-value={p.price}
                  aria-label={`${p.price} рублей`}
                >
                  {p.price}
                </span>
                <span className="text-2xl font-light text-white/60">р</span>
              </div>
            </div>
          ))}
        </div>

        {/* Дополнительно + Дети */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="price-panel border border-white/10 p-10 opacity-0 md:p-12">
            <p className="mb-6 text-xs font-light uppercase tracking-[0.35em] text-[#5f8f78]">
              Дополнительно
            </p>
            {extras.map((r, i) => (
              <div
                key={r.label}
                className={`price-row flex items-baseline justify-between gap-6 py-5 opacity-0 ${
                  i !== extras.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <span className="text-base font-light tracking-wide text-white/80 md:text-lg">
                  {r.label}
                </span>
                <span className="whitespace-nowrap text-xl font-light md:text-2xl">
                  {r.price}
                </span>
              </div>
            ))}
          </div>

          <div className="price-panel border border-white/10 p-10 opacity-0 md:p-12">
            <p className="mb-6 text-xs font-light uppercase tracking-[0.35em] text-[#5f8f78]">
              Дети
            </p>
            {kids.map((r, i) => (
              <div
                key={r.label}
                className={`price-row flex items-baseline justify-between gap-6 py-5 opacity-0 ${
                  i !== kids.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <span className="text-base font-light tracking-wide text-white/80 md:text-lg">
                  {r.label}
                </span>
                <span className="whitespace-nowrap text-xl font-light md:text-2xl">
                  {r.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}