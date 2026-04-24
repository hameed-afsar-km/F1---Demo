"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BeamsBackground } from "@/components/ui/beams-background";
import Image from "next/image";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    timerRef.current = setTimeout(onComplete, 5000);
    return () => clearTimeout(timerRef.current);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0, filter: "blur(0px)" }}
      exit={{
        y: "-100vh",
        filter: "blur(20px)",
        transition: {
          duration: 1.0,
          ease: [0.76, 0, 0.24, 1],
        },
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "#000",
        overflow: "hidden",
      }}
    >
      {/* Animated Beams */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <BeamsBackground className="bg-black" intensity="strong" />
      </div>

      {/* Ferrari Logo */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(30px)", scale: 0.92 }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
        }}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <div style={{ position: "relative", width: 220, height: 220 }}>
          <Image
            src="/F1.png"
            alt="Ferrari F1"
            fill
            style={{
              objectFit: "contain",
              filter: "brightness(0) invert(1) drop-shadow(0 0 30px rgba(255,255,255,0.7)) drop-shadow(0 0 60px rgba(255,255,255,0.3))",
            }}
            priority
          />
        </div>
      </motion.div>

      {/* Bottom progress bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 5, ease: "linear" }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 2,
          width: "100%",
          background: "linear-gradient(90deg, #dc0000, #ff4444)",
          transformOrigin: "left center",
          zIndex: 20,
        }}
      />

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.4, y: 0, transition: { delay: 0.8, duration: 1 } }}
        style={{
          position: "absolute",
          bottom: 40,
          width: "100%",
          textAlign: "center",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 12,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "#fff",
          zIndex: 20,
        }}
      >
        Scuderia Ferrari HP — Formula 1
      </motion.p>
    </motion.div>
  );
}
