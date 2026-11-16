// ФАЙЛ: src/components/MapSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { DivIcon } from "leaflet";

gsap.registerPlugin(ScrollTrigger);

// Примерные координаты — при необходимости замените на точные
const POSITION: [number, number] = [53.666, 23.833];
const ADDRESS = "Гродно, а/г Ратичи, улица Центральная 125";
const ROUTE_URL = `https://www.google.com/maps/dir/?api=1&destination=${POSITION[0]},${POSITION[1]}`;

// Заглушка на время загрузки карты
function MapPlaceholder() {
  return (
    <div className="flex h-[420px] w-full items-center justify-center bg-[#0a0a0a] md:h-[560px]">
      <p className="text-xs font-light uppercase tracking-[0.4em] text-white/40">
        Загрузка карты...
      </p>
    </div>
  );
}

// Каждый компонент react-leaflet грузится только в браузере.
// Типы пропсов сохраняются, пока установлен @types/leaflet.
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false, loading: () => <MapPlaceholder /> }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

export default function MapSection() {
  const root = useRef<HTMLElement>(null);
  const [icon, setIcon] = useState<DivIcon | null>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Leaflet загружаем только на клиенте и только внутри эффекта
  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((leaflet) => {
      if (cancelled) return;

      // Бандлеры по-разному отдают модуль (с default или без)
      const L =
        (leaflet as unknown as { default?: typeof leaflet }).default ?? leaflet;

      setIcon(
        L.divIcon({
          className: "fh-marker",
          html: '<span class="fh-marker-pulse"></span><span class="fh-marker-dot"></span>',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -18],
        })
      );
      setIsMobile(Boolean(L.Browser.mobile));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Анимации секции
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: ".map-head",
            start: "top 80%",
            once: true,
          },
        })
        .fromTo(
          ".map-label",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        )
        .fromTo(
          ".map-title-inner",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1 },
          "-=0.5"
        )
        .fromTo(
          ".map-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power2.inOut" },
          "-=0.6"
        )
        .fromTo(
          ".map-info",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          "-=0.6"
        );

      // Только opacity и y (без scale): масштаб контейнера сбивает расчёты Leaflet
      gsap.fromTo(
        ".map-frame",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".map-frame", start: "top 88%", once: true },
        }
      );
    }, root);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  const mapReady = icon !== null && isMobile !== null;

  return (
    <section
      ref={root}
      id="map"
      className="relative overflow-hidden bg-[#0a0a0a] px-6 py-28 md:px-12 md:py-40"
    >
      <style>{`
        .fh-marker { background: transparent; border: 0; }
        .fh-marker-dot,
        .fh-marker-pulse {
          position: absolute; left: 50%; top: 50%;
          width: 14px; height: 14px; margin: -7px 0 0 -7px;
          border-radius: 9999px;
        }
        .fh-marker-dot {
          background: #5f8f78; border: 2px solid #fff;
          box-shadow: 0 0 0 4px rgba(46,79,62,0.6);
        }
        .fh-marker-pulse {
          background: rgba(95,143,120,0.55);
          animation: fh-ping 2.2s ease-out infinite;
        }
        @keyframes fh-ping {
          0%   { transform: scale(1);   opacity: 0.9; }
          100% { transform: scale(3.2); opacity: 0; }
        }
        .fh-map.leaflet-container { background: #0a0a0a; font-family: inherit; }

        /* Тёмная тема для светлых тайлов OSM: инверсия + разворот оттенка.
           Фильтр только на слое плиток, маркер и попап не затрагиваются. */
        .fh-map .leaflet-tile-pane {
          filter: invert(1) hue-rotate(180deg) brightness(0.9) contrast(0.95) saturate(0.55);
        }

        .fh-map .leaflet-popup-content-wrapper {
          background: #0a0a0a; color: #fff; border-radius: 0;
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        }
        .fh-map .leaflet-popup-tip { background: #0a0a0a; }
        .fh-map .leaflet-popup-content { margin: 14px 18px; font-weight: 300; letter-spacing: 0.04em; }
        .fh-map .leaflet-bar a {
          background: #0a0a0a; color: #fff;
          border-bottom: 1px solid rgba(255,255,255,0.12);
        }
        .fh-map .leaflet-bar a:hover { background: #2e4f3e; }
        .fh-map .leaflet-bar { border: 1px solid rgba(255,255,255,0.12); box-shadow: none; }
        .fh-map .leaflet-control-attribution {
          background: rgba(10,10,10,0.75); color: rgba(255,255,255,0.4); font-size: 10px;
        }
        .fh-map .leaflet-control-attribution a { color: rgba(255,255,255,0.6); }
      `}</style>

      <div
        className="pointer-events-none absolute -right-40 top-10 h-[36rem] w-[36rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(46,79,62,0.2) 0%, rgba(10,10,10,0) 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="map-head mb-12 flex flex-col justify-between gap-10 md:mb-16 md:flex-row md:items-end">
          <div>
            <p className="map-label mb-6 text-xs font-light uppercase tracking-[0.4em] text-[#5f8f78] opacity-0">
              Расположение
            </p>
            <h2 className="overflow-hidden pb-2 text-4xl font-light uppercase leading-tight tracking-[0.04em] md:text-6xl">
              <span className="map-title-inner block opacity-0">Как нас найти</span>
            </h2>
            <div className="map-line mt-8 h-px w-24 origin-left bg-[#2e4f3e] md:w-40" />
          </div>

          <div className="map-info opacity-0">
            <p className="max-w-sm text-base font-light leading-relaxed tracking-wide text-white/70">
              {ADDRESS}
            </p>
            <a
              href={ROUTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-3 text-xs font-light uppercase tracking-[0.3em] text-[#5f8f78] transition-colors duration-300 hover:text-white"
            >
              <span>Построить маршрут</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </a>
          </div>
        </div>

        {/* isolate — чтобы z-index панелей Leaflet не вылезал за пределы блока */}
        <div className="map-frame relative isolate border border-white/10 opacity-0">
          {mapReady ? (
            <MapContainer
              center={POSITION}
              zoom={14}
              scrollWheelZoom={false}
              dragging={!isMobile}
              className="fh-map h-[420px] w-full md:h-[560px]"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={POSITION} icon={icon}>
                <Popup>
                  <span className="block text-sm uppercase tracking-[0.2em]">
                    Family House
                  </span>
                  <span className="mt-1 block text-xs text-white/60">
                    {ADDRESS}
                  </span>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <MapPlaceholder />
          )}

          {/* Лёгкий зелёный тон поверх карты (клики проходят сквозь) */}
          <div
            className="pointer-events-none absolute inset-0 z-[500]"
            style={{ background: "#2e4f3e", mixBlendMode: "color", opacity: 0.35 }}
          />
        </div>
      </div>
    </section>
  );
}