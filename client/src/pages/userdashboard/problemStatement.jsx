import React, { useState, useEffect } from 'react';
import {
  Clock,
  Target,
  ChevronDown,
  ChevronRight,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  ExternalLink,
  Lightbulb,
  Code,
  Database,
  Smartphone,
  Globe,
  Shield,
  Brain,
  Cpu,
  Star
} from 'lucide-react';

const ProblemStatement = () => {
  const [selectedTheme, setSelectedTheme] = useState('');
  const [timeLeft, setTimeLeft] = useState({});
  const [isCountdownExpired, setIsCountdownExpired] = useState(false);
  const [expandedProblem, setExpandedProblem] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [themeDownloadTimer, setThemeDownloadTimer] = useState(null);
  const [problemDownloadTimer, setProblemDownloadTimer] = useState(null);

  // Set the problem statement release date (November 6, 2025, 11:59 PM IST)
  const releaseDateTime = new Date('2025-11-06T23:59:00+05:30');

  const themes = [
    {
      id: 'ai-ml',
      name: 'Artificial Intelligence & Machine Learning',
      icon: Brain,
      description: 'Build intelligent solutions using AI/ML technologies',
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700'
    },
    {
      id: 'web-development',
      name: 'Web Development & Frontend',
      icon: Globe,
      description: 'Create innovative web applications and user interfaces',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    },
    {
      id: 'mobile-app',
      name: 'Mobile Application Development',
      icon: Smartphone,
      description: 'Develop mobile solutions for iOS and Android platforms',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700'
    },
    {
      id: 'blockchain',
      name: 'Blockchain & Cryptocurrency',
      icon: Shield,
      description: 'Explore decentralized technologies and crypto solutions',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700'
    },
    {
      id: 'iot',
      name: 'Internet of Things (IoT)', 
      icon: Cpu,
      description: 'Connect devices and create smart IoT ecosystems',
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700'
    },
    {
      id: 'data-science',
      name: 'Data Science & Analytics',
      icon: Database,
      description: 'Analyze data and extract meaningful insights',
      color: 'from-teal-500 to-cyan-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-700'
    }
  ];

  const problemStatements = {
    'ai-ml': [
      {
        id: 'ai-1',
        title: 'Smart Healthcare Assistant',
        difficulty: 'Advanced',
        description: 'Develop an AI-powered healthcare assistant that can diagnose diseases from symptoms and medical reports.',
        requirements: [
          'Implement natural language processing for symptom analysis',
          'Create machine learning models for disease prediction',
          'Design a user-friendly interface for patients and doctors',
          'Ensure HIPAA compliance and data privacy'
        ],
        techStack: ['Python', 'TensorFlow/PyTorch', 'NLP Libraries', 'React/Vue.js'],
        timeline: '48 hours',
        resources: [
          'Medical datasets (provided)',
          'API documentation',
          'ML model templates'
        ]
      },
      {
        id: 'ai-2',
        title: 'Intelligent Traffic Management System',
        difficulty: 'Intermediate',
        description: 'Build an AI system to optimize traffic flow and reduce congestion in smart cities.',
        requirements: [
          'Computer vision for traffic monitoring',
          'Predictive algorithms for traffic optimization',
          'Real-time dashboard for traffic management',
          'Integration with existing traffic infrastructure'
        ],
        techStack: ['OpenCV', 'Python', 'Machine Learning', 'Dashboard Framework'],
        timeline: '48 hours',
        resources: [
          'Traffic simulation datasets',
          'Camera feed samples',
          'City traffic APIs'
        ]
      }
    ],
    'web-development': [
      {
        id: 'web-1',
        title: 'Sustainable E-commerce Platform',
        difficulty: 'Intermediate',
        description: 'Create an e-commerce platform focused on sustainable and eco-friendly products.',
        requirements: [
          'Product catalog with sustainability ratings',
          'Carbon footprint calculator for purchases',
          'User authentication and payment integration',
          'Admin panel for inventory management'
        ],
        techStack: ['React/Next.js', 'Node.js', 'MongoDB', 'Stripe API'],
        timeline: '48 hours',
        resources: [
          'Product database samples',
          'Payment gateway sandbox',
          'UI/UX design templates'
        ]
      },
      {
        id: 'web-2',
        title: 'Online Learning Management System',
        difficulty: 'Advanced',
        description: 'Develop a comprehensive LMS for online education with interactive features.',
        requirements: [
          'Course creation and management tools',
          'Video streaming and interactive content',
          'Student progress tracking and analytics',
          'Real-time communication features'
        ],
        techStack: ['React', 'Node.js', 'WebRTC', 'Socket.io', 'MongoDB'],
        timeline: '48 hours',
        resources: [
          'Video content samples',
          'Course structure templates',
          'Analytics frameworks'
        ]
      }
    ],
    'mobile-app': [
      {
        id: 'mobile-1',
        title: 'Mental Health Companion App',
        difficulty: 'Intermediate',
        description: 'Build a mobile app to support mental health with mood tracking and therapeutic features.',
        requirements: [
          'Mood tracking and journaling features',
          'Meditation and mindfulness exercises',
          'Crisis intervention and emergency contacts',
          'Data privacy and security measures'
        ],
        techStack: ['React Native/Flutter', 'Firebase', 'Push Notifications', 'Analytics'],
        timeline: '48 hours',
        resources: [
          'Mental health APIs',
          'Meditation content library',
          'UI/UX guidelines for health apps'
        ]
      }
    ],
    'blockchain': [
      {
        id: 'blockchain-1',
        title: 'Decentralized Voting System',
        difficulty: 'Advanced',
        description: 'Create a secure, transparent voting system using blockchain technology.',
        requirements: [
          'Smart contract development for voting logic',
          'Web interface for voters and administrators',
          'Identity verification and voter authentication',
          'Real-time result tracking and transparency'
        ],
        techStack: ['Solidity', 'Web3.js', 'React', 'MetaMask Integration'],
        timeline: '48 hours',
        resources: [
          'Blockchain testnet access',
          'Smart contract templates',
          'Web3 development tools'
        ]
      }
    ],
    'iot': [
      {
        id: 'iot-1',
        title: 'Smart Campus Management System',
        difficulty: 'Advanced',
        description: 'Develop an IoT system for managing campus resources and student activities.',
        requirements: [
          'Sensor integration for environmental monitoring',
          'Smart attendance and access control',
          'Energy management and optimization',
          'Mobile app for students and staff'
        ],
        techStack: ['Arduino/Raspberry Pi', 'MQTT', 'Node.js', 'Mobile App Framework'],
        timeline: '48 hours',
        resources: [
          'IoT hardware kits (provided)',
          'Sensor documentation',
          'Cloud platform access'
        ]
      }
    ],
    'data-science': [
      {
        id: 'data-1',
        title: 'Predictive Analytics for Student Performance',
        difficulty: 'Intermediate',
        description: 'Build a data science solution to predict and improve student academic performance.',
        requirements: [
          'Data cleaning and preprocessing pipeline',
          'Predictive models for academic outcomes',
          'Interactive dashboard for educators',
          'Recommendation system for learning paths'
        ],
        techStack: ['Python', 'Pandas', 'Scikit-learn', 'Plotly/Dash', 'Jupyter'],
        timeline: '48 hours',
        resources: [
          'Student performance datasets',
          'Statistical analysis templates',
          'Visualization libraries'
        ]
      }
    ]
  };

  // Countdown timer logic for problem release
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = releaseDateTime.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setIsCountdownExpired(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [releaseDateTime]);

  // Countdown timer for theme download
  useEffect(() => {
    if (themeDownloadTimer > 0) {
      const timer = setTimeout(() => {
        setThemeDownloadTimer(themeDownloadTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [themeDownloadTimer]);

  // Countdown timer for problem download
  useEffect(() => {
    if (problemDownloadTimer > 0) {
      const timer = setTimeout(() => {
        setProblemDownloadTimer(problemDownloadTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [problemDownloadTimer]);

  const handleThemeSelect = (themeId) => {
    if (isUnlocked || isCountdownExpired) {
      setSelectedTheme(themeId);
      setSelectedProblem(null);
      setThemeDownloadTimer(5);
      setProblemDownloadTimer(null);
    }
  };

  const toggleProblemExpansion = (problemId) => {
    setExpandedProblem(expandedProblem === problemId ? null : problemId);
  };

  const handleProblemSelect = (problem) => {
    setSelectedProblem(problem);
    setProblemDownloadTimer(5);
  };

  const downloadThemeProblemStatements = () => {
    if (!selectedTheme) return;
    
    // Create a text file with all problem statements for the selected theme
    const theme = themes.find(t => t.id === selectedTheme);
    const problems = problemStatements[selectedTheme];
    
    const themeText = `
Theme: ${theme.name}
Description: ${theme.description}

Problem Statements:
${problems.map((problem, index) => `
${index + 1}. ${problem.title}
   Difficulty: ${problem.difficulty}
   Description: ${problem.description}
   Requirements:
   ${problem.requirements.map((req, i) => `     ${i+1}. ${req}`).join('\n   ')}
   Tech Stack: ${problem.techStack.join(', ')}
   Timeline: ${problem.timeline}
   Resources: ${problem.resources.join(', ')}
`).join('\n')}
    `;
    
    // Create a blob and download link
    const blob = new Blob([themeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name.replace(/\s+/g, '_')}_All_Problem_Statements.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadProblemStatement = () => {
    if (!selectedProblem) return;
    
    // Create a text file with problem details
    const problemText = `
Problem Statement: ${selectedProblem.title}
Theme: ${themes.find(t => t.id === selectedTheme)?.name}
Difficulty: ${selectedProblem.difficulty}
Description: ${selectedProblem.description}

Requirements:
${selectedProblem.requirements.map((req, i) => `${i+1}. ${req}`).join('\n')}

Tech Stack: ${selectedProblem.techStack.join(', ')}

Timeline: ${selectedProblem.timeline}

Provided Resources:
${selectedProblem.resources.join('\n')}
    `;
    
    // Create a blob and download link
    const blob = new Blob([problemText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedProblem.title.replace(/\s+/g, '_')}_Problem_Statement.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
  };

  const toggleUnlockThemes = () => {
    setIsUnlocked(!isUnlocked);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            FutureMaze <span className="bg-gradient-to-r from-[#0B2A4A] to-[#1D5B9B] bg-clip-text text-transparent">Problem Statements</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Choose your theme and prepare for the ultimate coding challenge. Problem statements will be revealed on the countdown completion.
          </p>
          
          {/* Admin Controls */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <button 
              onClick={toggleAdminMode}
              className={`px-4 py-2 rounded-lg font-medium ${isAdmin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} flex items-center`}
            >
              {isAdmin ? 'Exit Admin Mode' : 'Admin Mode'}
            </button>
            
            {isAdmin && (
              <button 
                onClick={toggleUnlockThemes}
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${isUnlocked ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
              >
                {isUnlocked ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                {isUnlocked ? 'Lock Themes' : 'Unlock Themes'}
              </button>
            )}
          </div>
          
      
        </div>

        {/* Theme Download Section */}
        {selectedTheme && themeDownloadTimer !== null && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-bold text-blue-800 mb-1">
                  Theme Problem Statements Ready for Download
                </h3>
                <p className="text-blue-600">
                  {themeDownloadTimer > 0 
                    ? `Download will be available in ${themeDownloadTimer} seconds...` 
                    : 'Click the button below to download all problem statements for this theme'}
                </p>
              </div>
              <button 
                onClick={downloadThemeProblemStatements}
                disabled={themeDownloadTimer > 0}
                className={`px-6 py-3 rounded-lg font-medium flex items-center ${themeDownloadTimer > 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                <Download className="w-5 h-5 mr-2" />
                {themeDownloadTimer > 0 ? `Wait ${themeDownloadTimer}s` : 'Download All Problem Statements'}
              </button>
            </div>
          </div>
        )}

        {/* Problem Download Section */}
        {selectedProblem && problemDownloadTimer !== null && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-bold text-green-800 mb-1">
                  Problem Statement Ready for Download
                </h3>
                <p className="text-green-600">
                  {problemDownloadTimer > 0 
                    ? `Download will be available in ${problemDownloadTimer} seconds...` 
                    : 'Click the button below to download this problem statement'}
                </p>
              </div>
              <button 
                onClick={downloadProblemStatement}
                disabled={problemDownloadTimer > 0}
                className={`px-6 py-3 rounded-lg font-medium flex items-center ${problemDownloadTimer > 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
              >
                <Download className="w-5 h-5 mr-2" />
                {problemDownloadTimer > 0 ? `Wait ${problemDownloadTimer}s` : 'Download Problem Statement'}
              </button>
            </div>
          </div>
        )}

        {/* Theme Selection */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            Choose Your Theme
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = selectedTheme === theme.id;
              const isDisabled = !isUnlocked && !isCountdownExpired;
              
              return (
                <div
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    isDisabled 
                      ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-200' 
                      : isSelected
                        ? `${theme.bgColor} ${theme.borderColor} border-2 shadow-lg transform scale-105`
                        : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'
                  }`}
                >
                  {isDisabled && (
                    <div className="absolute top-3 right-3">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${
                    isSelected ? `bg-gradient-to-r ${theme.color}` : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  
                  <h3 className={`font-bold text-lg mb-2 ${
                    isSelected ? theme.textColor : 'text-gray-900'
                  }`}>
                    {theme.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm">
                    {theme.description}
                  </p>
                  
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className={`w-6 h-6 ${theme.textColor}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Problem Statements */}
        {selectedTheme && (isUnlocked || isCountdownExpired) && (
          <div className="mb-8">
            <div className="flex items-center justify-center mb-8">
              <Target className="w-8 h-8 text-[#0B2A4A] mr-3" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Problem Statements - {themes.find(t => t.id === selectedTheme)?.name}
              </h2>
            </div>

            <div className="space-y-6">
              {problemStatements[selectedTheme]?.map((problem) => (
                <div key={problem.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => toggleProblemExpansion(problem.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-bold text-gray-900 mr-4">{problem.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{problem.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {problem.timeline}
                          </div>
                          <div className="flex items-center">
                            <Code className="w-4 h-4 mr-1" />
                            {problem.techStack.length} Technologies
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        {expandedProblem === problem.id ? (
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedProblem === problem.id && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Requirements */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                            Requirements
                          </h4>
                          <ul className="space-y-2">
                            {problem.requirements.map((req, index) => (
                              <li key={index} className="flex items-start text-gray-700">
                                <div className="w-2 h-2 bg-[#0B2A4A] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tech Stack */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <Code className="w-5 h-5 text-blue-600 mr-2" />
                            Recommended Tech Stack
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {problem.techStack.map((tech, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Resources */}
                        <div className="lg:col-span-2">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <FileText className="w-5 h-5 text-purple-600 mr-2" />
                            Provided Resources
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {problem.resources.map((resource, index) => (
                              <div key={index} className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                                <Download className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="text-gray-700 text-sm">{resource}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button 
                          onClick={() => handleProblemSelect(problem)}
                          className="px-6 py-2 bg-gradient-to-r from-[#0B2A4A] to-[#1D5B9B] text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center"
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Choose This Problem
                        </button>
                        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Resources
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guidelines */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 sm:p-8 border border-blue-200">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-6 h-6 text-blue-600 mr-3" />
            Important Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div className="space-y-2">
              <div className="flex items-start">
                <Star className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Team changes allowed until November 6, 2025, 11:59 PM IST</span>
              </div>
              <div className="flex items-start">
                <Star className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Maximum 4 members per team (including team leader)</span>
              </div>
              <div className="flex items-start">
                <Star className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>48-hour development timeline</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <Star className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Submit working prototype with source code</span>
              </div>
              <div className="flex items-start">
                <Star className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Present your solution to judges</span>
              </div>
              <div className="flex items-start">
                <Star className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Original code and innovative approach required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemStatement;