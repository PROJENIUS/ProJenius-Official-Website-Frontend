import React, { useEffect, useRef } from "react";
import "./HaveAWorkshopInMind.css";

const LINK_DISTANCE = 170;
const NODE_COLOR = "143, 154, 216";
const ACCENT_COLOR = "224, 160, 0";

function createNodes(width, height) {
  const count = Math.max(24, Math.round((width * height) / 19000));
  return Array.from({ length: count }, () => {
    const speed = 0.08 + Math.random() * 0.2;
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 1.2 + Math.random() * 1.8,
      accent: Math.random() < 0.07,
    };
  });
}

function draw(ctx, nodes, width, height) {
  ctx.clearRect(0, 0, width, height);

  // Links between nearby nodes, fading with distance
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < LINK_DISTANCE) {
        const alpha = (1 - dist / LINK_DISTANCE) * 0.35;
        ctx.strokeStyle = `rgba(${NODE_COLOR}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // Nodes
  for (const n of nodes) {
    ctx.fillStyle = n.accent
      ? `rgba(${ACCENT_COLOR}, 0.95)`
      : `rgba(${NODE_COLOR}, 0.85)`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function HaveAWorkshopInMind() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return undefined;

    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let nodes = [];
    let frameId = 0;

    const resize = () => {
      const rect = section.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = createNodes(width, height);
      draw(ctx, nodes, width, height);
    };

    const tick = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -10) n.x = width + 10;
        if (n.x > width + 10) n.x = -10;
        if (n.y < -10) n.y = height + 10;
        if (n.y > height + 10) n.y = -10;
      }
      draw(ctx, nodes, width, height);
      frameId = requestAnimationFrame(tick);
    };

    resize();
    if (!reduceMotion) frameId = requestAnimationFrame(tick);

    const observer = new ResizeObserver(resize);
    observer.observe(section);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  return (
    <section className="hwm-section" ref={sectionRef}>
      <canvas className="hwm-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="hwm-container">
        <h2 className="hwm-title">Have a Workshop in Mind?</h2>
        <p className="hwm-description">
          Tell us what your students or institution want to explore. Let{"\u2019"}s
          design a practical workshop around it.
        </p>
        <div className="hwm-actions">
          <a href="#plan-workshop" className="hwm-btn hwm-btn-primary">
            Plan a Workshop
          </a>
          <a href="#contact" className="hwm-btn hwm-btn-outline">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}