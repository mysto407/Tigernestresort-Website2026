"use client";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useSyncExternalStore,
  type Ref,
} from "react";

// Animated distortion layer for a full-bleed image (WebGL, no dependencies).
// Two variants, selected via the `variant` prop:
//
// - "noise" (default): per-pixel white-noise jitter that re-randomises in
//   discrete time steps — a TV-static shimmer — plus a faint luminous grain.
//   Hovering scrambles the area around the pointer harder.
// - "fluid": the image rides a subdivided vertex mesh that drifts with a
//   layered pseudo-curl flow; the pointer drags a bulge/ripple through it.
//
// Both react to hover and share a master intensity uniform (driven
// externally, e.g. from the cutout zoom) that scales the whole effect.
// Falls back to whatever sits underneath (the plain <Image>) when WebGL is
// unavailable or the user prefers reduced motion.

export interface FluidImageHandle {
  /** 0 = no distortion, 1 = full. Safe to call every frame. */
  setIntensity(value: number): void;
}

export type DistortionVariant = "noise" | "fluid";

interface FluidImageProps {
  src: string;
  variant?: DistortionVariant;
  className?: string;
  ref?: Ref<FluidImageHandle>;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void): () => void {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

// "noise" distorts per-pixel (fragment shader), so a single quad suffices;
// "fluid" displaces vertices, so it needs a dense mesh.
const GRID_BY_VARIANT: Record<DistortionVariant, { cols: number; rows: number }> = {
  noise: { cols: 2, rows: 2 },
  fluid: { cols: 48, rows: 36 },
};
const MAX_DPR = 2;
const MOUSE_LERP = 0.08;
const HOVER_LERP = 0.07;

const PASSTHROUGH_VERTEX_SHADER = `
attribute vec2 aPos;
attribute vec2 aUv;

varying vec2 vUv;

void main() {
  vUv = aUv;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const NOISE_FRAGMENT_SHADER = `
precision mediump float;

varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uFit;
uniform float uTime;
uniform float uStrength;
uniform float uHover;
uniform vec2 uMouse;
uniform float uAspect;

// Cheap hash — white noise from a 2D seed.
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  // object-contain mapping; outside the image, show nothing (section bg).
  vec2 base = (vUv - 0.5) * uFit + 0.5;
  if (base.x < 0.0 || base.x > 1.0 || base.y < 0.0 || base.y > 1.0) discard;

  // Discrete time steps so the noise flickers like analog static.
  float t = floor(uTime * 18.0);

  // Per-pixel white-noise jitter of the sample point.
  vec2 n = vec2(
    hash(vUv * 311.0 + t),
    hash(vUv * 197.0 - t * 1.3)
  ) - 0.5;

  // Hover wipes the noise clear around the pointer, like clearing fog.
  vec2 q = vec2((vUv.x * 2.0 - 1.0) * uAspect, vUv.y * 2.0 - 1.0);
  vec2 m = vec2(uMouse.x * uAspect, uMouse.y);
  float d2 = dot(q - m, q - m);
  float clearing = exp(-d2 * 3.0) * uHover;

  // The whole frame is heavily noisy; intensity and the hover clearing
  // both pull it back to the clean image.
  float noiseLevel = uStrength * (1.0 - clearing);
  vec2 uv = clamp(base + n * noiseLevel * 0.022, 0.0, 1.0);
  vec3 color = texture2D(uTex, uv).rgb;

  // Strong luminous grain on top — classic white-noise shimmer.
  float grain = (hash(vUv * 521.0 + t * 7.0) - 0.5) * noiseLevel * 0.28;
  color += grain;

  gl_FragColor = vec4(color, 1.0);
}
`;

const FLUID_VERTEX_SHADER = `
attribute vec2 aPos;
attribute vec2 aUv;

uniform float uTime;
uniform float uStrength;
uniform float uHover;
uniform vec2 uMouse;
uniform vec2 uMouseVel;
uniform float uAspect;

varying vec2 vUv;

void main() {
  vec2 p = aPos;
  // Aspect-corrected space so distances are isotropic on wide screens.
  vec2 q = vec2(p.x * uAspect, p.y);
  vec2 m = vec2(uMouse.x * uAspect, uMouse.y);
  float t = uTime * 0.55;

  // Ambient fluid flow — two layered pseudo-curl fields.
  vec2 flow = vec2(
    sin(q.y * 2.3 + t + sin(q.x * 1.7 + t * 0.7) * 1.3),
    cos(q.x * 2.1 - t * 0.8 + sin(q.y * 2.9 - t) * 1.1)
  );
  flow += 0.5 * vec2(sin(q.y * 5.1 - t * 1.7), cos(q.x * 4.7 + t * 1.3));

  // Pointer interaction — a dragged bulge plus a radial ripple, fading
  // with distance and gated by hover.
  float d = distance(q, m);
  float infl = exp(-d * d * 5.0) * uHover;
  vec2 dir = d > 0.0001 ? (q - m) / d : vec2(0.0);
  vec2 ripple = dir * sin(d * 14.0 - uTime * 5.0) * 0.4;
  vec2 pointer = (uMouseVel * 5.0 + ripple) * infl;

  vec2 disp = (flow * 0.014 + pointer * 0.06) * uStrength;
  gl_Position = vec4(p + disp, 0.0, 1.0);
  vUv = aUv;
}
`;

const FLUID_FRAGMENT_SHADER = `
precision mediump float;

varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uFit;

void main() {
  // object-contain mapping; outside the image, show nothing (section bg).
  vec2 uv = (vUv - 0.5) * uFit + 0.5;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;
  gl_FragColor = texture2D(uTex, uv);
}
`;

const SHADERS_BY_VARIANT: Record<
  DistortionVariant,
  { vertex: string; fragment: string }
> = {
  noise: { vertex: PASSTHROUGH_VERTEX_SHADER, fragment: NOISE_FRAGMENT_SHADER },
  fluid: { vertex: FLUID_VERTEX_SHADER, fragment: FLUID_FRAGMENT_SHADER },
};

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("createShader failed");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "unknown";
    gl.deleteShader(shader);
    throw new Error(`shader compile failed: ${log}`);
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  variant: DistortionVariant
): WebGLProgram {
  const { vertex, fragment } = SHADERS_BY_VARIANT[variant];
  const program = gl.createProgram();
  if (!program) throw new Error("createProgram failed");
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`program link failed: ${gl.getProgramInfoLog(program)}`);
  }
  return program;
}

interface MeshBuffers {
  vertexCount: number;
}

function uploadGrid(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  cols: number,
  rows: number
): MeshBuffers {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      positions.push((col / cols) * 2 - 1, (row / rows) * 2 - 1);
      uvs.push(col / cols, row / rows);
    }
  }
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const a = row * (cols + 1) + col;
      const b = a + 1;
      const c = a + cols + 1;
      const d = c + 1;
      indices.push(a, b, c, b, d, c);
    }
  }

  const bindAttribute = (name: string, data: number[]) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
  };
  bindAttribute("aPos", positions);
  bindAttribute("aUv", uvs);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  return { vertexCount: indices.length };
}

export default function FluidImage({
  src,
  variant = "noise",
  className = "",
  ref,
}: FluidImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(1);
  // Disabled on the server and for users who prefer reduced motion;
  // reacts live if the preference changes.
  const isEnabled = !useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => true
  );

  useImperativeHandle(
    ref,
    () => ({
      setIntensity(value: number) {
        intensityRef.current = Math.max(0, Math.min(1, value));
      },
    }),
    []
  );

  useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return; // no WebGL — the static <Image> underneath remains

    let program: WebGLProgram;
    let mesh: MeshBuffers;
    try {
      program = createProgram(gl, variant);
      gl.useProgram(program);
      const grid = GRID_BY_VARIANT[variant];
      mesh = uploadGrid(gl, program, grid.cols, grid.rows);
    } catch (error: unknown) {
      console.warn("FluidImage: WebGL init failed, using static image", error);
      return;
    }

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    // Union of both variants' uniforms — locations absent from the active
    // program are null, and gl.uniform* on null is a silent no-op.
    const uTime = uniform("uTime");
    const uStrength = uniform("uStrength");
    const uHover = uniform("uHover");
    const uMouse = uniform("uMouse");
    const uMouseVel = uniform("uMouseVel");
    const uAspect = uniform("uAspect");
    const uFit = uniform("uFit");

    let imageAspect = 1;
    let isTextureReady = false;

    const applyFit = () => {
      const canvasAspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
      gl.uniform1f(uAspect, canvasAspect);
      if (canvasAspect > imageAspect) {
        gl.uniform2f(uFit, canvasAspect / imageAspect, 1);
      } else {
        gl.uniform2f(uFit, 1, imageAspect / canvasAspect);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      applyFit();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Texture
    const texture = gl.createTexture();
    const image = new window.Image();
    image.onload = () => {
      imageAspect = image.naturalWidth / Math.max(1, image.naturalHeight);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      applyFit();
      isTextureReady = true;
      canvas.style.opacity = "1";
    };
    image.onerror = () => {
      console.warn(`FluidImage: failed to load ${src}, using static image`);
    };
    image.src = src;

    // Pointer state (plane coords, -1..1, y up)
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let hover = 0;
    let hoverTarget = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = (1 - (e.clientY - rect.top) / rect.height) * 2 - 1;
      const isInside = nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1;
      hoverTarget = isInside ? 1 : 0;
      if (isInside) {
        mouse.tx = nx;
        mouse.ty = ny;
      }
    };
    const onMouseLeave = () => {
      hoverTarget = 0;
    };
    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);

    let isContextLost = false;
    const onContextLost = (e: Event) => {
      e.preventDefault();
      isContextLost = true;
      canvas.style.opacity = "0"; // reveal the static image underneath
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (isContextLost || !isTextureReady) return;

      mouse.x += (mouse.tx - mouse.x) * MOUSE_LERP;
      mouse.y += (mouse.ty - mouse.y) * MOUSE_LERP;
      hover += (hoverTarget - hover) * HOVER_LERP;

      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform1f(uStrength, intensityRef.current);
      gl.uniform1f(uHover, hover);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      // Fluid only — the lag vector reads as pointer velocity.
      gl.uniform2f(uMouseVel, mouse.tx - mouse.x, mouse.ty - mouse.y);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, mesh.vertexCount, gl.UNSIGNED_SHORT, 0);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [isEnabled, src, variant]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`transition-opacity duration-700 ${className}`}
      style={{ opacity: 0 }}
    />
  );
}
