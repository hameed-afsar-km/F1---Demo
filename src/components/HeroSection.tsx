"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import LightBeamButton from "./LightBeamButton";
import { useCursor } from "@/context/CursorContext";

interface HeroSectionProps {
  onEnter: () => void;
}

export default function HeroSection({ onEnter }: HeroSectionProps) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setCursorDisabled } = useCursor();

  // Mouse parallax
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      if (zooming || videoStarted) {
        setParallax({ x: 0, y: 0 });
        return;
      }
      setParallax({
        x: ((e.clientX - cx) / cx) * 12,
        y: ((e.clientY - cy) / cy) * 8,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [zooming, videoStarted]);

  const handleSlideComplete = () => {
    setCursorDisabled(true);
    setZooming(true);
    setTimeout(() => {
      setVideoStarted(true);
    }, 1000);
    setParallax({ x: 0, y: 0 });
    onEnter();
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setShowScrollHint(true);
    setCursorDisabled(false);
  };

  const handleReset = () => {
    setVideoStarted(false);
    setVideoEnded(false);
    setZooming(false);
    setShowScrollHint(false);
    setCursorDisabled(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (videoStarted && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoStarted]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#000" }}>
      {/* Hero Background with Parallax */}
      <AnimatePresence>
        {!videoStarted && (
          <motion.div
            key="hero-bg"
            initial={{ scale: 1.15 }}
            animate={{ scale: zooming ? 1.0 : 1.15 }} 
            exit={{ opacity: 0, scale: 1.0, transition: { duration: 0.6 } }}
            transition={{ 
              duration: 1.0, 
              ease: [0.76, 0, 0.24, 1],
              scale: { duration: 1.0, ease: [0.64, 0, 0.78, 0] } // Velocity ramp (ease-in)
            }}
            style={{
              position: "absolute",
              inset: 0,
              willChange: "transform",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `translate(${parallax.x}px, ${parallax.y}px)`,
                transition: "transform 0.12s ease-out",
                willChange: "transform",
              }}
            >
              <Image
                src="/hero/frontview-1.jpeg"
                alt="Ferrari F1 Front View"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
                priority
              />
              {/* Dark overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.7) 100%)"
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Video with Fade-in */}
      {videoStarted && (
        <motion.video
          ref={videoRef}
          src="/hero/car hero.webm"
          muted
          playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onEnded={handleVideoEnd}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 10,
          }}
        />
      )}

      {/* Hero Text — shown before video */}
      <AnimatePresence>
        {!videoStarted && (
          <motion.div
            key="hero-text"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              padding: "48px 64px",
              zIndex: 20,
            }}
          >
            <p style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              marginBottom: 16,
            }}>
              Scuderia Ferrari HP · 2025 Season
            </p>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
              lineHeight: 0.9,
              letterSpacing: "0.02em",
              color: "#fff",
              textShadow: "0 4px 40px rgba(0,0,0,0.8)",
            }}>
              Beyond<br />
              <span style={{ color: "#dc0000" }}>The Limit</span>
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Slide Button */}
      <AnimatePresence>
        {!videoStarted && (
          <motion.div
            key="hero-cta"
            initial={{ opacity: 0, x: "-50%", y: 40 }}
            animate={{ opacity: 1, x: "-50%", y: 0, transition: { delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, x: "-50%", y: 20, transition: { duration: 0.3 } }}
            style={{
              position: "absolute",
              bottom: 80,
              left: "50%",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <p style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              marginBottom: 12,
            }}>
              Enter the Machine
            </p>
            <LightBeamButton onSlideComplete={handleSlideComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Race hint — after video ends */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            key="scroll-hint"
            initial={{ opacity: 0, x: "-50%", y: 20 }}
            animate={{ opacity: 1, x: "-50%", y: 0, transition: { duration: 0.8 } }}
            style={{
              position: "absolute",
              bottom: 40,
              left: "50%",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Replay button */}
            <button
              onClick={handleReset}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "4px",
                fontSize: "10px",
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "0.2em",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(220,0,0,0.2)";
                e.currentTarget.style.borderColor = "#dc0000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              REPLAY EXPERIENCE
            </button>
            {/* Racing flag animation */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 40,
                height: 2,
                background: "linear-gradient(90deg, transparent, #dc0000, transparent)",
                animation: "scroll-pulse 1.8s ease-in-out infinite",
              }} />
              <div style={{
                width: 28,
                height: 2,
                background: "linear-gradient(90deg, transparent, #fff, transparent)",
                animation: "scroll-pulse 1.8s ease-in-out infinite 0.3s",
              }} />
              <div style={{
                width: 18,
                height: 2,
                background: "linear-gradient(90deg, transparent, #dc0000, transparent)",
                animation: "scroll-pulse 1.8s ease-in-out infinite 0.6s",
              }} />
            </div>
            <p style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
            }}>
              Scroll to Race
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
