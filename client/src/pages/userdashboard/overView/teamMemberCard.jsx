import React, { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  Edit3,
  Trash2,
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import api from '../../../configs/api';

// Professional compact Team Members list (cards)
export default function TeamMemberCardProfessional({
  onEdit = () => {},
  onDelete = () => {}
}) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState({}); // keyed by memberId: { email: bool, phone: bool }

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/members/getmember');

      if (response?.data?.success && response.data.data) {
        const allMembers = response.data.data.members || [];
        // exclude Leader
        const members = allMembers.filter(m => m.role !== 'Leader');
        setTeamMembers(members);
      } else {
        setTeamMembers([]);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError('Failed to load team members');
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const getAvatar = (name) =>
    name ? name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() : 'TM';

  const copyToClipboard = async (value, memberId, key) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(prev => ({ ...prev, [memberId]: { ...(prev[memberId] || {}), [key]: true } }));
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [memberId]: { ...(prev[memberId] || {}), [key]: false } }));
      }, 1800);
    } catch (e) {
      console.error('copy failed', e);
    }
  };

  const truncated = (text, len = 28) =>
    text ? (text.length > len ? text.slice(0, len - 1) + '…' : text) : '—';

  // Loading / Error states
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0B2A4A]" />
            <p className="text-sm text-slate-600">Loading team members…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 text-center">
          <Users className="w-8 h-8 mx-auto mb-3 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#0B2A4A] to-[#1D5B9B] text-white rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Users size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Team Members</h2>
            <p className="text-xs opacity-80">{teamMembers.length} members</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {teamMembers.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm text-slate-500">No team members found</p>
            <p className="text-xs text-slate-400 mt-1">Add members to display them here</p>
          </div>
        ) : (
          teamMembers.map(member => {
            const memberId = member._id || member.id || member.email || Math.random();
            const memberCopied = copied[memberId] || {};
            return (
              <article
                key={memberId}
                className="relative bg-white border border-slate-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* action icons top-right */}
                <div className="absolute right-3 top-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(member)}
                    title="Edit"
                    aria-label={`Edit ${member.fullName}`}
                    className="p-1.5 rounded-md hover:bg-slate-50"
                  >
                    <Edit3 size={14} className="text-slate-600" />
                  </button>
                  <button
                    onClick={() => onDelete(member)}
                    title="Delete"
                    aria-label={`Delete ${member.fullName}`}
                    className="p-1.5 rounded-md hover:bg-red-50"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                </div>

                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B2A4A] to-[#1D5B9B] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {getAvatar(member.fullName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1" title={member.fullName}>
                      {truncated(member.fullName, 20)}
                    </h3>
                    <div className="text-xs text-[#0B2A4A] font-medium mb-1" title={member.role}>
                      {truncated(member.role, 18)}
                    </div>
                    <div className="text-xs text-slate-500" title={member.collegeName}>
                      {truncated(member.collegeName, 22)}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-2.5">
                  {/* Email */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/30 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-7 h-7 rounded-md bg-blue-100 flex items-center justify-center text-[#0B2A4A] flex-shrink-0">
                        <Mail size={13} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium mb-0.5">Email</p>
                        <p className="text-xs font-medium text-slate-900" title={member.email}>
                          {truncated(member.email, 25)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(member.email || '', memberId, 'email')}
                      aria-label="Copy email"
                      title="Copy email"
                      className="p-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all flex-shrink-0"
                    >
                      {memberCopied.email ? 
                        <Check size={14} className="text-green-600" /> : 
                        <Copy size={14} className="text-slate-400 hover:text-slate-600" />
                      }
                    </button>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/30 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-7 h-7 rounded-md bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0">
                        <Phone size={13} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium mb-0.5">Phone</p>
                        <p className="text-xs font-medium text-slate-900" title={member.phone}>
                          {truncated(member.phone, 18)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(member.phone || '', memberId, 'phone')}
                      aria-label="Copy phone"
                      title="Copy phone"
                      className="p-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all flex-shrink-0"
                    >
                      {memberCopied.phone ? 
                        <Check size={14} className="text-green-600" /> : 
                        <Copy size={14} className="text-slate-400 hover:text-slate-600" />
                      }
                    </button>
                  </div>

                  {/* Course */}
                  {member.course && (
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-100 bg-slate-50/30">
                      <div className="w-7 h-7 rounded-md bg-purple-100 flex items-center justify-center text-purple-700 flex-shrink-0">
                        <GraduationCap size={13} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium mb-0.5">Course</p>
                        <p className="text-xs font-medium text-slate-900" title={member.course}>
                          {truncated(member.course, 30)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Stream & Semester */}
                  {member.stream && (
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-100 bg-slate-50/30">
                      <div className="w-7 h-7 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-700 flex-shrink-0">
                        <BookOpen size={13} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium mb-0.5">Stream</p>
                        <p className="text-xs font-medium text-slate-900" title={`${member.stream} - ${member.semester}`}>
                          {truncated(`${member.stream} - ${member.semester}`, 28)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
