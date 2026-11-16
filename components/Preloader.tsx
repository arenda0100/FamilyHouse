// ФАЙЛ: src/components/Preloader.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type PreloaderProps = {
  onEnter: () => void;
};

export default function Preloader({ onEnter }: PreloaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const exitTl = useRef<gsap.core.Timeline | null>(null);
  const isLeaving = useRef(false);

  // Появление прелоадера
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        starRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.4, ease: "power3.out" }
      );
      gsap.fromTo(
        hintRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" }
      );
    }, root);

    return () => {
      ctx.revert();
      exitTl.current?.kill();
    };
  }, []);

  // Клик: звезда увеличивается и растворяется, затем вызываем onEnter
  const handleEnter = () => {
    if (isLeaving.current) return;
    isLeaving.current = true;

    const tl = gsap.timeline({ onComplete: onEnter });
    exitTl.current = tl;

    tl.to(
      hintRef.current,
      { opacity: 0, y: 10, duration: 0.4, ease: "power2.in", overwrite: true },
      0
    )
      // Увеличение (overwrite убирает незавершённую анимацию появления)
      .to(
        starRef.current,
        { scale: 28, duration: 1.6, ease: "power3.in", overwrite: true },
        0
      )
      // Растворение чуть позже, чтобы звезда успела «залить» экран
      .to(
        starRef.current,
        { opacity: 0, duration: 1.1, ease: "power1.inOut" },
        0.5
      );
  };

  return (
    <div
      ref={root}
      role="button"
      tabIndex={0}
      aria-label="Войти на сайт"
      onClick={handleEnter}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleEnter();
        }
      }}
      className="fixed inset-0 z-50 flex cursor-pointer select-none flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] outline-none"
    >
      <style>{`
        @keyframes star-pulse {
          0%, 100% {
            transform: scale(0.94);
            opacity: 0.55;
            filter: drop-shadow(0 0 6px rgba(95, 143, 120, 0.25));
          }
          50% {
            transform: scale(1.06);
            opacity: 1;
            filter: drop-shadow(0 0 22px rgba(95, 143, 120, 0.55));
          }
        }
        .star-pulse {
          animation: star-pulse 3.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .star-pulse { animation: none; }
        }
      `}</style>

      {/* Мягкое свечение за звездой */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(46,79,62,0.35) 0%, rgba(10,10,10,0) 65%)",
        }}
      />

      {/* Обёртка для GSAP (scale/opacity), внутри — CSS-пульсация */}
      <div ref={starRef} className="relative opacity-0">
        <svg
          viewBox="0 0 100 100"
          className="star-pulse h-28 w-28 md:h-36 md:w-36"
          aria-hidden="true"
        >
          {/* Пятиконечная звезда */}
          <polygon
            points="50,5 60.11,36.09 92.8,36.09 66.36,55.31 76.45,86.4 50,67.2 23.55,86.4 33.64,55.31 7.2,36.09 39.89,36.09"
            fill="rgba(46,79,62,0.35)"
            stroke="#5f8f78"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* Тонкий внутренний пятиугольник */}
          <polygon
            points="60.11,36.09 66.36,55.31 50,67.2 33.64,55.31 39.89,36.09"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p
        ref={hintRef}
        className="relative mt-14 text-[10px] font-light uppercase tracking-[0.4em] text-white/50 opacity-0"
      >
        Нажмите, чтобы войти
      </p>
    </div>
  );
}