// ФАЙЛ: src/components/FAQ.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ВАЖНО: проверьте ответы и поправьте под реальные правила дома
const faqs = [
  {
    q: "Можно ли с животными?",
    a: "Размещение с домашними животными лучше обсудить заранее. Позвоните или напишите нам при бронировании, и мы подскажем условия.",
  },
  {
    q: "Что входит в стоимость?",
    a: "Базовая цена — за дом для двоих: воскресенье–четверг 300 р, пятница–суббота 400 р. В доме есть кухня, совмещённая с гостиной, ванная, стиральная и сушильная машина, телевизор, холодильник, халаты и тапочки, а во дворе — терраса с камином, мангальная и костровая зоны, велосипеды, качели и парковка на 3 авто. Горячая купель и баня оплачиваются отдельно: по 100 р.",
  },
  {
    q: "Сколько человек можно разместить?",
    a: "До 6 гостей с ночевкой: две отдельные комнаты, две двуспальные кровати и один большой раскладной диван. Каждый последующий гость сверх двух — 50 р.",
  },
  {
    q: "Сколько стоит проживание с детьми?",
    a: "Дети до 6 лет — бесплатно, дети от 6 до 16 лет — 30 р.",
  },
  {
    q: "Во сколько заезд и выезд?",
    a: "Время заезда и выезда согласуется при бронировании: напишите нам в заявке удобное время или уточните по телефону.",
  },
  {
    q: "Как забронировать дом?",
    a: "Заполните форму на сайте, позвоните нам или напишите в Telegram или WhatsApp. Мы подтвердим доступность дат и расскажем об условиях бронирования.",
  },
  {
    q: "Работает ли бассейн зимой?",
    a: "Бассейн работает в летний сезон. Круглый год вас ждут горячая купель с массажем, баня и терраса с камином.",
  },
];

export default function FAQ() {
  const root = useRef<HTMLElement>(null);
  const panels = useRef<Array<HTMLDivElement | null>>([]);
  const firstRun = useRef(true);
  const [open, setOpen] = useState<number | null>(0);

  // Анимации появления
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: ".faq-head", start: "top 80%", once: true },
        })
        .fromTo(
          ".faq-label",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        )
        .fromTo(
          ".faq-title-inner",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1 },
          "-=0.5"
        )
        .fromTo(
          ".faq-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power2.inOut" },
          "-=0.6"
        );

      const items = gsap.utils.toArray<HTMLElement>(".faq-item");
      gsap.set(items, { opacity: 0, y: 40 });
      ScrollTrigger.batch(items, {
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
    }, root);

    return () => ctx.revert();
  }, []);

  // Раскрытие / сворачивание панелей
  useEffect(() => {
    panels.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        height: open === i ? "auto" : 0,
        duration: firstRun.current ? 0 : 0.6,
        ease: "power3.inOut",
        overwrite: true,
      });
    });
    firstRun.current = false;

    // Высота страницы изменилась — пересчитываем позиции триггеров
    const t = setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const list = panels.current;
    return () => {
      gsap.killTweensOf(list.filter(Boolean));
    };
  }, []);

  return (
    <section
      ref={root}
      id="faq"
      className="relative overflow-hidden px-6 py-28 md:px-12 md:py-40"
    >
      <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
        <div className="faq-head lg:col-span-4">
          <p className="faq-label mb-6 text-xs font-light uppercase tracking-[0.4em] text-[#d4af37] opacity-0">
            FAQ
          </p>
          <h2 className="overflow-hidden pb-2 text-4xl font-light uppercase leading-tight tracking-[0.04em] md:text-6xl">
            <span className="faq-title-inner block opacity-0">
              Частые вопросы
            </span>
          </h2>
          <div className="faq-line mt-8 h-px w-24 origin-left bg-[#d4af37] md:w-40" />
        </div>

        <div className="border-t border-white/10 lg:col-span-8">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="faq-item border-b border-white/10 opacity-0"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-btn-${i}`}
                    className="group flex w-full items-center justify-between gap-8 py-7 text-left md:py-8"
                  >
                    <span
                      className={`text-lg font-light tracking-wide transition-colors duration-300 md:text-2xl ${
                        isOpen ? "text-[#d4af37]" : "text-white/90 group-hover:text-white"
                      }`}
                    >
                      {item.q}
                    </span>
                    <span
                      className="relative h-5 w-5 shrink-0"
                      aria-hidden="true"
                    >
                      <span className="absolute left-0 top-1/2 h-px w-full bg-[#d4af37]" />
                      <span
                        className={`absolute left-1/2 top-0 h-full w-px bg-[#d4af37] transition-transform duration-500 ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  ref={(el) => {
                    panels.current[i] = el;
                  }}
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  style={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-8 text-base font-light leading-relaxed text-white/60 md:text-lg">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}