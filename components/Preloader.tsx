// ФАЙЛ: src/components/Preloader.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type PreloaderProps = {
  onEnter: () => void;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
};

// Контур пятиконечной звезды (viewBox 100x100)
const STAR: [number, number][] = [
  [50, 5],
  [60.11, 36.09],
  [92.8, 36.09],
  [66.36, 55.31],
  [76.45, 86.4],
  [50, 67.2],
  [23.55, 86.4],
  [33.64, 55.31],
  [7.2, 36.09],
  [39.89, 36.09],
];
const STAR_POINTS = STAR.map(([x, y]) => `${x},${y}`).join(" ");
const INNER_POINTS = "60.11,36.09 66.36,55.31 50,67.2 33.64,55.31 39.89,36.09";

const COLORS = ["#5f8f78", "#7fb59b", "#a8d5be", "#2e4f3e", "#ffffff"];
const TAU = Math.PI * 2;

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pickColor = () => COLORS[(Math.random() * COLORS.length) | 0];

// Лежит ли точка внутри звезды (ray casting)
function insideStar(px: number, py: number) {
  let inside = false;
  for (let i = 0, j = STAR.length - 1; i < STAR.length; j = i++) {
    const [xi, yi] = STAR[i];
    const [xj, yj] = STAR[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

export default function Preloader({ onEnter }: PreloaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  const engine = useRef<{ burst: () => void } | null>(null);
  const ready = useRef(false);
  const leaving = useRef(false);
  const exitTl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const star = starRef.current;
    const svg = svgRef.current;
    const hint = hintRef.current;
    const glow = glowRef.current;
    if (!canvas || !star || !svg || !hint || !glow) return;

    const c = canvas.getContext("2d");
    if (!c) return;

    ready.current = false;
    leaving.current = false;
    svg.classList.remove("star-pulse");

    let W = 0;
    let H = 0;
    let flying = true;
    const particles: Particle[] = [];
    const ring = { r: 0, a: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const starCenter = () => ({
      x: W / 2 + Number(gsap.getProperty(star, "x")),
      y: H / 2 + Number(gsap.getProperty(star, "y")),
    });

    // След из искр за летящей звездой
    const emitTrail = () => {
      const { x, y } = starCenter();
      const s = Number(gsap.getProperty(star, "scale")) || 1;
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: x + rand(-10, 10) * s,
          y: y + rand(-10, 10) * s,
          vx: rand(-25, 25),
          vy: rand(-25, 25),
          life: 0,
          max: rand(0.5, 1.1),
          size: rand(0.8, 2.4),
          color: pickColor(),
        });
      }
    };

    // Рендер-цикл частиц (на тикере GSAP)
    const tick = (_t: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 50) / 1000;
      if (flying) emitTrail();

      c.clearRect(0, 0, W, H);
      c.globalCompositeOperation = "lighter";

      const drag = Math.pow(0.965, dt * 60);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.max) {
          particles[i] = particles[particles.length - 1];
          particles.pop();
          continue;
        }
        p.vx *= drag;
        p.vy *= drag;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const k = 1 - p.life / p.max;
        c.globalAlpha = k;
        c.fillStyle = p.color;
        c.beginPath();
        c.arc(p.x, p.y, Math.max(0.3, p.size * (0.35 + 0.65 * k)), 0, TAU);
        c.fill();
      }

      if (ring.a > 0.01) {
        c.globalAlpha = ring.a;
        c.strokeStyle = "#7fb59b";
        c.lineWidth = 1.5;
        c.beginPath();
        c.arc(W / 2, H / 2, ring.r, 0, TAU);
        c.stroke();
      }

      c.globalAlpha = 1;
      c.globalCompositeOperation = "source-over";
    };
    gsap.ticker.add(tick);

    // Взрыв: частицы рождаются в точках внутри контура звезды
    const burst = () => {
      const rect = svg.getBoundingClientRect();
      const count = W < 640 ? 380 : 700;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.52;

      for (let n = 0; n < count; n++) {
        let px: number;
        let py: number;
        do {
          px = rand(7, 93);
          py = rand(5, 87);
        } while (!insideStar(px, py));

        const x = rect.left + (px / 100) * rect.width;
        const y = rect.top + (py / 100) * rect.height;
        const ang = Math.atan2(y - cy, x - cx) + rand(-0.35, 0.35);
        const speed = rand(90, 620) * (rect.width / 128);
        const swirl = rand(-70, 70);

        particles.push({
          x,
          y,
          vx: Math.cos(ang) * speed - Math.sin(ang) * swirl,
          vy: Math.sin(ang) * speed + Math.cos(ang) * swirl,
          life: 0,
          max: rand(0.9, 1.9),
          size: rand(0.8, 3.2),
          color: pickColor(),
        });
      }

      ring.r = rect.width * 0.4;
      ring.a = 0.7;
      gsap.to(ring, {
        r: Math.max(W, H) * 0.55,
        a: 0,
        duration: 1.4,
        ease: "power2.out",
      });
    };
    engine.current = { burst };

    // Звезда остановилась в центре
    const land = () => {
      flying = false;
      ready.current = true;
      svg.classList.add("star-pulse");

      gsap.to(hint, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });

      const { x, y } = starCenter();
      for (let i = 0; i < 28; i++) {
        const a = rand(0, TAU);
        const s = rand(40, 160);
        particles.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 0,
          max: rand(0.6, 1.2),
          size: rand(0.8, 2),
          color: pickColor(),
        });
      }
    };

    gsap.set(hint, { opacity: 0, y: 10 });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let fly: gsap.core.Timeline | null = null;

    if (reduce) {
      gsap.set(star, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 });
      gsap.set(glow, { opacity: 1 });
      land();
    } else {
      // Звезда влетает слева снизу, пересекает экран и возвращается в центр
      gsap.set(star, {
        x: -W * 0.7,
        y: H * 0.35,
        rotation: -540,
        scale: 0.45,
        opacity: 1,
      });
      gsap.fromTo(
        glow,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 3, ease: "power2.out", delay: 0.3 }
      );

      fly = gsap.timeline({ delay: 0.3, onComplete: land });
      fly
        .to(star, { x: W * 0.3, duration: 1.5, ease: "power2.out" }, 0)
        .to(star, { y: -H * 0.22, duration: 1.5, ease: "power1.out" }, 0)
        .to(star, { x: 0, y: 0, duration: 1.3, ease: "power3.inOut" }, 1.5)
        .to(star, { rotation: 0, scale: 1, duration: 2.8, ease: "power2.out" }, 0);
    }

    return () => {
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(tick);
      fly?.kill();
      exitTl.current?.kill();
      gsap.killTweensOf([star, hint, glow, ring]);
      engine.current = null;
    };
  }, []);

  // Клик: звезда дрожит, рассыпается на частицы, затем открывается сайт
  const handleEnter = () => {
    if (!ready.current || leaving.current) return;
    leaving.current = true;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.to(root.current, { opacity: 0, duration: 0.4, onComplete: onEnter });
      return;
    }

    const tl = gsap.timeline({ onComplete: onEnter });
    exitTl.current = tl;

    tl.to(hintRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0)
      // Нагнетание: звезда растёт и дрожит
      .to(starRef.current, { scale: 1.3, duration: 0.35, ease: "power2.in" }, 0)
      .to(
        starRef.current,
        { x: "+=3", duration: 0.04, repeat: 7, yoyo: true, ease: "none" },
        0
      )
      // Взрыв
      .call(() => engine.current?.burst(), [], 0.35)
      .set(starRef.current, { opacity: 0 }, 0.35)
      .to(
        glowRef.current,
        { opacity: 0, scale: 1.6, duration: 1.4, ease: "power2.out" },
        0.35
      )
      // Остатки частиц растворяются, дальше page.tsx плавно показывает сайт
      .to(canvasRef.current, { opacity: 0, duration: 0.7, ease: "power1.in" }, 1.7);
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
        .star-pulse { animation: star-pulse 3.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .star-pulse { animation: none; }
        }
      `}</style>

      {/* Свечение за звездой */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(46,79,62,0.35) 0%, rgba(10,10,10,0) 65%)",
        }}
      />

      {/* Холст для частиц: след при полёте и взрыв */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Обёртка для GSAP (полёт, масштаб), внутри — CSS-пульсация */}
      <div ref={starRef} className="relative z-10 opacity-0">
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="h-28 w-28 md:h-36 md:w-36"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="star-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(95,143,120,0.55)" />
              <stop offset="100%" stopColor="rgba(46,79,62,0.25)" />
            </linearGradient>
          </defs>
          <polygon
            points={STAR_POINTS}
            fill="url(#star-fill)"
            stroke="#5f8f78"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <polygon
            points={INNER_POINTS}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p
        ref={hintRef}
        className="relative z-10 mt-14 text-[10px] font-light uppercase tracking-[0.4em] text-white/50 opacity-0"
      >
        Нажмите, чтобы войти
      </p>
    </div>
  );
}