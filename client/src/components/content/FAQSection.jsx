import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaMinus } from 'react-icons/fa';
import { fadeInUp, containerVariants, itemVariants, THEME } from "./constants";

const FAQS = [
  {
    question: "Who can register?",
    answer: "Any student or professional team leader can register for the hackathon. Each team must have a minimum of 1 member (Team Leader) and can have up to 4 members in total."
  },
  {
    question: "How many members are allowed per team?",
    answer: "Minimum: 1 , Maximum: 4 (Team Leader + up to 3 members)"
  },
  {
    question: "Until when can teams be updated or altered?",
    answer: "Team alterations are allowed until November 6, 2025, 11:59 PM IST. After this deadline, no changes will be permitted."
  },
  {
    question: "Can one person be part of multiple teams?",
    answer: "No"
  },
  {
    question: "Should each team member's email be unique?",
    answer: "Yes. Each email must be unique in the registration system. If an email already exists in the database, registration will be blocked."
  },
  {
    question: "What is the registration fee?",
    answer: "The registration fee is ₹1,500 (non-refundable). Payment must be made via the provided QR code."
  },
  {
    question: "How should the payment receipt be submitted?",
    answer: "After completing the QR payment, upload a transaction screenshot (JPEG/PNG) where the UTR/transaction reference number is clearly visible."
  },
  {
    question: "How long does payment verification take?",
    answer: "Verification will take place within 24 hours (manual review by the admin). The initial payment status will remain 'Pending' until verification. Once confirmed, the status will be updated to 'Confirmed.'"
  },
  {
    question: "What happens if the payment is rejected?",
    answer: "You will receive a rejection email with the reason (e.e., invalid UTR). If allowed, you may re-submit the payment receipt."
  },
  {
    question: "Where can teams log in?",
    answer: "Teams can log in at /hackathon-login using their Team ID and password. A CAPTCHA will also be required for security."
  },
  {
    question: "When will the Team ID and password be provided?",
    answer: "After payment verification, the admin will confirm registration, update the database, and send an email containing: Team ID (HACK-XXXX format) and auto-generated password (8–12 alphanumeric characters)."
  },
  {
    question: "Until when can teams edit their dashboard details?",
    answer: "Teams can edit their details only during the alteration window (until November 6, 2025, 11:59 PM IST). After this, edits will be disabled."
  }
];

function FAQItem({ question, answer, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-gray-200 py-5"
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <div
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg md:text-xl font-semibold mb-2 pr-4" style={{ color: THEME.primary }}>
          {index + 1}. {question}
        </h3>
        <motion.div
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <FaMinus className="text-gray-600" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaPlus className="text-gray-600" />
            </motion.div>
          )}
        </motion.div>
      </div>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="text-gray-600 pt-2">{answer}</p>
      </motion.div>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <motion.section
      className="py-16 md:py-20 bg-gradient-to-br rounded-2xl md:rounded-3xl shadow-inner overflow-hidden mt-16"
      style={{ backgroundImage: `linear-gradient(135deg, ${THEME.gradientStart}, ${THEME.gradientEnd})` }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
    >
      <div className="px-4 sm:px-6 md:px-8">
        <motion.div className="text-center mb-10 md:mb-12" variants={fadeInUp}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: THEME.primary }}>
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Get quick answer to common question about registeration and event details 
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {FAQS.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}