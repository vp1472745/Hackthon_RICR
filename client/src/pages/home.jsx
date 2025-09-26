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

      <footer className="bg-gray-800 text-gray-200 py-6 mt-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <span className="text-sm">&copy; {new Date().getFullYear()} Ricr Hackathon. All rights reserved.</span>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/terms" className="hover:underline">Terms of Service</a>
            <a href="mailto:contact@ricrhackathon.com" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
