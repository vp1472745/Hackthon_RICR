import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaArrowRight,
} from "react-icons/fa";
import {
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlineChat,
} from "react-icons/hi";

function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      // Reset after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <footer className="bg-[#185784] text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white opacity-5"></div>
      <div className="absolute -top-20 -right-20 w-40 h-20 rounded-full bg-[#0B2A4A] opacity-10"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-20 rounded-full bg-[#1D5B9B] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 relative z-10">
        {/* Logo & About */}
        <motion.div 
          className="lg:col-span-2"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <motion.div 
              className="h-12 w-12 bg-white rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="text-2xl font-bold text-[#185784]">R</span>
            </motion.div>
            <span className="text-2xl font-bold">RICR</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-200 mb-6">
            RICR is a subsidiary of Raj Digital Private Limited. It is a premier
            coding and robotics institute, empowering students with
            cutting-edge education and real-world skills for a tech-driven
            future.
          </p>
          
          {/* Newsletter Subscription */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Stay Updated</h3>
            {isSubscribed ? (
              <motion.div 
                className="bg-green-500 text-white p-3 rounded-lg text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                Thank you for subscribing!
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <motion.button
                  type="submit"
                  className="bg-white text-[#185784] px-4 py-2 rounded-r-lg font-medium hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaArrowRight />
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <h3 className="font-semibold text-lg mb-4 pb-2 border-b border-white border-opacity-20">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            {["Courses", "Host a Workshop", "Community Ambassador", "Work With Us", "Contact Us"].map((item, index) => (
              <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <a href="#" className="hover:text-gray-300 flex items-center">
                  <FaArrowRight className="text-xs mr-2 opacity-70" />
                  {item}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Other Links */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <h3 className="font-semibold text-lg mb-2 pb-2 border-b border-white border-opacity-20">Other Links</h3>
          <ul className="space-y-3 text-sm mb-6">
            <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
              <a href="#" className="hover:text-gray-300 flex items-center">
                <FaArrowRight className="text-xs mr-2 opacity-70" />
                Edunest Facility
              </a>
            </motion.li>
          </ul>
          
          <h3 className="font-semibold text-lg mb-2 pb-2 border-b border-white border-opacity-20">Policies</h3>
          <ul className="space-y-3 text-sm">
            {["Terms of Service", "Privacy Policy"].map((item, index) => (
              <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <a href="#" className="hover:text-gray-300 flex items-center">
                  <FaArrowRight className="text-xs mr-2 opacity-70" />
                  {item}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <h3 className="font-semibold text-lg mb-4 pb-2 border-b border-white border-opacity-20">Information</h3>
          <ul className="space-y-4 text-sm mb-6">
            <motion.li 
              className="flex items-start space-x-3"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <HiOutlineLocationMarker className="text-xl mt-1 flex-shrink-0" />
              <span>Minal Mall, 4th Floor, Minal Residency, JK Road, Bhopal Pincode (462023)</span>
            </motion.li>
            <motion.li 
              className="flex items-center space-x-3"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <HiOutlineMail className="text-xl flex-shrink-0" />
              <a href="mailto:ashish@ricr.in" className="hover:text-gray-300">
               ashish@ricr.in
              </a>
            </motion.li>
            <motion.li 
              className="flex items-center space-x-3"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <HiOutlineChat className="text-xl flex-shrink-0" />
              <a href="tel:+918889991736" className="hover:text-gray-300">
                +91 8889991736
              </a>
            </motion.li>
          </ul>

          {/* Social Icons */}
<div>
  <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
  <div className="flex space-x-3">
    {[
      { icon: <FaFacebookF />, color: "#1877F2" },
      { icon: <FaInstagram />, color: "#E4405F" },
      { icon: <FaYoutube />, color: "#FF0000" },
      { icon: <FaLinkedinIn />, color: "#0A66C2" },
    ].map((social, index) => (
      <motion.a
        key={index}
        href="#"
        className="bg-white bg-opacity-10 p-3 rounded-full backdrop-blur-sm text-black"
        whileHover={{
          scale: 1.1,
          y: -3,
          color: social.color,        // ← icon color on hover
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {social.icon}
      </motion.a>
    ))}
  </div>
</div>


        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div 
        className="border-t border-white border-opacity-20 px-6 py-6 flex flex-col md:flex-row justify-between items-center bg-[#0B2A4A] bg-opacity-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm text-gray-200 text-center md:text-left mb-4 md:mb-0">
          © 2024 - Raj Digital Private Limited | All Rights Reserved
        </p>
      
      </motion.div>
    </footer>
  );
}

export default Footer;