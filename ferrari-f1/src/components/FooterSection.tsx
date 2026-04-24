"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useCursor } from "@/context/CursorContext";

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

  const { setInFooter } = useCursor();
  const [showToTop, setShowToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.9;
      setInFooter(isVisible);
      setShowToTop(isVisible);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      setInFooter(false);
    };
  }, [setInFooter]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Parallax Layer 1 & 3: scroll from bottom center
  const y1 = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);

  return (
    <footer
      id="footer"
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      }}
    >
      <motion.div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          background: "#000",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Parallax layers */}
        <motion.div style={{ position: "absolute", inset: 0, y: y1, zIndex: 2 }}>
          <GridDistortionBackground imageSrc="/footer/1.png" grid={20} mouse={0.15} strength={0.2} relaxation={0.96} />
        </motion.div>
        <motion.div style={{ position: "absolute", inset: 0, y: y2, zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image src="/footer/2.png" alt="Footer text" fill style={{ objectFit: "cover" }} />
          </div>
        </motion.div>
        <motion.div style={{ position: "absolute", inset: 0, y: y3, zIndex: 4 }}>
          <Image src="/footer/3.png" alt="Footer overlay" fill style={{ objectFit: "cover" }} />
        </motion.div>

        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.9) 100%)", zIndex: 5, pointerEvents: "none" }} />

        {/* Redesigned To Top Button */}
        <AnimatePresence>
          {showToTop && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              style={{
                position: "absolute",
                bottom: "120px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <button
                onClick={scrollToTop}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "20px",
                  transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#dc0000";
                  e.currentTarget.style.borderColor = "#dc0000";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(220,0,0,0.6)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                ↑
              </button>
              <span style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
              }}>
                Return to Top
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Content */}
        <div style={{ position: "relative", zIndex: 10, marginTop: "auto", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 64px 32px" }}>
            <div style={{ display: "flex", gap: 32 }}>
              {NAV_LINKS.slice(0, 3).map((link) => (
                <a key={link} href="#" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#dc0000")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>{link}</a>
              ))}
            </div>
            <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
              {NAV_LINKS.slice(3).map((link) => (
                <a key={link} href="#" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#dc0000")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>{link}</a>
              ))}
              <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.15)" }} />
              {SOCIAL.map((s) => (
                <a key={s.label} href={s.href} style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>{s.label}</a>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(220,0,0,0.4), transparent)", margin: "0 64px" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 64px 40px" }}>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "10px", letterSpacing: "0.25em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>© 2025 Scuderia Ferrari HP. All rights reserved.</p>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "10px", letterSpacing: "0.25em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", textAlign: "right" }}>Formula 1® is a registered trademark of Formula One Licensing BV</p>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
