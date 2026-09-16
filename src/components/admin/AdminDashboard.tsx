import React from 'react';
import { User, CollegeStats } from '../../types';
import {
  Users,
  Briefcase,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Award,
  Shield,
  ArrowRight,
  Sparkles,
  Building,
  CheckCircle2
} from 'lucide-react';

interface AdminDashboardProps {
  admin: User;
  stats: CollegeStats | null;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ admin, stats, onNavigateTab }) => {
  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-purple-200 border border-white/20 inline-block mb-3">
            🛡️ Central Administrative Office • Principal &amp; Dean Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Smart College ERP Administration
          </h1>
          <p className="text-sm text-purple-100 mt-2 leading-relaxed">
            Welcome, {admin.name}. You have unrestricted administrative governance over institutional admissions, faculty allocations, syllabus schemas, and college-wide AI analytics.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => onNavigateTab('students')}
              className="px-4 py-2 bg-white text-purple-950 hover:bg-purple-50 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-purple-700" />
              Manage Student Enrolment
            </button>
            <button
              onClick={() => onNavigateTab('faculty')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              Manage Faculty Directory
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* College Macro Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Students */}
        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolment</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats?.totalStudents || 1240}</span>
            <span className="text-xs font-semibold text-emerald-600">+12% YoY</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Active undergraduate students</p>
        </div>

        {/* Metric 2: Total Faculty */}
        <div
          onClick={() => onNavigateTab('faculty')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty Staff</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats?.totalFaculty || 86}</span>
            <span className="text-xs font-semibold text-indigo-600">Full-Time</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Across 6 academic departments</p>
        </div>

        {/* Metric 3: Overall College Attendance */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">College Attendance</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats?.overallAttendancePercentage || 84.8}%</span>
            <span className="text-xs font-semibold text-emerald-600">Healthy</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Exceeds university mandate (&gt;75%)</p>
        </div>

        {/* Metric 4: Academic Pass Percentage */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pass Rate</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats?.passPercentage || 94.2}%</span>
            <span className="text-xs font-semibold text-amber-700">Top Tier</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">University semester results</p>
        </div>
      </div>

      {/* College Departments & Modules Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Student Enrolment Control */}
        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Student Directory</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Register new students, update contact records, assign semesters, and audit academic standing.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 mt-4">
            Manage Students →
          </span>
        </div>

        {/* Faculty Staffing Control */}
        <div
          onClick={() => onNavigateTab('faculty')}
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Faculty Roster</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Appoint professors, assign subjects, configure designations, and monitor lecture distribution.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 mt-4">
            Manage Faculty →
          </span>
        </div>

        {/* Departments & Subjects */}
        <div
          onClick={() => onNavigateTab('departments')}
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Building className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Departments &amp; Subjects</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Configure academic branches (BCA, BSC-IT, MCA, BBA) and subject curriculum credit structures.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 mt-4">
            Manage Curriculum →
          </span>
        </div>
      </div>

    </div>
  );
};
