import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, THEME } from "./constants";
import { Link } from "react-router-dom";








export default function RegistrationCTASection() {

  return (
    <motion.section
      className="w-full py-16 md:py-20 bg-[#0B2A4A] text-white text-center rounded-2xl md:rounded-3xl shadow-xl relative overflow-hidden mt-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
    >
      {/* subtle animated shapes */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1/2 bg-white opacity-5"
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20"
        style={{ background: THEME.accent }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-20"
        style={{ background: THEME.accent }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />

      <div className="w-full relative z-10 px-4 sm:px-6">
        <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" variants={fadeInUp}>
          Ready to Join Nav Kalpana?
        </motion.h2>
        <motion.p className="text-lg md:text-xl mb-8 md:mb-10 max-w-3xl mx-auto opacity-90" variants={fadeInUp} transition={{ delay: 0.2 }}>
          Don't miss this incredible opportunity to showcase your skills, compete for ₹40,000 in prizes, and build the future of technology!
        </motion.p>

        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8" variants={fadeInUp} transition={{ delay: 0.4 }}>
          <Link to="/register">
            <motion.button
              className="bg-white text-[#0B2A4A] hover:bg-gray-100 font-bold py-3 px-6 md:py-4 md:px-8 rounded-lg shadow-lg text-sm md:text-base"
              whileHover={{ y: -5, scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.95 }}
              aria-label="Register Now - ₹1,500"
            >
              Register Now
            </motion.button>
          </Link>

        </motion.div>

        <motion.p className="text-sm opacity-80" variants={fadeInUp} transition={{ delay: 0.6 }}>
          Registration fee: ₹1,500 (Non-refundable) | Team alterations allowed until Feb 25, 2026, 11:59 PM IST
        </motion.p>
      </div>
    </motion.section>
  );
}