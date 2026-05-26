import React, { useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './index.less';
import { foodData } from '@/services/Trangchu/herosection';

const FoodSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === foodData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? foodData.length - 1 : prevIndex - 1
    );
  };

  const activeFood = foodData[currentIndex];

  // All other items except current
  const thumbnails = [
    ...foodData.slice(currentIndex + 1),
    ...foodData.slice(0, currentIndex)
  ];

  return (
    <div className={styles.sliderContainer}>
      <AnimatePresence>
        <motion.img 
          key={activeFood.id}
          layoutId={`image-${activeFood.id}`}
          className={styles.backgroundImage}
          src={activeFood.image}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </AnimatePresence>
      
      <div className={styles.overlay} />

      <div className={styles.contentWrapper}>
        <div className={styles.topTitle}>Thực đơn nổi bật</div>
        <div className={styles.leftContent}>
          <h1 className={styles.foodName}>{activeFood.name}</h1>
          <p className={styles.description}>{activeFood.description}</p>
        </div>

        <div className={styles.rightContent}>
          <div className={styles.thumbnailsWrapper}>
            {thumbnails.slice(0, 3).map((item) => (
              <div 
                key={item.id} 
                className={styles.thumbnailCard}
                onClick={() => setCurrentIndex(foodData.findIndex(f => f.id === item.id))}
              >
                <motion.img 
                  layoutId={`image-${item.id}`}
                  src={item.image} 
                  alt={item.name} 
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                <div className={styles.thumbnailInfo}>
                  <h5>{item.name.replace('\n', ' ')}</h5>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.bottomControls}>
            <div className={styles.navigationButtons}>
              <button onClick={prevSlide} className={styles.navBtn}>
                <LeftOutlined />
              </button>
              <button onClick={nextSlide} className={styles.navBtn}>
                <RightOutlined />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodSlider;
