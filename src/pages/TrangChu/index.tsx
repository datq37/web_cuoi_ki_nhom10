import React from 'react';
import { useModel } from 'umi';
import { motion } from 'framer-motion';
import Topbar from './Component/topbar/topbar';
import FeaturedMenu from './Component/FeaturedMenu';
import WhyChooseUs from './Component/WhyChooseUs';
import Footer from './Component/footer';
import './index.less';

// phần trang chủ
const HomePage: React.FC = () => {
  // phần lấy giao diện sáng tối
  const { theme } = useModel('KhachHang.GlobalState.index');

  // phần hiệu ứng hiện nội dung
  const revealVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  // phần giao diện chính
  return (
    <div className={`home-page-container theme-${theme}`}>
      <Topbar />
      <main>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={revealVariants}
        >
          <FeaturedMenu />
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
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={revealVariants}
      >
        <Footer />
      </motion.div>
    </div>
  );
};

export default HomePage;
