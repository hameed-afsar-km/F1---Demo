"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const DRIVERS_DATA = [
  { 
    name: "Charles Leclerc", 
    file: "/drivers/Charles Leclerc.jpg",
    number: "16",
    team: "Scuderia Ferrari HP"
  },
  { 
    name: "Lewis Hamilton", 
    file: "/drivers/Lewis Hamilton.jpg",
    number: "44",
    team: "Scuderia Ferrari HP"
  },
  { 
    name: "Max Verstappen", 
    file: "/drivers/Max Verstappen.jpg",
    number: "1",
    team: "Oracle Red Bull Racing"
  },
];

// Use 9 cards (3 sets of 3) for a perfectly smooth infinite loop with overlap
const CARDS = [...DRIVERS_DATA, ...DRIVERS_DATA, ...DRIVERS_DATA];

const CARD_WIDTH = 380;
const CARD_HEIGHT = 475;
const RADIUS = 850;

export default function DriversSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const ring = ringRef.current;
    if (!ring) return;
    const cards = Array.from(ring.querySelectorAll<HTMLDivElement>(".driver-card"));
    const angleStep = 360 / CARDS.length;

    // Position cards in 3D circle
    cards.forEach((card, i) => {
      const angle = i * angleStep;
      gsap.set(card, {
        rotationY: angle,
        translateZ: RADIUS,
        transformStyle: "preserve-3d",
      });
    });

    // Infinite Draggable with better drag ratio
    const proxy = document.createElement("div");
    const draggable = Draggable.create(proxy, {
      type: "x",
      trigger: containerRef.current,
      inertia: true,
      onDrag() {
        const delta = this.deltaX * -0.12;
        rotationRef.current += delta;
        gsap.set(ring, { rotationY: rotationRef.current });
        updateCardVisibility();
      },
      onThrowUpdate() {
        const delta = this.deltaX * -0.12;
        rotationRef.current += delta;
        gsap.set(ring, { rotationY: rotationRef.current });
        updateCardVisibility();
      },
      onDragEnd() {
        // Snap to nearest card
        const snapAngle = Math.round(rotationRef.current / angleStep) * angleStep;
        gsap.to(rotationRef, {
          current: snapAngle,
          duration: 0.8,
          ease: "power3.out",
          onUpdate: () => {
            gsap.set(ring, { rotationY: rotationRef.current });
            updateCardVisibility();
          }
        });
      }
    });

    const updateCardVisibility = () => {
      cards.forEach((card, i) => {
        const angle = (i * angleStep + rotationRef.current) % 360;
        const normalized = (angle + 360) % 360;
        
        // Hide cards on the far side for performance and cleaner look
        // Range is roughly 90 to 270 for the "back" of the circle
        const isBack = normalized > 100 && normalized < 260;
        const opacity = isBack ? 0 : 1;
        const blur = normalized > 60 && normalized < 300 ? Math.min((normalized - 60) * 0.1, 15) : 0;
        
        gsap.set(card, { 
          opacity, 
          filter: `blur(${blur}px)`,
          pointerEvents: opacity === 0 ? "none" : "all"
        });
      });
    };

    updateCardVisibility();

    // Entry reveal
    gsap.from(cards, {
      z: RADIUS - 500,
      opacity: 0,
      scale: 0.8,
      duration: 1.8,
      stagger: 0.05,
      ease: "expo.out",
      onComplete: updateCardVisibility
    });

    return () => {
      draggable[0].kill();
    };
  }, [mounted]);

  return (
    <section
      id="drivers"
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#000",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Dynamic Lighting Background */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at 50% 50%, #150000 0%, #000 80%)",
        zIndex: 0,
      }} />

      {/* Header UI */}
      <div style={{
        position: "absolute",
        top: "10vh",
        left: "5vw",
        zIndex: 50,
      }}>
        <div style={{ width: 40, height: 2, background: "#dc0000", marginBottom: 16 }} />
        <p style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "12px",
          letterSpacing: "0.5em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          marginBottom: 8,
        }}>
          Selection / 04
        </p>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(3rem, 6vw, 6rem)",
          lineHeight: 1,
          color: "#fff",
          textShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}>
          DRIVERS <span style={{ color: "#dc0000" }}>ELITE</span>
        </h2>
      </div>

      {/* 3D Reflection Floor */}
      <div style={{
        position: "absolute",
        bottom: 0,
        width: "200%",
        height: "40vh",
        background: "linear-gradient(180deg, transparent 0%, rgba(220,0,0,0.05) 100%)",
        transform: "rotateX(75deg)",
        zIndex: 1,
        pointerEvents: "none",
      }} />

      {/* 3D Carousel Scene */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        perspective: "2500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}>
        <div
          ref={ringRef}
          style={{
            position: "relative",
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {mounted && CARDS.map((driver, i) => (
            <div
              key={`${driver.name}-${i}`}
              className="driver-card"
              style={{
                position: "absolute",
                inset: 0,
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                borderRadius: "24px",
                backgroundImage: `url('${driver.file}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 30px 60px -12px rgba(0,0,0,0.8)",
                overflow: "hidden",
                backfaceVisibility: "hidden",
                cursor: "grab",
              }}
            >
              {/* Content Overlay */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "40px",
              }}>
                <div style={{
                  position: "absolute",
                  top: 40,
                  right: 40,
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "64px",
                  fontWeight: 900,
                  color: "rgba(220,0,0,0.2)",
                  lineHeight: 1,
                }}>
                  {driver.number}
                </div>
                
                <p style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#dc0000",
                  fontWeight: 700,
                  marginBottom: 4,
                }}>
                  {driver.team}
                </p>
                <h3 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "38px",
                  color: "#fff",
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                }}>
                  {driver.name}
                </h3>
              </div>

              {/* Surface Reflection */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%)",
                pointerEvents: "none",
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Help */}
      <div style={{
        position: "absolute",
        bottom: "8vh",
        display: "flex",
        alignItems: "center",
        gap: 20,
        zIndex: 50,
      }}>
        <div style={{ width: 100, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />
        <p style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.5em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
        }}>
          Swipe to Navigate
        </p>
        <div style={{ width: 100, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />
      </div>
    </section>
  );
}
