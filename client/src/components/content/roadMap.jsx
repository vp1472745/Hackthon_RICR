import React from 'react';
import { Rocket, Target, Zap } from 'lucide-react';

const RoadMap = () => {
  const steps = [
    { title: "Register Your Team", description: "Create your team account with basic details", color: "blue" },
    { title: "Verify Your Account", description: "Confirm your email and phone number (Whatsapp) via OTP", color: "green" },
    { title: "Complete Payment", description: "Secure your participation with payment", color: "purple" },
    { title: "Login to Dashboard", description: "Access your personalized team workspace", color: "orange" },
    { title: "Fill Leader Details", description: "Complete your profile", color: "pink" },
    { title: "Add Team Members", description: "Invite and manage your teammates", color: "indigo" },
    { title: "Select Project Theme", description: "Choose your hackathon project focus area", color: "teal" },
    { title: "Accept Terms & Conditions", description: "Review and agree to competition guidelines", color: "red" },
    { title: "Access Full Dashboard", description: "Start building your amazing project", color: "yellow" }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500 hover:bg-blue-600 border-blue-200',
      green: 'bg-green-500 hover:bg-green-600 border-green-200',
      purple: 'bg-purple-500 hover:bg-purple-600 border-purple-200',
      orange: 'bg-orange-500 hover:bg-orange-600 border-orange-200',
      pink: 'bg-pink-500 hover:bg-pink-600 border-pink-200',
      indigo: 'bg-indigo-500 hover:bg-indigo-600 border-indigo-200',
      teal: 'bg-teal-500 hover:bg-teal-600 border-teal-200',
      red: 'bg-red-500 hover:bg-red-600 border-red-200',
      yellow: 'bg-yellow-500 hover:bg-yellow-600 border-yellow-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 mt-10 w-full">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Rocket className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Start Your Hackathon Journey</h3>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Follow these simple steps to join the competition and showcase your skills
        </p>
      </div>

      {/* Steps Grid - Pure Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => {
          return (
            <div 
              key={index}
              className="group p-6 border border-gray-200 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-white to-gray-50"
            >
              <div className="flex flex-col items-center text-center">
                {/* Number inside colored background (replaces icon) */}
                <div className={`w-16 h-16 ${getColorClasses(step.color)} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <span className="text-white font-bold text-2xl">{index + 1}</span>
                </div>
                
                {/* Content */}
                <h4 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-gray-800 transition-colors">
                  {step.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>


    </div>
  );
};

export default RoadMap;