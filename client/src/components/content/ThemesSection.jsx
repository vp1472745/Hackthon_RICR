import React from "react";
import { motion } from "framer-motion";
import { 
  FaRobot, 
  FaLeaf, 
  FaBitcoin, 
  FaHospital
} from 'react-icons/fa';
import { SectionHeader } from "./SharedComponents";
import { containerVariants, itemVariants, iconHoverVariants, THEME } from "./constants";

const THEMES = [
  {
    icon: <FaRobot />,
    title: "AI & Machine Learning",
    description:
      "Develop intelligent solutions using artificial intelligence, machine learning, and deep learning technologies to solve real-world problems.",
  },
  {
    icon: <FaLeaf />,
    title: "Sustainable Technology",
    description:
      "Create eco-friendly solutions that promote sustainability, renewable energy, and environmental conservation through technology.",
  },
  {
    icon: <FaBitcoin />,
    title: "FinTech Innovation",
    description:
      "Build revolutionary financial technology solutions including blockchain, digital payments, and innovative banking systems.",
  },
  {
    icon: <FaHospital />,
    title: "HealthTech Solutions",
    description:
      "Develop healthcare innovations that improve patient care, medical diagnosis, and healthcare accessibility through technology.",
  },
];

export default function ThemesSection() {
  return (
    <section className="w-full py-16 md:py-20">
      <SectionHeader
        title="Hackathon Themes"
        subtitle="Choose from exciting themes and build innovative solutions that can make a real impact"
      />

      <motion.div
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {THEMES.map((t, idx) => (
          <motion.article
            key={idx}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 group cursor-pointer"
            variants={itemVariants}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4 mb-5">
              <motion.div className="text-3xl md:text-4xl text-[#0B2A4A]" variants={iconHoverVariants}>
                {t.icon}
              </motion.div>
              <h3 className="text-xl md:text-2xl font-bold" style={{ color: THEME.primary }}>
                {t.title}
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{t.description}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}