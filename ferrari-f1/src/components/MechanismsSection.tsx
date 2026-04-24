"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 153;
const FRAME_PATH = (n: number) =>
  `/scroll-animation/ezgif-frame-${String(n).padStart(3, "0")}.jpg`;

export default function MechanismsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef({ current: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    // Pre-load all frames
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    const drawFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (!img || !img.complete) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const x = (canvas.width - w) / 2;
      const y = (canvas.height - h) / 2;
      ctx.drawImage(img, x, y, w, h);
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loaded++;
        if (loaded === 1) drawFrame(0); // show first frame immediately
      };
      images.push(img);
    }
    imagesRef.current = images;

    // GSAP scroll scrub
    const obj = { frame: 0 };
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${TOTAL_FRAMES * 18}`,
      pin: true,
      scrub: 0.5,
      anticipatePin: 1,
      onUpdate: (self) => {
        const frameIndex = Math.round(self.progress * (TOTAL_FRAMES - 1));
        if (frameIndex !== frameRef.current.current) {
          frameRef.current.current = frameIndex;
          drawFrame(frameIndex);
        }
      },
    });

    return () => {
      st.kill();
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <section
      id="mechanisms"
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#000",
        overflow: "hidden",
      }}
    >
      {/* Canvas for frame sequence */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />

      {/* Overlay gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* Header text */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "48px 64px",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <p style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.5em",
          textTransform: "uppercase",
          color: "#dc0000",
          marginBottom: 8,
        }}>
          03 / Internal Architecture
        </p>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          letterSpacing: "0.04em",
          color: "#fff",
          textShadow: "0 2px 20px rgba(0,0,0,0.8)",
        }}>
          Mechanisms
        </h2>
      </div>

      {/* Bottom label */}
      <div style={{
        position: "absolute",
        bottom: 48,
        right: 64,
        zIndex: 10,
        textAlign: "right",
        pointerEvents: "none",
      }}>
        <p style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
        }}>
          Scroll to Reveal
        </p>
      </div>
    </section>
  );
}
