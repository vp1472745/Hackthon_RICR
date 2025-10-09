import React from "react";
import { 
  FaRocket, 
  FaTrophy, 
  FaHandshake
} from 'react-icons/fa';
import { SectionHeader, FeatureCard } from "./SharedComponents";

const FEATURES = [
  {
    icon: <FaRocket />,
    title: "Innovation Challenge",
    description: "Push the boundaries of technology and create groundbreaking solutions that can change the world",
  },
  {
    icon: <FaTrophy />,
    title: "₹40,000 Prize Pool",
    description: "Compete for exciting cash prizes and recognition in our flagship hackathon event",
  },
  {
    icon: <FaHandshake />,
    title: "Industry Collaboration",
    description: "Partner with NIIST Institute of Technology and connect with industry professionals",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full py-6 md:py-10">
      <SectionHeader
        title="Why Join FutureMaze?"
        subtitle="Discover the unique opportunities that make FutureMaze the premier hackathon experience"
      />

      <div
        className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {FEATURES.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>
    </section>
  );
}