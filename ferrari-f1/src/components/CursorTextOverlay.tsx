"use client";
import { useEffect, useState } from "react";
import { useCursor } from "@/context/CursorContext";

export default function CursorTextOverlay() {
  const { cursorText } = useCursor();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!cursorText) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: pos.y,
        left: pos.x,
        transform: "translate(-50%, -50%)",
        zIndex: 10001,
        pointerEvents: "none",
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#fff",
        background: "rgba(220,0,0,0.92)",
        padding: "7px 16px",
        borderRadius: "100px",
        whiteSpace: "nowrap",
        backdropFilter: "blur(8px)",
        boxShadow: "0 0 20px rgba(220,0,0,0.5)",
        transition: "opacity 0.15s ease",
      }}
    >
      {cursorText}
    </div>
  );
}
