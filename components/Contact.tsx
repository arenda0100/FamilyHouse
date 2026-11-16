// ФАЙЛ: src/components/Contact.tsx
"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ADDRESS = "Гродно, а/г Ратичи, улица Центральная 125";
const PHONE_DISPLAY = "+375 29 287-37-74";
const PHONE_LINK = "tel:+375292873774";
const INSTAGRAM_URL = "https://www.instagram.com/familyhouse.grodno";
// Если есть username в Telegram, замените на https://t.me/ВАШ_USERNAME
const TELEGRAM_URL = "https://t.me/+375292873774";
const WHATSAPP_URL = "https://wa.me/375292873774";
const ROUTE_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  ADDRESS
)}`;

type Card = {
  label: string;
  value: string;
  action: string;
  href: string;
  external?: boolean;
  icon: ReactNode;
};

const cards: Card[] = [
  {
    label: "Телефон",
    value: PHONE_DISPLAY,
    action: "Позвонить",
    href: PHONE_LINK,
    icon: (
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    ),
  },
  {
    label: "Instagram",
    value: "@familyhouse.grodno",
    action: "Открыть",
    href: INSTAGRAM_URL,
    external: true,
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" />
      </>
    ),
  },
  {
    label: "Адрес",
    value: ADDRESS,
    action: "Открыть на карте",
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      ADDRESS
    )}`,
    external: true,
    icon: (
      <>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </>
    ),
  },
];

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: ".contact-head", start: "top 80%", once: true },
        })
        .fromTo(
          ".contact-label",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        )
        .fromTo(
          ".contact-title-inner",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1 },
          "-=0.5"
        )
        .fromTo(
          ".contact-divider",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power2.inOut" },
          "-=0.6"
        );

      const items = gsap.utils.toArray<HTMLElement>(".contact-item");
      gsap.set(items, { opacity: 0, y: 50 });
      ScrollTrigger.batch(items, {
        start: "top 90%",
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
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="contact"
      className="relative overflow-hidden px-6 py-28 md:px-12 md:py-40"
    >
      <div
        className="pointer-events-none absolute -right-40 top-10 h-[40rem] w-[40rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(46,79,62,0.25) 0%, rgba(10,10,10,0) 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="contact-head mb-16 md:mb-24">
          <p className="contact-label mb-6 text-xs font-light uppercase tracking-[0.4em] text-[#d4af37] opacity-0">
            Связь с нами
          </p>
          <h2 className="overflow-hidden pb-2 text-4xl font-light uppercase leading-tight tracking-[0.04em] md:text-6xl">
            <span className="contact-title-inner block opacity-0">Контакты</span>
          </h2>
          <div className="contact-divider mt-8 h-px w-24 origin-left bg-[#d4af37] md:w-40" />
        </div>

        {/* Карточки */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.label}
              className="contact-item group relative flex flex-col justify-between overflow-hidden border border-white/10 bg-black/30 p-8 opacity-0 transition-colors duration-500 hover:border-[#d4af37]/50 md:p-10"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(10,10,10,0) 70%)",
                }}
              />

              <div className="relative">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d4af37]/40 text-[#d4af37] transition-colors duration-500 group-hover:border-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-[#0a0a0a]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {c.icon}
                  </svg>
                </span>

                <p className="mt-8 text-[11px] font-light uppercase tracking-[0.35em] text-[#d4af37]/80">
                  {c.label}
                </p>
                <p className="mt-3 text-xl font-light leading-snug tracking-wide md:text-2xl">
                  {c.value}
                </p>
              </div>

              <a
                href={c.href}
                {...(c.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="relative mt-10 inline-flex items-center gap-3 self-start border border-white/20 px-6 py-3 text-[11px] font-light uppercase tracking-[0.3em] transition-colors duration-300 hover:border-[#d4af37] hover:text-[#d4af37]"
              >
                <span>{c.action}</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          ))}
        </div>

        {/* Мессенджеры */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item group flex items-center justify-between gap-6 bg-[#229ED9] px-8 py-7 text-[#0a0a0a] opacity-0 transition-[filter,transform] duration-500 hover:brightness-110 md:px-12 md:py-9"
          >
            <span className="flex items-center gap-5">
              <svg
                viewBox="0 0 24 24"
                className="h-9 w-9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21.5 3.5 2.5 10.8l6.2 2.3 2.3 6.4 3.1-4.4 5 3.7z" />
                <path d="M8.7 13.1l12.8-9.6" />
              </svg>
              <span className="text-sm font-normal uppercase tracking-[0.3em] md:text-base">
                Написать в Telegram
              </span>
            </span>
            <span className="text-2xl transition-transform duration-500 group-hover:translate-x-2">
              →
            </span>
          </a>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item group flex items-center justify-between gap-6 bg-[#25D366] px-8 py-7 text-[#0a0a0a] opacity-0 transition-[filter,transform] duration-500 hover:brightness-110 md:px-12 md:py-9"
          >
            <span className="flex items-center gap-5">
              <svg
                viewBox="0 0 24 24"
                className="h-9 w-9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.5z" />
                <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z" />
              </svg>
              <span className="text-sm font-normal uppercase tracking-[0.3em] md:text-base">
                Написать в WhatsApp
              </span>
            </span>
            <span className="text-2xl transition-transform duration-500 group-hover:translate-x-2">
              →
            </span>
          </a>
        </div>

        {/* Маршрут */}
        <a
          href={ROUTE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-item group relative mt-6 flex items-center justify-between gap-8 overflow-hidden border border-[#d4af37] px-8 py-7 text-white opacity-0 md:px-12 md:py-9"
        >
          {/* Золотая заливка выезжает слева при наведении */}
          <span className="absolute inset-0 -translate-x-full bg-[#d4af37] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
          <span className="relative flex flex-col gap-1 transition-colors duration-500 group-hover:text-[#0a0a0a]">
            <span className="text-sm font-normal uppercase tracking-[0.3em] md:text-base">
              Построить маршрут
            </span>
            <span className="text-xs font-light tracking-wide opacity-60">
              Google Maps · {ADDRESS}
            </span>
          </span>
          <span className="relative text-3xl transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#0a0a0a]">
            ↗
          </span>
        </a>
      </div>
    </section>
  );
}