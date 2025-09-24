import React from 'react';
import { Edit, Trash2, User, Mail, Phone, MapPin, GraduationCap, BookOpen } from 'lucide-react';

const TeamMemberCard = ({
  member,
  onEdit,
  onDelete
}) => {
  const displayName = member.fullName || member.name || 'Unknown';

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200/60 p-5 w-full max-w-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0B2A4A] to-[#1D5B9B] rounded-full flex items-center justify-center text-white">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">{displayName}</h3>
            <p className="text-xs text-slate-500">{member.role || 'Team Member'}</p>
          </div>
        </div>

        {/* Top Right Action Icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            aria-label="Edit"
            className="p-1.5 rounded-md hover:bg-slate-100"
          >
            <Edit className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={onDelete}
            aria-label="Delete"
            className="p-1.5 rounded-md hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        {member.email && (
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>{member.email}</span>
          </div>
        )}

        {member.phone && (
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-4 h-4 text-slate-400" />
            <span>{member.phone}</span>
          </div>
        )}

        {member.collegeName && (
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{member.collegeName}</span>
          </div>
        )}

        {member.course && (
          <div className="flex items-center gap-2 text-slate-600">
            <GraduationCap className="w-4 h-4 text-slate-400" />
            <span>{member.course}</span>
          </div>
        )}

        {member.stream && (
          <div className="flex items-center gap-2 text-slate-600">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>
              {member.stream} - {member.semester}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;
