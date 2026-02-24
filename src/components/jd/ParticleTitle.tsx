"use client";

import React, { useRef, useEffect, useState } from "react";

interface Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    size: number;
    density: number;
    color: string;
    vx: number;
    vy: number;
    baseAlpha: number; // Texture prop
    twinkleSpeed: number;
    twinkleOffset: number;
    vortexAngle: number;
    vortexRadius: number;
    vortexSpeed: number;
    isBackground?: boolean; // 배경 별 여부
    floatOffset: number;   // 유영 오차
    draw: (time: number) => void;
    update: (time: number) => void;
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

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            setDimensions({ width: w, height: h });
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        document.fonts.ready.then(() => setFontLoaded(true));
    }, []);

    useEffect(() => {
        if (dimensions.width === 0 || dimensions.height === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        // Config
        const isMobile = dimensions.width < 768;
        // 모바일 사양 고려 및 데스크탑 원복: 모바일은 최대 1.5배, 데스크탑은 1배(기본) 유지
        const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;

        canvas.width = dimensions.width * dpr;
        canvas.height = dimensions.height * dpr;
        canvas.style.width = `${dimensions.width}px`;
        canvas.style.height = `${dimensions.height}px`;

        let particlesArray: Particle[] = [];

        const textLines = isMobile ? ["Jidu", "Portfolio"] : ["Jidu Portfolio"];
        const verticalScale = 2.5;

        let fontSize = 0;
        if (isMobile) {
            fontSize = Math.min(dimensions.width * 0.16, dimensions.height * 0.2);
        } else {
            fontSize = Math.min(dimensions.width * 0.09, dimensions.height * 0.5);
        }
        const lineHeight = isMobile ? fontSize * 0.85 : fontSize * 0.9;

        // Draw Text for sampling
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.fillStyle = "white";
        // Retrieve the font family from the CSS variable, fallback to explicit Google Font name
        const fontFamily = getComputedStyle(document.body).getPropertyValue('--font-oswald').replaceAll('"', '').trim() || "Oswald";
        ctx.font = `900 ${fontSize}px "${fontFamily}", "Arial Narrow", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.scale(1, verticalScale);

        const scaledCanvasHeight = dimensions.height / verticalScale;
        // 모바일은 위로(-20), 데스크탑은 요청대로 아래로(+20) 살짝 위치 조정
        const startY = (scaledCanvasHeight - (lineHeight * textLines.length)) / 2 + (lineHeight / 2) + (isMobile ? -20 : 20);

        textLines.forEach((line, index) => {
            ctx.fillText(line, dimensions.width / 2, startY + (index * lineHeight));
        });
        ctx.restore();

        // After drawing text, we sample the pixel data (which is in real pixels)
        // Reset transform to 1:1 for getImageData and future rendering
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Star/Twinkle Logic
        // No global pulse state needed anymore

        const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        class ParticleClass implements Particle {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            size: number;
            density: number;
            color: string;
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

            constructor(x: number, y: number, isBackground = false) {
                this.x = x;
                this.y = y;
                this.baseX = x;
                this.baseY = y;
                this.isBackground = isBackground;
                // High-DPI에서 입자가 선명하고 뚜렷하게 보이도록 사이즈 보정
                this.size = isBackground ? (Math.random() * 1.5 + 0.5) * dpr : (isMobile ? 1.8 * dpr : 2);
                this.density = isBackground ? 0 : Math.random() * 40 + 5;
                this.color = "white";
                this.vx = (Math.random() - 0.5) * 15;
                this.vy = (Math.random() - 0.5) * 15;

                // 원본 투명도 수준으로 원복 (너무 과하지 않게)
                this.baseAlpha = isBackground ? Math.random() * 0.5 + 0.1 : Math.random() * 0.3 + 0.1;

                this.twinkleSpeed = Math.random() * 0.02 + 0.005;
                this.twinkleOffset = Math.random() * Math.PI * 2;
                this.floatOffset = Math.random() * Math.PI * 2;
                this.vortexAngle = Math.random() * Math.PI * 2;
                this.vortexRadius = Math.random() * (canvas ? canvas.width * 0.6 : 500);
                this.vortexSpeed = (50 / (this.vortexRadius + 10)) * (isBackground ? 0.05 : 0.1);
            }

            draw(time: number) {
                if (!ctx) return;
                // Use provided timestamp for stable twinkle
                const twinkle = Math.sin((time * this.twinkleSpeed * 0.02) + this.twinkleOffset);
                let alpha = this.baseAlpha + (twinkle * 0.15);

                if (Math.random() < 0.001) alpha = 1;

                if (mouse.current.x != null && mouse.current.y != null) {
                    const mx = mouse.current.x * dpr;
                    const my = mouse.current.y * dpr;
                    const mdx = mx - this.x;
                    const mdy = my - this.y;
                    if (mdx * mdx + mdy * mdy < 12000 * dpr * dpr) alpha = 1;
                }

                if (alpha < 0.1) alpha = 0.1;
                if (alpha > 1) alpha = 1;

                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update(time: number) {
                if (isExploding.current) {
                    if (!canvas) return;
                    const cx = canvas.width / 2;
                    const cy = canvas.height / 2;
                    this.vortexAngle += this.vortexSpeed;
                    const targetX = cx + Math.cos(this.vortexAngle) * this.vortexRadius;
                    const targetY = cy + Math.sin(this.vortexAngle) * this.vortexRadius;
                    this.x += (targetX - this.x) * 0.1;
                    this.y += (targetY - this.y) * 0.1;
                    return;
                }

                const mx = mouse.current.x != null ? mouse.current.x * dpr : -10000;
                const my = mouse.current.y != null ? mouse.current.y * dpr : -10000;
                const dx = mx - this.x;
                const dy = my - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = mouse.current.radius * dpr;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const directionX = (dx / distance) * force * this.density;
                    const directionY = (dy / distance) * force * this.density;
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    // Use provided timestamp (converted to seconds)
                    const sec = time * 0.001;
                    const floatX = Math.sin(sec + this.floatOffset) * 2 * dpr;
                    const floatY = Math.cos(sec * 0.8 + this.floatOffset) * 2 * dpr;

                    const targetX = this.baseX + floatX;
                    const targetY = this.baseY + floatY;

                    if (this.x !== targetX) {
                        this.x -= (this.x - targetX) / 15;
                    }
                    if (this.y !== targetY) {
                        this.y -= (this.y - targetY) / 15;
                    }
                }
            }
        }

        function init() {
            if (!canvas) return;
            particlesArray = [];

            // 1. Background Stars - 원본 개수로 원복 (최적화)
            const starCount = isMobile ? 100 : 250;
            for (let i = 0; i < starCount; i++) {
                const rx = Math.random() * canvas.width;
                const ry = Math.random() * canvas.height;
                particlesArray.push(new ParticleClass(rx, ry, true));
            }

            // 2. Text Particles - Gap 4로 원복하여 입자 수 조절 (퍼포먼스 확보)
            const gap = 4;
            for (let y = 0, y2 = textCoordinates.height; y < y2; y += gap) {
                for (let x = 0, x2 = textCoordinates.width; x < x2; x += gap) {
                    if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                        particlesArray.push(new ParticleClass(x, y, false));
                    }
                }
            }
        }

        let animationFrameId: number;

        function animate(time: number) {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].draw(time);
                particlesArray[i].update(time);
            }
            animationFrameId = requestAnimationFrame(animate);
        }

        init();
        animationFrameId = requestAnimationFrame(animate);

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            mouse.current.x = (event.clientX - rect.left) * scaleX;
            mouse.current.y = (event.clientY - rect.top) * scaleY;
        };
        const handleMouseLeave = () => { mouse.current.x = null; mouse.current.y = null; };
        const handleTouchMove = (event: TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            mouse.current.x = (event.touches[0].clientX - rect.left) * scaleX;
            mouse.current.y = (event.touches[0].clientY - rect.top) * scaleY;
        };
        const handleClick = () => { if (dimensions.width > 768) isExploding.current = !isExploding.current; };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
        canvas.addEventListener("touchstart", handleTouchMove, { passive: true });
        canvas.addEventListener("touchend", handleMouseLeave);
        canvas.addEventListener("click", handleClick);

        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            canvas.removeEventListener("touchmove", handleTouchMove);
            canvas.removeEventListener("touchstart", handleTouchMove);
            canvas.removeEventListener("touchend", handleMouseLeave);
            canvas.removeEventListener("click", handleClick);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [dimensions, fontLoaded]);

    return <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100vh", touchAction: "none" }} />;
};

export default ParticleTitle;
