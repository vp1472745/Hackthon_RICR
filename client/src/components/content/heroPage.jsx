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
              Future<span className="text-[#1D5B9B]">Maze</span>
            </h1>

            {/* Subheading */}
            <div className="inline-flex items-center bg-[#1D5B9B]/10 px-4 py-2 rounded-full mb-6">
              <span className="text-xs md:text-base font-semibold text-[#1D5B9B] flex items-center gap-2">
                Powered by <span className='font-bold'>RICR</span> <span className='text-red-500 text-2xl'><FaHandshake /></span> <span className='font-bold'>NRI</span> Institute of Technology
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
            <div className="bg-white p-2 sm:p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#0B2A4A]">Nov 7<sup>th</sup> - 8<sup>th</sup></div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Block Your Calendar</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-2">
          <Link
            to="/register"
            className="bg-[#0B2A4A] hover:bg-[#1D5B9B] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span>Register Now - ₹1,500</span>
            <FaArrowUp className="h-5 w-5" />
          </Link>
          <button className="border-2 border-[#0B2A4A] text-[#0B2A4A] hover:bg-[#0B2A4A] hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2">
            <span>Learn More</span>
            <FaQuestionCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Deadline notice */}
        <div className="bg-[#F1F7FE] p-4 rounded-lg border border-[#1D5B9B]/20 max-w-2xl mx-auto">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
            <FaClock className="h-5 w-5 text-[#1D5B9B]" />
            <span>Registration deadline: <span className="font-semibold text-[#0B2A4A]">November 6, 2025, 11:59 PM IST</span></span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroPage;