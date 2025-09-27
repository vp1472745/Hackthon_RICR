import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { problemStatementAPI } from '../../configs/api.js';
import { FileText, Download, AlertCircle, Loader, Lightbulb, Calendar, Target, Users } from 'lucide-react';

const ProblemStatements = () => {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get teamId from user info or cookie
  const hackathonUser = JSON.parse(localStorage.getItem('hackathonUser'));
  const teamId = hackathonUser?.team?._id || hackathonUser?.teamId || hackathonUser?.user?.teamId;

  useEffect(() => {
    const fetchProblem = async () => {
      console.log('teamId:', teamId);
      if (!teamId) {
        setProblem(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await problemStatementAPI.getByTeam(teamId);
        console.log('API response:', res.data);
        let problem = null;
        if (res.data.problemStatements && Array.isArray(res.data.problemStatements) && res.data.problemStatements.length > 0) {
          problem = res.data.problemStatements[0];
        } else if (res.data.problems && Array.isArray(res.data.problems) && res.data.problems.length > 0) {
          problem = res.data.problems[0];
        } else if (res.data.problemStatement) {
          problem = res.data.problemStatement;
        } else if (res.data.problem) {
          problem = res.data.problem;
        }
        setProblem(problem);
        setLoading(false);
      } catch (err) {
        setError('Failed to load problem statement');
        setLoading(false);
        console.error('Fetch error:', err);
      }
    };
    fetchProblem();
  }, [teamId]);

  const handleDownloadPDF = () => {
    if (!problem) return;
    
    const doc = new jsPDF();
    
    // Styling for PDF
    doc.setFillColor(11, 42, 74); // #0B2A4A
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('PROBLEM STATEMENT', 105, 20, { align: 'center' });
    
    doc.setFillColor(255, 255, 255);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(problem.PStitle, 20, 50);
    
    doc.setFontSize(12);
    doc.text('Description:', 20, 70);
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(problem.PSdescription || '', 170);
    doc.text(lines, 20, 80);
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 280);
    
    doc.save(`${problem.PStitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'problem_statement'}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-md w-full">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Problem Statement</h3>
          <p className="text-gray-600">Fetching your challenge details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Problem Statement</h1>
              <p className="text-gray-600 text-lg">Your hackathon challenge and project requirements</p>
            </div>
          </div>
          
          {!teamId && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">Team Not Found</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Please ensure you're part of a team to view problem statements.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Error Loading Problem Statement</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* No Problem Statement State */}
        {!loading && !error && !problem && teamId && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Problem Statement Assigned</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Your team hasn't been assigned a problem statement yet. Please check back later or contact the organizers.
            </p>
            <div className="bg-blue-50 rounded-xl p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-700">
                Problem statements are typically assigned after theme selection and team finalization.
              </p>
            </div>
          </div>
        )}

        {/* Problem Statement Content */}
        {!loading && !error && problem && (
          <div className="space-y-6">
            {/* Problem Statement Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{problem.PStitle}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Assigned: {new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>Hackathon Challenge</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold whitespace-nowrap"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Problem Description
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                      {problem.PSdescription}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Understand the Problem</h4>
                <p className="text-gray-600 text-sm">Read the statement carefully and identify key challenges</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Team Discussion</h4>
                <p className="text-gray-600 text-sm">Brainstorm solutions with your team members</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Start Building</h4>
                <p className="text-gray-600 text-sm">Begin developing your innovative solution</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemStatements;