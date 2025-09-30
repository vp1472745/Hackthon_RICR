import React from "react";
import { motion } from "framer-motion";
import {
  FaRobot, FaLeaf, FaBitcoin, FaHospital, FaGlobe, FaBook
} from 'react-icons/fa';
import { SectionHeader } from "./SharedComponents";
import { containerVariants, itemVariants, iconHoverVariants, THEME } from "./constants";
import HackathonThemeModal from "./HackathonThemeModal";

const THEMES = [
  {
    icon: <FaRobot />,
    title: "AI & Machine Learning",
    shortDescription:
      "Create intelligent systems using AI, machine learning, and deep learning to solve complex, real-world problems efficiently.",
    description:
      "Explore the vast world of artificial intelligence and machine learning by creating intelligent systems capable of learning, reasoning, and decision-making. Implement deep learning models, neural networks, natural language processing, and computer vision to solve complex real-world challenges. Focus on predictive analytics, automation, and adaptive algorithms to improve efficiency across industries such as healthcare, finance, education, and robotics. Emphasize ethical AI, bias reduction, and data privacy while innovating in areas like autonomous vehicles, smart assistants, recommendation engines, and AI-driven business insights.",
  },
  {
    icon: <FaLeaf />,
    title: "Sustainable Technology",
    shortDescription:
      "Design eco-friendly solutions using renewable energy, IoT, and smart systems to promote sustainability and environmental conservation.",
    description:
      "Design innovative solutions that promote environmental sustainability and reduce the human ecological footprint. Focus on renewable energy technologies like solar, wind, and bioenergy, as well as energy-efficient systems for homes, industries, and transportation. Develop smart agriculture systems, waste management solutions, and eco-friendly products to conserve natural resources. Leverage IoT, AI, and data analytics to monitor environmental impact, reduce carbon emissions, and optimize resource consumption. Aim to create scalable, practical solutions that encourage sustainable living, climate action, and conservation of biodiversity while improving the quality of life for communities worldwide.",
  },
  {
    icon: <FaBitcoin />,
    title: "FinTech Innovation",
    shortDescription:
      "Revolutionize financial services with blockchain, digital payments, and AI-powered solutions for secure, transparent, and efficient transactions.",
    description:
      "Revolutionize the financial sector by designing cutting-edge fintech solutions that enhance banking, payments, investments, and insurance services. Explore blockchain technology, cryptocurrencies, and decentralized finance to provide secure, transparent, and efficient financial transactions. Develop mobile banking apps, digital wallets, peer-to-peer payment platforms, robo-advisors, and AI-driven fraud detection systems. Focus on improving financial accessibility, customer experience, and data-driven decision-making. Combine technology with regulatory compliance, risk management, and cybersecurity best practices to deliver innovative solutions that transform the way individuals, businesses, and institutions manage money in the digital age.",
  },
  {
    icon: <FaHospital />,
    title: "HealthTech Solutions",
    shortDescription:
      "Develop healthcare innovations using AI, telemedicine, and wearable devices to improve patient care and medical accessibility.",
    description:
      "Develop transformative healthcare solutions that improve patient care, streamline medical operations, and enhance diagnostic accuracy. Utilize telemedicine platforms, AI-driven diagnostics, wearable health monitoring devices, and electronic health records to optimize medical workflows. Focus on personalized medicine, remote patient monitoring, and predictive analytics for early disease detection. Explore the integration of robotics, virtual reality, and data-driven decision-making to enhance surgeries, rehabilitation, and treatment plans. Emphasize accessibility, affordability, and privacy in healthcare delivery while creating solutions that improve outcomes, patient engagement, and the overall efficiency of global healthcare systems.",
  },
  {
    icon: <FaBook />,
    title: "EdTech & Education Innovation",
    shortDescription:
      "Transform education with interactive e-learning platforms, AI tutoring, and virtual classrooms to enhance learning and accessibility worldwide.",
    description:
      "Transform education through technology by creating innovative platforms, tools, and solutions that enhance teaching and learning experiences. Develop interactive e-learning platforms, AI-driven tutoring systems, adaptive learning apps, and virtual classrooms to personalize education for students of all ages. Leverage gamification, augmented reality, and data analytics to make learning more engaging, accessible, and effective. Focus on bridging educational gaps, improving accessibility for underserved communities, and empowering educators with smart tools for assessment and curriculum planning. Aim to create scalable solutions that foster lifelong learning, skill development, and knowledge-sharing in a rapidly evolving digital world.",
  },
  {
    icon: <FaGlobe />,
    title: "Global Connectivity & IoT",
    shortDescription:
      "Build smart, connected systems using IoT and networking technologies to improve efficiency, communication, and global resource management.",
    description:
      "Create intelligent systems that connect people, devices, and infrastructure across the globe using Internet of Things (IoT) and networking technologies. Develop smart cities, connected transportation systems, automated homes, and industrial IoT solutions to improve efficiency and quality of life. Utilize cloud computing, edge computing, and big data analytics to process real-time information from connected devices. Focus on secure, scalable, and sustainable networking solutions that enhance global communication, monitoring, and resource management. Aim to build integrated platforms that foster collaboration, optimize processes, and bridge gaps between technology, society, and the environment worldwide.",
  },
];

export default function ThemesSection() {
  const [isThemeModalOpen, setThemeModalOpen] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState(null);
  return (
    <>
      <section className="w-full py-8 md:py-10">
        <SectionHeader
          title="Hackathon Themes"
          subtitle="Wide Range of Exciting themes to build innovative solutions that can make a real impact"
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
              className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 group "
              variants={itemVariants}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4 mb-5">
                <motion.div className="text-3xl md:text-4xl text-[#0B2A4A]" variants={iconHoverVariants}>
                  {t.icon}
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold cursor-default" style={{ color: THEME.primary }}>
                  {t.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed cursor-default">{t.shortDescription}</p>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 rounded  text-[#0B2A4A] font-semibold transition-colors hover:text-[#16406b] hover:underline focus:outline-none cursor-pointer"
                  type="button"
                  onClick={() => { setThemeModalOpen(true), setSelectedTheme(t) }}
                >
                  Know More
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
      <HackathonThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        themeData={selectedTheme}
      />
    </>
  );
}