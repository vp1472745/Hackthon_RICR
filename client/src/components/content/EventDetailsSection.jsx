import React from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaHome,
  FaCreditCard,
  FaTrophy,
  FaUsers
} from 'react-icons/fa';
import { InfoCard } from "./SharedComponents";
import { fadeInUp, containerVariants, pulseVariants, THEME } from "./constants";

export default function EventDetailsSection() {
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
            FutureMaze Event Details
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
            <InfoCard icon={<FaCalendarAlt />} heading="Event Timeline">
              <ul className="space-y-3 text-gray-700">
                <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span className="font-medium">Dates:</span>
                  <span className="text-[#0B2A4A] font-semibold mt-1 sm:mt-0">TBD (To Be Announced)</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span className="font-medium">Registration:</span>
                  <span className="text-[#0B2A4A] font-semibold mt-1 sm:mt-0">Open Now</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span className="font-medium">Team Alterations:</span>
                  <span className="text-[#0B2A4A] font-semibold mt-1 sm:mt-0">Until Nov 6, 2025</span>
                </li>
              </ul>
            </InfoCard>

            <InfoCard icon={<FaMapMarkerAlt />} heading="Venue">
              <p className="text-gray-700 font-medium">NRI Institute of Technology</p>
              <a
                href="https://maps.google.com/?q=NRI+College+Science+Technology+Bhopal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaMapMarkerAlt className="mr-2" />
                View on Google Maps
              </a>
            </InfoCard>

            <InfoCard icon={<FaHome />} heading="Accommodation">
              <ul className="space-y-2 text-gray-700">
                <li>Hostel facility available at RICR</li>
                <li className="font-semibold text-[#0B2A4A]">₹300/night/person</li>
                <li className="text-sm text-gray-500 italic">Contact organizer for booking</li>
              </ul>
              <a
                href="https://www.google.com/maps/place/RICR+-+Raj+Institute+of+Coding+%26+Robotics+%7C+Best+Java+Coding+Classes+In+Bhopal/@23.2689676,77.4524774,17z/data=!3m2!4b1!5s0x397c69f43f4807e5:0x6396b47e29fb2ed7!4m6!3m5!1s0x397c6967f58e0dbf:0x65d0724cf8368e2d!8m2!3d23.2689627!4d77.4573483!16s%2Fg%2F11vzch1wzj?entry=ttu&g_ep=EgoyMDI5MDkxNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-3 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaHome className="mr-2" />
                View Hostel Location
              </a>
            </InfoCard>
          </div>

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
                  <span>Team alterations allowed until Nov 6, 2025</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0B2A4A] font-bold">•</span>
                  <span>Unique Team IDs generated upon registration</span>
                </li>
              </ul>
            </InfoCard>

            <InfoCard icon={<FaCreditCard />} heading="Registration">
              <div className="space-y-2 text-gray-700">
                <p className="font-semibold text-[#0B2A4A]">Registration Fee: ₹1,000 (Non-refundable)</p>
                <p>Payment via UPI QR Code</p>
              </div>
            </InfoCard>

            <InfoCard icon={<FaTrophy />} heading="Prizes & Benefits">
              <ul className="space-y-2 text-gray-700">
                <li className="font-semibold text-[#0B2A4A]">₹40,000 Total Prize Pool</li>
                <li>Industry Mentorship</li>
                <li>Networking Opportunities</li>
                <li>Certificate of Participation</li>
              </ul>
            </InfoCard>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}