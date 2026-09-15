"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export type GatewayFlowProps = {
  mode?: "dark" | "light" | "auto";
  speed?: number;
  density?: number;
  className?: string;
  style?: CSSProperties;
};

export default function GatewayFlow({
  mode = "dark",
  speed = 1,
  density = 1,
  className = "",
  style = {},
}: GatewayFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = 0;
    let height = 0;
    let explosions: { x: number; y: number; radius: number; life: number }[] = [];

    const isDark = mode === "dark";

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      explosions.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        life: 1,
      });
    };

    window.addEventListener("click", handleClick);

    // Generate paths
    const basePathsCount = Math.max(16, Math.round(80 * density));
    const paths = Array.from({ length: basePathsCount }, (_, i) => ({
      isLeft: i % 2 === 0,
      startY: (i / basePathsCount) * height * 1.4 - height * 0.2,
      particles: [
        {
          t: Math.random(),
          speed: (0.0018 + Math.random() * 0.0025) * speed,
        },
      ],
    }));

    const getBezierPoint = (
      t: number,
      p0: { x: number; y: number },
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      p3: { x: number; y: number }
    ) => {
      const u = 1 - t;
      return {
        x: u ** 3 * p0.x + 3 * u ** 2 * t * p1.x + 3 * u * t ** 2 * p2.x + t ** 3 * p3.x,
        y: u ** 3 * p0.y + 3 * u ** 2 * t * p1.y + 3 * u * t ** 2 * p2.y + t ** 3 * p3.y,
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Canvas Background (Black for dark mode, White for light mode)
      ctx.fillStyle = isDark ? "#000000" : "#ffffff";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Update Shockwaves
      explosions.forEach((exp) => {
        exp.radius += 14;
        exp.life -= 0.02;
      });
      explosions = explosions.filter((exp) => exp.life > 0);

      // Render Paths & Particles
      paths.forEach((path) => {
        const p0 = { x: path.isLeft ? 0 : width, y: path.startY };
        const p1 = {
          x: path.isLeft ? centerX * 0.5 : width - centerX * 0.5,
          y: path.startY,
        };
        const p2 = {
          x: path.isLeft ? centerX * 0.8 : width - centerX * 0.8,
          y: centerY,
        };
        const p3 = { x: centerX, y: centerY };

        // Bezier Flow Line
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.28)" : "rgba(37, 99, 235, 0.35)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([1, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Particles
        path.particles.forEach((p) => {
          p.t += p.speed;
          if (p.t > 1) {
            p.t = 0;
            path.startY += (Math.random() - 0.5) * 10;
          }

          let pos = getBezierPoint(p.t, p0, p1, p2, p3);

          let dxTotal = 0;
          let dyTotal = 0;
          explosions.forEach((exp) => {
            const dx = pos.x - exp.x;
            const dy = pos.y - exp.y;
            const dist = Math.hypot(dx, dy);
            if (dist < exp.radius + 120 && dist > exp.radius - 120) {
              const force = (1 - Math.abs(dist - exp.radius) / 120) * exp.life;
              dxTotal += (dx / dist) * force * 80;
              dyTotal += (dy / dist) * force * 80;
            }
          });

          pos.x += dxTotal;
          pos.y += dyTotal;

          // Glowing Particle Dots
          ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.95)" : "rgba(29, 78, 216, 0.95)";
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animFrameId);
    };
  }, [mode, speed, density]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} style={{ background: mode === "dark" ? "#000000" : "#ffffff", ...style }}>
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-auto" />
    </div>
  );
}
