"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const DRIVERS = [
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

const CARD_WIDTH = 420;
const CARD_HEIGHT = 525;

export default function DriversSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef({ progress: 0 }); // infinite progress
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const cards = Array.from(trackRef.current!.querySelectorAll<HTMLDivElement>(".driver-card"));
    const numCards = DRIVERS.length;
    
    // Ellipse radii
    const radiusX = window.innerWidth > 1000 ? 500 : window.innerWidth * 0.4;
    const radiusZ = 300;

    const updateCards = () => {
      const p = scrollRef.current.progress;

      cards.forEach((card, i) => {
        // Calculate the angle for this card.
        // progress goes positive or negative.
        // 1 unit of progress = 1 card shift = 360 / numCards degrees.
        const angleOffset = (i - p) * (Math.PI * 2 / numCards);
        
        // At angle 0, card is at the front center
        const x = Math.sin(angleOffset) * radiusX;
        const z = Math.cos(angleOffset) * radiusZ;
        
        // Normalize Z from [-radiusZ, radiusZ] to [0, 1] for scaling and opacity
        const normalizedZ = (z + radiusZ) / (radiusZ * 2); 
        
        // Cards in back should be smaller and less opaque
        const scale = 0.6 + (0.4 * normalizedZ);
        const opacity = 0.2 + (0.8 * normalizedZ);

        gsap.set(card, {
          x: x,
          z: z - radiusZ, // push entire carousel slightly back
          scale: scale,
          opacity: opacity,
          zIndex: Math.round(normalizedZ * 100),
          rotationY: x * 0.05, // Slight tilt based on X position for dynamic feel
        });
      });
    };

    // Initial positioning
    updateCards();

    // Entry animation
    gsap.from(cards, {
      y: 200,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out",
    });

    // Infinite Draggable logic
    const proxy = document.createElement("div");
    const draggable = Draggable.create(proxy, {
      type: "x",
      trigger: containerRef.current,
      inertia: true,
      onDrag() {
        // DeltaX to progress conversion. Negative delta means moving left -> progress increases.
        const delta = this.deltaX * -0.003;
        scrollRef.current.progress += delta;
        updateCards();
      },
      onThrowUpdate() {
        const delta = this.deltaX * -0.003;
        scrollRef.current.progress += delta;
        updateCards();
      },
      onDragEnd() {
        // Snap to nearest integer progress
        const snapTarget = Math.round(scrollRef.current.progress);
        gsap.to(scrollRef.current, {
          progress: snapTarget,
          duration: 0.8,
          ease: "power3.out",
          onUpdate: updateCards,
        });
      }
    });

    // Handle window resize
    const handleResize = () => updateCards();
    window.addEventListener("resize", handleResize);

    return () => {
      draggable[0].kill();
      window.removeEventListener("resize", handleResize);
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
      {/* Background glow behind the carousel */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "60vw",
        height: "60vh",
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle, rgba(220,0,0,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div style={{
        position: "absolute",
        top: "8vh",
        left: "0",
        width: "100%",
        textAlign: "center",
        zIndex: 50,
      }}>
        <p style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "12px",
          letterSpacing: "0.5em",
          textTransform: "uppercase",
          color: "#dc0000",
          marginBottom: 8,
        }}>
          04 / Global Elite
        </p>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(3rem, 6vw, 6rem)",
          lineHeight: 1,
          color: "#fff",
        }}>
          The Drivers
        </h2>
      </div>

      {/* 3D Scene */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        perspective: "2000px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}>
        <div
          ref={trackRef}
          style={{
            position: "relative",
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            transformStyle: "preserve-3d",
          }}
        >
          {mounted && DRIVERS.map((driver, i) => (
            <div
              key={driver.name}
              className="driver-card"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                borderRadius: "16px",
                backgroundImage: `url('${driver.file}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0px 30px 60px rgba(0,0,0,0.8)",
                overflow: "hidden",
                cursor: "grab",
                transformOrigin: "center center",
              }}
            >
              {/* Overlay Gradient */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(0deg, rgba(0,0,0,0.95) 0%, transparent 60%)",
              }} />

              {/* Info Overlay */}
              <div style={{
                position: "absolute",
                bottom: 30,
                left: 30,
                right: 30,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}>
                <div style={{
                  position: "absolute",
                  top: -60,
                  right: -10,
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "120px",
                  color: "rgba(220,0,0,0.15)",
                  lineHeight: 1,
                  zIndex: -1,
                }}>
                  {driver.number}
                </div>
                
                <h3 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "42px",
                  color: "#fff",
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                  marginBottom: 6,
                }}>
                  {driver.name}
                </h3>
                <p style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "13px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#dc0000",
                  fontWeight: 600,
                }}>
                  {driver.team}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: "absolute",
        bottom: "8vh",
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}>
        <p style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
        }}>
          ← Swipe to Loop →
        </p>
      </div>
    </section>
  );
}
