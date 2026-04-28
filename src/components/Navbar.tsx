"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCursor } from "@/context/CursorContext";

interface NavbarProps {
  revealed: boolean;
}

const LEFT_ITEMS = ["Features", "Mechanisms"];
const RIGHT_ITEMS = ["Drivers", "Experience It"];

const SECTION_IDS: Record<string, string> = {
  Features: "features",
  Mechanisms: "mechanisms",
  Drivers: "drivers",
  "Experience It": "experience",
};

export default function Navbar({ revealed }: NavbarProps) {
  const { setCursorText, inFooter } = useCursor();

  const itemVariants = {
    hidden: { y: -60, opacity: 0, filter: "blur(8px)" },
    visible: (delay: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay,
        duration: 0.9,
        ease: [0.76, 0, 0.24, 1] as const, // Smooth ramp speed curve
      },
    }),
  };

  const logoVariants = {
    hidden: { opacity: 0, filter: "blur(20px)", scale: 0.9 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      transition: { delay: 0.7, duration: 1.0, ease: [0.76, 0, 0.24, 1] as const },
    },
  };

  const scrollTo = (id: string) => {
    if (window.lenis) {
      window.lenis.scrollTo(`#${id}`, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -100 }}
      animate={{
        opacity: revealed ? 1 : 0,
        y: (revealed && !inFooter) ? 0 : -100
      }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 48px",
        background: "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, transparent 100%)",
        backdropFilter: "blur(0px)",
        pointerEvents: (revealed && !inFooter) ? "all" : "none",
      }}
    >
      {/* Left links */}
      <div style={{ display: "flex", gap: 48, flex: 1 }}>
        {LEFT_ITEMS.map((item, i) => (
          <motion.button
            key={item}
            custom={i === 0 ? 0 : 0.3} // Features (outer) at 0s, Mechanisms (inner) at 0.3s
            variants={itemVariants}
            initial="hidden"
            animate={revealed ? "visible" : "hidden"}
            onClick={() => scrollTo(SECTION_IDS[item])}
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.75)",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "color 0.25s ease",
            }}
            whileHover={{ color: "#dc0000", scale: 1.05 } as never}
          >
            {item}
          </motion.button>
        ))}
      </div>

      {/* Center Logo */}
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate={revealed ? "visible" : "hidden"}
        style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <img
          src="/F1.png"
          alt="Ferrari F1 Logo"
          style={{
            height: 40,
            filter: "brightness(0) invert(1)",
            display: "block",
          }}
        />
        <div className="md:hidden" style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "8px",
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          marginTop: "4px"
        }}>
          Best in Landscape
        </div>
      </motion.div>

      {/* Right links */}
      <div style={{ display: "flex", gap: 48, flex: 1, justifyContent: "flex-end" }}>
        {RIGHT_ITEMS.map((item, i) => (
          <motion.button
            key={item}
            custom={i === 0 ? 0.3 : 0} // Drivers (inner) at 0.3s, Experience It (outer) at 0s
            variants={itemVariants}
            initial="hidden"
            animate={revealed ? "visible" : "hidden"}
            onClick={() => scrollTo(SECTION_IDS[item])}
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.75)",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "color 0.25s ease",
            }}
            whileHover={{ color: "#dc0000", scale: 1.05 } as never}
          >
            {item}
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
}
