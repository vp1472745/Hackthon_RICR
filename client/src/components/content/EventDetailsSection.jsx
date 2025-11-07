import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaHome,
  FaCreditCard,
  FaTrophy,
  FaUsers,
  FaPhoneAlt
} from 'react-icons/fa';
import { InfoCard } from "./SharedComponents";
import { fadeInUp, containerVariants, pulseVariants, THEME } from "./constants";

const EventDetailsSection = () => {
  // Device detection for mobile/desktop (safe for SSR/build — runs only in useEffect)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMobile(/Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent));
    }
  }, []);

  const [showPopup, setShowPopup] = useState(false);
  const [popupNumber, setPopupNumber] = useState("");

  const handlePhoneClick = (number) => {
    if (isMobile) {
      window.location.href = `tel:${number}`;
    } else {
      setPopupNumber(number);
      setShowPopup(true);
    }
  };

  const closePopup = () => setShowPopup(false);

  return (
    <motion.section
      className="w-full py-16 md:py-20 bg-gradient-to-br rounded-2xl md:rounded-3xl shadow-inner overflow-hidden"
      style={{ backgroundImage: `linear-gradient(135deg, ${THEME.gradientStart}, ${THEME.gradientEnd})` }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
    >
      <div className="w-full relative px-4 sm:px-6 md:px-8">
        {/* decorative pulses */}
        <motion.div
          className="absolute -top-6 -left-6 w-20 h-20 md:w-24 md:h-24 rounded-full"
          style={{ background: THEME.accent, opacity: 0.05 }}
          variants={pulseVariants}
          animate="animate"
        />
        <motion.div
          className="absolute -bottom-6 -right-6 w-28 h-28 md:w-32 md:h-32 rounded-full"
          style={{ background: THEME.primary, opacity: 0.05 }}
          variants={pulseVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />

        <motion.div className="w-full text-center mb-10 md:mb-12 relative z-10" variants={fadeInUp}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: THEME.primary }}>
            Event Details
          </h2>
        </motion.div>

        <motion.div
          className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 relative z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="w-full">
            <InfoCard icon={<FaUsers />} heading="Team Structure">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#0B2A4A] font-bold">•</span>
                  <span>Minimum: 1 member (Team Leader only)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0B2A4A] font-bold">•</span>
                  <span>Maximum: 4 members (Team Leader + 3 members)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0B2A4A] font-bold">•</span>
                  <span>Team alterations allowed until Feb 25, 2026</span>
                </li>
              </ul>
            </InfoCard>

            <InfoCard icon={<FaHome />} heading="Accommodation">
              <div className="flex flex-col sm:flex-row justify-between gap-6">
                {/* 🏠 RICR Hostel Info */}
                <div className="flex-1">
                  <ul className="space-y-2 text-gray-700">
                    <li className="font-semibold text-[#0B2A4A]">RICR Hostel</li>
                    <li>Hostel facility available at RICR</li>
                    <li>
                      <button
                        className="flex items-center cursor-pointer gap-2 font-semibold text-[#0B2A4A] hover:text-green-700 focus:outline-none"
                        onClick={() => handlePhoneClick('+916268923703')}
                        type="button"
                      >
                        <FaPhoneAlt className="text-blue-600" />
                        +91 62689 23703
                      </button>
                    </li>
                  </ul>
                  <a
                    href="https://www.google.com/maps/place/RICR+-+Raj+Institute+of+Coding+%26+Robotics+%7C+Best+Java+Coding+Classes+In+Bhopal/@23.2689676,77.4524774,17z/data=!3m2!4b1!5s0x397c69f43f4807e5:0x6396b47e29fb2ed7!4m6!3m5!1s0x397c6967f58e0dbf:0x65d0724cf8368e2d!8m2!3d23.2689627!4d77.4573483!16s%2Fg%2F11vzch1wzj?entry=ttu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                <FaMapMarkerAlt className="mr-2" />
                 View on Google Maps
                  </a>
                </div>

                {/* Divider for desktop */}
                <div className="hidden sm:block w-px bg-gray-200 mx-2"></div>

                {/* 🏫 NIIST Hostel Info */}
                <div className="flex-1">
                  <ul className="space-y-2 text-gray-700">
                    <li className="font-semibold text-[#0B2A4A]">NIIST Hostel</li>
                    <li>Hostel facility available at NIIST</li>
                    <li>
                      <button
                        className="flex items-center gap-2 cursor-pointer font-semibold text-[#0B2A4A] hover:text-green-700 focus:outline-none"
                        onClick={() => handlePhoneClick('+916268923703')}
                        type="button"
                      >
                        <FaPhoneAlt className="text-blue-600" />
                        +91 62689 23703
                      </button>
                    </li>
                  </ul>
                 <a
                href="https://www.google.com/maps/place/NRI+Institute+of+Research+and+Technology+(NIRT),+Bhopal,+M.P/@23.2458624,77.5000911,762m/data=!3m2!1e3!4b1!4m6!3m5!1s0x397c412491bc4217:0x992321e57fea48dc!8m2!3d23.2458575!4d77.502666!16s%2Fg%2F11gj0tht90?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaMapMarkerAlt className="mr-2" />
                View on Google Maps
              </a>
                </div>
              </div>

       
            </InfoCard>
          </div>

          <div className="w-full">
            <InfoCard icon={<FaTrophy />} heading="Prizes & Benefits">
              <ul className="space-y-2 text-gray-700">
                <li className="font-semibold text-[#0B2A4A]">₹40,000 Total Prize Pool</li>
                <li>Industry Mentorship</li>
                <li>Networking Opportunities</li>
                <li>Certificate of Participation</li>
              </ul>
            </InfoCard>

            <InfoCard icon={<FaMapMarkerAlt />} heading="Venue">
              <p className="text-gray-700 font-medium">NRI Institute of Information Science and Technology (NIIST), Bhopal, Madhya Pradesh.</p>
              <a
                href="https://www.google.com/maps/place/NRI+Institute+of+Research+and+Technology+(NIRT),+Bhopal,+M.P/@23.2458624,77.5000911,762m/data=!3m2!1e3!4b1!4m6!3m5!1s0x397c412491bc4217:0x992321e57fea48dc!8m2!3d23.2458575!4d77.502666!16s%2Fg%2F11gj0tht90?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaMapMarkerAlt className="mr-2" />
                View on Google Maps
              </a>
            </InfoCard>
          </div>
        </motion.div>

        {/* Centered Prizes & Benefits card below the grid */}
        <div className="w-full flex justify-center mt-10">
          <div className="max-w-[600px] w-full">
            <InfoCard icon={<FaCreditCard />} heading="Registration">
              <div className="space-y-2 text-gray-700">
                <p className="font-semibold text-[#0B2A4A]">Registration Fee: ₹1,500 (Non-refundable)</p>
                <p>Payment via UPI QR Code</p>
              </div>
            </InfoCard>
          </div>
        </div>
      </div>



             {/* Popup for desktop */}
              {showPopup && !isMobile && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
                  <div className="bg-white rounded-lg shadow-lg p-6 min-w-[280px] flex flex-col items-center">
                    <FaPhoneAlt className="text-green-600 text-2xl mb-2" />
                    <div className="font-bold text-lg text-[#0B2A4A] mb-2">Contact Number</div>
                    <div className="text-xl font-semibold mb-4">{popupNumber}</div>
                    <button
                      onClick={closePopup}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
    </motion.section>
  );
};

export default EventDetailsSection;
