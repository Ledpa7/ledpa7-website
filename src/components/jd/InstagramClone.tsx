import React from 'react';
import styles from './InstagramClone.module.css';
import { FaUserPlus, FaEllipsisH } from 'react-icons/fa';
import { BsGrid3X3, BsPersonSquare, BsPlayBtn } from 'react-icons/bs';
import { FaHeart, FaComment } from 'react-icons/fa';
import { TiPin } from 'react-icons/ti';

// Mock Data strictly following the screenshot logic
const PROFILE_DATA = {
    username: "microwave.30",
    name: "전자렌지30초",
    category: "음식점",
    bio: [
        "💖팔로우 하시고 매주 아이디어 얻어가세요",
        "💌광고/협업 DM",
        "@microwave.30"
    ],
    stats: {
        posts: 298,
        followers: 4290,
        following: 172
    },
    followedBy: "pa7led님이 팔로우합니다"
};

// Local Images provided by user, plus placeholders
const FEED_ITEMS = [
    { id: 1, image: '/jd/images/feed_0.png', pinned: true },
    { id: 2, image: '/jd/images/feed_1.png', pinned: true },
    { id: 3, image: '/jd/images/feed_2.png', pinned: true },
    { id: 4, image: '/jd/images/feed_3.png' },
    { id: 5, image: '/jd/images/feed_4.png' },
    { id: 6, image: '/jd/images/feed_5.png' },
    { id: 7, image: '/jd/images/feed_6.png' },
    { id: 8, image: '/jd/images/feed_7.png' },
    { id: 9, image: '/jd/images/feed_8.png' },
    { id: 10, image: '/jd/images/feed_9.png' },
    { id: 11, image: '/jd/images/feed_10.png' }, // New uploaded image 1
    { id: 12, image: '/jd/images/feed_11.png' }, // New uploaded image 2
];

const InstagramClone = () => {
    const [stats, setStats] = React.useState(PROFILE_DATA.stats);
    const [feedItems, setFeedItems] = React.useState(FEED_ITEMS);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/instagram?username=${PROFILE_DATA.username}`);
                if (res.ok) {
                    const data = await res.json();
                    // If using the proxy/api method
                    if (data.followers) {
                        setStats({
                            posts: data.posts || PROFILE_DATA.stats.posts,
                            followers: data.followers || PROFILE_DATA.stats.followers,
                            following: data.following || PROFILE_DATA.stats.following
                        });
                        console.log("Instagram stats synced:", data);
                        return;
                    }
                }
            } catch (e) {
                console.error("Instagram sync failed, using fallback.", e);
            }
        };

        fetchStats();

        // Keep a slow simulation for "alive" feel if sync fails or for micro-updates
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                followers: prev.followers + (Math.random() > 0.8 ? 1 : 0)
            }));
        }, 30000);

        return () => clearInterval(interval);
    }, []);
    return (
        <div className={styles.container}>
            {/* Header Section */}
            <div className={styles.header}>
                {/* Profile Image */}
                <div className={styles.profileImageContainer}>
                    <div className={styles.profileImageOuter}>
                        <div className={styles.profileImageInner}>
                            <img
                                src="/jd/images/mw_profile.png"
                                alt="microwave.30 profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Profile Info */}
                <div className={styles.info}>
                    {/* Top Row: Username & Buttons */}
                    <div className={styles.topRow} style={{ marginBottom: '0px' }}>
                        <h2 className={styles.username} style={{ fontWeight: 'bold' }}>{PROFILE_DATA.username}</h2>
                        <div className={styles.moreIcon}>
                            <FaEllipsisH size={24} />
                        </div>
                    </div>

                    {/* Name explicitly moved here as requested */}
                    <div className={styles.bioName} style={{ marginBottom: '12px' }}>{PROFILE_DATA.name}</div>

                    {/* Stats Row */}
                    <div className={styles.statsRow}>
                        <div className={styles.statItem}>
                            <span>게시물</span>
                            <span className={styles.statNumber}>{stats.posts.toLocaleString()}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span>팔로워</span>
                            <span className={styles.statNumber}>{stats.followers.toLocaleString()}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span>팔로우</span>
                            <span className={styles.statNumber}>{stats.following.toLocaleString()}</span>
                        </div>
                    </div>





                    {/* Bio Row */}
                    <div className={styles.bioSection}>
                        <div className={styles.category}>{PROFILE_DATA.category}</div>
                        {PROFILE_DATA.bio.map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Highlights Section */}

            {/* Tabs */}
            <div className={styles.tabs}>
                <div className={`${styles.tabItem} ${styles.tabActive}`}>
                    <BsGrid3X3 size={12} />
                    <span>게시물</span>
                </div>
                <div className={styles.tabItem}>
                    <BsPlayBtn size={12} />
                    <span>릴스</span>
                </div>
                <div className={styles.tabItem}>
                    <BsPersonSquare size={12} />
                    <span>태그됨</span>
                </div>
            </div>

            {/* Grid Feed */}
            <div className={styles.feedGrid}>
                {feedItems.map((item: any) => (
                    <div
                        key={item.id}
                        className={styles.feedItem}
                        style={{ backgroundColor: item.color || '#000' }}
                        onClick={() => window.open("https://www.instagram.com/microwave.30/", "_blank")}
                    >
                        {item.image && (
                            <img src={item.image} alt="feed" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        {item.pinned && (
                            <div className={styles.pinIcon}>
                                <TiPin />
                            </div>
                        )}
                        <div className={styles.hoverOverlay}>
                            <div className={styles.overlayStat}>
                                <FaHeart />
                                <span>{Math.floor(Math.random() * 500) + 100}</span>
                            </div>
                            <div className={styles.overlayStat}>
                                <FaComment />
                                <span>{Math.floor(Math.random() * 50) + 5}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InstagramClone;
