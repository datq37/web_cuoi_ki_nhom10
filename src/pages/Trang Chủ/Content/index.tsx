import React, { useState } from 'react';
import styles from './index.less';
import { contentData } from '@/services/Trangchu/content';

// phần nội dung giới thiệu
const ContentSection: React.FC = () => {
  // phần trạng thái tab đang chọn
  const [activeId, setActiveId] = useState('thuantien');

  // phần dữ liệu đang hiển thị
  const activeIndex = contentData.findIndex((item) => item.id === activeId);
  const activeContent = contentData[activeIndex];

  // phần giao diện chính
  return (
    <section className={styles.contentSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Vì Sao Chọn Chúng Tôi?</h2>
        
        <div className={styles.navContainer}>
          <div className={styles.navBar}>
            <div 
              className={styles.navIndicator} 
              style={{ transform: `translateX(${activeIndex * 100}%)` }}
            />
            {contentData.map((item) => (
              <button
                key={item.id}
                className={`${styles.navItem} ${activeId === item.id ? styles.active : ''}`}
                onClick={() => setActiveId(item.id)}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {activeContent && (
          <div key={activeId} className={styles.contentBody}>
            <div className={styles.imageWrapper}>
              <img src={activeContent.image} alt={activeContent.title} className={styles.image} />
            </div>
            <div className={styles.divider}></div>
            <div className={styles.textWrapper}>
              <h3 className={styles.contentTitle}>{activeContent.title}</h3>
              <p className={styles.description}>{activeContent.description}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContentSection;
