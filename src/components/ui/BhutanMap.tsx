"use client";

import { useEffect, useRef } from "react";
import { BHUTAN_PATH, BHUTAN_TRANSFORM } from "@/lib/bhutan-path";

// Marker positions expressed directly in the 1024×1024 viewBox
// (north = up, west = left). Tuned visually against the silhouette.
interface Marker {
  id: string;
  label?: string;
  sub?: string;
  x: number;
  y: number;
  primary?: boolean;
}

const MARKERS: Marker[] = [
  { id: "paro", label: "Tiger's Nest Resort", sub: "Paro", x: 200, y: 540, primary: true },
  { id: "thimphu", label: "Thimphu", x: 270, y: 527 },
];

// Cropped viewBox — focuses on the silhouette's vertical band (≈249–775
// in full-frame coords) plus breathing room, so the wide, short map of
// Bhutan isn't marooned in empty space.
const VIEWBOX = "0 205 1024 610";

// How far (in viewBox units) the revealed image drifts behind the cutout,
// and how far the whole map tilts, at the cursor's furthest reach.
const IMAGE_DRIFT = 42;
const TILT_DEG = 6;
const LERP = 0.08;

interface BhutanMapProps {
  /** Image revealed through the cutout. */
  src?: string;
  className?: string;
}

export default function BhutanMap({
  src = "/tnrPhotos/tigersnest1.jpg",
  className = "",
}: BhutanMapProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<SVGImageElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const wrap = wrapRef.current;
    const tilt = tiltRef.current;
    const img = imgRef.current;
    if (!wrap || !tilt || !img) return;

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

      // Image drifts opposite the cursor — parallax depth inside the cutout.
      img.setAttribute(
        "transform",
        `translate(${-x * IMAGE_DRIFT} ${-y * IMAGE_DRIFT})`
      );
      // The whole map tilts toward the cursor for a tactile, 3D feel.
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
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      style={{ perspective: "1400px" }}
    >
      <div
        ref={tiltRef}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        <svg
          viewBox={VIEWBOX}
          className="h-full w-full overflow-visible"
          role="img"
          aria-label="Map of Bhutan marking Tiger's Nest Resort in Paro"
        >
          <defs>
            <path id="bt-shape" d={BHUTAN_PATH} transform={BHUTAN_TRANSFORM} />
            <clipPath id="bt-clip">
              <use href="#bt-shape" />
            </clipPath>
            <radialGradient id="bt-vignette" cx="42%" cy="44%" r="62%">
              <stop offset="0%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
            </radialGradient>
          </defs>

          {/* Base fill — reads as a shape before the photo decodes. */}
          <use href="#bt-shape" fill="#0f0e0c" />

          {/* Revealed imagery, clipped to the country outline. */}
          <g clipPath="url(#bt-clip)">
            <image
              ref={imgRef}
              href={src}
              x={-90}
              y={-90}
              width={1204}
              height={1204}
              preserveAspectRatio="xMidYMid slice"
              style={{ willChange: "transform" }}
            />
            <rect x="0" y="0" width="1024" height="1024" fill="url(#bt-vignette)" />
          </g>

          {/* Crisp outline on top of the cutout. */}
          <use
            href="#bt-shape"
            fill="none"
            stroke="#1a1814"
            strokeWidth={1.25}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.55"
          />

          {/* Location markers. */}
          {MARKERS.map((m) =>
            m.primary ? (
              <g key={m.id}>
                {/* Pulsing halo. */}
                <circle cx={m.x} cy={m.y} r="9" fill="#ffffff">
                  <animate attributeName="r" values="9;30" dur="2.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0" dur="2.6s" repeatCount="indefinite" />
                </circle>
                {/* Connector. */}
                <line
                  x1={m.x}
                  y1={m.y - 12}
                  x2={m.x}
                  y2={m.y - 56}
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                  opacity="0.85"
                />
                {/* Label chip — opaque, so it reads over both the cutout and the panel. */}
                <g transform={`translate(${m.x - 180} ${m.y - 148})`}>
                  <rect width="360" height="92" rx="10" fill="#15130f" opacity="0.92" />
                  <text
                    x="180"
                    y="40"
                    textAnchor="middle"
                    className="fill-white font-sans"
                    style={{ fontSize: 30, fontWeight: 900, letterSpacing: "0.01em" }}
                  >
                    {m.label}
                  </text>
                  {m.sub && (
                    <text
                      x="180"
                      y="69"
                      textAnchor="middle"
                      className="fill-white/55 font-mono"
                      style={{ fontSize: 16, letterSpacing: "0.34em" }}
                    >
                      {m.sub.toUpperCase()}
                    </text>
                  )}
                </g>
                {/* Pin. */}
                <circle cx={m.x} cy={m.y} r="8" fill="#ffffff" stroke="#15130f" strokeWidth="2" />
              </g>
            ) : (
              <circle
                key={m.id}
                cx={m.x}
                cy={m.y}
                r="5"
                fill="#ffffff"
                opacity="0.6"
                stroke="#15130f"
                strokeWidth="1"
              />
            )
          )}
        </svg>
      </div>
    </div>
  );
}
