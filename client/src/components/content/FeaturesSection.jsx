import React from "react";
import {
  FaRocket,
  FaTrophy,
  FaHandshake,

} from 'react-icons/fa';
import { GrCertificate } from "react-icons/gr";
import Execulsive from "../../assets/exculsive.png";
import { SectionHeader, FeatureCard } from "./SharedComponents";


const FEATURES = [
  {
    icon: <FaTrophy className="text-yellow-600" />,
    title: "₹40,000 Prize Pool",
    description: "Compete for exciting cash prizes and recognition in our flagship hackathon event",
  },
  {
    icon: <GrCertificate className="text-blue-600" />,
    title: "Participation Certificate",
    description: "Show your creativity and earn a Certificate of Participation!",
  },



  {
    icon: <FaHandshake className="text-green-600" />,
    title: "Industry Collaboration",
    description: "Connect with industry professionals",
  },
  {
    icon: <img src={Execulsive} alt="Exclusive Swags" className="w-14 h-14 object-contain" />,
    title: "Exclusive SWAGS",
    description: "Top participants will get exclusive SWAGS",
  }
];

export default function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Rewards and Benefits"
        />

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}