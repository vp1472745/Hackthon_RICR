import React, { useEffect, useState } from "react";
import {
  Clock,
  Download,
  Lock,
  Unlock,
  FileText,
  Calendar,
  Timer
} from "lucide-react";

// Release datetime (IST): Nov 6, 2025 23:59 IST
const RELEASE_ISO = "2025-11-06T23:59:00+05:30";

export default function ProblemStatementCard() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [released, setReleased] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const releaseTime = new Date(RELEASE_ISO);
      const diff = releaseTime.getTime() - now.getTime();

      if (diff <= 0) {
        setReleased(true);
        setCountdown({ days: 0, hours: "00", minutes: "00", seconds: "00" });
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0");
      const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
      const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const releaseDisplayString = () => {
    const d = new Date(RELEASE_ISO);
    return d.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }) + " (IST)";
  };

  const handleDownload = () => {
    if (!released) return;

    // Create a sample problem statement PDF download
    const link = document.createElement('a');
    link.href = '/api/download-problem-statement'; // This would be your actual download endpoint
    link.download = 'FutureMaze_Problem_Statements.pdf';
    link.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B2A4A] to-[#1D5B9B] text-white p-4">
        <div className="flex items-center justify-center ">
          {released ? (
            <Unlock className="w-8 h-8 mr-3" />
          ) : (
            <Lock className="w-8 h-8 mr-3" />
          )}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-50">
            {/* Left Side - Heading */}
            <h2 className="text-2xl font-bold">
              Problem Statements
            </h2>




            {/* Right Side - Calendar with Date */}

            <div className="text-lg font-semibold bg-white/10 rounded-lg px-5 py-2 flex items-center gap-5">
              <p className="text-lg sm:text-xl">
                {released
                  ? 'Problem statements are now available!'
                  : 'Problem statements will be released on:'}
              </p>
              <p className="flex items-center">

                <Calendar className="w-5 h-5 mr-2" />
                {releaseDisplayString()}
              </p>

            </div>
          </div>

        </div>

        <div className="text-center">


        </div>
      </div>

      {/* Countdown Section */}
      <div className="p-6">
        {!released ? (
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <Timer className="w-6 h-6 text-[#0B2A4A] mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Time Remaining</h3>
            </div>

            {/* Countdown Display */}
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-3xl font-bold text-[#0B2A4A]">{countdown.days}</div>
                <div className="text-sm text-gray-600 font-medium">Days</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-3xl font-bold text-[#0B2A4A]">{countdown.hours}</div>
                <div className="text-sm text-gray-600 font-medium">Hours</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-3xl font-bold text-[#0B2A4A]">{countdown.minutes}</div>
                <div className="text-sm text-gray-600 font-medium">Minutes</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-3xl font-bold text-[#0B2A4A]">{countdown.seconds}</div>
                <div className="text-sm text-gray-600 font-medium">Seconds</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-center mb-2">
                <Unlock className="w-8 h-8 text-green-600 mr-2" />
                <h3 className="text-xl font-bold text-green-900">Problem Statements Released!</h3>
              </div>
              <p className="text-green-700">
                🎉 You can now download the problem statements and start working on your solution.
              </p>
            </div>
          </div>
        )}

        {/* Download Button */}
        <div className="text-center">
          <button
            onClick={handleDownload}
            disabled={!released}
            className={`inline-flex items-center px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${released
              ? 'bg-gradient-to-r from-[#0B2A4A] to-[#1D5B9B] text-white hover:shadow-lg transform hover:scale-105 cursor-pointer'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
          >
            {released ? (
              <>
                <Download className="w-6 h-6 mr-3" />
                Download Problem Statements
              </>
            ) : (
              <>
                <Lock className="w-6 h-6 mr-3" />
                Download Available After Release
              </>
            )}
          </button>

          {!released && (
            <p className="text-sm text-gray-500 mt-3">
              The download button will be enabled automatically when the countdown reaches zero.
            </p>
          )}
        </div>


      </div>
    </div>
  );
}
