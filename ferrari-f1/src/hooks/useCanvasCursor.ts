"use client";
import { useEffect } from "react";

export function useCanvasCursor(canvasRef: React.RefObject<HTMLCanvasElement | null>, enabled: boolean) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let frame = 1;
    const pos = { x: 0, y: 0 };
    let lines: Line[] = [];
    const E = {
      debug: true,
      friction: 0.5,
      trails: 20,
      size: 50,
      dampening: 0.25,
      tension: 0.98,
    };

    class Oscillator {
      phase: number;
      offset: number;
      frequency: number;
      amplitude: number;

      constructor(e: any = {}) {
        this.phase = e.phase || 0;
        this.offset = e.offset || 0;
        this.frequency = e.frequency || 0.001;
        this.amplitude = e.amplitude || 1;
      }
      update() {
        this.phase += this.frequency;
        return this.offset + Math.sin(this.phase) * this.amplitude;
      }
    }

    class Node {
      x: number = 0;
      y: number = 0;
      vy: number = 0;
      vx: number = 0;
    }

    class Line {
      spring: number;
      friction: number;
      nodes: Node[] = [];

      constructor(e: any = {}) {
        this.spring = e.spring + 0.1 * Math.random() - 0.02;
        this.friction = E.friction + 0.01 * Math.random() - 0.002;
        for (let i = 0; i < E.size; i++) {
          let t = new Node();
          t.x = pos.x;
          t.y = pos.y;
          this.nodes.push(t);
        }
      }

      update() {
        let e = this.spring;
        let t = this.nodes[0];
        t.vx += (pos.x - t.x) * e;
        t.vy += (pos.y - t.y) * e;
        for (let i = 0, a = this.nodes.length; i < a; i++) {
          t = this.nodes[i];
          if (i > 0) {
            let n = this.nodes[i - 1];
            t.vx += (n.x - t.x) * e;
            t.vy += (n.y - t.y) * e;
            t.vx += n.vx * E.dampening;
            t.vy += n.vy * E.dampening;
          }
          t.vx *= this.friction;
          t.vy *= this.friction;
          t.x += t.vx;
          t.y += t.vy;
          e *= E.tension;
        }
      }

      draw() {
        if (!ctx) return;
        let e, t;
        let n = this.nodes[0].x;
        let i = this.nodes[0].y;
        ctx.beginPath();
        ctx.moveTo(n, i);
        let a = 1;
        for (let o = this.nodes.length - 2; a < o; a++) {
          e = this.nodes[a];
          t = this.nodes[a + 1];
          n = 0.5 * (e.x + t.x);
          i = 0.5 * (e.y + t.y);
          ctx.quadraticCurveTo(e.x, e.y, n, i);
        }
        e = this.nodes[a];
        t = this.nodes[a + 1];
        if (e && t) {
          ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);
        }
        ctx.stroke();
        ctx.closePath();
      }
    }

    const f = new Oscillator({
      phase: Math.random() * 2 * Math.PI,
      amplitude: 15,
      frequency: 0.0015,
      offset: 0,
    });

    function render() {
      if (!running) return;
      if (enabled && canvas && ctx) {
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = "hsla(" + Math.round(f.update()) + ", 100%, 50%, 0.5)";
        ctx.lineWidth = 1;
        for (let e = 0; e < E.trails; e++) {
          if (lines[e]) {
            lines[e].update();
            lines[e].draw();
          }
        }
        frame++;
      }
      requestAnimationFrame(render);
    }

    function resizeCanvas() {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    }

    function onMouseMove(e: MouseEvent | TouchEvent) {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchstart", onMouseMove);
      document.addEventListener("mousemove", updatePos);
      document.addEventListener("touchmove", updatePos);
      document.addEventListener("touchstart", handleTouchStart);
      
      initLines();
      updatePos(e);
      render();
    }

    function initLines() {
      lines = [];
      for (let e = 0; e < E.trails; e++) {
        lines.push(new Line({ spring: 0.4 + (e / E.trails) * 0.025 }));
      }
    }

    function updatePos(e: any) {
      if (e.touches) {
        pos.x = e.touches[0].pageX;
        pos.y = e.touches[0].pageY;
      } else {
        pos.x = e.clientX;
        pos.y = e.clientY;
      }
    }

    function handleTouchStart(e: TouchEvent) {
      if (e.touches.length === 1) {
        pos.x = e.touches[0].pageX;
        pos.y = e.touches[0].pageY;
      }
    }

    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchstart", onMouseMove);
    
    resizeCanvas();

    return () => {
      running = false;
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchstart", onMouseMove);
      document.removeEventListener("mousemove", updatePos);
      document.removeEventListener("touchmove", updatePos);
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, [canvasRef, enabled]);
}
