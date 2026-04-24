"use client";
import { useEffect, useRef } from "react";

export default function BeamsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface Beam {
      x: number;
      y: number;
      width: number;
      speed: number;
      opacity: number;
      hue: number;
      length: number;
      delay: number;
      phase: number;
    }

    const NUM_BEAMS = 32;
    let beams: Beam[] = [];
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initBeams();
    };

    const initBeams = () => {
      beams = Array.from({ length: NUM_BEAMS }, (_, i) => ({
        x: (i / NUM_BEAMS) * canvas.width + Math.random() * 40 - 20,
        y: -Math.random() * canvas.height * 1.5,
        width: Math.random() * 3 + 0.5,
        speed: Math.random() * 0.8 + 0.3,
        opacity: Math.random() * 0.6 + 0.1,
        hue: Math.random() * 25, // 0–25 for red tones
        length: Math.random() * 300 + 150,
        delay: Math.random() * 200,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      time++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient — deep black to very dark red
      const bg = ctx.createRadialGradient(
        canvas.width / 2, canvas.height * 0.3, 0,
        canvas.width / 2, canvas.height * 0.3, canvas.height
      );
      bg.addColorStop(0, "#0a0000");
      bg.addColorStop(0.5, "#050000");
      bg.addColorStop(1, "#000000");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      beams.forEach((beam) => {
        if (time < beam.delay) return;

        // Drift beam downward
        beam.y += beam.speed;
        if (beam.y > canvas.height + beam.length) {
          beam.y = -beam.length - Math.random() * 100;
          beam.x = Math.random() * canvas.width;
        }

        // Flickering opacity
        const flicker = Math.sin(time * 0.05 + beam.phase) * 0.15 + 0.85;
        const alpha = beam.opacity * flicker;

        const grad = ctx.createLinearGradient(beam.x, beam.y, beam.x, beam.y + beam.length);
        grad.addColorStop(0, `hsla(${beam.hue}, 100%, 30%, 0)`);
        grad.addColorStop(0.3, `hsla(${beam.hue}, 100%, 40%, ${alpha})`);
        grad.addColorStop(0.7, `hsla(${beam.hue}, 85%, 25%, ${alpha * 0.7})`);
        grad.addColorStop(1, `hsla(${beam.hue}, 100%, 20%, 0)`);

        ctx.beginPath();
        ctx.moveTo(beam.x, beam.y);
        ctx.lineTo(beam.x, beam.y + beam.length);
        ctx.strokeStyle = grad;
        ctx.lineWidth = beam.width;
        ctx.shadowBlur = beam.width * 8;
        ctx.shadowColor = `hsla(${beam.hue}, 100%, 35%, 0.5)`;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
