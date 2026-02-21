import React, { useEffect, useRef } from 'react';

/**
 * Custom wand cursor with a subtle golden spark trail.
 * Performance optimised:
 *  - Throttled spawn (every 3rd frame) to cap particle count
 *  - Pool-limit of 120 particles max
 *  - Single shared shadowBlur per frame via save/restore
 *  - Uses devicePixelRatio for crisp retina rendering
 */
const MAX_SPARKS = 120;
const SPAWN_INTERVAL = 3;           // spawn every N frames
const SPARK_COLORS = ['#ffd700', '#c9a84c', '#ffe07a', '#b8962e'];

export default function WandCursor() {
    const canvasRef = useRef(null);
    const sparks = useRef([]);
    const mouse = useRef({ x: -100, y: -100 });
    const prevMouse = useRef({ x: -100, y: -100 });
    const frameCount = useRef(0);
    const raf = useRef(null);
    const isTouchDevice = useRef(false);

    useEffect(() => {
        // Skip on touch devices
        isTouchDevice.current = 'ontouchstart' in window;
        if (isTouchDevice.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.scale(dpr, dpr);
        };
        resize();
        window.addEventListener('resize', resize);

        const onMouseMove = (e) => {
            prevMouse.current = { ...mouse.current };
            mouse.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });

        /* ---- Lerp helper ---- */
        const lerp = (a, b, t) => a + (b - a) * t;

        /* ---- Spawn sparks ---- */
        const spawnSparks = () => {
            const dx = mouse.current.x - prevMouse.current.x;
            const dy = mouse.current.y - prevMouse.current.y;
            const speed = Math.sqrt(dx * dx + dy * dy);

            // More sparks when moving faster, fewer when slow
            const count = Math.min(Math.floor(speed * 0.15) + 1, 4);

            for (let i = 0; i < count; i++) {
                if (sparks.current.length >= MAX_SPARKS) break;

                const angle = Math.random() * Math.PI * 2;
                const spread = Math.random() * 6;
                const baseVx = -dx * 0.04; // drift opposite to movement
                const baseVy = -dy * 0.04;

                sparks.current.push({
                    x: mouse.current.x + Math.cos(angle) * spread,
                    y: mouse.current.y + Math.sin(angle) * spread,
                    vx: baseVx + (Math.random() - 0.5) * 1.2,
                    vy: baseVy + (Math.random() - 0.5) * 1.2 - 0.5,
                    life: 1,
                    decay: 0.015 + Math.random() * 0.012,
                    size: Math.random() * 2.5 + 0.8,
                    color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
                    rotation: Math.random() * Math.PI,
                    isStar: Math.random() > 0.7, // 30% chance of star shape
                });
            }
        };

        /* ---- Draw a tiny 4-point star ---- */
        const drawStar = (cx, cy, r) => {
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
                const outerX = cx + Math.cos(a) * r;
                const outerY = cy + Math.sin(a) * r;
                const innerA = a + Math.PI / 4;
                const innerX = cx + Math.cos(innerA) * r * 0.35;
                const innerY = cy + Math.sin(innerA) * r * 0.35;
                if (i === 0) ctx.moveTo(outerX, outerY);
                else ctx.lineTo(outerX, outerY);
                ctx.lineTo(innerX, innerY);
            }
            ctx.closePath();
            ctx.fill();
        };

        /* ---- Render loop ---- */
        const animate = () => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            frameCount.current++;
            if (frameCount.current % SPAWN_INTERVAL === 0 && mouse.current.x > 0) {
                spawnSparks();
            }

            // Draw wand glow at cursor position
            const grad = ctx.createRadialGradient(
                mouse.current.x, mouse.current.y, 0,
                mouse.current.x, mouse.current.y, 18
            );
            grad.addColorStop(0, 'rgba(255, 215, 0, 0.15)');
            grad.addColorStop(0.5, 'rgba(201, 168, 76, 0.05)');
            grad.addColorStop(1, 'rgba(201, 168, 76, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(mouse.current.x, mouse.current.y, 18, 0, Math.PI * 2);
            ctx.fill();

            // Update & draw sparks
            let alive = 0;
            for (let i = 0; i < sparks.current.length; i++) {
                const s = sparks.current[i];
                s.x += s.vx;
                s.y += s.vy;
                s.vy += 0.02;       // slight gravity
                s.vx *= 0.98;       // air resistance
                s.vy *= 0.98;
                s.life -= s.decay;
                s.size *= 0.985;

                if (s.life <= 0 || s.size < 0.2) continue;

                ctx.save();
                ctx.globalAlpha = s.life * s.life; // quadratic fade for smoother falloff
                ctx.fillStyle = s.color;
                ctx.shadowBlur = 6;
                ctx.shadowColor = s.color;

                if (s.isStar) {
                    drawStar(s.x, s.y, s.size * 1.8);
                } else {
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();

                sparks.current[alive++] = s;
            }
            sparks.current.length = alive;

            raf.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(raf.current);
        };
    }, []);

    if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999,
            }}
        />
    );
}
