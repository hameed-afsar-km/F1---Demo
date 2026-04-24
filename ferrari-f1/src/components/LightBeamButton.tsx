"use client";
import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface LightBeamButtonProps {
  onSlideComplete: () => void;
}

export default function LightBeamButton({ onSlideComplete }: LightBeamButtonProps) {
  const [sliding, setSliding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const isDraggingRef = useRef(false);

  const THRESHOLD = 0.85;

  const getTrackWidth = () => trackRef.current?.clientWidth ?? 300;
  const KNOB_SIZE = 52;

  const startDrag = useCallback((clientX: number) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    setSliding(true);
  }, []);

  const onDrag = useCallback((clientX: number) => {
    if (!isDraggingRef.current) return;
    const trackWidth = getTrackWidth() - KNOB_SIZE - 8;
    const delta = clientX - startXRef.current;
    const p = Math.min(1, Math.max(0, delta / trackWidth));
    setProgress(p);
    if (p >= THRESHOLD && !completed) {
      setCompleted(true);
      isDraggingRef.current = false;
      setProgress(1);
      setTimeout(() => onSlideComplete(), 300);
    }
  }, [completed, onSlideComplete]);

  const endDrag = useCallback(() => {
    if (!completed) {
      isDraggingRef.current = false;
      setSliding(false);
      setProgress(0);
    }
  }, [completed]);

  return (
    <div className="relative select-none" style={{ width: 340 }}>
      {/* Rotating gradient border */}
      <div
        style={{
          padding: "2px",
          borderRadius: "100px",
          background: `conic-gradient(from var(--angle, 0deg), #dc0000, #ff4444, #ffffff, #dc0000)`,
          animation: "rotate-border 2.5s linear infinite",
          boxShadow: "0 0 30px rgba(220,0,0,0.4), 0 0 60px rgba(220,0,0,0.15)",
        }}
      >
        <div
          ref={trackRef}
          className="relative overflow-hidden"
          style={{
            height: 60,
            borderRadius: "100px",
            background: "rgba(0,0,0,0.95)",
            backdropFilter: "blur(10px)",
          }}
          onMouseDown={(e) => startDrag(e.clientX)}
          onMouseMove={(e) => onDrag(e.clientX)}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchStart={(e) => startDrag(e.touches[0].clientX)}
          onTouchMove={(e) => onDrag(e.touches[0].clientX)}
          onTouchEnd={endDrag}
        >
          {/* Fill bar */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg, rgba(220,0,0,0.3), rgba(220,0,0,0.1))",
              transition: sliding ? "none" : "width 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
              borderRadius: "100px",
            }}
          />

          {/* Label */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: `rgba(255,255,255,${completed ? 0 : 1 - progress * 0.6})`,
              transition: "color 0.2s ease",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {completed ? "✓" : "Slide to Enter"}
          </div>

          {/* Knob */}
          <motion.div
            style={{
              position: "absolute",
              top: 4,
              left: 4 + progress * (getTrackWidth() - KNOB_SIZE - 8),
              width: KNOB_SIZE,
              height: KNOB_SIZE,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #dc0000, #ff2222)",
              boxShadow: "0 0 20px rgba(220,0,0,0.8), 0 4px 12px rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              cursor: "grab",
            }}
            animate={{ scale: sliding ? 0.92 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {completed ? "✓" : "→"}
          </motion.div>
        </div>
      </div>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: completed ? 0 : 0.5 }}
        style={{
          textAlign: "center",
          marginTop: 12,
          fontSize: "11px",
          letterSpacing: "0.2em",
          fontFamily: "'Rajdhani', sans-serif",
          textTransform: "uppercase",
          color: "#666",
        }}
      >
        Drag the lever →
      </motion.p>
    </div>
  );
}
