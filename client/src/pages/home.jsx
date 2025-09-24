import React from 'react';
import HeroPage from '../components/content/heroPage.jsx';
import FeaturesSection from "../components/content/FeaturesSection";
import EventDetailsSection from "../components/content/EventDetailsSection";
import ThemesSection from "../components/content/ThemesSection";
import ContactSection from "../components/content/ContactSection";
import FAQSection from "../components/content/FAQSection";
import RegistrationCTASection from "../components/content/RegistrationCTASection";


function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero should be full width */}
      <HeroPage />

      {/* Main content container */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 ">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturesSection />
          <EventDetailsSection />
          <ThemesSection />
          <ContactSection />
          <FAQSection />
          <RegistrationCTASection />
        </div>
      </main>


    </div>
  );
}

export default Home;
