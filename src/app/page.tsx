"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { ROOMS, ATTRACTIONS, CONTACT } from "@/lib/data";

const EASE = "cubicBezier(0.22, 1, 0.36, 1)";

function RoomGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full aspect-4/3 overflow-hidden">
        {images.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: active === i ? 1 : 0 }}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="45vw" />
            <div className="absolute inset-0 bg-black/25" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setActive(i)}
            className="relative h-12 flex-1 overflow-hidden outline-none"
            style={{ opacity: active === i ? 1 : 0.4 }}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="10vw" />
          </button>
        ))}
      </div>
    </div>
  );
}

function FeatureIcon({ feature }: { feature: string }) {
  const f = feature.toLowerCase();
  const cls = "w-3.5 h-3.5 shrink-0 stroke-black/40";
  const props = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: cls };

  if (f.includes("bed") || f.includes("twin") || f.includes("king"))
    return <svg {...props}><path d="M2 20V10a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10"/><path d="M2 14h20"/><path d="M7 8V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2"/></svg>;

  if (f.includes("view") || f.includes("valley") || f.includes("mountain") || f.includes("balcony"))
    return <svg {...props}><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>;

  if (f.includes("bath") || f.includes("shower") || f.includes("amenities"))
    return <svg {...props}><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z"/><path d="M6 12V5a2 2 0 0 1 2-2h3v2.25"/><path d="m4 21 1-1.5M20 21l-1-1.5"/></svg>;

  if (f.includes("wi-fi") || f.includes("wifi") || f.includes("safe"))
    return <svg {...props}><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>;

  if (f.includes("garden") || f.includes("lounge") || f.includes("sitting"))
    return <svg {...props}><path d="M12 22V12"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><path d="M8 6c0 4 4 6 4 6s4-2 4-6a4 4 0 0 0-8 0z"/></svg>;

  if (f.includes("tea") || f.includes("minibar") || f.includes("service"))
    return <svg {...props}><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>;

  if (f.includes("family") || f.includes("layout") || f.includes("configuration"))
    return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;

  return <svg {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}

const EXPERIENCES = [
  { label: "Hot Stone Bath & Spa",    img: "/tnrPhotos/14.jpg" },
  { label: "Cultural Bonfire Shows",  img: "/tnrPhotos/49.jpg" },
  { label: "Monastery Hikes",         img: "/tnrPhotos/52.jpg" },
  { label: "Bhutanese Cuisine",       img: "/tnrPhotos/46.jpg" },
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const estRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const tip = useRef({ x: 0, y: 0 });
  const [activeExp, setActiveExp] = useState<number | null>(null);

  // Smooth horizontal scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const el = containerRef.current;
    if (!el) return;

    let target = 0;
    let current = 0;
    let raf: number;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const max = el.scrollWidth - el.clientWidth;
      target = Math.max(0, Math.min(max, target + e.deltaY + e.deltaX));
    };

    const tick = () => {
      current += (target - current) * 0.1;
      if (Math.abs(target - current) < 0.1) current = target;
      el.scrollLeft = current;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Hero animations on mount
  useEffect(() => {
    if (photoRef.current)
      animate(photoRef.current, {
        y: ["100%", "0%"],
        duration: 750,
        ease: "out(3)",
      });

    if (estRef.current)
      animate(estRef.current, { opacity: [0, 1], duration: 1000, delay: 200 });

    if (titleRef.current)
      animate(titleRef.current.querySelectorAll("[data-reveal]"), {
        y: ["100%", "0%"],
        duration: 750,
        ease: "out(3)",
        delay: (_, i) => 300 + i * 200,
      });

    if (logoRef.current)
      animate(logoRef.current.querySelectorAll("[data-reveal]"), {
        y: ["100%", "0%"],
        duration: 750,
        ease: "out(3)",
        delay: 1100,
      });

    if (ctaRef.current)
      animate(ctaRef.current.querySelectorAll("[data-reveal]"), {
        y: ["100%", "0%"],
        duration: 750,
        ease: "out(3)",
        delay: 1300,
      });
  }, []);

  // Cursor tooltip tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const tick = () => {
      tip.current.x += (mouse.current.x - tip.current.x) * 0.1;
      tip.current.y += (mouse.current.y - tip.current.y) * 0.1;
      if (tooltipRef.current) {
        tooltipRef.current.style.transform =
          `translate(${tip.current.x + 24}px, ${tip.current.y - 180}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);


  // Scroll-triggered animations
  useEffect(() => {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(entry.target, {
            y: ["40px", "0px"],
            opacity: [0, 1],
            duration: 750,
            ease: EASE,
          });
          fadeObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(Array.from(entry.target.children), {
            y: ["40px", "0px"],
            opacity: [0, 1],
            duration: 750,
            delay: stagger(120),
            ease: EASE,
          });
          staggerObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => fadeObserver.observe(el));
    document.querySelectorAll("[data-stagger]").forEach((el) => staggerObserver.observe(el));

    return () => {
      fadeObserver.disconnect();
      staggerObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hide-scrollbar flex flex-row h-screen overflow-x-scroll overflow-y-hidden"
    >
      {/* ── HERO ── */}
      <section className="relative shrink-0 w-screen h-screen bg-black overflow-hidden flex">
        <div className="relative w-1/2 h-full overflow-hidden">
          <div ref={photoRef} className="relative w-full h-full">
            <Image
              src="/tnrPhotos/1.jpg"
              alt="Tiger's Nest Resort"
              fill
              className="object-contain object-center"
              priority
            />
          </div>
        </div>

        <div className="w-1/2 flex items-center px-10 md:px-12 -translate-y-4">
          <h1
            ref={titleRef}
            className="font-gloock leading-none text-white uppercase tracking-tight flex flex-col gap-[0.5vw]"
          >
            <div className="overflow-hidden">
              <span data-reveal className="block text-[11.5vw]">Tiger&apos;s</span>
            </div>
            <div className="overflow-hidden">
              <span data-reveal className="block text-[11.5vw]">Nest</span>
            </div>
            <div className="overflow-hidden">
              <span data-reveal className="block text-[7vw]">Resort</span>
            </div>
            <div className="overflow-hidden mt-2">
              <span data-reveal className="block font-sans font-normal text-[1.1vw] tracking-[0.3em] text-white/60">
                Paro, Bhutan
              </span>
            </div>
          </h1>
        </div>

        <p
          ref={estRef}
          style={{ opacity: 0 }}
          className="absolute top-7 left-7 font-mono text-[10px] tracking-[0.3em] uppercase text-white/50"
        >
          Est. 2010
        </p>

        <div
          ref={ctaRef}
          className="absolute bottom-28 right-0 px-6 md:px-12 flex flex-col items-end gap-3"
        >
          <div className="overflow-hidden">
            <a
              data-reveal
              href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=Hello%2C%20I%20would%20like%20to%20make%20a%20reservation`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans font-normal text-sm tracking-[0.3em] uppercase text-white border border-white/50 px-7 py-4 hover:bg-white hover:text-black transition-colors block"
            >
              Book — 50% Off
            </a>
          </div>
        </div>

        {/* Hero logo */}
        <div
          className="absolute right-0 px-6 md:px-12 z-10 pointer-events-none flex flex-col items-end gap-3 mix-blend-difference"
          style={{ bottom: "7rem" }}
        >
          <div className="overflow-hidden" ref={logoRef}>
            <div data-reveal>
              <Image
                src="/tnrPhotos/logowhite copy.png"
                alt="Tiger's Nest Resort"
                width={180}
                height={100}
                className="object-contain"
              />
            </div>
          </div>
          <div className="font-mono text-sm px-7 py-4 opacity-0 select-none" aria-hidden="true">
            Book — 50% Off
          </div>
        </div>
      </section>

      {/* ── EXPERIENCES ── */}
      <section className="shrink-0 w-screen h-screen bg-black flex flex-col">
        <div className="sticky left-0 z-20 w-screen flex items-center px-10 py-4 border-b border-white/10 bg-black/70 backdrop-blur-sm">
          <p className="font-mono text-sm tracking-[0.3em] uppercase text-white/40">Experiences</p>
        </div>
        <div className="flex flex-col justify-center flex-1">
        <div data-stagger>
          {EXPERIENCES.map(({ label }, i) => (
            <div
              key={label}
              style={{ opacity: 0 }}
              className="border-t border-white/10 px-14 py-8 flex items-baseline gap-6"
              onMouseEnter={() => setActiveExp(i)}
              onMouseLeave={() => setActiveExp(null)}
            >
              <span className="font-mono text-[10px] text-white/20 shrink-0 w-6">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className={`font-sans font-black text-[5vw] uppercase leading-none tracking-tight transition-colors duration-200 ${activeExp === i ? "text-white" : "text-white/60"}`}>
                {label}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 mx-14 mt-2" />
        </div>
      </section>

      {/* ── ROOMS — one panel per room ── */}
      <div className="shrink-0 h-screen flex flex-col bg-cream" style={{ width: "300vw" }}>
        <div className="sticky left-0 z-20 w-screen flex items-center px-10 py-4 border-b border-black/10 bg-cream/80 backdrop-blur-sm">
          <p className="font-mono text-sm tracking-[0.3em] uppercase text-black/30">Rooms</p>
        </div>
        <div className="flex flex-1">
          {ROOMS.map((room, i) => (
            <div
              key={room.id}
              data-animate
              style={{ opacity: 0 }}
              className="flex-1 bg-cream flex flex-col border-l border-black/10 first:border-l-0 overflow-hidden"
            >
              {/* Room name */}
              <div className="px-14 pt-3 pb-0 flex items-baseline gap-6">
                <span className="font-mono text-[10px] tracking-[0.3em] text-black/25 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-sans font-black text-[8vw] text-black uppercase leading-none tracking-tight">
                  {room.name}
                </h2>
              </div>

              {/* Content */}
              <div className="flex-1 px-14 pb-14 grid grid-cols-2 gap-12 items-start overflow-hidden">
                {room.images && <RoomGallery images={room.images} />}
                <div className="flex flex-col gap-6 h-full py-2">
                  <p className="font-serif text-lg text-black/50 leading-relaxed">
                    {room.description}
                  </p>

                  <ul className="flex flex-col gap-2 border-t border-black/10 pt-6">
                    {room.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-black/50">
                        <FeatureIcon feature={f} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center justify-start border-t border-black/10 pt-6">
                    <a
                      href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=Hello%2C%20I%20would%20like%20to%20reserve%20the%20${encodeURIComponent(room.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm tracking-[0.3em] uppercase px-10 py-5 bg-black text-white hover:bg-black/80 transition-colors"
                    >
                      Reserve
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FACILITIES ── */}
      <section className="shrink-0 w-screen h-screen bg-black flex flex-col">
        <div className="sticky left-0 z-20 w-screen flex items-center px-10 py-4 border-b border-white/10 bg-black/70 backdrop-blur-sm">
          <p className="font-mono text-sm tracking-[0.3em] uppercase text-white/40">Facilities</p>
        </div>
        <div className="flex-1 flex divide-x divide-white/10 overflow-hidden">
          {[
            { name: "Hot Stone Bath", img: "/tnrPhotos/14.jpg" },
            { name: "Café",           img: "/tnrPhotos/cafe.png" },
            { name: "Bar",            img: "/tnrPhotos/bar.png"  },
          ].map(({ name, img }) => (
            <div key={name} className="flex-1 flex flex-col">
              <div className="relative flex-1 overflow-hidden">
                <Image src={img} alt={name} fill className="object-cover" sizes="33vw" />
                <div className="absolute inset-0 bg-black/25" />
              </div>
              <div className="px-8 py-7 border-t border-white/10">
                <h3 className="font-sans font-black text-2xl text-white uppercase tracking-tight">
                  {name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ATTRACTIONS ── */}
      <div className="shrink-0 h-screen bg-black flex flex-col" style={{ width: "200vw" }}>
        {/* Sticky "Nearby Destinations" header */}
        <div className="sticky left-0 z-20 w-screen flex items-center px-10 py-4 border-b border-white/10 bg-black/70 backdrop-blur-sm">
          <p className="font-mono text-sm tracking-[0.3em] uppercase text-white/40">
            Nearby Destinations
          </p>
        </div>

        {/* All 4 panels in one flex row */}
        <div className="flex flex-1">
          {ATTRACTIONS.map((place) => (
            <div key={place.id} className="relative flex-1 h-full overflow-hidden border-l border-white/10 first:border-l-0">
              {place.images?.[0] && (
                <Image
                  src={place.images[0]}
                  alt={place.name}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              )}
              <div className="absolute inset-0 bg-black/50" />

              {/* Top */}
              <div className="absolute top-0 left-0 right-0 flex items-start justify-between px-10 pt-8">
                <div className="flex flex-col gap-1">
                  {place.tripToBase && (
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">
                      trip to base: {place.tripToBase}
                    </p>
                  )}
                  {place.hikeDistance && (
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">
                      hike distance: {place.hikeDistance}
                    </p>
                  )}
                  {place.totalTime && (
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">
                      total time: {place.totalTime}
                    </p>
                  )}
                </div>
                {place.images?.[1] && (
                  <div className="relative w-36 h-24 overflow-hidden transition-transform duration-500 hover:scale-[2.5] origin-top-right">
                    <Image src={place.images[1]} alt="" fill className="object-cover" sizes="144px" />
                  </div>
                )}
              </div>

              {/* Bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-10 pb-10">
                <h3 className="font-sans font-black text-[4vw] text-white uppercase leading-none tracking-tight mb-3">
                  {place.name}
                </h3>
                <p className="font-serif text-sm text-white/55 leading-relaxed">
                  {place.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOOK ── */}
      <section data-stagger className="shrink-0 w-screen h-screen bg-black px-14 flex flex-col justify-center">
        <p style={{ opacity: 0 }} className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/25 mb-6">
          Direct Booking — {CONTACT.address}
        </p>
        <p style={{ opacity: 0 }} className="font-sans font-black text-[7vw] leading-[0.85] text-white uppercase tracking-tight mb-16">
          {CONTACT.phone}
        </p>
        <div style={{ opacity: 0 }} className="flex flex-col sm:flex-row gap-3 mb-20">
          <a
            href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=Hello%2C%20I%20would%20like%20to%20make%20a%20reservation`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-mono text-[10px] tracking-[0.3em] uppercase px-10 py-5 bg-white text-black hover:bg-cream transition-colors"
          >
            Book via WhatsApp
          </a>
          <Link
            href="/about"
            className="inline-flex items-center justify-center font-mono text-[10px] tracking-[0.3em] uppercase px-10 py-5 border border-white/30 text-white hover:border-white transition-colors"
          >
            About Us
          </Link>
        </div>
        <p style={{ opacity: 0 }} className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/15">
          Book direct &amp; save 50%
        </p>
      </section>
      {/* ── CURSOR TOOLTIP ── */}
      <div
        ref={tooltipRef}
        className="fixed top-0 left-0 z-9998 pointer-events-none w-65 h-85"
        style={{ willChange: "transform" }}
      >
        {EXPERIENCES.map(({ img }, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: activeExp === i ? 1 : 0 }}
          >
            <Image src={img} fill className="object-contain object-top" alt="" sizes="260px" />
          </div>
        ))}
      </div>
    </div>
  );
}
