import React from 'react';
import HeroPage from '../components/content/heroPage.jsx';
import FeaturesSection from "../components/content/FeaturesSection";
import EventDetailsSection from "../components/content/EventDetailsSection";
import ThemesSection from "../components/content/ThemesSection";
import ContactSection from "../components/content/ContactSection";
import FAQSection from "../components/content/FAQSection";
import RegistrationCTASection from "../components/content/RegistrationCTASection";
import Process from '../components/content/roadMap.jsx';
import JuryPanel from '../components/content/juryPanel.jsx';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section (full width) */}
      <HeroPage />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 lg:space-y-20">
         <Process />
          <FeaturesSection />
          <EventDetailsSection />
          <ThemesSection />
          <JuryPanel />
          <ContactSection />
          <FAQSection />
          <RegistrationCTASection />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-6 mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <span className="text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Ricr Hackathon. All rights reserved.
          </span>

          <div className="flex flex-col sm:flex-row sm:space-x-6 text-sm text-center md:text-right">
            <a href="/privacy" className="hover:underline mb-2 sm:mb-0">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:underline mb-2 sm:mb-0">
              Terms of Service
            </a>
            <a href="mailto:ashish@ricr.in" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
