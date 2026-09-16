import React, { useState, useEffect } from 'react';
import {
  User,
  UserRole,
  StudentAttendanceSummary,
  MarkRecord,
  Assignment,
  AssignmentSubmission,
  TimetableSlot,
  CollegeStats,
} from './types';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { VivaDocumentationModal } from './components/docs/VivaDocumentationModal';

// Student Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { AttendanceView } from './components/student/AttendanceView';
import { MarksView } from './components/student/MarksView';
import { TimetableCard } from './components/student/TimetableCard';
import { AssignmentsView } from './components/student/AssignmentsView';
import { AIAcademicHub } from './components/student/AIAcademicHub';

// Faculty Components
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { AttendanceManager } from './components/faculty/AttendanceManager';
import { MarksManager } from './components/faculty/MarksManager';
import { AssignmentManager } from './components/faculty/AssignmentManager';
import { FacultyReports } from './components/faculty/FacultyReports';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentManager } from './components/admin/StudentManager';
import { FacultyManager } from './components/admin/FacultyManager';
import { DepartmentSubjectManager } from './components/admin/DepartmentSubjectManager';
import { AdminReports } from './components/admin/AdminReports';

import {
  LayoutDashboard,
  CalendarCheck,
  Award,
  Calendar,
  FileText,
  Sparkles,
  Users,
  Briefcase,
  Building,
  BarChart3,
  CheckSquare,
  FilePlus,
  BookOpen
} from 'lucide-react';

export default function App() {
  // Default logged-in user: Aarav Sharma (Student) so examiners immediately see an active, functional app
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'std-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    loginId: 'BCA2024-001',
    role: 'student',
    department: 'Computer Applications (BCA)',
    semester: '4th Semester',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  });

  // Navigation tab states
  const [studentTab, setStudentTab] = useState<'dashboard' | 'attendance' | 'marks' | 'timetable' | 'assignments' | 'ai'>('dashboard');
  const [aiSubTool, setAiSubTool] = useState<string>('chat');

  const [facultyTab, setFacultyTab] = useState<'dashboard' | 'attendance' | 'marks' | 'assignments' | 'reports'>('dashboard');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'students' | 'faculty' | 'departments' | 'reports'>('dashboard');

  // Modal dialog states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  // Student specific fetched data
  const [overallAttendance, setOverallAttendance] = useState<number>(85.6);
  const [attendanceSummary, setAttendanceSummary] = useState<StudentAttendanceSummary[]>([]);
  const [studentMarks, setStudentMarks] = useState<MarkRecord[]>([]);
  const [assignments, setAssignments] = useState<(Assignment & { submissionStatus: string; submission?: AssignmentSubmission | null })[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [todaysClasses, setTodaysClasses] = useState<TimetableSlot[]>([]);

  // Admin stats
  const [collegeStats, setCollegeStats] = useState<CollegeStats | null>(null);

  // Initial data loading
  useEffect(() => {
    if (currentUser?.role === 'student') {
      fetchStudentData(currentUser.id);
    } else if (currentUser?.role === 'admin') {
      fetchAdminStats();
    }
  }, [currentUser]);

  const fetchStudentData = async (studentId: string) => {
    try {
      // 1. Attendance
      const attRes = await fetch(`/api/student/${studentId}/attendance`);
      const attData = await attRes.json();
      if (attData.overallPercentage !== undefined) {
        setOverallAttendance(attData.overallPercentage);
        setAttendanceSummary(attData.summary || []);
      }

      // 2. Marks
      const marksRes = await fetch(`/api/student/${studentId}/marks`);
      const marksData = await marksRes.json();
      if (marksData.records) {
        setStudentMarks(marksData.records);
      }

      // 3. Assignments
      const asgRes = await fetch(`/api/student/${studentId}/assignments`);
      const asgData = await asgRes.json();
      if (asgData.assignments) {
        setAssignments(asgData.assignments);
      }

      // 4. Timetable
      const ttRes = await fetch(`/api/student/timetable`);
      const ttData = await ttRes.json();
      if (ttData.timetable) {
        setTimetable(ttData.timetable);
        setTodaysClasses(ttData.todaysClasses || []);
      }
    } catch (err) {
      console.error('Error loading student data:', err);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.stats) {
        setCollegeStats(data.stats);
      }
    } catch (err) {
      console.error('Error loading college stats:', err);
    }
  };

  // Quick Role Switcher handler
  const handleSwitchRole = async (targetRole: UserRole) => {
    if (currentUser?.role === targetRole) return;

    let targetId = 'BCA2024-001';
    let targetPass = 'student123';

    if (targetRole === 'faculty') {
      targetId = 'FAC-101';
      targetPass = 'faculty123';
    } else if (targetRole === 'admin') {
      targetId = 'ADM-001';
      targetPass = 'admin123';
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId: targetId,
          password: targetPass,
          role: targetRole,
        }),
      });

      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        // Reset sub-tabs to dashboard
        setStudentTab('dashboard');
        setFacultyTab('dashboard');
        setAdminTab('dashboard');
      }
    } catch (err) {
      console.error('Error switching role:', err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthModalOpen(true);
  };

  const handleOpenAIWithTool = (toolName: string = 'chat') => {
    setAiSubTool(toolName);
    setStudentTab('ai');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onSwitchRole={handleSwitchRole}
        onOpenDocs={() => setIsDocsModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Role Portal Header & Sub-Navigation */}
        {currentUser && (
          <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 py-1">
              
              {/* Role Title Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                    currentUser.role === 'student'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : currentUser.role === 'faculty'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-purple-50 text-purple-800 border border-purple-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  {currentUser.role} Portal
                </span>
                <span className="text-xs text-slate-400 font-medium hidden md:inline">
                  | Logged in as <strong className="text-slate-700">{currentUser.name}</strong>
                </span>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                
                {/* 1. STUDENT TABS */}
                {currentUser.role === 'student' && (
                  <>
                    <button
                      onClick={() => setStudentTab('dashboard')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        studentTab === 'dashboard'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Dashboard
                    </button>

                    <button
                      onClick={() => setStudentTab('attendance')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        studentTab === 'attendance'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      Attendance
                    </button>

                    <button
                      onClick={() => setStudentTab('marks')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        studentTab === 'marks'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      Marks
                    </button>

                    <button
                      onClick={() => setStudentTab('timetable')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        studentTab === 'timetable'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Timetable
                    </button>

                    <button
                      onClick={() => setStudentTab('assignments')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        studentTab === 'assignments'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Assignments
                    </button>

                    <button
                      onClick={() => setStudentTab('ai')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        studentTab === 'ai'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      AI Academic Hub
                    </button>
                  </>
                )}

                {/* 2. FACULTY TABS */}
                {currentUser.role === 'faculty' && (
                  <>
                    <button
                      onClick={() => setFacultyTab('dashboard')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        facultyTab === 'dashboard'
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Overview
                    </button>

                    <button
                      onClick={() => setFacultyTab('attendance')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        facultyTab === 'attendance'
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      Mark Attendance
                    </button>

                    <button
                      onClick={() => setFacultyTab('marks')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        facultyTab === 'marks'
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      Enter Marks
                    </button>

                    <button
                      onClick={() => setFacultyTab('assignments')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        facultyTab === 'assignments'
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <FilePlus className="w-3.5 h-3.5" />
                      Assignments
                    </button>

                    <button
                      onClick={() => setFacultyTab('reports')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        facultyTab === 'reports'
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      Reports
                    </button>
                  </>
                )}

                {/* 3. ADMIN TABS */}
                {currentUser.role === 'admin' && (
                  <>
                    <button
                      onClick={() => setAdminTab('dashboard')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        adminTab === 'dashboard'
                          ? 'bg-purple-800 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Overview
                    </button>

                    <button
                      onClick={() => setAdminTab('students')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        adminTab === 'students'
                          ? 'bg-purple-800 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      Students
                    </button>

                    <button
                      onClick={() => setAdminTab('faculty')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        adminTab === 'faculty'
                          ? 'bg-purple-800 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      Faculty
                    </button>

                    <button
                      onClick={() => setAdminTab('departments')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        adminTab === 'departments'
                          ? 'bg-purple-800 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Building className="w-3.5 h-3.5" />
                      Curriculum
                    </button>

                    <button
                      onClick={() => setAdminTab('reports')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        adminTab === 'reports'
                          ? 'bg-purple-800 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      Statistics
                    </button>
                  </>
                )}

              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* Render Portal by Role */}
        {/* ------------------------------------------------------------- */}
        {currentUser?.role === 'student' && (
          <div>
            {studentTab === 'dashboard' && (
              <StudentDashboard
                student={currentUser}
                overallAttendancePercentage={overallAttendance}
                attendanceSummary={attendanceSummary}
                studentMarks={studentMarks}
                assignments={assignments}
                todaysClasses={todaysClasses}
                onNavigateTab={(tab: string) => setStudentTab(tab as any)}
                onOpenAIHub={handleOpenAIWithTool}
              />
            )}

            {studentTab === 'attendance' && (
              <AttendanceView
                student={currentUser}
                overallAttendancePercentage={overallAttendance}
                attendanceSummary={attendanceSummary}
              />
            )}

            {studentTab === 'marks' && (
              <MarksView student={currentUser} studentMarks={studentMarks} />
            )}

            {studentTab === 'timetable' && (
              <TimetableCard student={currentUser} timetable={timetable} />
            )}

            {studentTab === 'assignments' && (
              <AssignmentsView
                student={currentUser}
                assignments={assignments}
                onSubmissionSuccess={() => fetchStudentData(currentUser.id)}
              />
            )}

            {studentTab === 'ai' && (
              <AIAcademicHub student={currentUser} initialTab={aiSubTool} />
            )}
          </div>
        )}

        {currentUser?.role === 'faculty' && (
          <div>
            {facultyTab === 'dashboard' && (
              <FacultyDashboard
                faculty={currentUser}
                onNavigateTab={(tab: string) => setFacultyTab(tab as any)}
              />
            )}

            {facultyTab === 'attendance' && <AttendanceManager faculty={currentUser} />}

            {facultyTab === 'marks' && <MarksManager faculty={currentUser} />}

            {facultyTab === 'assignments' && <AssignmentManager faculty={currentUser} />}

            {facultyTab === 'reports' && <FacultyReports faculty={currentUser} />}
          </div>
        )}

        {currentUser?.role === 'admin' && (
          <div>
            {adminTab === 'dashboard' && (
              <AdminDashboard
                admin={currentUser}
                stats={collegeStats}
                onNavigateTab={(tab: string) => setAdminTab(tab as any)}
              />
            )}

            {adminTab === 'students' && <StudentManager />}

            {adminTab === 'faculty' && <FacultyManager />}

            {adminTab === 'departments' && <DepartmentSubjectManager />}

            {adminTab === 'reports' && <AdminReports stats={collegeStats} />}
          </div>
        )}

      </main>

      {/* Footer with Viva Documentation Link */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">Smart College Management System with AI</span>
            <span>•</span>
            <span>Department of Computer Applications</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              View Review 1 Dossier &amp; Viva Q&amp;A
            </button>
            <span>•</span>
            <span className="text-slate-400">Google Gemini 3.8 Flash SDK</span>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user: User) => {
          setCurrentUser(user);
          setStudentTab('dashboard');
          setFacultyTab('dashboard');
          setAdminTab('dashboard');
        }}
      />

      {/* Review 1 & Viva Documentation Modal */}
      <VivaDocumentationModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />

    </div>
  );
}
