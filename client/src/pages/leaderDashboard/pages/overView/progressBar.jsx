import React, { useState, useEffect } from 'react';
import { 
  User, 
  Users, 
  Target, 
  CheckCircle, 
  Circle, 
  Clock
} from 'lucide-react';

const ProgressBar = () => {


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

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate', handleStorageChange);
    };
  }, []);

  // Step 1: Profile Completion (33.33%)
  const isProfileComplete = () => {
    if (leaderProfile) {
      return leaderProfile.fullName && leaderProfile.email && leaderProfile.phone && 
             leaderProfile.collegeName && leaderProfile.course;
    } else if (hackathonUser.user) {
      return hackathonUser.user.fullName && hackathonUser.user.email && hackathonUser.user.phone && 
             hackathonUser.user.collegeName && hackathonUser.user.course;
    } else {
      return hackathonUser.name && hackathonUser.email && hackathonUser.phone && 
             hackathonUser.college && hackathonUser.course;
    }
  };

  // Step 2: Team Members (33.33% with incremental progress)
  const getTeamProgress = () => {
    let teamMembers = [];
    if (apiTeamMembers && apiTeamMembers.length > 0) {
      teamMembers = apiTeamMembers;
    } else if (registrationData.teamMembers) {
      teamMembers = registrationData.teamMembers;
    } else if (leaderProfile && leaderProfile.teamInfo && leaderProfile.teamInfo.members) {
      teamMembers = leaderProfile.teamInfo.members;
    }
    const currentCount = teamMembers.length;
    const requiredCount = 4;
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

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const profileWeight = 33.33;
    const teamWeight = 33.33;
    const themeWeight = 33.34;
    let totalProgress = 0;
    if (isProfileComplete()) {
      totalProgress += profileWeight;
    }
    const teamProgress = getTeamProgress();
    totalProgress += (teamProgress.stepProgress / 100) * teamWeight;
    if (isThemeSelected()) {
      totalProgress += themeWeight;
    }
    return Math.round(totalProgress * 100) / 100;
  };

  const profileComplete = isProfileComplete();
  const teamProgress = getTeamProgress();
  const themeSelected = isThemeSelected();
  const overallProgress = calculateOverallProgress();

  const steps = [
    {
      id: 'profile',
      title: 'Complete Team Leader Profile',
      description: 'Fill in all your personal details as team leader',
      icon: User,
      isCompleted: profileComplete,
      progress: profileComplete ? 100 : (() => {
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
      weight: 33.33
    },
    {
      id: 'team',
      title: 'Add 3 Team Members',
      description: 'Build your complete hackathon team (3 members + you = 4 total)',
      icon: Users,
      isCompleted: teamProgress.isComplete,
      progress: teamProgress.stepProgress,
      status: `${teamProgress.current}/${teamProgress.required} members`,
      weight: 33.33
    },
    {
      id: 'theme',
      title: 'Select Project Theme',
      description: 'Choose your hackathon challenge theme',
      icon: Target,
      isCompleted: themeSelected,
      progress: themeSelected ? 100 : 0,
      status: themeSelected ? `Selected: ${selectedTheme}` : 'Not Selected',
      weight: 33.34
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



  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm"
      style={{ maxHeight: '100vh', overflow: 'hidden' }}
    >
      <div className="p-4">
        {/* Loading type progress bar */}
        
        <style>
          {`
            @keyframes progressBarLoading {
              0% { width: 0; }
              100% { width: ${overallProgress}%; }
            }
          `}
        </style>
        {/* Remove individual step progress bars and descriptions */}
        <div className="flex flex-wrap gap-4 mb-5">
          {steps.map((step, idx) => {
            const status = getStepStatus(step);
            const Icon = step.icon;
            const StatusIcon = status.icon;
            return (
              <div
                key={idx}
                className={`flex flex-col justify-between w-full sm:w-[32%] bg-white rounded-lg border ${status.borderColor} shadow-sm ${status.bgColor} p-4 transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div className='flex items-center'>
                    <Icon className={`w-7 h-7 ${status.color} mr-2`} />
                  <span className="font-semibold text-base">{step.title}</span>
                  </div>
                  <span className={`flex items-center gap-1 text-xs ${status.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {step.status}
                  </span>
                </div>
                {/* <div className="flex items-center justify-end">
                  
                  <span className="text-xs text-gray-400">{step.progress}%</span>
                </div> */}
              </div>
            );
          })}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-700"
            style={{
              width: `${overallProgress}%`,
              animation: 'progressBarLoading 2s linear'
            }}
          />
          <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-white">
            {overallProgress}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;