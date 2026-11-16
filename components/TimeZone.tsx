// ФАЙЛ: src/components/TimeZone.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Zone = { city: string; tz: string; offset: string; main?: boolean };

const ZONES: Zone[] = [
  { city: "Гродно", tz: "Europe/Minsk", offset: "UTC+3", main: true },
  { city: "Москва", tz: "Europe/Moscow", offset: "UTC+3" },
];

// Форматтеры создаются один раз. Intl сам учитывает часовой пояс,
// поэтому смещение не нужно считать вручную.
const timeFmt = (tz: string) =>
  new Intl.DateTimeFormat("ru-RU", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

const dateFmt = (tz: string) =>
  new Intl.DateTimeFormat("ru-RU", {
    timeZone: tz,
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const timeFormatters = Object.fromEntries(ZONES.map((z) => [z.tz, timeFmt(z.tz)]));
const dateFormatters = Object.fromEntries(ZONES.map((z) => [z.tz, dateFmt(z.tz)]));

export default function TimeZone() {
  const root = useRef<HTMLElement>(null);
  // null до монтирования — чтобы не было рассинхрона серверного и клиентского HTML
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: ".tz-head", start: "top 85%", once: true },
        })
        .fromTo(
          ".tz-label",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        )
        .fromTo(
          ".tz-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power2.inOut" },
          "-=0.4"
        );

      const cards = gsap.utils.toArray<HTMLElement>(".tz-card");
      gsap.set(cards, { opacity: 0, y: 50 });
      ScrollTrigger.batch(cards, {
        start: "top 90%",
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
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="time"
      className="relative overflow-hidden bg-[#0a0a0a] px-6 pb-28 md:px-12 md:pb-40"
    >
      <style>{`
        @keyframes tz-blink {
          0%, 49%   { opacity: 1; }
          50%, 100% { opacity: 0.25; }
        }
        .tz-colon { animation: tz-blink 1s steps(1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .tz-colon { animation: none; }
        }
      `}</style>

      <div className="relative mx-auto max-w-7xl">
        <div className="tz-head mb-10 md:mb-14">
          <p className="tz-label mb-6 text-xs font-light uppercase tracking-[0.4em] text-[#5f8f78] opacity-0">
            Местное время
          </p>
          <div className="tz-line h-px w-24 origin-left bg-[#2e4f3e] md:w-40" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {ZONES.map((z) => {
            const parts = now ? timeFmt(z.tz).format(now).split(":") : null;
            const [hh, mm, ss] = parts ?? ["--", "--", "--"];

            return (
              <div
                key={z.city}
                className="tz-card relative overflow-hidden border border-white/10 p-10 opacity-0 md:p-14"
                style={{
                  background: z.main
                    ? "linear-gradient(135deg, rgba(46,79,62,0.5) 0%, rgba(10,10,10,0) 80%)"
                    : "linear-gradient(135deg, rgba(46,79,62,0.15) 0%, rgba(10,10,10,0) 80%)",
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-light uppercase tracking-[0.35em] text-[#5f8f78]">
                    Время в {z.city === "Гродно" ? "Гродно" : "Москве"}
                  </p>
                  <span className="text-xs font-light tracking-[0.3em] text-white/40">
                    {z.offset}
                  </span>
                </div>

                <div
                  className="mt-10 flex items-baseline font-extralight leading-none tabular-nums text-[clamp(3.5rem,9vw,7rem)]"
                  aria-label={now ? timeFormatters[z.tz].format(now) : undefined}
                >
                  <span>{hh}</span>
                  <span className="tz-colon mx-1 text-[#5f8f78] md:mx-2">:</span>
                  <span>{mm}</span>
                  <span className="tz-colon mx-1 text-[#5f8f78] md:mx-2">:</span>
                  <span className="text-[0.45em] text-white/50">{ss}</span>
                </div>

                <p className="mt-6 text-sm font-light capitalize tracking-wide text-white/50">
                  {now ? dateFormatters[z.tz].format(now) : "\u00A0"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}