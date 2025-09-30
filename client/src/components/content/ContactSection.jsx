import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt  } from 'react-icons/fa';
import PranaySir from '../../assets/pranaySir.webp';
import RajSir from '../../assets/rajSir.webp';
import { fadeInUp, containerVariants, itemVariants, THEME } from "./constants";

export default function ContactSection() {
  const [activeCard, setActiveCard] = useState(null);

  const handleCardClick = (cardId) => {
    // Only handle clicks on mobile (touch devices)
    if (window.innerWidth <= 768) {
      setActiveCard(activeCard === cardId ? null : cardId);
    }
  };

  return (
    <motion.section
      className="w-full py-16 md:py-20 rounded-2xl md:rounded-3xl shadow-inner overflow-hidden"
      style={{ backgroundImage: `linear-gradient(135deg, ${THEME.gradientStart}, ${THEME.gradientEnd})` }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
    >
      <div className="w-full px-4 sm:px-6 md:px-8">
        <motion.div className="w-full text-center mb-10 md:mb-12" variants={fadeInUp}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: THEME.primary }}>
            Contact Information
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Get in touch with our team for any questions or support
          </p>
        </motion.div>

        <motion.div
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-40 justify-center items-start max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div
            className="w-full rounded-3xl shadow-md text-center group overflow-hidden cursor-pointer"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 15px 30px -5px rgba(0,0,0,0.1)" }}
            onClick={() => handleCardClick('pranay')}
          >
            <div className="w-full relative aspect-[4/4] mt-1">
              <img
                src={PranaySir}
                alt="Hackathon Manager"
                className="w-full h-full object-cover"
              />
              <motion.div
                className={`absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/95 via-black/80 to-transparent transition-opacity duration-300 flex items-end justify-center
                  ${activeCard === 'pranay' ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-white text-center px-4 pb-4">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    Pranay K Das
                  </h3>
                  <p className="text-base md:text-lg mb-3 opacity-90">
                    Hackathon Manager
                  </p>
                  <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-2">
                    <FaPhoneAlt className="text-lg" />
                    <a href="tel:+917566106266" className="hover:text-blue-300 transition-colors text-sm md:text-base">
                      +91 75661 06266
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="w-full rounded-3xl shadow-md text-center group overflow-hidden cursor-pointer"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 15px 30px -5px rgba(0,0,0,0.1)" }}
            onClick={() => handleCardClick('raj')}
          >
            <div className="w-full relative aspect-[4/4] mt-1">
              <img
                src={RajSir}
                alt="Hackathon Coordinator"
                className="w-full h-full object-cover"
              />
              <motion.div
                className={`absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/95 via-black/80 to-transparent transition-opacity duration-300 flex items-end justify-center
                  ${activeCard === 'raj' ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-white text-center px-4 pb-4">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    Raj Vardhan
                  </h3>
                  <p className="text-base md:text-lg mb-3 opacity-90">
                    Hackathon Coordinator
                  </p>
                  <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-2">
                    <FaPhoneAlt className="text-lg" />
                    <a href="tel:+917340862969" className="hover:text-blue-300 transition-colors text-sm md:text-base">
                      +91 73408 62969
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}