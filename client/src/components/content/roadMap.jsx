import React from "react";
import { Rocket, Target, Zap } from "lucide-react";
import TimeLine from "../../assets/eventTimeLine.png";
import { LuClock } from "react-icons/lu";
import { LuCalendarDays } from "react-icons/lu";
const RoadMap = () => {
  const steps = [
    {
      title: "Registration Open",
      date: "10th Dec, 2025",
      time: "09:00 AM",
      color: "blue",
    },
    {
      title: "Registration Close",
      date: "20th Feb, 2026",
      time: "09:15 AM",
      color: "green",
    },
    {
      title: "Hackathon Begins",
      date: "25th Feb 2026",
      time: "09:30 AM",
      color: "purple",
    },
    {
      title: "Hackathon Finales",
      date: "26th Feb 2026",
      time: "09:00 AM",
      color: "orange",
    },
    {
      title: "Results Announcement",
      date: "26th Feb 2026",
      time: "12:00 PM",
      color: "pink",
    },
    {
      title: "Prizes Distribution",
      date: "26th Feb 2026",
      time: "02:00 PM",
      color: "indigo",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-500 hover:bg-blue-600 border-blue-200",
      green: "bg-green-500 hover:bg-green-600 border-green-200",
      purple: "bg-purple-500 hover:bg-purple-600 border-purple-200",
      orange: "bg-orange-500 hover:bg-orange-600 border-orange-200",
      pink: "bg-pink-500 hover:bg-pink-600 border-pink-200",
      indigo: "bg-indigo-500 hover:bg-indigo-600 border-indigo-200",
      teal: "bg-teal-500 hover:bg-teal-600 border-teal-200",
      red: "bg-red-500 hover:bg-red-600 border-red-200",
      yellow: "bg-yellow-500 hover:bg-yellow-600 border-yellow-200",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 mt-10 w-full">
      {/* Header */}
      <div className="text-center mb-12">
        <h3 className="text-4xl font-bold text-gray-900 mb-4">
          Event Timeline
        </h3>
      </div>

      {/* Steps Grid - Pure Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => {
          // Only the first step is clickable
          const isClickable = index === 0;
          const handleClick = () => {
            // You can replace this with navigation or modal logic as needed
            window.location.href = "/register";
          };
          return (
            <div
              key={index}
              className={
                `group p-6 border border-gray-200 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-white to-gray-50 ` +
                (isClickable
                  ? "cursor-pointer ring-2 ring-blue-300 hover:ring-blue-500"
                  : "")
              }
              onClick={isClickable ? handleClick : undefined}
              tabIndex={isClickable ? 0 : undefined}
              role={isClickable ? "button" : undefined}
              aria-pressed={isClickable ? "false" : undefined}
            >
              <div className="flex items-center gap-5">
                {/* Number inside colored background (replaces icon) */}
                <div
                  className={`w-16 h-16 ${getColorClasses(
                    step.color
                  )} rounded-2xl flex items-center justify-center  group-hover:scale-110 transition-all duration-300 shadow-lg`}
                >
                  <span className="text-white font-bold text-2xl">
                    {index + 1}
                  </span>
                </div>

                <div className="flex flex-col  ">
                  <h4 className="font-bold text-gray-900 text-lg  group-hover:text-gray-800 transition-colors">
                    {step.title}
                  </h4>
                  <span className="text-gray-700 text-sm  flex items-center gap-3">
                    <LuCalendarDays />
                    {step.date}
                  </span>
                  <span className="text-gray-700 text-sm  flex items-center gap-3">
                    {" "}
                    <LuClock /> {step.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadMap;
