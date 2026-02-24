"use client";

import React, { useEffect, useState } from "react";
import styles from "./TableOfContents.module.css";

const sections = [
    { id: "hero", label: "Intro" },
    { id: "about", label: "Profile" },
    { id: "projects", label: "Project" },
    { id: "works", label: "Works" },
];

const TableOfContents = () => {
    const [activeId, setActiveId] = useState("");

    useEffect(() => {
        // Find the custom scroll container (styles.container in page.tsx)
        const scrollContainer = document.getElementById("hero")?.closest('div[class*="container"]');
        const targetContainer = scrollContainer || window;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                // Custom scroll container가 있을 경우 root로 설정
                root: scrollContainer instanceof HTMLElement ? scrollContainer : null,
                rootMargin: "-20% 0px -70% 0px", // 화면 상단 20~30% 지점에 왔을 때 활성화
                threshold: 0
            }
        );

        sections.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        // 스크롤이 끝까지 내려갔을 때 마지막 항목(works) 강제 활성화
        const handleScroll = () => {
            const el = scrollContainer instanceof HTMLElement ? scrollContainer : document.documentElement;
            const scrollPos = el.scrollTop + el.clientHeight;
            const totalHeight = el.scrollHeight;

            if (scrollPos >= totalHeight - 100) {
                setActiveId("works");
            }
        };

        targetContainer.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            observer.disconnect();
            targetContainer.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <aside className={styles.toc}>
            <div className={styles.line} />
            <ul className={styles.list}>
                {sections.map(({ id, label }) => (
                    <li key={id} className={`${styles.item} ${activeId === id ? styles.active : ""}`}>
                        <a href={`#${id}`} className={styles.link}>
                            <span className={styles.dot} />
                            <span className={styles.label}>{label}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default TableOfContents;
