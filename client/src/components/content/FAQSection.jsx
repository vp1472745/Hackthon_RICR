import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaMinus } from 'react-icons/fa';
import { fadeInUp, containerVariants, itemVariants, THEME } from "./constants";

const FAQS = [
  {
    question: "Who can register?",
    answer: "Any student or professional team leader can register for the hackathon. Each team must have a minimum of 1 member (Team Leader) and can have up to 4 members in total.",
    category: "Registration"
  },
  {
    question: "How many members are allowed per team?",
    answer: "Minimum: 1 , Maximum: 4 (Team Leader + up to 3 members)",
    category: "Team"
  },
  {
    question: "Until when can teams be updated or altered?",
    answer: "Team alterations are allowed until Feb 25, 2026, 11:59 PM IST. After this deadline, no changes will be permitted.",
    category: "Team"
  },
  {
    question: "Can one person be part of multiple teams?",
    answer: "No",
    category: "Team"
  },
  {
    question: "Should each team member's email be unique?",
    answer: "Yes. Each email must be unique in the registration system. If an email already exists in the database, registration will be blocked.",
    category: "Registration"
  },
  {
    question: "What is the registration fee?",
    answer: "The registration fee is ₹1,500 (non-refundable). Payment must be made via the provided QR code.",
    category: "Payment"
  },
  {
    question: "How should the payment receipt be submitted?",
    answer: "After completing the QR payment, upload a transaction screenshot (JPEG/PNG) where the UTR/transaction reference number is clearly visible.",
    category: "Payment"
  },
  {
    question: "How long does payment verification take?",
    answer: "Verification will take place within 24 hours (manual review by the admin). The initial payment status will remain 'Pending' until verification. Once confirmed, the status will be updated to 'Confirmed.'",
    category: "Payment"
  },
  {
    question: "What happens if the payment is rejected?",
    answer: "You will receive a rejection email with the reason (e.g. invalid UTR). If allowed, you may re-submit the payment receipt.",
    category: "Payment"
  },
  {
    question: "Where can teams log in?",
    answer: "Teams can log in at https://hackathon.ricr.in/login using their Team ID and password.",
    category: "Login"
  },
  {
    question: "When will the Team ID and password be provided?",
    answer: "After payment verification, the admin will confirm registration, update the database, and send an email containing: Team ID (RICR-NK-XXXX format) and email address.",
    category: "Login"
  },
  {
    question: "Until when can teams edit their dashboard details?",
    answer: "Teams can edit their details only during the alteration window (until Feb 25, 2026, 11:59 PM IST, 11:59 PM IST). After this, edits will be disabled.",
    category: "Team"
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
  const [selectedCategory, setSelectedCategory] = useState('All');
  // Get unique categories from FAQS
  const categories = ['All', ...Array.from(new Set(FAQS.map(faq => faq.category)))];

  // Filter FAQs based on selected category
  const filteredFaqs = selectedCategory === 'All' ? FAQS : FAQS.filter(faq => faq.category === selectedCategory);

  return (
    <motion.section
      className="py-16 md:py-20 bg-gradient-to-br rounded-2xl md:rounded-3xl shadow-inner overflow-hidden mt-10"
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

        {/* Category Tabs (moved below header) */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-8 py-2 rounded-lg font-semibold border transition-colors cursor-pointer ${selectedCategory === cat ? 'bg-[#0B2A4A] text-white border-[#0B2A4A]' : 'bg-white text-[#0B2A4A] border-gray-300 hover:bg-gray-100'}`}
              onClick={() => setSelectedCategory(cat)}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">No FAQs in this category.</div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}



// oikjlksdjhnfklsadjdsakljfdsklajdkls