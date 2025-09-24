import React, { useState, useEffect } from "react";
import {
  Award,
  Trophy,
  Medal,
  Star,
  TrendingUp,
  Users,
  Clock,
  Target,
  CheckCircle,
  Download,
  Share,
  Calendar,
  MapPin,
  User,
  Crown,
  Gift,
  Zap,
  BarChart3,
  FileText,
  ExternalLink,
} from "lucide-react";

const Result = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading (API call placeholder)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Sample Result Data (yeh API se aayega in real project)
  const resultData = {
    currentStudent: {
      name: "Amit Sharma",
      teamName: "Code Warriors",
      college: "RICR College of Engineering",
      participantId: "FM2025055",
      registrationDate: "2025-09-18",
      overallRank: 45,
      themeRank: 15,
      status: "Participant", // Winner | Runner-up | Participant | Qualified
      score: 76.5,
      maxScore: 100,
      percentile: 65,
      qualified: false,
      certificateAvailable: true,
      performance: {
        categories: [
          { name: "Innovation", score: 72, maxScore: 100, weight: 30 },
          { name: "Technical Implementation", score: 78, maxScore: 100, weight: 25 },
          { name: "Presentation", score: 70, maxScore: 100, weight: 20 },
          { name: "Problem Solving", score: 82, maxScore: 100, weight: 15 },
          { name: "Team Collaboration", score: 80, maxScore: 100, weight: 10 },
        ],
        strengths: ["Good Problem Solving", "Team Collaboration", "Technical Skills"],
        improvements: ["Innovation", "Presentation Skills", "Creative Thinking"],
      },
    },
    topPerformer: {
      name: "Ravi Kumar",
      teamName: "FutureMaze Innovators",
      college: "NRI Institute, Bhopal",
      participantId: "FM2025001",
      overallRank: 1,
      themeRank: 1,
      status: "Winner",
      score: 96.8,
      maxScore: 100,
      percentile: 99,
      performance: {
        categories: [
          { name: "Innovation", score: 98, maxScore: 100, weight: 30 },
          { name: "Technical Implementation", score: 95, maxScore: 100, weight: 25 },
          { name: "Presentation", score: 96, maxScore: 100, weight: 20 },
          { name: "Problem Solving", score: 97, maxScore: 100, weight: 15 },
          { name: "Team Collaboration", score: 98, maxScore: 100, weight: 10 },
        ],
      },
    },
    hackathon: {
      name: "FutureMaze Hackathon 2025",
      theme: "AI & Machine Learning",
      duration: "48 Hours",
      totalParticipants: 500,
      totalTeams: 125,
      venue: "NRI Institute, Bhopal",
      dates: "Nov 6-8, 2025",
    },
    timeline: [
      { event: "Registration", date: "2025-09-15", status: "completed" },
      { event: "Problem Statement Release", date: "2025-11-06", status: "completed" },
      { event: "Submission Deadline", date: "2025-11-08", status: "completed" },
      { event: "Evaluation", date: "2025-11-10", status: "completed" },
      { event: "Results Declared", date: "2025-11-12", status: "completed" },
    ],
  };

  // Helper Functions
  const getStatusColor = (status) => {
    switch (status) {
      case "Winner":
        return "text-green-600 bg-green-100";
      case "Runner-up":
        return "text-blue-600 bg-blue-100";
      case "Qualified":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Loader Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0B2A4A] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Loading Results...
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we fetch your performance data
          </p>
        </div>
      </div>
    );
  }

  // Main Result Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0B2A4A] to-[#2563EB] bg-clip-text text-transparent mb-4">
            Hackathon Results Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-600">{resultData.hackathon.name}</p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <Calendar className="w-4 h-4 mr-2" />
            {resultData.hackathon.dates}
          </div>
        </div>

        {/* Current Student Status Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex items-center mb-4 lg:mb-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#0B2A4A] to-[#1D5B9B] rounded-full flex items-center justify-center mr-4 sm:mr-6">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {resultData.currentStudent.name}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">Team: {resultData.currentStudent.teamName}</p>
                <p className="text-gray-500 text-xs sm:text-sm">{resultData.currentStudent.college}</p>
              </div>
            </div>
            <div className="text-left lg:text-right">
              <div className={`inline-flex items-center px-4 py-2 rounded-full font-semibold text-sm sm:text-base ${getStatusColor(resultData.currentStudent.status)}`}>
                <Award className="w-4 h-4 mr-2" />
                {resultData.currentStudent.status}
              </div>
              <div className="mt-2 grid grid-cols-3 gap-4 lg:gap-6 text-center lg:text-right">
                <div>
                  <div className="text-lg sm:text-xl font-bold text-[#0B2A4A]">#{resultData.currentStudent.overallRank}</div>
                  <div className="text-xs text-gray-500">Overall Rank</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-purple-600">{resultData.currentStudent.score}</div>
                  <div className="text-xs text-gray-500">Your Score</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-green-600">{resultData.currentStudent.percentile}%</div>
                  <div className="text-xs text-gray-500">Percentile</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Comparison Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Your Performance */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-3 text-[#0B2A4A]" />
                Your Performance
              </h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#0B2A4A]">{resultData.currentStudent.score}</div>
                <div className="text-xs text-gray-500">Total Score</div>
              </div>
            </div>

            <div className="space-y-4">
              {resultData.currentStudent.performance.categories.map((cat, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    <span className="text-sm text-gray-600 font-semibold">{cat.score}/{cat.maxScore}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-[#0B2A4A] to-[#1D5B9B] h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Weight: {cat.weight}%</span>
                    <span>{Math.round((cat.score / cat.maxScore) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Strengths & Improvements */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {resultData.currentStudent.performance.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-green-600 flex items-center">
                      <Star className="w-3 h-3 mr-2 fill-current" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-700 mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Areas to Improve
                </h4>
                <ul className="space-y-1">
                  {resultData.currentStudent.performance.improvements.map((improvement, idx) => (
                    <li key={idx} className="text-sm text-orange-600 flex items-center">
                      <Target className="w-3 h-3 mr-2" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Top Performer Comparison */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                <Crown className="w-5 h-5 mr-3 text-yellow-500" />
                Top Performer
              </h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-600">{resultData.topPerformer.score}</div>
                <div className="text-xs text-gray-500">Winning Score</div>
              </div>
            </div>

            <div className="mb-4 p-4 bg-white/70 rounded-lg">
              <div className="flex items-center mb-2">
                <Trophy className="w-6 h-6 text-yellow-500 mr-3" />
                <div>
                  <h4 className="font-bold text-gray-900">{resultData.topPerformer.name}</h4>
                  <p className="text-sm text-gray-600">{resultData.topPerformer.teamName}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mt-3">
                <div>
                  <div className="font-bold text-yellow-600">#{resultData.topPerformer.overallRank}</div>
                  <div className="text-xs text-gray-500">Rank</div>
                </div>
                <div>
                  <div className="font-bold text-yellow-600">{resultData.topPerformer.percentile}%</div>
                  <div className="text-xs text-gray-500">Percentile</div>
                </div>
                <div>
                  <div className="font-bold text-green-600">
                    +{(resultData.topPerformer.score - resultData.currentStudent.score).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">Score Diff</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {resultData.topPerformer.performance.categories.map((cat, index) => {
                const yourScore = resultData.currentStudent.performance.categories[index].score;
                const diff = cat.score - yourScore;
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{cat.score}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${diff > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {diff > 0 ? `+${diff}` : diff}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                        style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>



        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button className="flex items-center justify-center px-6 py-3 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#1D5B9B] transition-colors font-medium">
            <Download className="w-4 h-4 mr-2" />
            Download Certificate
          </button>
          <button className="flex items-center justify-center px-6 py-3 border border-[#0B2A4A] text-[#0B2A4A] rounded-lg hover:bg-[#0B2A4A] hover:text-white transition-colors font-medium">
            <Share className="w-4 h-4 mr-2" />
            Share Results
          </button>
          <button className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            <FileText className="w-4 h-4 mr-2" />
            Detailed Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
