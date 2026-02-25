import React from 'react';
import styles from './TrayLightDesign.module.css';
import MagnifiedImage from './MagnifiedImage';

const TrayLightDesign = () => {
    return (
        <div className={styles.container}>
            {/* Header / Intro */}
            <div className={styles.header}>
                <div className={styles.topLabel}>02 Service & Product</div>
                <h1 className={styles.title}>
                    Tray Light
                    <br />
                    <span className={styles.subtitle}>: Millennial's More Familiar Space</span>
                </h1>
                <p className={styles.introText}>
                    <span className={styles.highlight}>1가구</span>가 증가하는 사회적 현상과 주를 이루는 세대들이 <span className={styles.highlight}>추구하는 가치</span>를 발견하고 <br />어떻게 제공할 수 있는지에 대한 <span className={styles.highlight}>결과를 도출하는 프로젝트</span>입니다.
                </p>
            </div>

            {/* Portfolio Pages */}
            <div className={styles.pagesContainer}>
                <MagnifiedImage src="/jd/images/traylight_page_11.jpg" alt="Tray Light Page 11" className={styles.pageImage} magSize={250} zoom={2} />
                <MagnifiedImage src="/jd/images/traylight_page_12.jpg" alt="Tray Light Page 12" className={styles.pageImage} magSize={250} zoom={2} />
                <MagnifiedImage src="/jd/images/traylight_page_13.jpg" alt="Tray Light Page 13" className={styles.pageImage} magSize={250} zoom={2} />
                <MagnifiedImage src="/jd/images/traylight_page_14.jpg" alt="Tray Light Page 14" className={styles.pageImage} magSize={250} zoom={2} />
                <MagnifiedImage src="/jd/images/traylight_page_15.jpg" alt="Tray Light Page 15" className={styles.pageImage} magSize={250} zoom={2} />
            </div>
        </div>
    );
};

export default TrayLightDesign;
