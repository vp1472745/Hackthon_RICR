import React from 'react';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Trophy,
  FileText,
  RefreshCw
} from 'lucide-react';

const TeamLeaderCard = ({ 
  leaderProfile, 
  teamData, 
  loading, 
  error, 
  fetchLeaderProfile 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-[#0B2A4A]" />
          <h2 className="text-lg font-semibold text-gray-800">Team Leader</h2>
        </div>
        <button 
          onClick={fetchLeaderProfile}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-[#0B2A4A] transition-colors disabled:opacity-50"
          title="Refresh profile"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B2A4A]"></div>
          <span className="ml-2 text-gray-600">Loading profile...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">{error}</div>
          <button 
            onClick={fetchLeaderProfile}
            className="text-[#0B2A4A] hover:underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gradient-to-br from-[#0B2A4A] to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">
              {(leaderProfile?.fullName || teamData.name || 'T').charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* Profile Details */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">
              {leaderProfile?.fullName || teamData.name || 'Not Set'}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{leaderProfile?.email || teamData.email || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{leaderProfile?.phone || teamData.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="w-4 h-4" />
                <span>{leaderProfile?.collegeName || teamData.college || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{leaderProfile?.course || teamData.course || 'Not provided'}</span>
              </div>
              {leaderProfile?.collegeBranch && (
                <div className="flex items-center gap-2 text-gray-600">
                  <GraduationCap className="w-4 h-4" />
                  <span>{leaderProfile.collegeBranch}</span>
                </div>
              )}
              {leaderProfile?.GitHubProfile && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="w-4 h-4" />
                  <a 
                    href={leaderProfile.GitHubProfile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#0B2A4A] hover:underline"
                  >
                    GitHub Profile
                  </a>
                </div>
              )}
            </div>
            
            {/* Leader Badge */}
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#0B2A4A] text-white">
                <Trophy className="w-3 h-3 mr-1" />
                Team Leader
              </span>
              {leaderProfile?.teamId && (
                <span className="text-xs text-gray-500">
                  Team: {leaderProfile.teamId.teamName || 'Unknown'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamLeaderCard;