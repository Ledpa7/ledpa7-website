"use client";

import React, { useRef, useEffect, useState } from "react";

const InteractiveStarBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const mouse = useRef<{ x: number | null; y: number | null; radius: number }>({
        x: null,
        y: null,
        radius: 120,
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (dimensions.width === 0 || dimensions.height === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        interface Star {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            size: number;
            density: number;
            baseAlpha: number;
            twinkleSpeed: number;
            twinkleOffset: number;
            floatOffset: number;
        }

        let starsArray: Star[] = [];
        const isMobile = dimensions.width < 768;
        const starCount = isMobile ? 150 : 400; // Balanced density

        const init = () => {
            starsArray = [];
            const colors = ["#ffffff", "#e0f2ff", "#fff4e0", "#ffffff"];
            for (let i = 0; i < starCount; i++) {
                const rx = Math.random() * canvas.width;
                const ry = Math.random() * canvas.height;
                starsArray.push({
                    x: rx,
                    y: ry,
                    baseX: rx,
                    baseY: ry,
                    size: Math.random() * (isMobile ? 0.8 : 1.2) + 0.2, // Delicate stars
                    density: Math.random() * 15 + 2,
                    baseAlpha: Math.random() * 0.4 + 0.1, // Softer
                    twinkleSpeed: Math.random() * 0.03 + 0.005,
                    twinkleOffset: Math.random() * Math.PI * 2,
                    floatOffset: Math.random() * Math.PI * 2,
                    color: colors[Math.floor(Math.random() * colors.length)]
                } as any);
            }
        };

        const drawStar = (star: any, time: number) => {
            if (!ctx) return;
            const twinkle = Math.sin((time * star.twinkleSpeed * 0.02) + star.twinkleOffset);
            let alpha = star.baseAlpha + (twinkle * 0.2);

            // Mouse interaction: brighten stars when mouse is near
            if (mouse.current.x != null && mouse.current.y != null) {
                const dx = (mouse.current.x * (window.devicePixelRatio || 1)) - star.x;
                const dy = (mouse.current.y * (window.devicePixelRatio || 1)) - star.y;
                const distanceSq = dx * dx + dy * dy;
                const rad = mouse.current.radius * (window.devicePixelRatio || 1);
                if (distanceSq < rad * rad) {
                    const ratio = 1 - (Math.sqrt(distanceSq) / rad);
                    alpha += ratio * 0.5;
                }
            }

            if (alpha < 0.1) alpha = 0.1;
            if (alpha > 1) alpha = 1;

            ctx.fillStyle = star.color || "#ffffff";
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        };

        const updateStar = (star: Star, time: number) => {
            const dpr = window.devicePixelRatio || 1;
            const mx = mouse.current.x != null ? mouse.current.x * dpr : -1000;
            const my = mouse.current.y != null ? mouse.current.y * dpr : -1000;
            const dx = mx - star.x;
            const dy = my - star.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.current.radius * dpr) {
                const force = (mouse.current.radius * dpr - distance) / (mouse.current.radius * dpr);
                star.x -= (dx / distance) * force * star.density * 0.1;
                star.y -= (dy / distance) * force * star.density * 0.1;
            } else {
                const sec = time * 0.0005;
                const floatX = Math.sin(sec + star.floatOffset) * 3;
                const floatY = Math.cos(sec * 0.8 + star.floatOffset) * 3;

                const targetX = star.baseX + floatX;
                const targetY = star.baseY + floatY;

                star.x += (targetX - star.x) * 0.02;
                star.y += (targetY - star.y) * 0.02;
            }
        };

        let animationFrameId: number;
        const animate = (time: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < starsArray.length; i++) {
                drawStar(starsArray[i], time);
                updateStar(starsArray[i], time);
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        const handlePointerMove = (x: number, y: number) => {
            mouse.current.x = x;
            mouse.current.y = y;
        };

        const handlePointerLeave = () => {
            mouse.current.x = null;
            mouse.current.y = null;
        };

        const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
        const onTouchMove = (e: TouchEvent) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("mouseleave", handlePointerLeave);

        init();
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("mouseleave", handlePointerLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [dimensions]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
                background: "transparent"
            }}
        />
    );
};

export default InteractiveStarBackground;
