"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    name: "Aerodynamics",
    file: "Aerodynamics.jpeg",
    desc: "Every surface sculpted by computational fluid dynamics. The SF-25 generates 3.5G of downforce at 300km/h.",
  },
  {
    name: "Engine",
    file: "Engine.jpeg",
    desc: "1.6L turbocharged V6 hybrid unit producing over 1000bhp. The pinnacle of internal combustion engineering.",
  },
  {
    name: "Materials",
    file: "Materials.jpeg",
    desc: "Ultra-lightweight carbon fiber monocoque. Advanced composites engineered for rigidity without compromise.",
  },
  {
    name: "Steering",
    file: "Steering.jpeg",
    desc: "Over 20 controls on a single wheel. The cockpit of the SF-25 puts absolute command in the driver's hands.",
  },
  {
    name: "Tires",
    file: "Tire.jpeg",
    desc: "Four contact patches, each the size of a hand. Pirelli rubber that defines the edge of grip.",
  },
];

export default function FeaturesSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const totalScroll = track.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: () => `+=${totalScroll}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, outer);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={outerRef}
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* Fixed header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          padding: "80px 64px 0",
          pointerEvents: "none",
        }}
      >
        <p style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.5em",
          textTransform: "uppercase",
          color: "#dc0000",
          marginBottom: 12,
        }}>
          02 / Engineering Excellence
        </p>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
          letterSpacing: "0.04em",
          lineHeight: 0.95,
          color: "#fff",
        }}>
          FEATURES that<br />
          <span style={{ color: "#dc0000" }}>DISTINGUISH US</span>
        </h2>
        {/* Red rule */}
        <div style={{ width: 80, height: 2, background: "#dc0000", marginTop: 24 }} />
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          paddingBottom: 80,
          paddingTop: "180px",
          paddingLeft: 64,
          gap: 32,
          willChange: "transform",
          width: "max-content",
        }}
      >
        {FEATURES.map((feature, i) => (
          <div
            key={feature.name}
            style={{
              flexShrink: 0,
              width: "clamp(280px, 25vw, 380px)",
              position: "relative",
            }}
          >
            {/* Image */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "3/4",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid rgba(220,0,0,0.2)",
              }}
            >
              <Image
                src={`/features/${feature.file}`}
                alt={feature.name}
                fill
                style={{ objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)" }}
              />
              {/* Gradient overlay */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "50%",
                background: "linear-gradient(0deg, rgba(0,0,0,0.8), transparent)",
              }} />
              {/* Index number */}
              <div style={{
                position: "absolute",
                top: 20,
                left: 20,
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "56px",
                color: "rgba(220,0,0,0.25)",
                lineHeight: 1,
              }}>
                0{i + 1}
              </div>
            </div>

            {/* Description */}
            <div style={{ padding: "24px 4px 0" }}>
              <h3 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.8rem",
                letterSpacing: "0.08em",
                color: "#fff",
                marginBottom: 8,
              }}>
                {feature.name}
              </h3>
              <div style={{ width: 36, height: 1, background: "#dc0000", marginBottom: 12 }} />
              <p style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "14px",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.55)",
                fontWeight: 400,
              }}>
                {feature.desc}
              </p>
            </div>
          </div>
        ))}

        {/* Trailing spacer */}
        <div style={{ flexShrink: 0, width: 64 }} />
      </div>

      {/* Right vignette */}
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: 120,
        background: "linear-gradient(270deg, #000 0%, transparent 100%)",
        zIndex: 20,
        pointerEvents: "none",
      }} />
    </section>
  );
}
