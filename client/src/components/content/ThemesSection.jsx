import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaRobot, FaLeaf, FaBitcoin, FaHospital, FaGlobe, FaBook, FaCode, FaGamepad, FaShieldAlt
} from 'react-icons/fa';
import { AiOutlineClose } from "react-icons/ai";
import { SectionHeader } from "./SharedComponents";
import { containerVariants, itemVariants, iconHoverVariants, THEME } from "./constants";
import HackathonThemeModal from "./HackathonThemeModal";
import { homeAPI } from "../../configs/api.js";

// Function to map theme names to icons
const getThemeIcon = (themeName) => {
  const iconMap = {
    'AI & Machine Learning': <FaRobot />,
    'Artificial Intelligence': <FaRobot />,
    'Machine Learning': <FaRobot />,
    'Sustainable Technology': <FaLeaf />,
    'Green Technology': <FaLeaf />,
    'Environment': <FaLeaf />,
    'FinTech Innovation': <FaBitcoin />,
    'FinTech': <FaBitcoin />,
    'Blockchain': <FaBitcoin />,
    'HealthTech Solutions': <FaHospital />,
    'HealthTech': <FaHospital />,
    'Healthcare': <FaHospital />,
    'EdTech & Education Innovation': <FaBook />,
    'EdTech': <FaBook />,
    'Education': <FaBook />,
    'Global Connectivity & IoT': <FaGlobe />,
    'IoT': <FaGlobe />,
    'Connectivity': <FaGlobe />,
    'Web Development': <FaCode />,
    'Software Development': <FaCode />,
    'App Development': <FaCode />,
    'Gaming': <FaGamepad />,
    'Game Development': <FaGamepad />,
    'Security': <FaShieldAlt />,
    'Cybersecurity': <FaShieldAlt />,
    'Data Security': <FaShieldAlt />,
  };

  // Try to find exact match first
  if (iconMap[themeName]) {
    return iconMap[themeName];
  }

  // Try to find partial match
  for (const [key, icon] of Object.entries(iconMap)) {
    if (themeName.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(themeName.toLowerCase())) {
      return icon;
    }
  }

  // Default icon if no match found
  return <FaCode />;
};

export default function ThemesSection() {
  const MAX_TEAMS = 10; // maximum teams allowed per theme
  const [isThemeModalOpen, setThemeModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [isTeamsModalOpen, setTeamsModalOpen] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState(null);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await homeAPI.getAllThemes();
     // console.log('API Response:', response.data);

      // Extract themes from response
      const themesData = response.data?.themes || [];
      setThemes(themesData);
    } catch (err) {
      console.error('Error fetching themes:', err);
      setError(err.message || 'Failed to fetch themes');
    } finally {
      setLoading(false);
    }
  };
  // Loading state
  if (loading) {
    return (
      <section className="w-full py-8 md:py-10">
        <SectionHeader
          title="Hackathon Themes"
          subtitle="Wide Range of Exciting themes to build innovative solutions that can make a real impact"
        />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2A4A]"></div>
          <span className="ml-3 text-gray-600">Loading themes...</span>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="w-full py-8 md:py-10">
        <SectionHeader
          title="Hackathon Themes"
          subtitle="Wide Range of Exciting themes to build innovative solutions that can make a real impact"
        />
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <p className="text-lg font-semibold">Unable to load themes</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={fetchThemes}
            className="px-6 py-3 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#16406b] transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // Empty state
  if (themes.length === 0) {
    return (
      <section className="w-full py-8 md:py-10">
        <SectionHeader
          title="Hackathon Themes"
          subtitle="Wide Range of Exciting themes to build innovative solutions that can make a real impact"
        />
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No themes available at the moment.</p>
          <p className="text-gray-500 text-sm mt-2">Please check back later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="w-full py-8 md:py-10">
        <SectionHeader
          title="Hackathon Themes"
          subtitle="Wide Range of Exciting themes to build innovative solutions that can make a real impact"
        />

        <motion.div
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {themes.map((theme, idx) => {
            const enrolled = theme.teamCount ?? 0;
            const remaining = Math.max(0, MAX_TEAMS - enrolled);
            return (
            <motion.article
              key={theme._id || idx}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 group "
              variants={itemVariants}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4 mb-5">
                <motion.div className="text-3xl md:text-4xl text-[#0B2A4A]" variants={iconHoverVariants}>
                  {getThemeIcon(theme.themeName)}
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold cursor-default" style={{ color: THEME.primary }}>
                    {theme.themeName}
                  </h3>
                  <p className="text-xs text-orange-500 mt-1 font-bold">
               Only 10 teams can select this theme.
                  </p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed cursor-default line-clamp-2">
                {theme.themeShortDescription || theme.themeDescription?.substring(0, 150) + '...' || 'No description available'}
              </p>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2 ">
                  {theme.teamCount !== undefined && (
                    // Show remaining and total, e.g., '7 left (of 10)' or 'Full (of 10)'
                    enrolled > 0 ? (
                      <span className={`inline-block text-sm mt-3 text-white py-2 px-5 rounded-lg ${remaining === 0 ? 'bg-red-500' : 'bg-[#0B2A4A]'}`}>
                        {remaining > 0 ? `${remaining} left` : 'Full'}
                      </span>
                    ) : (
                      <span className={`inline-block text-sm mt-3 text-white py-2 px-5 rounded-lg bg-[#0B2A4A]`}>
                        {`${MAX_TEAMS} left`}
                      </span>
                    )
                  )}
                </div>
                <button
                  className="text-sm bg-[#0B2A4A]  text-white mt-3   py-2 px-5 rounded-lg   cursor-pointer  transition-colors"
                  type="button"
                  onClick={() => {
                    setThemeModalOpen(true);
                    setSelectedTheme({
                      title: theme.themeName,
                      description: theme.themeDescription,
                      shortDescription: theme.themeShortDescription,
                      themeShortDescription: theme.themeShortDescription, // API field name
                      themeDescription: theme.themeDescription, // API field name
                      icon: getThemeIcon(theme.themeName),
                      teamCount: theme.teamCount,
                      enrolledTeams: theme.enrolledTeams,
                      _id: theme._id,
                      themeName: theme.themeName, // API field name
                      status: theme.status
                    });
                  }}
                >
                  Read More
                </button>
              </div>
            </motion.article>
            );
          })}
        </motion.div>
      </section>
      <HackathonThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        themeData={selectedTheme}
      />

      {/* Enrolled Teams Modal */}
      {isTeamsModalOpen && selectedTeams && (
        <div className="fixed inset-0 h-screen z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] p-6 overflow-hidden">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
              onClick={() => setTeamsModalOpen(false)}
              aria-label="Close"
            >
              <AiOutlineClose size={24} />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Enrolled Teams</h2>
              {(() => {
                const enrolled = selectedTeams.teamCount ?? 0;
                const remaining = Math.max(0, MAX_TEAMS - enrolled);
                return (
                  <p className="text-sm text-gray-600">{selectedTeams.themeName} • {remaining > 0 ? `${remaining} left` : 'Full'}</p>
                );
              })()}
              <div className="h-1 w-full bg-blue-500 rounded mt-4 mb-6"></div>

              <div className="max-h-96 overflow-y-auto">
                {selectedTeams.enrolledTeams && selectedTeams.enrolledTeams.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTeams.enrolledTeams.map((team, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {team.teamName || `Team ${index + 1}`}
                            </h4>
                            {team.leaderName && (
                              <p className="text-sm text-gray-600">
                                Leader: {team.leaderName}
                              </p>
                            )}
                            {team.memberCount && (
                              <p className="text-xs text-gray-500">
                                {team.memberCount} members
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            {team.registrationDate && (
                              <p className="text-xs text-gray-500">
                                {new Date(team.registrationDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No team details available</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {Math.max(0, MAX_TEAMS - (selectedTeams.teamCount ?? 0)) > 0 ? `${Math.max(0, MAX_TEAMS - (selectedTeams.teamCount ?? 0))} slots left` : 'Full'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                onClick={() => setTeamsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}