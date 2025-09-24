import React from 'react';
import ProblemStatementCard from './problemStatementCard.jsx';
import TeamLeaderCard from './teamLeaderCard.jsx';
import TeamMemberCard from './teamMemberCard.jsx';
import { Activity, Users, Clock, Target } from 'lucide-react';

const MainPages = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        
        {/* Enhanced Header Section */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <div className="p-3 bg-gradient-to-r from-[#0B2A4A] to-[#1D5B9B] rounded-xl mr-4">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0B2A4A] via-[#1D5B9B] to-[#2563EB] bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
            </div>
            
            <p className="text-lg text-gray-600 max-w-6xl mx-auto lg:mx-0 leading-relaxed">
              Welcome to your FutureMaze hackathon dashboard. Monitor your team progress, track deadlines, and access challenge resources.
            </p>
     
          </div>
        </div>

        {/* Professional Cards Layout */}
        <div className="space-y-8">
          {/* Top Section - Problem Statement (Full Width) */}
          <div className="w-full">
           
            <ProblemStatementCard />
          </div>

          {/* Bottom Section - Team Information */}
          <div className="w-full">
          
            {/* Team Cards Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
              {/* Team Leader Card */}
              <div className="xl:col-span-4">
                <TeamLeaderCard />
              </div>
              
              {/* Team Members Card */}
              <div className="xl:col-span-8">
                <TeamMemberCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPages;
