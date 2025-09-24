import React, { useState } from 'react';
import { 
  Lightbulb, 
  Globe, 
  Heart, 
  Leaf, 
  Smartphone, 
  GraduationCap, 
  Building, 
  Gamepad2,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

const ProjectTheme = () => {
  const [selectedTheme, setSelectedTheme] = useState(
    localStorage.getItem('selectedTheme') || null
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(null);

  const themes = [
    {
      id: 'healthcare',
      title: 'Healthcare & Medical',
      icon: Heart,
      description: 'Develop solutions for healthcare challenges, telemedicine, patient management, or medical diagnostics.',
      gradient: 'from-red-400 to-pink-500',
      examples: ['Telemedicine platforms', 'Health monitoring apps', 'Medical diagnosis tools'],
      difficulty: 'Medium',
      popularity: 85
    },
    {
      id: 'environment',
      title: 'Environment & Sustainability',
      icon: Leaf,
      description: 'Create eco-friendly solutions for climate change, waste management, or renewable energy.',
      gradient: 'from-green-400 to-emerald-500',
      examples: ['Carbon footprint trackers', 'Waste management systems', 'Smart energy solutions'],
      difficulty: 'High',
      popularity: 78
    },
    {
      id: 'education',
      title: 'Education & Learning',
      icon: GraduationCap,
      description: 'Build platforms for online learning, skill development, or educational accessibility.',
      gradient: 'from-blue-400 to-indigo-500',
      examples: ['E-learning platforms', 'Skill assessment tools', 'Virtual classrooms'],
      difficulty: 'Medium',
      popularity: 92
    },
    {
      id: 'fintech',
      title: 'FinTech & Banking',
      icon: Building,
      description: 'Develop financial solutions, payment systems, or blockchain-based applications.',
      gradient: 'from-yellow-400 to-orange-500',
      examples: ['Digital payment systems', 'Investment platforms', 'Cryptocurrency tools'],
      difficulty: 'High',
      popularity: 88
    },
    {
      id: 'social-impact',
      title: 'Social Impact & Community',
      icon: Globe,
      description: 'Address social issues, community building, or public welfare challenges.',
      gradient: 'from-purple-400 to-indigo-500',
      examples: ['Community platforms', 'Social welfare apps', 'Volunteer management'],
      difficulty: 'Medium',
      popularity: 75
    },
    {
      id: 'mobile-apps',
      title: 'Mobile & Web Applications',
      icon: Smartphone,
      description: 'Create innovative mobile or web applications with unique user experiences.',
      gradient: 'from-cyan-400 to-blue-500',
      examples: ['Productivity apps', 'Social networking', 'Utility applications'],
      difficulty: 'Low',
      popularity: 95
    },
    {
      id: 'gaming',
      title: 'Gaming & Entertainment',
      icon: Gamepad2,
      description: 'Develop games, entertainment platforms, or interactive media experiences.',
      gradient: 'from-pink-400 to-purple-500',
      examples: ['Mobile games', 'AR/VR experiences', 'Interactive media'],
      difficulty: 'Medium',
      popularity: 82
    },
    {
      id: 'open-innovation',
      title: 'Open Innovation',
      icon: Lightbulb,
      description: 'Present your own innovative idea that doesn\'t fit into other categories.',
      gradient: 'from-gray-400 to-gray-600',
      examples: ['AI solutions', 'IoT projects', 'Emerging technologies'],
      difficulty: 'Variable',
      popularity: 70
    }
  ];

  const handleThemeSelect = (themeId) => {
    if (selectedTheme === themeId) return;
    
    setPendingSelection(themeId);
    setShowConfirmation(true);
  };

  const confirmSelection = () => {
    setSelectedTheme(pendingSelection);
    localStorage.setItem('selectedTheme', pendingSelection);
    setShowConfirmation(false);
    setPendingSelection(null);
    
    // Show success message
    alert('Theme selected successfully! You can change it until November 6, 2025.');
  };

  const cancelSelection = () => {
    setShowConfirmation(false);
    setPendingSelection(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const selectedThemeData = themes.find(theme => theme.id === selectedTheme);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="w-6 h-6 text-[#0B2A4A]" />
              <h1 className="text-2xl font-bold text-gray-800">Project Themes</h1>
            </div>
            <p className="text-gray-600">
              Choose a theme for your hackathon project. You can change your selection until November 6, 2025.
            </p>
          </div>
          
          {selectedTheme && (
            <div className="text-right">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Theme Selected</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {selectedThemeData?.title}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Selection (if any) */}
      {selectedTheme && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800">Current Selection</h2>
          </div>
          
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${selectedThemeData?.gradient} rounded-xl flex items-center justify-center`}>
              {selectedThemeData && React.createElement(selectedThemeData.icon, { 
                className: "w-6 h-6 text-white" 
              })}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">
                {selectedThemeData?.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {selectedThemeData?.description}
              </p>
              
              <div className="mt-3 text-sm text-gray-600">
                <span className="font-medium">You can still change your selection until November 6, 2025</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theme Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isSelected = selectedTheme === theme.id;
          
          return (
            <div
              key={theme.id}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                isSelected 
                  ? 'border-green-500 ring-2 ring-green-200' 
                  : 'border-gray-200 hover:border-[#0B2A4A]'
              }`}
              onClick={() => handleThemeSelect(theme.id)}
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${theme.gradient} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {isSelected && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-2">{theme.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{theme.description}</p>
              </div>

              {/* Content */}
              <div className="px-6 pb-4">
                {/* Examples */}
                <div className="mb-4">
                  <div className="text-xs font-medium text-gray-700 mb-2">Example Projects:</div>
                  <div className="space-y-1">
                    {theme.examples.slice(0, 2).map((example, index) => (
                      <div key={index} className="text-xs text-gray-600 flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {example}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(theme.difficulty)}`}>
                      {theme.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">{theme.popularity}% popular</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    isSelected
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-[#0B2A4A] text-white hover:bg-[#0d2d4f]'
                  }`}
                  disabled={isSelected}
                >
                  {isSelected ? 'Selected' : 'Select Theme'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection Guidelines */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Theme Selection Guidelines
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Important Deadlines</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Theme selection deadline: November 6, 2025, 11:59 PM IST</li>
              <li>• You can change your theme until the deadline</li>
              <li>• Late selections will not be accepted</li>
              <li>• Ensure your team agrees on the selected theme</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Selection Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Consider your team's technical expertise</li>
              <li>• Choose based on available resources and tools</li>
              <li>• Think about the project scope for 48 hours</li>
              <li>• Research existing solutions in your chosen area</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Theme Selection</h3>
              
              {pendingSelection && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${themes.find(t => t.id === pendingSelection)?.gradient} rounded-lg flex items-center justify-center`}>
                      {React.createElement(themes.find(t => t.id === pendingSelection)?.icon, {
                        className: "w-5 h-5 text-white"
                      })}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {themes.find(t => t.id === pendingSelection)?.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {themes.find(t => t.id === pendingSelection)?.description}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to select this theme? You can change it until November 6, 2025.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={confirmSelection}
                  className="flex-1 px-4 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0d2d4f] transition-colors"
                >
                  Confirm Selection
                </button>
                <button
                  onClick={cancelSelection}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTheme;