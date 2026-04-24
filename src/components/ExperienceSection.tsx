"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // position:relative is required for Framer Motion useScroll offset tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      {/* Animated gradient background */}
      <div
        className="gradient-animate"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      />

      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(220,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(220,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <motion.div
        style={{ y, opacity, position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div style={{ padding: "64px 64px 0", flexShrink: 0 }}>
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "#dc0000",
            marginBottom: 8,
          }}>
            05 / Interactive Experience
          </p>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 5rem)",
            letterSpacing: "0.04em",
            color: "#fff",
          }}>
            Experience it Yourself
          </h2>
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "14px",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.1em",
            marginTop: 8,
          }}>
            Interact with the SF-23 in full 3D
          </p>
        </div>

        {/* Model Viewer embed */}
        <div style={{ flex: 1, position: "relative", margin: "32px 0 0" }}>
          <div
            style={{ width: "100%", height: "100%", display: "block", border: "none" }}
            dangerouslySetInnerHTML={{ __html: `
              <model-viewer 
                src="/scuderia_ferrari_f1_sf23_2023.glb"
                alt="Ferrari F1 SF-23 3D Model"
                auto-rotate
                camera-controls
                ar
                shadow-intensity="1"
                environment-image="neutral"
                exposure="1"
                interaction-prompt="auto"
                style="width: 100%; height: 100%; background: transparent; --poster-color: transparent;">
              </model-viewer>
            ` }}
          />
          {/* Side vignettes */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.3) 100%)",
            pointerEvents: "none",
          }} />
        </div>
      </motion.div>
    </section>
  );
}
