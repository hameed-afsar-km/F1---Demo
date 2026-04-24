"use client";
import { useEffect, useState } from "react";
import { useCursor } from "@/context/CursorContext";

export default function MainCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const { cursorDisabled } = useCursor();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (cursorDisabled) return null;

  return (
    <div 
      className="custom-cursor"
      style={{
        left: pos.x,
        top: pos.y,
      }}
    />
  );
}
