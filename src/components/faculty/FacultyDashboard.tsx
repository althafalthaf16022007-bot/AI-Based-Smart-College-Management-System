import React from 'react';
import { User, Subject } from '../../types';
import {
  Users,
  CheckSquare,
  Award,
  FilePlus,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface FacultyDashboardProps {
  faculty: User;
  onNavigateTab: (tab: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ faculty, onNavigateTab }) => {
  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-amber-100 border border-white/20 inline-block mb-3">
            👨‍🏫 Faculty Portal • {faculty.department}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {faculty.name}!
          </h1>
          <p className="text-sm text-amber-100 mt-2 leading-relaxed">
            Manage your student lecture registers, grade continuous internal assessments (CIA), and inspect performance analytics.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => onNavigateTab('attendance')}
              className="px-4 py-2 bg-white text-amber-950 hover:bg-amber-50 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <CheckSquare className="w-4 h-4 text-amber-700" />
              Take Today's Attendance
            </button>
            <button
              onClick={() => onNavigateTab('marks')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              Enter Exam Marks
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Faculty Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Assigned Subjects */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Courses</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">2</span>
            <span className="text-xs font-semibold text-indigo-600">Subjects</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">BCA-401 (DBMS) &amp; BCA-402 (Web Tech)</p>
        </div>

        {/* Metric 2: Enrolled Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">60</span>
            <span className="text-xs font-semibold text-emerald-600">Active</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">4th Semester BCA Batch 2024</p>
        </div>

        {/* Metric 3: Average Class Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Class Attendance</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">82.4%</span>
            <span className="text-xs font-semibold text-emerald-600">Satisfactory</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">4 students below 75% threshold</p>
        </div>

        {/* Metric 4: Pending Submissions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Grading</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">3</span>
            <span className="text-xs font-semibold text-purple-600">Tasks</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">New lab submissions to review</p>
        </div>
      </div>

      {/* Faculty Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Attendance Action */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <CheckSquare className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Mark Attendance</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Record lecture-wise student presence with quick "Mark All Present" toggle and custom remarks.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 mt-4">
            Open Attendance Register →
          </span>
        </div>

        {/* Marks Entry Action */}
        <div
          onClick={() => onNavigateTab('marks')}
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Enter &amp; Update Marks</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Input Internal 1, Internal 2, Mid-Term, and Practical exam marks with automated grade assignment.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 mt-4">
            Enter Marks Portal →
          </span>
        </div>

        {/* Assignments Action */}
        <div
          onClick={() => onNavigateTab('assignments')}
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FilePlus className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Assignments &amp; Grading</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Create coursework tasks, set deadlines, evaluate submitted student answers, and give feedback.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 mt-4">
            Manage Assignments →
          </span>
        </div>
      </div>

    </div>
  );
};
