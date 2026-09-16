import React from 'react';
import { User, StudentAttendanceSummary, MarkRecord, Assignment, TimetableSlot } from '../../types';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Sparkles,
  TrendingUp,
  Award,
  ArrowRight,
  BookOpen,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface StudentDashboardProps {
  student: User;
  overallAttendancePercentage: number;
  attendanceSummary: StudentAttendanceSummary[];
  studentMarks: MarkRecord[];
  assignments: (Assignment & { submissionStatus: string })[];
  todaysClasses: TimetableSlot[];
  onNavigateTab: (tab: string) => void;
  onOpenAIHub: (tool?: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  overallAttendancePercentage,
  attendanceSummary,
  studentMarks,
  assignments,
  todaysClasses,
  onNavigateTab,
  onOpenAIHub,
}) => {
  // Compute pending assignments
  const pendingAssignments = assignments.filter((a) => a.submissionStatus === 'Pending');

  // Compute average marks percentage
  const marksAvg =
    studentMarks.length > 0
      ? Math.round(
          studentMarks.reduce((acc, m) => acc + (m.marksObtained / m.maxMarks) * 100, 0) /
            studentMarks.length
        )
      : 84;

  const isAttendanceShortage = overallAttendancePercentage < 75;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-indigo-100 border border-white/20 inline-block mb-3">
            🎓 {student.department} • {student.semester || '4th Semester'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {student.name}!
          </h1>
          <p className="text-sm text-indigo-100 mt-2 leading-relaxed">
            Your college portal is active. You have <strong className="text-white">{todaysClasses.length} lectures</strong> scheduled today and <strong className="text-white">{pendingAssignments.length} pending assignments</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => onOpenAIHub('chat')}
              className="px-4 py-2 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Ask AI Academic Assistant
            </button>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              View Full Attendance Log
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Subtle Decorative Geometric Background */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-radial from-indigo-500/20 to-transparent pointer-events-none" />
      </div>

      {/* Attendance Shortage Alert if < 75% */}
      {isAttendanceShortage && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-amber-900">University Attendance Condonation Alert</p>
            <p className="mt-0.5 text-amber-700">
              Your overall attendance is currently <strong>{overallAttendancePercentage}%</strong>, which is below the mandatory <strong>75% requirement</strong> for semester exams. Please attend upcoming lectures to regain eligibility.
            </p>
          </div>
        </div>
      )}

      {/* Key Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Attendance Metric */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance</span>
            <div className={`p-2 rounded-xl ${overallAttendancePercentage >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{overallAttendancePercentage}%</span>
            <span className={`text-xs font-semibold ${overallAttendancePercentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {overallAttendancePercentage >= 75 ? 'Eligible' : 'Low (<75%)'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                overallAttendancePercentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(overallAttendancePercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Academic Marks Average */}
        <div
          onClick={() => onNavigateTab('marks')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Marks</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{marksAvg}%</span>
            <span className="text-xs font-semibold text-indigo-600">Grade A+</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Across {studentMarks.length} internal evaluations</p>
        </div>

        {/* Pending Assignments */}
        <div
          onClick={() => onNavigateTab('assignments')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignments</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{pendingAssignments.length}</span>
            <span className="text-xs font-semibold text-amber-600">Pending</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">{assignments.length - pendingAssignments.length} already submitted</p>
        </div>

        {/* Today's Lectures */}
        <div
          onClick={() => onNavigateTab('timetable')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Lectures</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{todaysClasses.length}</span>
            <span className="text-xs font-semibold text-purple-600">Classes</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Next: {todaysClasses[0]?.subjectName || 'Schedule completed'}</p>
        </div>
      </div>

      {/* Main Content Grid: Attendance Chart & Subject Marks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Subject-Wise Attendance Progress (2 columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Subject-Wise Attendance</h2>
              <p className="text-xs text-slate-500">Must maintain ≥75% attendance in each course</p>
            </div>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Details <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {attendanceSummary.map((sub) => (
              <div key={sub.subjectCode} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-800">
                    {sub.subjectCode}: {sub.subjectName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">
                      {sub.attendedClasses}/{sub.totalClasses} classes
                    </span>
                    <span
                      className={`font-extrabold px-2 py-0.5 rounded-md text-[11px] ${
                        sub.percentage >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {sub.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Quick Assistant Callout (1 column) */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Gemini AI Academic Suite</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Instant academic tutoring, viva revision, automated multiple-choice quiz generator, and personalized study schedules.
            </p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => onOpenAIHub('quiz')}
                className="w-full p-2.5 bg-white hover:bg-slate-100 rounded-xl border border-indigo-200/60 text-left text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
              >
                <span>🎯 Generate AI Practice Quiz</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
              </button>

              <button
                onClick={() => onOpenAIHub('explain')}
                className="w-full p-2.5 bg-white hover:bg-slate-100 rounded-xl border border-indigo-200/60 text-left text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
              >
                <span>💡 Explain Complex BCA Topic</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
              </button>

              <button
                onClick={() => onOpenAIHub('performance')}
                className="w-full p-2.5 bg-white hover:bg-slate-100 rounded-xl border border-indigo-200/60 text-left text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
              >
                <span>📊 Analyze My Academic Score</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
              </button>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-indigo-100">
            <span className="text-[11px] text-indigo-700 font-medium">
              Powered by Google Gemini 3.8 Flash SDK
            </span>
          </div>
        </div>
      </div>

      {/* Today's Timetable Preview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Today's Class Schedule</h2>
          </div>
          <button
            onClick={() => onNavigateTab('timetable')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            View Weekly Timetable →
          </button>
        </div>

        {todaysClasses.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No scheduled lectures for today.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {todaysClasses.map((cls, idx) => (
              <div
                key={cls.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-indigo-700">{cls.time}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-medium text-[10px]">
                    Period {cls.period}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1">{cls.subjectName}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                  <span>👨‍🏫 {cls.facultyName}</span>
                  <span className="font-medium text-slate-700">📍 {cls.room}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
