import React, { useState, useEffect } from "react";
import {
  Crown,
  Mail,
  Phone,
  User,
  MapPin,
  BookOpen,
  Award,
  Copy,
  Check,
  Loader2
} from "lucide-react";
import api from '../../../configs/api.js';

const defaultLeader = {
  fullName: "No Team Leader Found",
  email: "",
  phone: "",
  collegeName: "",
  semester: "",
  course: "",
  stream: "",
  role: "Leader",
  status: "Please add a team leader"
};

export default function TeamLeaderCardProfessional() {
  const [leader, setLeader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState({ email: false, phone: false });

  // Fetch team leader from backend
  useEffect(() => {
    fetchTeamLeader();
  }, []);

  const fetchTeamLeader = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/members/getmember');

      if (response?.data?.success && response.data.data) {
        const members = response.data.data.members || [];
        const teamLeader = members.find(member => member.role === 'Leader');
        setLeader(teamLeader || defaultLeader);
      } else {
        setLeader(defaultLeader);
      }
    } catch (err) {
      console.error('Error fetching team leader:', err);
      setError('Failed to load team leader');
      setLeader(defaultLeader);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (value, key) => {
    try {
      if (!value) return;
      await navigator.clipboard.writeText(value);
      setCopied(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const truncated = (text, len = 28) =>
    text ? (text.length > len ? text.slice(0, len - 1) + "…" : text) : "";

  // Loading
  if (loading) {
    return (
      <article className="max-w-sm mx-auto bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0B2A4A]" />
            <p className="text-sm text-slate-600">Loading leader...</p>
          </div>
        </div>
      </article>
    );
  }

  // Error
  if (error) {
    return (
      <article className="max-w-sm mx-auto bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 text-center">
          <Crown className="w-8 h-8 mx-auto mb-3 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="max-w-sm mx-auto bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <header className="relative p-3 flex items-center justify-between bg-gradient-to-r from-[#0B2A4A] to-[#1D5B9B] text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-white/10 p-2">
            <Crown size={16} />
          </div>
          <div>
            <p className="text-xs font-medium">Team Leader</p>
            <p className="text-sm font-semibold leading-tight">{leader.fullName || defaultLeader.fullName}</p>
          </div>
        </div>

        {/* small role badge */}
        <div className="text-xs bg-white/10 px-2 py-1 rounded-md">
          <span className="font-medium">{leader.role || 'Leader'}</span>
        </div>
      </header>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Avatar + meta */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B2A4A] to-[#1D5B9B] flex items-center justify-center text-white shadow">
            <User size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900 truncate">{leader.fullName}</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{leader.stream || leader.course}</p>
            <p className="text-xs text-slate-400 mt-1">{leader.semester ? `${leader.semester} • ${truncated(leader.collegeName || '', 36)}` : truncated(leader.collegeName || '', 36)}</p>
          </div>
        </div>

        {/* short stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 p-2 rounded-md border border-slate-100 text-center">
            <BookOpen size={14} className="mx-auto text-[#0B2A4A] mb-1" />
            <p className="text-[10px] text-slate-500">Course</p>
            <p className="text-sm font-medium text-slate-900 mt-1 truncate">{truncated(leader.course || '—', 36)}</p>
          </div>

          <div className="bg-slate-50 p-2 rounded-md border border-slate-100 text-center">
            <Award size={14} className="mx-auto text-[#0B2A4A] mb-1" />
            <p className="text-[10px] text-slate-500">Status</p>
            <p className="text-sm font-medium text-slate-900 mt-1 truncate">{truncated(leader.status || leader.role, 28)}</p>
          </div>

          <div className="col-span-2 bg-slate-50 p-2 rounded-md border border-slate-100 text-center">
            <MapPin size={14} className="mx-auto text-[#0B2A4A] mb-1" />
            <p className="text-[10px] text-slate-500">College</p>
            <p className="text-sm font-medium text-slate-900 mt-1 truncate">{truncated(leader.collegeName || '—', 60)}</p>
          </div>
        </div>
        {/* contacts */}
        <div className="space-y-2">
          {/* Email */}
          <div className="flex items-center justify-between p-2 rounded-md border border-slate-100 bg-white">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-[#0B2A4A] flex-shrink-0">
                <Mail size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-500">Email</p>
                <p className="text-sm font-medium text-slate-900 truncate">{leader.email || '—'}</p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(leader.email, 'email')}
              aria-label="Copy email"
              title="Copy email"
              className="p-1 rounded-md hover:bg-slate-50 flex-shrink-0"
            >
              {copied.email ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between p-2 rounded-md border border-slate-100 bg-white">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-[#0B2A4A] flex-shrink-0">
                <Phone size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-500">Phone</p>
                <p className="text-sm font-medium text-slate-900 truncate">{leader.phone || '—'}</p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(leader.phone, 'phone')}
              aria-label="Copy phone"
              title="Copy phone"
              className="p-1 rounded-md hover:bg-slate-50 flex-shrink-0"
            >
              {copied.phone ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

      </div>
    </article>
  );
}
