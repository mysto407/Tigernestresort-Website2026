"use client";
import { useEffect, useRef, useState } from "react";

type Guide = { id: number; type: "v" | "h"; pos: number };

let nextId = 0;

export default function AlignmentGuide() {
  const [visible, setVisible] = useState(false);
  const [guides, setGuides] = useState<Guide[]>([]);
  const dragging = useRef<{ id: number; type: "v" | "h" } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "G" && e.shiftKey) setVisible((v) => !v);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (!visible || !e.altKey) return;
      e.preventDefault();
      const type = e.shiftKey ? "h" : "v";
      const pos = type === "v" ? e.clientX : e.clientY;
      const id = nextId++;
      setGuides((gs) => [...gs, { id, type, pos }]);
      dragging.current = { id, type };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const { id, type } = dragging.current;
      const pos = type === "v" ? e.clientX : e.clientY;
      setGuides((gs) => gs.map((g) => (g.id === id ? { ...g, pos } : g)));
    };

    const onMouseUp = () => { dragging.current = null; };

    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-9999 pointer-events-none select-none">
      {/* Baseline grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 7px, rgba(255,0,100,0.4) 7px, rgba(255,0,100,0.4) 9px)",
        }}
      />

      {/* Draggable guide lines */}
      {guides.map((g) => (
        <div
          key={g.id}
          className="absolute pointer-events-auto group"
          style={
            g.type === "v"
              ? { left: g.pos, top: 0, width: 1, height: "100vh", cursor: "ew-resize", background: "rgba(59,130,246,0.9)" }
              : { top: g.pos, left: 0, height: 1, width: "100vw", cursor: "ns-resize", background: "rgba(59,130,246,0.9)" }
          }
          onMouseDown={(e) => {
            e.stopPropagation();
            dragging.current = { id: g.id, type: g.type };
          }}
          onDoubleClick={() => setGuides((gs) => gs.filter((x) => x.id !== g.id))}
        >
          {/* Position label */}
          <span
            className="absolute font-mono text-[9px] bg-blue-500 text-white px-1 py-px leading-none whitespace-nowrap"
            style={g.type === "v" ? { top: 8, left: 4 } : { left: 8, top: -14 }}
          >
            {Math.round(g.pos)}px
          </span>
        </div>
      ))}

      {/* HUD */}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.15em] uppercase text-white/80 bg-black/80 px-3 py-1.5 whitespace-nowrap">
        Alt+Click → vertical &nbsp;·&nbsp; Alt+Shift+Click → horizontal &nbsp;·&nbsp; Drag to move &nbsp;·&nbsp; Double-click to remove &nbsp;·&nbsp; Shift+G to hide
      </p>
    </div>
  );
}
