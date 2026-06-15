"use client";

import { useEffect, useRef } from "react";
import {
  BHUTAN_DISTRICTS,
  BHUTAN_DISTRICTS_VIEWBOX,
  MAP_MARKERS,
} from "@/lib/bhutan-districts";

// How far the whole map tilts toward the cursor, at the cursor's furthest
// reach, when `interactive` is enabled.
const TILT_DEG = 6;
const LERP = 0.08;

// viewBox is "0 0 1024 593" — keep these in sync for the terrain fill rect.
const VB_W = 1024;
const VB_H = 593;

// District name labels (viewBox coords) giving the resort its western
// neighbours for context. Paro sits just south of the resort pin.
const DISTRICT_LABELS = [
  { name: "PARO", x: 206, y: 334 },
  { name: "HAA", x: 150, y: 372 },
];

interface BhutanMapProps {
  className?: string;
  /**
   * Cursor-driven tilt. Off by default — the map renders static. Flip on to
   * reuse the interaction elsewhere.
   */
  interactive?: boolean;
}

export default function BhutanMap({
  className = "",
  interactive = false,
}: BhutanMapProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;
    const wrap = wrapRef.current;
    const tilt = tiltRef.current;
    if (!wrap || !tilt) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      target.current = {
        x: ((e.clientX - r.left) / r.width - 0.5) * 2, // -1 … 1
        y: ((e.clientY - r.top) / r.height - 0.5) * 2,
      };
    };
    const onLeave = () => {
      target.current = { x: 0, y: 0 };
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * LERP;
      current.current.y += (target.current.y - current.current.y) * LERP;
      const { x, y } = current.current;
      tilt.style.transform =
        `rotateY(${x * TILT_DEG}deg) rotateX(${-y * TILT_DEG}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [interactive]);

  const { paro, thimphu } = MAP_MARKERS;

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      style={interactive ? { perspective: "1400px" } : undefined}
    >
      <div
        ref={tiltRef}
        className="relative h-full w-full"
        style={
          interactive
            ? { transformStyle: "preserve-3d", willChange: "transform" }
            : undefined
        }
      >
        <svg
          viewBox={BHUTAN_DISTRICTS_VIEWBOX}
          className="h-full w-full overflow-visible"
          role="img"
          aria-label="Map of Bhutan's dzongkhags (districts), marking Tiger's Nest Resort in Paro"
        >
          <defs>
            {/* Hypsometric terrain tint — snow-capped Himalayan north (top)
                grading down to forested southern lowlands (bottom). */}
            <linearGradient id="bt-terrain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#edeae0" />
              <stop offset="18%" stopColor="#d8ccaf" />
              <stop offset="42%" stopColor="#c2bd92" />
              <stop offset="70%" stopColor="#9bac74" />
              <stop offset="100%" stopColor="#86a062" />
            </linearGradient>

            {/* Soft directional relief — light from the north-west. */}
            <linearGradient id="bt-relief" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
            </linearGradient>

            {/* Union of every district = the country silhouette. */}
            <clipPath id="bt-country">
              {BHUTAN_DISTRICTS.map((district) => (
                <path key={district.name} d={district.d} />
              ))}
            </clipPath>

            {/* Lifts the landmass off the cream panel. */}
            <filter id="bt-lift" x="-8%" y="-8%" width="116%" height="124%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="7"
                floodColor="#1a1814"
                floodOpacity="0.18"
              />
            </filter>
          </defs>

          {/* Terrain fill, clipped to the country outline. */}
          <g filter="url(#bt-lift)">
            <g clipPath="url(#bt-country)">
              <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#bt-terrain)" />
              <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#bt-relief)" />
            </g>
          </g>

          {/* District fills + boundaries. Paro (the resort's district) is
              tinted so it reads as "you are here". */}
          {BHUTAN_DISTRICTS.map((district) => {
            const isParo = district.name === "Paro";
            return (
              <path
                key={district.name}
                d={district.d}
                fill={isParo ? "rgba(26,24,20,0.12)" : "transparent"}
                stroke="#4a4332"
                strokeWidth={isParo ? 1.4 : 0.85}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                opacity={isParo ? 0.85 : 0.6}
              >
                <title>{district.name}</title>
              </path>
            );
          })}

          {/* District name labels (Paro, Haa) for western context. */}
          {DISTRICT_LABELS.map((label) => (
            <text
              key={label.name}
              x={label.x}
              y={label.y}
              textAnchor="middle"
              className="fill-[#1a1814] font-mono"
              style={{ fontSize: 16, letterSpacing: "0.24em", opacity: 0.65 }}
            >
              {label.name}
            </text>
          ))}

          {/* Thimphu — secondary pin. */}
          <g>
            <circle cx={thimphu.x} cy={thimphu.y} r="6" fill="#1a1814" />
            <circle cx={thimphu.x} cy={thimphu.y} r="6" fill="none" stroke="#faf7f0" strokeWidth="1.5" />
            <text
              x={thimphu.x + 14}
              y={thimphu.y + 6}
              className="fill-[#1a1814] font-mono"
              style={{ fontSize: 17, letterSpacing: "0.22em" }}
            >
              THIMPHU
            </text>
          </g>

          {/* Paro / Tiger's Nest Resort — primary pin with callout. */}
          <g>
            {/* Pulsing halo. */}
            <circle cx={paro.x} cy={paro.y} r="9" fill="#1a1814">
              <animate attributeName="r" values="9;30" dur="2.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.45;0" dur="2.6s" repeatCount="indefinite" />
            </circle>
            {/* Connector. */}
            <line
              x1={paro.x}
              y1={paro.y - 12}
              x2={paro.x}
              y2={paro.y - 58}
              stroke="#1a1814"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              opacity="0.85"
            />
            {/* Label chip. */}
            <g transform={`translate(${paro.x - 180} ${paro.y - 150})`}>
              <rect width="360" height="92" rx="10" fill="#15130f" />
              <text
                x="180"
                y="40"
                textAnchor="middle"
                className="fill-white font-sans"
                style={{ fontSize: 30, fontWeight: 900, letterSpacing: "0.01em" }}
              >
                Tiger&apos;s Nest Resort
              </text>
              <text
                x="180"
                y="69"
                textAnchor="middle"
                className="fill-white/55 font-mono"
                style={{ fontSize: 16, letterSpacing: "0.34em" }}
              >
                PARO
              </text>
            </g>
            {/* Pin. */}
            <circle cx={paro.x} cy={paro.y} r="8" fill="#ffffff" stroke="#15130f" strokeWidth="2.5" />
            <circle cx={paro.x} cy={paro.y} r="3" fill="#15130f" />
          </g>
        </svg>
      </div>
    </div>
  );
}
