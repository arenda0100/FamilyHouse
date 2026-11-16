// ФАЙЛ: src/components/Hero.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CTAS = [
  { label: "Смотреть дом", href: "#features", variant: "fill" },
  { label: "Забронировать", href: "#booking", variant: "outline" },
] as const;

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  // ───── Основные анимации ─────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.3,
      });

      intro
        .fromTo(
          ".hero-label",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 }
        )
        .fromTo(
          ".hero-line",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.3, stagger: 0.18 },
          "-=0.5"
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
      gsap.to(".hero-blob-gold", {
        x: 40,
        y: 30,
        duration: 13,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Параллакс при скролле
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        })
        .fromTo(".hero-bg", { scale: 1.15 }, { scale: 1, yPercent: 15 }, 0)
        .to(".hero-p-title", { yPercent: -30 }, 0)
        .to(".hero-p-sub", { yPercent: -50 }, 0)
        .to(".hero-p-cta", { yPercent: -80 }, 0)
        .to(".hero-content", { opacity: 0 }, 0);
    }, root);

    return () => ctx.revert();
  }, []);

  // ───── Эффект магнита для обеих кнопок ─────
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cleanups: Array<() => void> = [];

    el.querySelectorAll<HTMLElement>(".magnet-area").forEach((area) => {
      const btn = area.querySelector<HTMLElement>(".magnet-btn");
      const label = area.querySelector<HTMLElement>(".magnet-text");
      if (!btn || !label) return;

      const opts = { duration: 0.7, ease: "power3.out" };
      const xTo = gsap.quickTo(btn, "x", opts);
      const yTo = gsap.quickTo(btn, "y", opts);
      const lxTo = gsap.quickTo(label, "x", opts);
      const lyTo = gsap.quickTo(label, "y", opts);

      const clampBtn = gsap.utils.clamp(-30, 30);
      const clampLabel = gsap.utils.clamp(-10, 10);

      const onMove = (e: MouseEvent) => {
        // Считаем от неподвижной области, а не от кнопки — иначе будет «дрожь»
        const r = area.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(clampBtn(dx * 0.35));
        yTo(clampBtn(dy * 0.35));
        lxTo(clampLabel(dx * 0.15));
        lyTo(clampLabel(dy * 0.15));
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
        lxTo(0);
        lyTo(0);
      };

      area.addEventListener("mousemove", onMove);
      area.addEventListener("mouseleave", onLeave);

      cleanups.push(() => {
        area.removeEventListener("mousemove", onMove);
        area.removeEventListener("mouseleave", onLeave);
        gsap.killTweensOf([btn, label]);
        gsap.set([btn, label], { x: 0, y: 0 });
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Фон: прозрачные слои поверх анимированного градиента сайта */}
      <div className="hero-bg pointer-events-none absolute inset-0 will-change-transform">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(46,79,62,0.5) 0%, rgba(10,10,10,0) 70%), radial-gradient(ellipse 60% 50% at 85% 100%, rgba(30,64,120,0.28) 0%, rgba(10,10,10,0) 70%)",
          }}
        />
        <div className="hero-blob-a absolute -left-32 top-1/4 h-[28rem] w-[28rem] rounded-full bg-[#2e4f3e] opacity-30 blur-[120px]" />
        <div className="hero-blob-b absolute -right-24 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[#3b6a52] opacity-20 blur-[120px]" />
        <div className="hero-blob-gold absolute left-1/2 top-[55%] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-[#d4af37] opacity-[0.08] blur-[130px]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.55) 100%)",
          }}
        />
      </div>

      {/* Контент */}
      <div className="hero-content relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        {/* Слой 1: надзаголовок + заголовок */}
        <div className="hero-p-title">
          <p className="hero-label mb-8 text-[11px] font-light uppercase tracking-[0.5em] text-[#d4af37] opacity-0 md:text-xs">
            Family House · Гродно
          </p>

          <h1
            aria-label="Тишина и комфорт"
            className="font-serif text-[clamp(3.5rem,12vw,10rem)] font-normal leading-[0.95] tracking-tight"
          >
            <span className="block overflow-hidden pb-2">
              <span className="hero-line block opacity-0">Тишина</span>
            </span>
            <span className="block overflow-hidden pb-3">
              <span className="hero-line block italic text-[#d4af37] opacity-0">
                и комфорт
              </span>
            </span>
          </h1>
        </div>

        {/* Слой 2: разделитель и описание */}
        <div className="hero-p-sub flex flex-col items-center">
          <div className="hero-divider mt-8 h-px w-24 origin-center bg-[#d4af37] md:w-40" />
          <p className="hero-sub mt-8 max-w-2xl text-base font-light leading-relaxed text-white/70 opacity-0 md:text-lg">
            Премиальная аренда дома в Гродно. Горячая купель, баня, терраса с
            камином и парковка на 3 авто — для отдыха семьёй или компанией до 6
            гостей.
          </p>
        </div>

        {/* Слой 3: кнопки с эффектом магнита */}
        <div className="hero-p-cta mt-6">
          <div className="hero-cta flex flex-col items-center opacity-0 sm:flex-row">
            {CTAS.map((c) => (
              <div key={c.label} className="magnet-area inline-flex p-4">
                <div className="magnet-btn will-change-transform">
                  <a
                    href={c.href}
                    className={
                      c.variant === "fill"
                        ? "group relative inline-flex items-center border border-[#d4af37] bg-[#d4af37] px-10 py-4 text-xs font-normal uppercase tracking-[0.3em] text-[#0a0a0a] transition-colors duration-500 hover:bg-[#e6c35c] md:text-sm"
                        : "group relative inline-flex items-center border border-[#d4af37]/60 px-10 py-4 text-xs font-light uppercase tracking-[0.3em] text-white transition-colors duration-500 hover:border-[#d4af37] hover:bg-[#d4af37]/10 md:text-sm"
                    }
                  >
                    <span
                      className="magnet-text inline-flex items-center gap-4 will-change-transform"
                    >
                      <span>{c.label}</span>
                      <span className="inline-block transition-transform duration-500 group-hover:translate-x-2">
                        →
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Индикатор скролла */}
      <div className="hero-scroll absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 opacity-0">
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/60">
          Scroll
        </span>
        <span className="block h-10 w-px bg-gradient-to-b from-[#d4af37] to-transparent" />
      </div>
    </section>
  );
}