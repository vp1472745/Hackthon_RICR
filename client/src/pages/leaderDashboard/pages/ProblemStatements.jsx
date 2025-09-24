import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Target,
  Award,
  Users,
  CheckCircle,
  BookOpen,
  Lightbulb
} from 'lucide-react';

const ProblemStatements = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedProblem, setExpandedProblem] = useState(null);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'environment', name: 'Environment' },
    { id: 'education', name: 'Education' },
    { id: 'fintech', name: 'FinTech' },
    { id: 'social', name: 'Social Impact' },
    { id: 'technology', name: 'Technology' }
  ];

  const problemStatements = [
    {
      id: 1,
      title: 'Digital Health Record Management System',
      category: 'healthcare',
      difficulty: 'Medium',
      duration: '48 hours',
      participants: 156,
      description: 'Create a comprehensive digital health record system that allows patients to securely store, access, and share their medical information with healthcare providers.',
      objectives: [
        'Develop secure patient data storage',
        'Implement role-based access control',
        'Create intuitive user interface',
        'Ensure HIPAA compliance'
      ],
      technicalRequirements: [
        'Web or mobile application',
        'Database management system',
        'Authentication and authorization',
        'Data encryption'
      ],
      deliverables: [
        'Working prototype',
        'Source code with documentation',
        'Demo video (3-5 minutes)',
        'Presentation slides'
      ],
      resources: [
        'Sample medical data sets',
        'UI/UX design guidelines',
        'Security best practices'
      ]
    },
    {
      id: 2,
      title: 'Smart Waste Management System',
      category: 'environment',
      difficulty: 'High',
      duration: '48 hours',
      participants: 89,
      description: 'Design an IoT-based smart waste management system that optimizes waste collection routes and monitors bin fill levels in real-time.',
      objectives: [
        'Monitor waste bin fill levels',
        'Optimize collection routes',
        'Reduce operational costs',
        'Improve environmental impact'
      ],
      technicalRequirements: [
        'IoT sensors simulation',
        'Route optimization algorithms',
        'Real-time data processing',
        'Dashboard for monitoring'
      ],
      deliverables: [
        'Functional prototype',
        'Algorithm implementation',
        'Mobile/web dashboard',
        'Technical documentation'
      ],
      resources: [
        'City map data',
        'Traffic pattern datasets',
        'Environmental impact metrics'
      ]
    },
    {
      id: 3,
      title: 'Adaptive Learning Platform',
      category: 'education',
      difficulty: 'Medium',
      duration: '48 hours',
      participants: 234,
      description: 'Build an AI-powered adaptive learning platform that personalizes educational content based on individual student learning patterns and preferences.',
      objectives: [
        'Personalized learning paths',
        'Progress tracking system',
        'Interactive content delivery',
        'Performance analytics'
      ],
      technicalRequirements: [
        'Machine learning algorithms',
        'Content management system',
        'User progress tracking',
        'Analytics dashboard'
      ],
      deliverables: [
        'Learning platform prototype',
        'ML model implementation',
        'Student dashboard',
        'Demonstration video'
      ],
      resources: [
        'Educational content samples',
        'Learning pattern datasets',
        'UI component library'
      ]
    },
    {
      id: 4,
      title: 'Micro-Investment Platform for Students',
      category: 'fintech',
      difficulty: 'High',
      duration: '48 hours',
      participants: 178,
      description: 'Create a micro-investment platform specifically designed for students to learn about financial markets while investing small amounts.',
      objectives: [
        'Enable micro-investments',
        'Educational investment guides',
        'Portfolio tracking',
        'Risk management tools'
      ],
      technicalRequirements: [
        'Payment gateway integration',
        'Market data APIs',
        'Portfolio management system',
        'Security implementation'
      ],
      deliverables: [
        'Investment platform',
        'Mobile application',
        'Educational modules',
        'Security documentation'
      ],
      resources: [
        'Market data APIs',
        'Financial education content',
        'Compliance guidelines'
      ]
    },
    {
      id: 5,
      title: 'Community Service Coordination App',
      category: 'social',
      difficulty: 'Low',
      duration: '48 hours',
      participants: 145,
      description: 'Develop a mobile application that connects volunteers with local community service opportunities and tracks their impact.',
      objectives: [
        'Match volunteers with opportunities',
        'Track volunteer hours',
        'Measure community impact',
        'Build volunteer network'
      ],
      technicalRequirements: [
        'Mobile app development',
        'Geolocation services',
        'User matching algorithms',
        'Impact tracking system'
      ],
      deliverables: [
        'Mobile application',
        'Volunteer dashboard',
        'Organization portal',
        'Impact analytics'
      ],
      resources: [
        'Volunteer organization database',
        'Community needs assessment',
        'Mobile development tools'
      ]
    }
  ];

  const filteredProblems = problemStatements.filter(problem => {
    const matchesCategory = selectedCategory === 'all' || problem.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'healthcare': return '🏥';
      case 'environment': return '🌱';
      case 'education': return '📚';
      case 'fintech': return '💰';
      case 'social': return '🤝';
      case 'technology': return '💻';
      default: return '📋';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6 text-[#0B2A4A]" />
          <h1 className="text-2xl font-bold text-gray-800">Problem Statements</h1>
        </div>
        <p className="text-gray-600">
          Explore available problem statements for the hackathon. Choose one that matches your team's expertise and interests.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search problem statements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredProblems.length} of {problemStatements.length} problem statements
        </div>
      </div>

      {/* Problem Statements Grid */}
      <div className="space-y-4">
        {filteredProblems.map((problem) => (
          <div key={problem.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getCategoryIcon(problem.category)}</span>
                    <h3 className="text-xl font-semibold text-gray-800">{problem.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">{problem.description}</p>
                  
                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      {problem.duration}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      {problem.participants} participants
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Target className="w-4 h-4" />
                      {problem.category}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setExpandedProblem(expandedProblem === problem.id ? null : problem.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View Details
                  {expandedProblem === problem.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedProblem === problem.id && (
              <div className="border-t border-gray-200">
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Objectives */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        Project Objectives
                      </h4>
                      <ul className="space-y-2">
                        {problem.objectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technical Requirements */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-purple-600" />
                        Technical Requirements
                      </h4>
                      <ul className="space-y-2">
                        {problem.technicalRequirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Deliverables */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-orange-600" />
                        Expected Deliverables
                      </h4>
                      <ul className="space-y-2">
                        {problem.deliverables.map((deliverable, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Resources */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        Available Resources
                      </h4>
                      <ul className="space-y-2">
                        {problem.resources.map((resource, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button className="px-6 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0d2d4f] transition-colors">
                      Select This Problem
                    </button>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Save for Later
                    </button>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Guidelines */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Problem Statement Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="mb-2"><strong>Selection Tips:</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Choose based on your team's technical skills</li>
              <li>• Consider the time constraints (48 hours)</li>
              <li>• Ensure you understand all requirements</li>
              <li>• Check available resources and APIs</li>
            </ul>
          </div>
          <div>
            <p className="mb-2"><strong>Important Notes:</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Problem statements are finalized and won't change</li>
              <li>• You can switch problems until November 7, 2025</li>
              <li>• All deliverables must be submitted by deadline</li>
              <li>• Use provided resources for best results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemStatements;