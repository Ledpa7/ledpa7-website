import React, { Suspense, useRef, useEffect, useState, lazy } from "react";
import styles from "./JDPortfolio.module.css";
import FadeIn from "../components/jd/FadeIn";

const ParticleTitle = lazy(() => import("../components/jd/ParticleTitle"));
const TableOfContents = lazy(() => import("../components/jd/TableOfContents"));
const ProjectSection = lazy(() => import("../components/jd/ProjectSection"));
const ClickSpark = lazy(() => import("../components/jd/ClickSpark"));
const TiltCard = lazy(() => import("../components/jd/TiltCard"));
import { portfolioData } from "../data/jd/portfolio";
import "./JDGlobal.css";
import CustomCursor from "../components/jd/CustomCursor";
import InteractiveStarBackground from "../components/jd/InteractiveStarBackground";

export default function Home() {
  return (
    <div className="jd-portfolio-wrapper">
      <InteractiveStarBackground />
      <div className={styles.container}>
        <CustomCursor />
        <ClickSpark />
        <TableOfContents />

        <main className={styles.main}>
          {/* Hero Section */}
          <section id="hero" className={styles.hero}>
            <ParticleTitle />
          </section>

          {/* About Section */}
          <section id="about" className={`${styles.section} ${styles.aboutSection}`}>
            <FadeIn>
              <h2 className={styles.sectionTitle} style={{ color: 'var(--accent-primary)' }}>Profile</h2>
            </FadeIn>

            <div className={styles.aboutContent}>
              {/* Profile Image Area */}
              <div className={styles.profileImageArea}>
                <FadeIn delay={0.2}>
                  <TiltCard
                    max={15}
                    scale={1.05}
                    className={styles.profileImageWrapper}
                  >
                    <img
                      src="/jd/profile.jpg"
                      alt="Jung Jidu"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                    />
                  </TiltCard>
                </FadeIn>
              </div>

              {/* Basic Profile Info Area */}
              <div className={styles.profileBasicArea}>
                <FadeIn delay={0.4}>
                  <h3 className={styles.profileName}>
                    {portfolioData.about.koreanName}
                    <span className={styles.profileSubName}>{portfolioData.about.name}</span>
                  </h3>
                  <div className={styles.profileDetails}>
                    <span>{portfolioData.about.birthDate}</span>
                    <span>{portfolioData.about.phone}</span>
                    <span>{portfolioData.about.email}</span>
                  </div>
                </FadeIn>
              </div>

              {/* Profile Description Area */}
              <div className={styles.profileDescArea}>
                <FadeIn delay={0.5}>
                  <p className={styles.profileDescription}>
                    {portfolioData.about.description}
                  </p>
                </FadeIn>
              </div>
            </div>

            {/* Skills & Awards Mini Grid */}
            <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
              <FadeIn delay={0.6}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', color: 'var(--accent-primary)' }}>Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {portfolioData.skills.map((skill) => (
                    <span key={skill} style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '4px 12px',
                      borderRadius: '100px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </FadeIn>
              <FadeIn delay={0.7}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', color: 'var(--accent-primary)' }}>Awards & Certificates</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {portfolioData.awards.map((award, i) => (
                    <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--text-secondary)', marginRight: '8px', fontWeight: 600 }}>{award.year}</span>
                      {award.title}
                    </li>
                  ))}
                  {portfolioData.certificates.map((cert, i) => (
                    <li key={`cert-${i}`} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      - {cert}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className={styles.section}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'start' }}>
              {/* Education Group */}
              <FadeIn delay={0.2}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px', color: 'var(--accent-primary)' }}>Education</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {portfolioData.education.map((edu, index) => (
                    <li key={index} style={{ paddingBottom: '16px', borderBottom: index !== portfolioData.education.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{edu.school}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{edu.period}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {edu.major}
                      </p>
                    </li>
                  ))}
                </ul>
              </FadeIn>

              {/* Experience Group */}
              <FadeIn delay={0.4}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px', color: 'var(--accent-primary)' }}>Work Experience</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {portfolioData.experience.map((exp, index) => (
                    <li key={index} style={{ paddingBottom: '16px', borderBottom: index !== portfolioData.experience.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>
                          {exp.company}
                          {exp.rank && <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400 }}> / {exp.rank}</span>}
                        </h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{exp.period}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {exp.role}
                      </p>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>
          </section>

          {/* Project Section */}
          <section id="projects" className={`${styles.section} ${styles.projectsSection}`} style={{ paddingLeft: 0, paddingRight: 0, maxWidth: '100%' }}>
            <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px' }}>
              <FadeIn>
                <Suspense fallback={<div>Loading Projects...</div>}>
                  <ProjectSection />
                </Suspense>
              </FadeIn>
            </div>
          </section>

          {/* Works Section (Development Projects as List) */}
          <section id="works" className={`${styles.section} ${styles.worksSection}`}>
            <FadeIn>
              <h2 className={styles.sectionTitle}>Works</h2>
              <WorksList />
            </FadeIn>
          </section>

          {/* Contact Section */}
          <section id="contact" className={styles.section}>
            <FadeIn>
              <h2 className={styles.sectionTitle}>Contact</h2>
              <p style={{ maxWidth: "600px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "32px", fontSize: "0.85rem" }}>
                새로운 가치를 만드는 일에 언제나 열려있습니다.<br />
                +82 10 9077 1261 / wjdwlen@naver.com
              </p>
              <a href={`mailto:${portfolioData.about.email}`} className={styles.ctaButton} style={{ color: '#1a1a1a' }}>
                Send Email
              </a>
            </FadeIn>
          </section>
        </main>

        <footer className={styles.footer}>
          © {new Date().getFullYear()} Jung Jidu. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

const WorksList = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      className={styles.worksList}
      ref={containerRef}
      onScroll={handleScroll}
    >
      {portfolioData.categories
        .find(cat => cat.id === 'development')
        ?.subcategories.map((sub, sIdx) => (
          <div key={sIdx} className={styles.worksCategory}>
            <h3 className={styles.worksCategoryTitle}>{sub.title}</h3>
            {sub.projects.map((proj, pIdx) => (
              <WorksListItem
                key={pIdx}
                proj={proj}
                containerRef={containerRef}
                scrollTop={scrollTop}
              />
            ))}
          </div>
        ))}
    </div>
  );
};

const WorksListItem = ({ proj, containerRef, scrollTop }: any) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [leftStyle, setLeftStyle] = useState<React.CSSProperties>({});
  const [rightStyle, setRightStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!containerRef.current || !itemRef.current) return;

    const container = containerRef.current;
    const item = itemRef.current;

    const containerHeight = container.offsetHeight;
    const itemCenter = item.offsetTop - container.offsetTop + (item.offsetHeight / 2);
    const containerCenter = container.scrollTop + (containerHeight / 2);

    const dist = Math.abs(containerCenter - itemCenter);
    const maxDist = containerHeight / 1.5;

    const factor = Math.min(1, dist / maxDist);
    const active = 1 - factor;

    const grayVal = Math.round(68 + (255 - 68) * active);
    const colorStr = `rgb(${grayVal}, ${grayVal}, ${grayVal})`;

    setStyle({
      transform: `scale(${0.9 + (active * 0.1)})`, // 전체 스케일 유지
      opacity: 0.4 + (active * 0.6),
      color: colorStr,
      transition: 'transform 0.3s ease, opacity 0.3s ease, color 0.2s ease'
    });

    const isMobile = window.innerWidth < 768;
    // 모바일은 세로로 합쳐졌으므로 수평 수렴 효과를 0으로 (정렬 유지), 데스크탑은 40px 유지
    const moveDist = isMobile ? 0 : 40;

    // 센터 기준으로 텍스트들이 서로를 향해 모여드는 효과 (수렴)
    setLeftStyle({
      transform: `translateX(${active * moveDist}px)`,
      transition: 'transform 0.4s ease'
    });
    setRightStyle({
      transform: `translateX(${-active * moveDist}px)`,
      transition: 'transform 0.4s ease'
    });
  }, [scrollTop, containerRef]);

  return (
    <div ref={itemRef} className={styles.worksItem} style={style}>
      <div className={styles.worksInfo} style={leftStyle}>
        <span className={styles.worksProjectTitle} style={{ color: 'inherit' }}>{proj.title}</span>
        <span className={styles.worksRole} style={{ color: 'inherit', opacity: 0.8 }}>{proj.description}</span>
      </div>
      <span className={styles.worksDate} style={{ ...rightStyle, color: 'inherit' }}>{proj.period}</span>
    </div>
  );
};
