"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
    children: React.ReactNode;
    delay?: number; // Delay in seconds
    duration?: number; // Duration in seconds
    threshold?: number; // Intersection threshold (0~1)
    direction?: "up" | "down" | "none";
    className?: string;
    style?: React.CSSProperties;
};

const FadeIn = ({
    children,
    delay = 0,
    duration = 0.8,
    threshold = 0.1,
    direction = "up",
    className = "",
    style = {},
}: Props) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(element); // Trigger once
                }
            },
            { threshold }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, [threshold]);

    const getTransform = () => {
        if (direction === "up") return "translate3d(0, 40px, 0)";
        if (direction === "down") return "translate3d(0, -40px, 0)";
        return "none";
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translate3d(0, 0, 0)" : getTransform(),
                transition: `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1), transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1)`,
                transitionDelay: `${delay}s`,
                willChange: "opacity, transform",
                ...style,
            }}
        >
            {children}
        </div>
    );
};

export default FadeIn;
