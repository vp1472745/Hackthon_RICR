import React, { useState, useEffect } from 'react';
import { 
  User, 
  Users, 
  Target, 
  CheckCircle, 
  Circle, 
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react';

const ProgressBar = () => {
  const [expandedStep, setExpandedStep] = useState(null);
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get data from localStorage
  const hackathonUser = JSON.parse(localStorage.getItem('hackathonUser')) || {};
  const leaderProfile = JSON.parse(localStorage.getItem('leaderProfile')) || null;
  const apiTeamMembers = JSON.parse(localStorage.getItem('apiTeamMembers')) || [];
  const registrationData = JSON.parse(localStorage.getItem('registrationData')) || {};
  const selectedTheme = localStorage.getItem('selectedTheme');
  
  // Listen for localStorage changes to refresh progress
  useEffect(() => {
    const handleStorageChange = () => {
      setRefreshTrigger(prev => prev + 1);
    };

    // Listen for custom storage events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate', handleStorageChange);
    };
  }, []);
  
  // Step 1: Profile Completion (33.33%)
  const isProfileComplete = () => {
    // Check both hackathonUser and leaderProfile for different data sources
    if (leaderProfile) {
      // API-based data structure
      return leaderProfile.fullName && leaderProfile.email && leaderProfile.phone && 
             leaderProfile.collegeName && leaderProfile.course;
    } else if (hackathonUser.user) {
      // Token-based user structure
      return hackathonUser.user.fullName && hackathonUser.user.email && hackathonUser.user.phone && 
             hackathonUser.user.collegeName && hackathonUser.user.course;
    } else {
      // Direct hackathonUser structure (fallback)
      return hackathonUser.name && hackathonUser.email && hackathonUser.phone && 
             hackathonUser.college && hackathonUser.course;
    }
  };

  // Step 2: Team Members (33.33% with incremental progress)
  const getTeamProgress = () => {
    // Check multiple data sources for team members
    let teamMembers = [];
    
    if (apiTeamMembers && apiTeamMembers.length > 0) {
      // Use API team members (most reliable)
      teamMembers = apiTeamMembers;
    } else if (registrationData.teamMembers) {
      // Use registration data
      teamMembers = registrationData.teamMembers;
    } else if (leaderProfile && leaderProfile.teamInfo && leaderProfile.teamInfo.members) {
      // Use leader profile team info
      teamMembers = leaderProfile.teamInfo.members;
    }
    
    const currentCount = teamMembers.length;
    const requiredCount = 4; // 1 leader + 3 members = 4 total, but only counting members here
    const stepProgress = Math.min(currentCount / requiredCount, 1) * 100;
    
    return {
      current: currentCount,
      required: requiredCount,
      isComplete: currentCount >= requiredCount,
      stepProgress: stepProgress
    };
  };

  // Step 3: Theme Selection (33.33%)
  const isThemeSelected = () => {
    return selectedTheme && selectedTheme !== null;
  };

  // Calculate overall progress (exact fractions to reach 100%)
  const calculateOverallProgress = () => {
    const profileWeight = 33.33;
    const teamWeight = 33.33;
    const themeWeight = 33.34; // Slightly higher to reach exactly 100%

    let totalProgress = 0;

    // Profile step
    if (isProfileComplete()) {
      totalProgress += profileWeight;
    }

    // Team step (incremental)
    const teamProgress = getTeamProgress();
    totalProgress += (teamProgress.stepProgress / 100) * teamWeight;

    // Theme step
    if (isThemeSelected()) {
      totalProgress += themeWeight;
    }

    return Math.round(totalProgress * 100) / 100;
  };

  const profileComplete = isProfileComplete();
  const teamProgress = getTeamProgress();
  const themeSelected = isThemeSelected();
  const overallProgress = calculateOverallProgress();
  
  // Use refreshTrigger to ensure reactivity to localStorage changes
  refreshTrigger; // This forces re-evaluation when localStorage changes
  
  // Debug: Log progress calculation results
  console.log('ProgressBar Results:', {
    profileComplete,
    teamProgress,
    themeSelected,
    overallProgress,
    dataStatus: {
      hasHackathonUser: !!hackathonUser.user || !!Object.keys(hackathonUser).length,
      hasLeaderProfile: !!leaderProfile,
      teamMembersCount: apiTeamMembers?.length || 0
    }
  });

  const steps = [
    {
      id: 'profile',
      title: 'Complete Team Leader Profile',
      description: 'Fill in all your personal details as team leader',
      icon: User,
      isCompleted: profileComplete,
      progress: profileComplete ? 100 : (() => {
        // Calculate partial progress based on completed fields
        const fields = [
          leaderProfile?.fullName || hackathonUser.user?.fullName || hackathonUser.name,
          leaderProfile?.email || hackathonUser.user?.email || hackathonUser.email,
          leaderProfile?.phone || hackathonUser.user?.phone || hackathonUser.phone,
          leaderProfile?.collegeName || hackathonUser.user?.collegeName || hackathonUser.college,
          leaderProfile?.course || hackathonUser.user?.course || hackathonUser.course
        ];
        const completedFields = fields.filter(field => !!field).length;
        return Math.round((completedFields / fields.length) * 100);
      })(),
      status: profileComplete ? 'Complete' : 'Incomplete',
      weight: 33.33,
      moreDetails: {
        requirements: [
          { 
            item: 'Full Name', 
            completed: !!(leaderProfile?.fullName || hackathonUser.user?.fullName || hackathonUser.name)
          },
          { 
            item: 'Email Address', 
            completed: !!(leaderProfile?.email || hackathonUser.user?.email || hackathonUser.email)
          },
          { 
            item: 'Phone Number', 
            completed: !!(leaderProfile?.phone || hackathonUser.user?.phone || hackathonUser.phone)
          },
          { 
            item: 'College/University', 
            completed: !!(leaderProfile?.collegeName || hackathonUser.user?.collegeName || hackathonUser.college)
          },
          { 
            item: 'Course/Branch', 
            completed: !!(leaderProfile?.course || hackathonUser.user?.course || hackathonUser.course)
          }
        ],
        tips: [
          'Make sure your email is valid for important updates',
          'Phone number should be active for SMS notifications',
          'College information helps us with certificates',
          'Complete profile unlocks team leader privileges'
        ]
      }
    },
    {
      id: 'team',
      title: 'Add 3 Team Members',
      description: 'Build your complete hackathon team (3 members + you = 4 total)',
      icon: Users,
      isCompleted: teamProgress.isComplete,
      progress: teamProgress.stepProgress,
      status: `${teamProgress.current}/${teamProgress.required} members`,
      weight: 33.33,
      moreDetails: {
        requirements: [
          { item: 'Team Leader (You)', completed: true },
          { 
            item: 'Team Member 1', 
            completed: (apiTeamMembers?.length || registrationData.teamMembers?.length || leaderProfile?.teamInfo?.members?.length || 0) >= 1 
          },
          { 
            item: 'Team Member 2', 
            completed: (apiTeamMembers?.length || registrationData.teamMembers?.length || leaderProfile?.teamInfo?.members?.length || 0) >= 2 
          },
          { 
            item: 'Team Member 3', 
            completed: (apiTeamMembers?.length || registrationData.teamMembers?.length || leaderProfile?.teamInfo?.members?.length || 0) >= 3 
          }
        ],
        tips: [
          'Each member needs their own registration',
          'Diverse skills make stronger teams',
          'Maximum 4 members per team allowed',
          'All members must be students',
          'You can add members from Manage Team section'
        ]
      }
    },
    {
      id: 'theme',
      title: 'Select Project Theme',
      description: 'Choose your hackathon challenge theme',
      icon: Target,
      isCompleted: themeSelected,
      progress: themeSelected ? 100 : 0,
      status: themeSelected ? `Selected: ${selectedTheme}` : 'Not Selected',
      weight: 33.34,
      moreDetails: {
        requirements: [
          { item: 'Browse Available Themes', completed: true },
          { item: 'Select One Theme', completed: !!themeSelected },
          { item: 'Confirm Selection', completed: !!themeSelected }
        ],
        tips: [
          'Choose theme based on your team\'s expertise',
          'Read problem statements carefully',
          'You can change theme until submission starts',
          'Some themes have specific technology requirements',
          'Visit Project Theme section to explore options'
        ]
      }
    }
  ];

  const getStepStatus = (step) => {
    if (step.isCompleted) {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        progressColor: 'bg-green-500'
      };
    } else if (step.progress > 0) {
      return {
        icon: Clock,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        progressColor: 'bg-blue-500'
      };
    } else {
      return {
        icon: Circle,
        color: 'text-gray-400',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        progressColor: 'bg-gray-300'
      };
    }
  };

  const completedSteps = steps.filter(step => step.isCompleted).length;
  const totalSteps = steps.length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-6 h-6 text-[#0B2A4A]" />
              Profile Completion Progress
            </h2>
            <p className="text-gray-600 mt-1">Complete all steps to participate in the hackathon</p>
          </div>
          
          {/* Overall Progress Circle */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallProgress / 100)}`}
                className="text-[#0B2A4A] transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">
                {Math.round(overallProgress)}%
              </span>
            </div>
          </div>
        </div>



        {/* Main Dropdown for All Steps and Details */}
        <div className="mt-6">
          {/* Main Dropdown Header */}
          <div 
            className="bg-gradient-to-r from-[#0B2A4A] to-blue-600 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg"
            onClick={() => setIsMainDropdownOpen(!isMainDropdownOpen)}
          >
            <div className="p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold text-lg">Detailed Progress Breakdown</h3>
                    <p className="text-white/80 text-sm">View step-by-step progress and requirements</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm text-white/80">{completedSteps}/{totalSteps} steps</div>
                    <div className="text-lg font-bold">{Math.round(overallProgress)}% Complete</div>
                  </div>
                  <button
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label={isMainDropdownOpen ? 'Hide detailed breakdown' : 'Show detailed breakdown'}
                    aria-expanded={isMainDropdownOpen}
                  >
                    {isMainDropdownOpen ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dropdown Content */}
          {isMainDropdownOpen && (
            <div className="mt-3 bg-white rounded-lg border border-gray-200 shadow-sm animate-fadeIn">
              <div className="p-6">
                {/* Individual Steps with Dropdowns */}
                <div className="space-y-4">
                  {steps.map((step) => {
                    const status = getStepStatus(step);
                    const StatusIcon = status.icon;
                    const isExpanded = expandedStep === step.id;
                    
                    return (
                      <div 
                        key={step.id} 
                        className={`rounded-lg border ${status.borderColor} ${status.bgColor} transition-all duration-200 overflow-hidden`}
                      >
                        {/* Main Step Header */}
                        <div className="p-4">
                          <div className="flex items-center gap-4">
                            {/* Step Icon */}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${status.bgColor} border-2 ${status.borderColor} flex items-center justify-center`}>
                              <StatusIcon className={`w-6 h-6 ${status.color}`} />
                            </div>
                            
                            {/* Step Content */}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${status.bgColor} ${status.color}`}>
                                    {step.status}
                                  </span>
                                  {/* Dropdown Toggle */}
                                  <button
                                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                                    className="p-1 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B2A4A] focus:ring-opacity-50"
                                    aria-label={isExpanded ? 'Hide details' : 'Show details'}
                                    aria-expanded={isExpanded}
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="w-5 h-5 text-gray-600" />
                                    ) : (
                                      <ChevronDown className="w-5 h-5 text-gray-600" />
                                    )}
                                  </button>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                              
                              {/* Individual Step Progress Bar */}
                              <div className="mb-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${status.progressColor}`}
                                    style={{ width: `${step.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>{Math.round(step.progress)}% Complete</span>
                                <span>Weight: {step.weight}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details Dropdown */}
                        {isExpanded && (
                          <div className="border-t border-gray-200 bg-white/70 p-4 animate-fadeIn">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Requirements Checklist */}
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                  <CheckCircle className="w-5 h-5 text-blue-600" />
                                  Requirements Checklist
                                </h4>
                                <div className="space-y-2">
                                  {step.moreDetails.requirements.map((req, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                                      {req.completed ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                      ) : (
                                        <Circle className="w-5 h-5 text-gray-400" />
                                      )}
                                      <span className={`text-sm ${req.completed ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                                        {req.item}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Tips & Guidelines */}
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                  Tips & Guidelines
                                </h4>
                                <div className="space-y-2">
                                  {step.moreDetails.tips.map((tip, index) => (
                                    <div key={index} className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                                      <div className="w-2 h-2 bg-[#0B2A4A] rounded-full mt-2 flex-shrink-0"></div>
                                      <span className="text-sm text-gray-600">{tip}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                              <button
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  step.isCompleted
                                    ? 'bg-green-100 text-green-700 cursor-default'
                                    : 'bg-[#0B2A4A] text-white hover:bg-[#1D5B9B] hover:shadow-md transform hover:-translate-y-0.5'
                                }`}
                                disabled={step.isCompleted}
                              >
                                {step.isCompleted ? (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    Completed
                                  </>
                                ) : (
                                  <>
                                    <ArrowRight className="w-4 h-4" />
                                    Complete {step.title}
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Overall Status Message */}
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="flex items-start gap-3">
                    {overallProgress === 100 ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="w-6 h-6 text-[#0B2A4A] flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`text-sm font-medium ${
                        overallProgress === 100 ? 'text-green-800' : 'text-[#0B2A4A]'
                      }`}>
                        {overallProgress === 100 
                          ? '🎉 Congratulations! Your profile setup is complete.'
                          : `You're ${Math.round(overallProgress)}% complete. Keep going!`
                        }
                      </p>
                      <p className={`text-xs mt-1 ${
                        overallProgress === 100 ? 'text-green-600' : 'text-blue-700'
                      }`}>
                        {overallProgress === 100 
                          ? 'You are now ready to fully participate in the hackathon!'
                          : 'Click on the dropdown arrows above to see detailed requirements for each step.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
