// Shared components for the content page
import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, itemVariants, iconHoverVariants, THEME } from "./constants";

/* -------------------------
   SHARED COMPONENTS
   -------------------------*/
export function SectionHeader({ title, subtitle }) {
  return (
    <motion.header
      className="text-center mb-12 md:mb-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ color: THEME.primary }}>
        {title}
      </h2>
      {subtitle && <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">{subtitle}</p>}
    </motion.header>
  );
}

export function FeatureCard({ icon, title, description }) {
  return (
    <motion.article
      className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 group"
      variants={itemVariants}
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-4xl md:text-5xl mb-5 md:mb-6 flex justify-center text-[#0B2A4A]" variants={iconHoverVariants} aria-hidden>
        {icon}
      </motion.div>
      <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-center" style={{ color: THEME.primary }}>
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed text-center">{description}</p>
    </motion.article>
  );
}

export function InfoCard({ icon, heading, children }) {
  return (
    <motion.div variants={itemVariants} className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0B2A4A] flex items-center justify-center text-white"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl md:text-2xl font-bold" style={{ color: THEME.primary }}>
          {heading}
        </h3>
      </div>

      <motion.div
        className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100"
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}