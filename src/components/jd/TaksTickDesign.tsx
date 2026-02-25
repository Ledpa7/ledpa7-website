import React from 'react';
import styles from './TaksTickDesign.module.css';
import MagnifiedImage from './MagnifiedImage';

const TaksTickDesign = () => {
    return (
        <div className={styles.container}>
            {/* Header / Intro */}
            <div className={styles.header}>
                <div className={styles.topLabel}>02 Service & Product</div>
                <h1 className={styles.title}>
                    Taks Tick
                    <br />
                    <span className={styles.subtitle}>: Golf Training is Fun Anytime, Anywhere</span>
                </h1>
                <p className={styles.introText}>
                    '행복골프훈련소'와 같이 골프 훈련소의 문제점을 발견하여, <span className={styles.highlight}>새로운 회원의 접근성</span>을 높이고 <br /><span className={styles.highlight}>재방문</span> 할 수 있도록 <span className={styles.highlight}>사용자 경험을 설계</span>하는 프로젝트입니다.
                </p>
            </div>

            {/* Portfolio Pages */}
            <div className={styles.pagesContainer}>
                <MagnifiedImage src="/jd/images/takstick_page_17.jpg" alt="Taks Tick Page 17" className={styles.pageImage} magSize={250} zoom={2} />
                <MagnifiedImage src="/jd/images/takstick_page_18.jpg" alt="Taks Tick Page 18" className={styles.pageImage} magSize={250} zoom={2} />
                <MagnifiedImage src="/jd/images/takstick_page_19.jpg" alt="Taks Tick Page 19" className={styles.pageImage} magSize={250} zoom={2} />
                <MagnifiedImage src="/jd/images/takstick_page_20.jpg" alt="Taks Tick Page 20" className={styles.pageImage} magSize={250} zoom={2} />
                <MagnifiedImage src="/jd/images/takstick_page_21.jpg" alt="Taks Tick Page 21" className={styles.pageImage} magSize={250} zoom={2} />
            </div>
        </div>
    );
};

export default TaksTickDesign;
