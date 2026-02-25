import React from 'react';
import styles from './DeadGearDesign.module.css';
import MagnifiedImage from './MagnifiedImage';

const DeadGearDesign = () => {
    return (
        <div className={styles.container}>
            {/* Header / Intro */}
            <div className={styles.header}>
                <div className={styles.topLabel}>01ARDUINO</div>
                <h1 className={styles.title}>
                    Dead Gear
                    <br />
                    <span className={styles.subtitle}>: Save the Dead Gear</span>
                </h1>
                <p className={styles.introText}>
                    현대자동차에서 주최하는 '예술과 기술, 스타트업의 경계를 허무는 <span className={styles.highlight}>2018 제로원데이</span>' 축제에서
                    <br />
                    관람객들이 <span className={styles.highlight}>축제를 즐기고, 참여를 유도하는</span> 프로젝트를 진행하였습니다.
                </p>
            </div>

            {/* Portfolio Pages */}
            <div className={styles.pagesContainer}>
                <MagnifiedImage src="/jd/images/deadgear_page_08.jpg" alt="Dead Gear Page 8" className={styles.pageImage} magSize={250} zoom={2} />
                <a href="https://www.youtube.com/watch?v=LACadr9oxiQ" target="_blank" rel="noopener noreferrer" style={{ display: 'block', cursor: 'pointer' }}>
                    <MagnifiedImage src="/jd/images/deadgear_page_09.jpg" alt="Dead Gear Page 9" className={styles.pageImage} magSize={250} zoom={2} />
                </a>
            </div>
        </div>
    );
};

export default DeadGearDesign;
