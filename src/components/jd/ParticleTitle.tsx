"use client";

import React, { useRef, useEffect, useState } from "react";

interface Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    size: number;
    density: number;
    vx: number;
    vy: number;
    baseAlpha: number;
    twinkleSpeed: number;
    twinkleOffset: number;
    vortexAngle: number;
    vortexRadius: number;
    vortexSpeed: number;
    isBackground: boolean;
    floatOffset: number;
    draw: (ctx: CanvasRenderingContext2D, time: number, dpr: number, mx: number | null, my: number | null) => void;
    update: (time: number, dpr: number, mx: number | null, my: number | null, radius: number, cx: number, cy: number, exploding: boolean) => void;
}

class ParticleClass implements Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    size: number;
    density: number;
    vx: number;
    vy: number;
    baseAlpha: number;
    twinkleSpeed: number;
    twinkleOffset: number;
    vortexAngle: number;
    vortexRadius: number;
    vortexSpeed: number;
    isBackground: boolean;
    floatOffset: number;

    constructor(x: number, y: number, dpr: number, isMobile: boolean, canvasWidth: number, isBackground = false) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.isBackground = isBackground;
        this.size = isBackground ? (Math.random() * 1.5 + 0.5) * dpr : (isMobile ? 1.6 * dpr : 2.2);
        this.density = isBackground ? 0 : Math.random() * 40 + 5;
        this.vx = (Math.random() - 0.5) * 15;
        this.vy = (Math.random() - 0.5) * 15;
        this.baseAlpha = isBackground ? Math.random() * 0.5 + 0.1 : Math.random() * 0.4 + 0.1;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleOffset = Math.random() * Math.PI * 2;
        this.floatOffset = Math.random() * Math.PI * 2;
        this.vortexAngle = Math.random() * Math.PI * 2;
        this.vortexRadius = Math.random() * (canvasWidth * 0.6);
        this.vortexSpeed = (50 / (this.vortexRadius + 10)) * (isBackground ? 0.05 : 0.1);
    }

    draw(ctx: CanvasRenderingContext2D, time: number, dpr: number, mx: number | null, my: number | null) {
        const twinkle = Math.sin((time * this.twinkleSpeed * 0.02) + this.twinkleOffset);
        let alpha = this.baseAlpha + (twinkle * 0.15);

        if (mx != null && my != null) {
            const mdx = (mx * dpr) - this.x;
            const mdy = (my * dpr) - this.y;
            if (mdx * mdx + mdy * mdy < 12000 * dpr * dpr) alpha = 1;
        }

        if (alpha < 0.1) alpha = 0.1;
        if (alpha > 1) alpha = 1;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        // Use small full circles for better look while maintaining speed
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    update(time: number, dpr: number, mx: number | null, my: number | null, radius: number, cx: number, cy: number, exploding: boolean) {
        if (exploding) {
            this.vortexAngle += this.vortexSpeed;
            const targetX = cx + Math.cos(this.vortexAngle) * this.vortexRadius;
            const targetY = cy + Math.sin(this.vortexAngle) * this.vortexRadius;
            this.x += (targetX - this.x) * 0.1;
            this.y += (targetY - this.y) * 0.1;
            return;
        }

        const mouseX = mx != null ? mx * dpr : -10000;
        const mouseY = my != null ? my * dpr : -10000;
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distanceSq = dx * dx + dy * dy;
        const maxDistance = radius * dpr;
        const maxDistanceSq = maxDistance * maxDistance;

        if (distanceSq < maxDistanceSq) {
            const distance = Math.sqrt(distanceSq);
            const force = (maxDistance - distance) / maxDistance;
            const directionX = (dx / distance) * force * this.density;
            const directionY = (dy / distance) * force * this.density;
            this.x -= directionX;
            this.y -= directionY;
        } else {
            const sec = time * 0.001;
            const floatX = Math.sin(sec + this.floatOffset) * 2 * dpr;
            const floatY = Math.cos(sec * 0.8 + this.floatOffset) * 2 * dpr;
            const targetX = this.baseX + floatX;
            const targetY = this.baseY + floatY;

            this.x -= (this.x - targetX) / 10; // Speed up return slightly
            this.y -= (this.y - targetY) / 10;
        }
    }
}

const ParticleTitle = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const mouse = useRef<{ x: number | null; y: number | null; radius: number }>({
        x: null,
        y: null,
        radius: 100,
    });
    const isExploding = useRef(false);
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        document.fonts.ready.then(() => setFontLoaded(true));
    }, []);

    useEffect(() => {
        if (dimensions.width === 0 || dimensions.height === 0 || !fontLoaded) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const isMobile = dimensions.width < 768;
        const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limit DPR for performance balance

        canvas.width = dimensions.width * dpr;
        canvas.height = dimensions.height * dpr;
        canvas.style.width = `${dimensions.width}px`;
        canvas.style.height = `${dimensions.height}px`;

        const textLines = isMobile ? ["Jidu", "Portfolio"] : ["Jidu Portfolio"];
        const verticalScale = 1.35;
        let fontSize = isMobile
            ? Math.min(dimensions.width * 0.18, dimensions.height * 0.25)
            : Math.min(dimensions.width * 0.12, dimensions.height * 0.5);
        const lineHeight = isMobile ? fontSize * 1.1 : fontSize * 1.2;

        // Step 1: Clean sampling of text
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = `900 ${fontSize}px "Inter", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.save();
        ctx.scale(dpr, dpr * verticalScale);
        const scaledCanvasHeight = dimensions.height / verticalScale;
        const startY = (scaledCanvasHeight - (lineHeight * textLines.length)) / 2 + (lineHeight / 2) + (isMobile ? -60 : 10);
        textLines.forEach((line, index) => {
            ctx.fillText(line, dimensions.width / 2, startY + (index * lineHeight));
        });
        ctx.restore();

        const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let particlesArray: ParticleClass[] = [];
        const init = () => {
            particlesArray = [];
            // Removed redundant background stars to align with global InteractiveStarBackground

            // Text particles - Balanced Gap
            const gap = isMobile ? 4.5 : 4;
            for (let y = 0; y < textCoordinates.height; y += gap) {
                for (let x = 0; x < textCoordinates.width; x += gap) {
                    // Sample every gap-th pixel exactly
                    const ix = Math.floor(x);
                    const iy = Math.floor(y);
                    const index = (iy * 4 * textCoordinates.width) + (ix * 4);

                    // Check brightness from any color channel (using red here)
                    if (textCoordinates.data[index] > 150) {
                        particlesArray.push(new ParticleClass(x, y, dpr, isMobile, canvas.width, false));
                    }
                }
            }
        };

        let animationFrameId: number;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        const animate = (time: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Standard clear for reliability

            const mx = mouse.current.x;
            const my = mouse.current.y;
            const rad = mouse.current.radius;
            const exploding = isExploding.current;

            for (let i = 0; i < particlesArray.length; i++) {
                const p = particlesArray[i];
                p.update(time, dpr, mx, my, rad, cx, cy, exploding);
                p.draw(ctx, time, dpr, mx, my);
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate(0);

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.current.x = (e.clientX - rect.left);
            mouse.current.y = (e.clientY - rect.top);
        };
        const handleTouchMove = (e: TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.current.x = (e.touches[0].clientX - rect.left);
            mouse.current.y = (e.touches[0].clientY - rect.top);
        };
        const handleLeave = () => { mouse.current.x = null; mouse.current.y = null; };
        const handleClick = () => { if (!isMobile) isExploding.current = !isExploding.current; };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleLeave);
        canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
        canvas.addEventListener("touchstart", handleTouchMove, { passive: true });
        canvas.addEventListener("touchend", handleLeave);
        canvas.addEventListener("click", handleClick);

        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleLeave);
            canvas.removeEventListener("touchmove", handleTouchMove);
            canvas.removeEventListener("touchstart", handleTouchMove);
            canvas.removeEventListener("touchend", handleLeave);
            canvas.removeEventListener("click", handleClick);
            cancelAnimationFrame(animationFrameId);
        };
    }, [dimensions, fontLoaded]);

    return (
        <div style={{ position: "relative", width: "100%", height: "100vh", background: "transparent" }}>
            <span style={{ fontFamily: "Inter", fontWeight: 900, opacity: 0, position: "absolute" }}>Font Loader</span>
            <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100vh", touchAction: "none" }} />
        </div>
    );
};

export default ParticleTitle;
