import React from 'react';
import { motion } from 'framer-motion';
import Topbar from './Component/topbar/topbar';
import FoodSlider from './Hero Section';
import WhyChooseUs from './Component/WhyChooseUs';
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
          <WhyChooseUs />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
