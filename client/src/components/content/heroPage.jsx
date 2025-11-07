import React from 'react';
import { Link } from 'react-router-dom';

import {
  FaHandshake,
  FaArrowUp,
  FaQuestionCircle,
  FaClock
} from "react-icons/fa";


function HeroPage() {
  return (
    <section className="relative flex items-center justify-center px-4  py-4 md:py-6 lg-py-0 bg-gradient-to-br from-[#F8FAFC] to-[#E6F0FA]">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-72 bg-[#0B2A4A] opacity-5 transform -skew-y-3 -translate-y-24"></div>
      <div className="absolute top-20 right-12 w-32 h-32 rounded-full bg-[#1D5B9B] opacity-10"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 rounded-full bg-[#0B2A4A] opacity-10"></div>

      <div className="relative max-w-5xl mx-auto text-center z-10">


        {/* Main heading */}
        <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-0 md:gap-10 lg:gap-20 mb-12'>
          <div >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B2A4A] mb-4 leading-tight">
              Nav<span className="text-[#1D5B9B]">Kalpana</span>
            </h1>

            {/* Subheading */}
            <div className="inline-flex items-center bg-[#1D5B9B]/10 px-4 py-2 rounded-full mb-6">
              <span className="text-xs md:text-base font-semibold text-[#1D5B9B] flex items-center gap-2">
                Conducted by  <span className='font-bold'>NIIST</span> <span className='text-red-500 text-2xl'><FaHandshake /></span>  Powered by <span className='font-bold'>RICR</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-md md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-6">
              Join us for an exciting hackathon where innovation meets opportunity.
              Build groundbreaking solutions, compete for <span className="font-semibold text-[#0B2A4A]">₹40,000 in prizes</span>,
              and shape the future of technology!
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white p-2 sm:p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="text-lg sm:text-xl  md:text-2xl font-bold text-[#0B2A4A]">₹40,000</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Prize Pool</div>
            </div>
            <div className="bg-white p-2 sm:p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="text-lg sm:text-xl  md:text-2xl font-bold text-[#0B2A4A]">₹1,500</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Registration Fee</div>
            </div>
            <div className="bg-white p-2 sm:p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#0B2A4A]">1-4</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Team Size</div>
            </div>
            <div className="bg-white p-2 sm:p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer">
              <a
                // UPDATED: dates set to Feb 25–26, 2026 (UTC times kept similar to original)
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Hackathon+Event&dates=20260225T033000Z/20260226T113000Z&details=Join+our+Hackathon+and+build+amazing+projects!&location=Online&ctz=Asia/Kolkata"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-bold text-[#0B2A4A]">
                    <FaClock className="text-[#0B2A4A] text-xl md:text-2xl" />
                    <span className='text-lg'>Feb 25<sup>th</sup> - 26<sup>th</sup></span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    Block Your Calendar
                  </div>
                </div>
              </a>
            </div>

          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-2">
          <Link
            to="/register"
            className="bg-[#0B2A4A] hover:bg-[#1D5B9B] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span>Register Now </span>
            <FaArrowUp className="h-5 w-5" />
          </Link>

        </div>


      </div>
    </section>
  );
}

export default HeroPage;
