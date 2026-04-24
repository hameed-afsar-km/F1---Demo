"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";

const GridDistortionBackground = dynamic(() => import("./GridDistortionBackground"), { ssr: false });

const NAV_LINKS = ["Race", "Team", "Heritage", "Merchandise", "Press"];
const SOCIAL = [
  { label: "Instagram", href: "#" },
  { label: "X", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "Facebook", href: "#" },
];

export default function FooterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  // Layer 1 & 3: scroll from bottom center
  const y1 = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);
  // Opacity: 0 to 1 as we scroll through the section
  const layerOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const layer2Opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <footer
      id="footer"
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "#000",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Parallax layer 1 — base image with WebGL distortion */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          y: y1,
          opacity: layerOpacity,
          zIndex: 2,
        }}
      >
        <GridDistortionBackground 
          imageSrc="/footer/1.png"
          grid={20}
          mouse={0.15}
          strength={0.2}
          relaxation={0.96}
        />
      </motion.div>

      {/* Parallax layer 2 — text image, from top */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          y: y2,
          opacity: layer2Opacity,
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src="/footer/2.png"
            alt="Footer text layer"
            fill
            style={{ objectFit: "contain", objectPosition: "center" }}
          />
        </div>
      </motion.div>

      {/* Parallax layer 3 — top overlay */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          y: y3,
          opacity: layerOpacity,
          zIndex: 4,
        }}
      >
        <Image
          src="/footer/3.png"
          alt="Footer overlay"
          fill
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
      </motion.div>

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.85) 100%)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />

      {/* Footer UI content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: "auto",
          width: "100%",
        }}
      >
        {/* Nav links row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: "0 64px 32px",
          }}
        >
          {/* Left links */}
          <div style={{ display: "flex", gap: 32 }}>
            {NAV_LINKS.slice(0, 3).map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#dc0000")}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)")}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right links + social */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {NAV_LINKS.slice(3).map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#dc0000")}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)")}
              >
                {link}
              </a>
            ))}
            <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.15)" }} />
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#fff")}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.35)")}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(220,0,0,0.4), transparent)",
          margin: "0 64px",
        }} />

        {/* Bottom row with centered logo */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            padding: "24px 64px 40px",
          }}
        >
          {/* Left — copyright */}
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
          }}>
            © 2025 Scuderia Ferrari HP. All rights reserved.
          </p>

          {/* Center — Empty since F1 Logo is removed */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          </div>

          {/* Right — legal */}
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
            textAlign: "right",
          }}>
            Formula 1® is a registered trademark of Formula One Licensing BV
          </p>
        </div>
      </div>
    </footer>
  );
}
