// ФАЙЛ: src/components/Booking.tsx
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Номер для получения заявок (WhatsApp, формат без + и пробелов)
const WHATSAPP_NUMBER = "375292873774";

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

type FormState = {
  checkIn: string;
  checkOut: string;
  guests: number;
  onlySauna: boolean;
  banquet: boolean;
  name: string;
  phone: string;
  wishes: string;
};

const initial: FormState = {
  checkIn: "",
  checkOut: "",
  guests: 2,
  onlySauna: false,
  banquet: false,
  name: "",
  phone: "",
  wishes: "",
};

const toLocalISO = (d: Date) => {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

const formatDate = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
};

const fieldCls =
  "w-full border border-white/15 bg-black/40 px-5 py-4 text-base font-light tracking-wide text-white placeholder:text-white/30 outline-none transition-colors duration-300 focus:border-[#d4af37] [color-scheme:dark]";
const labelCls =
  "mb-3 block text-[11px] font-light uppercase tracking-[0.3em] text-[#d4af37]/80";

/**
 * Отправка заявки. Сейчас открывается WhatsApp с готовым текстом — работает без сервера.
 * Когда появится бэкенд, замените тело функции на fetch("/api/booking", { ... }).
 */
function sendRequest(f: FormState) {
  const extras = [f.onlySauna && "только баня", f.banquet && "банкет"]
    .filter(Boolean)
    .join(", ");

  const text = [
    "Заявка с сайта Family House",
    `Заезд: ${formatDate(f.checkIn)}`,
    `Выезд: ${formatDate(f.checkOut)}`,
    `Гостей: ${f.guests}`,
    extras && `Дополнительно: ${extras}`,
    `Имя: ${f.name.trim()}`,
    `Телефон: ${f.phone.trim()}`,
    f.wishes.trim() && `Пожелания: ${f.wishes.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener,noreferrer"
  );
}

export default function Booking() {
  const root = useRef<HTMLElement>(null);
  const [form, setForm] = useState<FormState>(initial);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const today = toLocalISO(new Date());

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setSent(false);
    setForm((p) => ({ ...p, [key]: value }));
  };

  const changeGuests = (delta: number) =>
    set("guests", Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, form.guests + delta)));

  const validate = (): string | null => {
    if (!form.checkIn) return "Укажите дату заезда.";
    if (form.checkOut && form.checkOut < form.checkIn)
      return "Дата выезда не может быть раньше заезда.";
    if (!form.name.trim()) return "Введите ваше имя.";
    if (form.phone.replace(/\D/g, "").length < 9)
      return "Введите корректный номер телефона.";
    return null;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const err = validate();
    setError(err);
    if (err) return;
    sendRequest(form);
    setSent(true);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: ".booking-head", start: "top 80%", once: true },
        })
        .fromTo(
          ".booking-label",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        )
        .fromTo(
          ".booking-title-inner",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1 },
          "-=0.5"
        )
        .fromTo(
          ".booking-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power2.inOut" },
          "-=0.6"
        )
        .fromTo(
          ".booking-text",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          "-=0.6"
        );

      gsap.fromTo(
        ".booking-form",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".booking-form", start: "top 88%", once: true },
        }
      );

      const fields = gsap.utils.toArray<HTMLElement>(".booking-field");
      gsap.set(fields, { opacity: 0, y: 30 });
      ScrollTrigger.batch(fields, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            overwrite: true,
          }),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="booking"
      className="relative overflow-hidden px-6 py-28 md:px-12 md:py-40"
    >
      <div
        className="pointer-events-none absolute -left-40 top-20 h-[40rem] w-[40rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(212,175,55,0.10) 0%, rgba(10,10,10,0) 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
        {/* Левая колонка */}
        <div className="booking-head lg:col-span-5">
          <p className="booking-label mb-6 text-xs font-light uppercase tracking-[0.4em] text-[#d4af37] opacity-0">
            Бронирование
          </p>
          <h2 className="overflow-hidden pb-2 text-4xl font-light uppercase leading-tight tracking-[0.04em] md:text-6xl">
            <span className="booking-title-inner block opacity-0">
              Оставьте заявку
            </span>
          </h2>
          <div className="booking-line mt-8 h-px w-24 origin-left bg-[#d4af37] md:w-40" />
          <p className="booking-text mt-8 max-w-md text-base font-light leading-relaxed text-white/60 opacity-0">
            Выберите даты и количество гостей — мы свяжемся с вами и подтвердим
            бронь. В доме могут остаться на ночь до 6 гостей.
          </p>
        </div>

        {/* Форма */}
        <form
          onSubmit={onSubmit}
          noValidate
          className="booking-form border border-white/10 bg-black/30 p-8 opacity-0 backdrop-blur-sm md:p-12 lg:col-span-7"
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div className="booking-field">
              <label htmlFor="b-in" className={labelCls}>
                Заезд
              </label>
              <input
                id="b-in"
                type="date"
                min={today}
                value={form.checkIn}
                onChange={(e) => {
                  const v = e.target.value;
                  set("checkIn", v);
                  if (form.checkOut && v && form.checkOut < v) set("checkOut", "");
                }}
                className={fieldCls}
              />
            </div>

            <div className="booking-field">
              <label htmlFor="b-out" className={labelCls}>
                Выезд
              </label>
              <input
                id="b-out"
                type="date"
                min={form.checkIn || today}
                value={form.checkOut}
                onChange={(e) => set("checkOut", e.target.value)}
                className={fieldCls}
              />
            </div>

            {/* Гости */}
            <div className="booking-field">
              <span className={labelCls}>Количество гостей</span>
              <div className="flex items-stretch border border-white/15 bg-black/40">
                <button
                  type="button"
                  onClick={() => changeGuests(-1)}
                  disabled={form.guests <= MIN_GUESTS}
                  aria-label="Уменьшить количество гостей"
                  className="w-16 text-2xl font-extralight text-white transition-colors duration-300 hover:bg-[#d4af37] hover:text-[#0a0a0a] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
                >
                  −
                </button>
                <output
                  aria-live="polite"
                  className="flex flex-1 items-center justify-center border-x border-white/15 py-4 text-xl font-light tabular-nums"
                >
                  {form.guests}
                </output>
                <button
                  type="button"
                  onClick={() => changeGuests(1)}
                  disabled={form.guests >= MAX_GUESTS}
                  aria-label="Увеличить количество гостей"
                  className="w-16 text-2xl font-extralight text-white transition-colors duration-300 hover:bg-[#d4af37] hover:text-[#0a0a0a] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Чекбоксы */}
            <div className="booking-field">
              <span className={labelCls}>Дополнительно</span>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    ["onlySauna", "Только баня"],
                    ["banquet", "Банкет"],
                  ] as const
                ).map(([key, text]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-3 border border-white/15 bg-black/40 px-4 py-4 text-sm font-light tracking-wide transition-colors duration-300 hover:border-[#d4af37]/60"
                  >
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={(e) => set(key, e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-white/30 text-[#0a0a0a] transition-colors duration-300 peer-checked:border-[#d4af37] peer-checked:bg-[#d4af37] peer-focus-visible:ring-1 peer-focus-visible:ring-[#d4af37] [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    <span>{text}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="booking-field">
              <label htmlFor="b-name" className={labelCls}>
                Ваше имя
              </label>
              <input
                id="b-name"
                type="text"
                autoComplete="name"
                placeholder="Как к вам обращаться"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={fieldCls}
              />
            </div>

            <div className="booking-field">
              <label htmlFor="b-phone" className={labelCls}>
                Телефон
              </label>
              <input
                id="b-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+375 __ ___-__-__"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={fieldCls}
              />
            </div>

            <div className="booking-field md:col-span-2">
              <label htmlFor="b-wishes" className={labelCls}>
                Пожелания
              </label>
              <textarea
                id="b-wishes"
                rows={4}
                placeholder="Повод, время заезда, особые просьбы…"
                value={form.wishes}
                onChange={(e) => set("wishes", e.target.value)}
                className={`${fieldCls} resize-none`}
              />
            </div>
          </div>

          <div className="booking-field mt-10">
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-4 border border-[#d4af37] bg-[#d4af37] px-10 py-5 text-sm font-normal uppercase tracking-[0.3em] text-[#0a0a0a] transition-colors duration-500 hover:bg-[#e6c35c]"
            >
              <span>Отправить заявку</span>
              <span className="inline-block transition-transform duration-500 group-hover:translate-x-2">
                →
              </span>
            </button>

            {error && (
              <p role="alert" className="mt-5 text-sm font-light text-red-300">
                {error}
              </p>
            )}
            {sent && !error && (
              <p role="status" className="mt-5 text-sm font-light text-[#d4af37]">
                Мы открыли WhatsApp с готовым сообщением — отправьте его, и заявка
                придёт к нам.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}