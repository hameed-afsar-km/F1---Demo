"use client";
import { useRef } from "react";
import { useCanvasCursor } from "@/hooks/useCanvasCursor";
import { useCursor } from "@/context/CursorContext";

export default function CanvasCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { cursorDisabled, inFooter, cursorText } = useCursor();

  useCanvasCursor(canvasRef, !cursorDisabled && !inFooter && !cursorText);

  return (
    <canvas
      ref={canvasRef}
      id="cursor-canvas"
      style={{
        opacity: inFooter || cursorDisabled || !!cursorText ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}
    />
  );
}
