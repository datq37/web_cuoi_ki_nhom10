import React from 'react';
import { motion } from 'framer-motion';
import Topbar from './Component/topbar/topbar';
import Banner from './Banner/banner';
import FoodSlider from './Hero Section';
import ContentSection from './Content';
import Footer from './Component/footer';
import './index.less';

const HomePage: React.FC = () => {
  const revealVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  return (
    <div className="home-page-container">
      <Topbar />
      <main>
        <Banner />
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={revealVariants}
        >
          <FoodSlider />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={revealVariants}
        >
          <ContentSection />
        </motion.div>

        {/* Các phần khác của trang chủ sẽ được thêm vào đây sau */}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
