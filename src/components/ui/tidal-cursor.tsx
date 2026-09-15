"use client";

import { useEffect, useRef, useState } from "react";

export interface TidalCursorProps {
  color?: string;
  ringColor?: string;
  dotSize?: number;
  ringSize?: number;
  mixBlendMode?: boolean;
}

export function TidalCursor({
  color = "#ffffff",
  ringColor = "rgba(255, 255, 255, 0.35)",
  dotSize = 7,
  ringSize = 36,
  mixBlendMode = false,
}: TidalCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Position & Spring Physics Refs
  const targetPos = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const velocity = useRef({ x: 0, y: 0 });
  const angleRef = useRef(0);
  const scaleRef = useRef({ x: 1, y: 1 });
  const ripples = useRef<{ x: number; y: number; radius: number; maxRadius: number; alpha: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;

      // Update inner white dot immediately for 0-latency tracking
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Check if hovering interactive elements
      const target = e.target as HTMLElement;
      if (target) {
        const isInteractive =
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.getAttribute("role") === "button" ||
          target.closest("button") !== null ||
          target.closest("a") !== null ||
          target.classList.contains("if-ripple") ||
          target.classList.contains("interactive");

        setIsHovered(isInteractive);
      }
    };

    const handleMouseDown = () => {
      setIsMouseDown(true);
      // Spawn white click tidal ripple
      ripples.current.push({
        x: targetPos.current.x,
        y: targetPos.current.y,
        radius: 10,
        maxRadius: isHovered ? 65 : 45,
        alpha: 0.7,
      });
    };

    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Canvas & Animation Loop Setup
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Ultra-Smooth Fluid Animation Loop (Damped Harmonic Oscillator)
    const animate = () => {
      // Damped Spring Physics for silky smooth movement
      const stiffness = 0.12;
      const damping = 0.72;

      const dx = targetPos.current.x - pos.current.x;
      const dy = targetPos.current.y - pos.current.y;

      velocity.current.x = velocity.current.x * damping + dx * stiffness;
      velocity.current.y = velocity.current.y * damping + dy * stiffness;

      pos.current.x += velocity.current.x;
      pos.current.y += velocity.current.y;

      const speed = Math.hypot(velocity.current.x, velocity.current.y);

      // Smooth Angle Interpolation
      if (speed > 0.5) {
        const targetAngle = Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI);
        // Normalize angle delta
        let deltaAngle = (targetAngle - angleRef.current) % 360;
        if (deltaAngle > 180) deltaAngle -= 360;
        if (deltaAngle < -180) deltaAngle += 360;
        angleRef.current += deltaAngle * 0.15;
      }

      // Smooth Scale Interpolation based on state & velocity
      const targetScale = isMouseDown ? 0.75 : isHovered ? 1.5 : 1;
      const stretch = Math.min(speed * 0.03, 0.4);

      const targetScaleX = targetScale * (1 + stretch);
      const targetScaleY = targetScale * (1 - stretch * 0.4);

      scaleRef.current.x += (targetScaleX - scaleRef.current.x) * 0.14;
      scaleRef.current.y += (targetScaleY - scaleRef.current.y) * 0.14;

      // Update Ring CSS Transform
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) rotate(${angleRef.current}deg) scale(${scaleRef.current.x}, ${scaleRef.current.y})`;
      }

      // Spawn soft white velocity ripples when moving fast
      if (speed > 9 && Math.random() < 0.25) {
        ripples.current.push({
          x: pos.current.x,
          y: pos.current.y,
          radius: 8,
          maxRadius: 26 + speed * 1.1,
          alpha: 0.4,
        });
      }

      // Render Canvas White Ripples
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const r = ripples.current[i];
        r.radius += (r.maxRadius - r.radius) * 0.1;
        r.alpha *= 0.92;

        if (r.alpha < 0.01) {
          ripples.current.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isHovered, isMouseDown, isVisible]);

  if (typeof window === "undefined") return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[99999] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ mixBlendMode: mixBlendMode ? "difference" : "normal" }}
    >
      {/* 1. White Ripple Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 2. Fluid Deforming Glowing White Ring */}
      <div
        ref={ringRef}
        className="absolute top-0 left-0 rounded-full border border-white/60 transition-colors duration-200"
        style={{
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          backgroundColor: ringColor,
          boxShadow: isHovered
            ? "0 0 30px rgba(255, 255, 255, 0.8), inset 0 0 12px rgba(255, 255, 255, 0.5)"
            : "0 0 16px rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* 3. Pure White Precision Inner Cursor Dot */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 rounded-full transition-transform duration-75"
        style={{
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          backgroundColor: color,
          boxShadow: "0 0 12px rgba(255, 255, 255, 0.95)",
        }}
      />
    </div>
  );
}

export default TidalCursor;
