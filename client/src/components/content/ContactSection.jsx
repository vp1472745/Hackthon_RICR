import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt } from 'react-icons/fa';
import PranaySir from '../../assets/pranaySir.webp';
import RajSir from '../../assets/rajSir.webp';
import { fadeInUp, containerVariants, itemVariants, THEME } from "./constants";

export default function ContactSection() {
  const [activeCard, setActiveCard] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  // update isMobile on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCardClick = (cardId) => {
    // On mobile we toggle (useful if you want to collapse)
    if (isMobile) {
      setActiveCard((prev) => (prev === cardId ? null : cardId));
    }
    // On desktop clicks do nothing (hover will handle it)
  };

  // helper to show overlay (used for animate prop)
  const isVisible = (cardId) => activeCard === cardId || isMobile;

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
          {/* Pranay Card */}
          <motion.div
            className="w-full rounded-3xl shadow-md text-center group overflow-hidden cursor-pointer"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 15px 30px -5px rgba(0,0,0,0.1)" }}
            onClick={() => handleCardClick('pranay')}
            onMouseEnter={() => !isMobile && setActiveCard('pranay')}
            onMouseLeave={() => !isMobile && setActiveCard(null)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick('pranay'); }}
          >
            <div className="w-full relative aspect-[4/4] mt-1">
              <img
                src={PranaySir}
                alt="Hackathon Manager"
                className="w-full h-full object-cover"
              />

              {/* overlay: animate opacity based on activeCard OR isMobile */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex items-end justify-center"
                animate={{ opacity: isVisible('pranay') ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ pointerEvents: isVisible('pranay') ? 'auto' : 'none' }}
                aria-hidden={!isVisible('pranay')}
              >
                <div className="text-white text-center px-4 pb-4">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Pranay K Das</h3>
                  <p className="text-base md:text-lg mb-3 opacity-90">Hackathon Manager</p>
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

          {/* Raj Card */}
          <motion.div
            className="w-full rounded-3xl shadow-md text-center group overflow-hidden cursor-pointer"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 15px 30px -5px rgba(0,0,0,0.1)" }}
            onClick={() => handleCardClick('raj')}
            onMouseEnter={() => !isMobile && setActiveCard('raj')}
            onMouseLeave={() => !isMobile && setActiveCard(null)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick('raj'); }}
          >
            <div className="w-full relative aspect-[4/4] mt-1">
              <img
                src={RajSir}
                alt="Hackathon Coordinator"
                className="w-full h-full object-cover"
              />

              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex items-end justify-center"
                animate={{ opacity: isVisible('raj') ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ pointerEvents: isVisible('raj') ? 'auto' : 'none' }}
                aria-hidden={!isVisible('raj')}
              >
                <div className="text-white text-center px-4 pb-4">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Raj Vardhan</h3>
                  <p className="text-base md:text-lg mb-3 opacity-90">Hackathon Coordinator</p>
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
