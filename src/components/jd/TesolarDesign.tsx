import React from 'react';
import styles from './TesolarDesign.module.css';
import FadeIn from './FadeIn';
import MagnifiedImage from './MagnifiedImage';

const TesolarDesign = () => {
    return (
        <div className={styles.container}>
            {/* Header / Intro */}
            <div className={styles.header}>
                <div className={styles.topLabel}>01 Arduino</div>
                <h1 className={styles.title}>
                    Tesolar
                    <br />
                    <span className={styles.subtitle}>: What if Tesla made the lights?</span>
                </h1>
                <p className={styles.introText}>
                    ['특정 브랜드가 어떤 제품을 출시한다.'] 라는 가정하에 임의로 정한 <span className={styles.highlight}>브랜드를 조사</span>하고
                    <span className={styles.highlight}>키워드를 도출</span>하여, <br />해당 브랜드의 제품화하는 <span className={styles.highlight}>커머셜 프로토타입</span> 프로젝트(Team)입니다.
                </p>
            </div>

            {/* Portfolio Pages */}
            <div className={styles.pagesContainer}>

                <MagnifiedImage src="/jd/images/tesolar_page_03.jpg" alt="Tesolar Page 3" className={styles.pageImage} magSize={250} zoom={2} />
                <MagnifiedImage src="/jd/images/tesolar_page_04.jpg" alt="Tesolar Page 4" className={styles.pageImage} magSize={250} zoom={2} />
                <MagnifiedImage src="/jd/images/tesolar_page_05.jpg" alt="Tesolar Page 5" className={styles.pageImage} magSize={250} zoom={2} />
                <a href="https://youtu.be/MqtvQ8aDk6U" target="_blank" rel="noopener noreferrer" style={{ display: 'block', cursor: 'pointer' }}>
                    <MagnifiedImage src="/jd/images/tesolar_page_06.jpg" alt="Tesolar Page 6" className={styles.pageImage} magSize={250} zoom={2} />
                </a>
            </div>
        </div>
    );
};

export default TesolarDesign;
