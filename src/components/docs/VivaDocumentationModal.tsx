import React, { useState } from 'react';
import {
  BookOpen,
  X,
  CheckCircle2,
  Layers,
  Database,
  Server,
  Code,
  Sparkles,
  HelpCircle,
  FileCheck,
  Printer,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

interface VivaDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaDocumentationModal: React.FC<VivaDocumentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<string>('review1');

  if (!isOpen) return null;

  const sections = [
    { id: 'review1', label: '📋 Review 1 (35% Milestone)' },
    { id: 'abstract', label: '📖 Project Abstract & Problem' },
    { id: 'objectives', label: '🎯 Objectives & Proposed System' },
    { id: 'modules', label: '🧩 Modules & Feature Scope' },
    { id: 'techstack', label: '💻 Technology Stack' },
    { id: 'database', label: '🗄️ Database & Schema Design' },
    { id: 'architecture', label: '🏛️ System Architecture' },
    { id: 'testing', label: '🧪 Testing Plan & Test Cases' },
    { id: 'viva', label: '🎓 15 BCA Viva Q&A Guide' },
    { id: 'future', label: '🚀 Future Enhancements' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Smart College Management System with AI</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Project Dossier &amp; Review 1 Report
                </span>
              </div>
              <p className="text-xs text-slate-400">
                BCA Major Project • 3-Tier Architecture • Google Gemini AI Integration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Print Documentation"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body with Sidebar Tabs */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-3 overflow-y-auto shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
              Documentation Index
            </span>
            <nav className="space-y-1 mt-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    activeSection === s.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <span>{s.label}</span>
                  {activeSection === s.id && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-slate-700 text-xs leading-relaxed bg-white">
            
            {/* SECTION 1: Review 1 Documentation (35% Milestone) */}
            {activeSection === 'review1' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                    Official College Presentation
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    Project Review 1 Report (35% Completion Milestone)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Course: Bachelor of Computer Applications (BCA) • Semester IV / VI Project
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Status</span>
                    <p className="font-extrabold text-emerald-700 text-sm mt-0.5">✓ 35% Approved</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Architecture</span>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">3-Tier Full-Stack</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Backend</span>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">Express + Node</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">AI Engine</span>
                    <p className="font-bold text-indigo-700 text-xs mt-0.5">Gemini 3.8 Flash</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">1. Work Completed by Review 1:</h4>
                  <ul className="space-y-1.5 list-disc pl-5 text-slate-700">
                    <li>Comprehensive requirements gathering, software requirement specification (SRS), and feasibility analysis.</li>
                    <li>Relational schema and database entity-relationship (ER) models established for Students, Faculty, Attendance, Marks, and Assignments.</li>
                    <li>Role-Based Access Control (RBAC) authentication engine built with support for Student, Faculty, and Admin roles.</li>
                    <li>Complete Express REST API backend implemented with endpoints for attendance recording, marks submission, and coursework.</li>
                    <li>Google Gemini AI SDK integrated server-side with fallback academic rule engine for uninterrupted evaluation.</li>
                    <li>Interactive responsive user interfaces built in React with Tailwind CSS utility architecture.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">2. Targets for Review 2 (65% Milestone):</h4>
                  <ul className="space-y-1.5 list-disc pl-5 text-slate-700">
                    <li>Persistent Cloud Database integration (Firestore / PostgreSQL) with encrypted password hashing (bcrypt).</li>
                    <li>Push notification service and SMS gateway for immediate attendance shortage alerts to parents.</li>
                    <li>Automated barcode / QR-code generation for student ID cards to facilitate biometric attendance.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* SECTION 2: Abstract & Problem Statement */}
            {activeSection === 'abstract' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-black text-slate-900">Project Abstract &amp; Problem Statement</h3>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5">Abstract</h4>
                  <p className="leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                    The <strong>Smart College Management System with AI</strong> is a full-stack, enterprise-grade educational resource planning (ERP) web platform engineered to automate collegiate administration and augment student learning with generative artificial intelligence. The application unifies students, faculty members, and institutional administrators into a secure, role-based environment. Traditional portals operate as passive ledger systems; in contrast, this system integrates the <strong>Google Gemini API</strong> to act as an active academic tutor—synthesizing concept explanations, generating personalized revision quizzes, analyzing individual score trends, and generating bespoke 7-day exam preparation roadmaps.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5">Problem Statement</h4>
                  <p className="leading-relaxed">
                    Higher education institutions currently suffer from fragmented workflows:
                  </p>
                  <ul className="space-y-1.5 list-disc pl-5 mt-2">
                    <li><strong>Paper Registers &amp; Manual Errors:</strong> Manual paper registers for attendance are prone to proxy marking, physical damage, and tedious end-of-semester percentage calculations.</li>
                    <li><strong>Delayed Condonation Awareness:</strong> Students typically discover they have fallen below the mandatory 75% attendance threshold only a few days prior to university hall ticket distribution, preventing timely remedial attendance.</li>
                    <li><strong>One-Way Reporting:</strong> Existing ERP platforms display raw grades without diagnostic guidance or personalized academic tutoring for students struggling with challenging technical subjects like DBMS, Algorithms, and Networks.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* SECTION 3: Objectives & Proposed System */}
            {activeSection === 'objectives' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-black text-slate-900">Objectives &amp; Proposed System</h3>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Project Objectives</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block mb-1">1. Unified Role Access</strong>
                      <span>Provide dedicated, tailored dashboards for Students, Faculty, and Administrators under a single secure web domain.</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block mb-1">2. Transparent Attendance</strong>
                      <span>Calculate real-time percentage indicators and highlight exact number of lectures needed to recover eligibility.</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block mb-1">3. Automated CIA Assessment</strong>
                      <span>Enable professors to record internal exam marks and coursework with instantaneous SGPA estimation.</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block mb-1">4. Generative AI Tutoring</strong>
                      <span>Leverage Gemini 3.8 Flash for multi-turn academic doubt solving, automated quizzes, and exam study roadmaps.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Existing System vs. Proposed System</h4>
                  <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5">Feature</th>
                        <th className="p-2.5">Existing College System</th>
                        <th className="p-2.5">Proposed Smart AI ERP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2.5 font-semibold">Attendance</td>
                        <td className="p-2.5 text-rose-700">Manual paper sheets, prone to manipulation</td>
                        <td className="p-2.5 text-emerald-700">Instant digital register with &lt;75% risk warnings</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">Marks Publishing</td>
                        <td className="p-2.5 text-rose-700">Pasted on departmental notice boards</td>
                        <td className="p-2.5 text-emerald-700">Real-time marksheet with SGPA &amp; grade analytics</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">Academic Doubts</td>
                        <td className="p-2.5 text-rose-700">Limited to classroom faculty office hours</td>
                        <td className="p-2.5 text-emerald-700">24/7 AI tutor powered by Gemini Flash</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">Viva Preparation</td>
                        <td className="p-2.5 text-rose-700">Self-study without question prediction</td>
                        <td className="p-2.5 text-emerald-700">AI Concept Explainer with expected viva Q&amp;A</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SECTION 4: Modules & Features */}
            {activeSection === 'modules' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-black text-slate-900">Functional Modules &amp; Scope</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40">
                    <h4 className="font-bold text-indigo-950 text-sm">Module 1: Student Portal</h4>
                    <p className="mt-1 text-slate-600">
                      Enables enrolled students to inspect cumulative and subject-wise attendance percentages, review continuous internal assessment (CIA) marks, view daily timetable slots, submit coursework assignments, and access the Gemini AI suite.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
                    <h4 className="font-bold text-amber-950 text-sm">Module 2: Faculty Portal</h4>
                    <p className="mt-1 text-slate-600">
                      Enables professors to conduct roll calls with quick "Mark All Present" switches, enter Internal and Practical marks with automatic grade computation, publish assignments with deadlines, evaluate student submissions with marks and feedback, and generate shortage reports.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40">
                    <h4 className="font-bold text-purple-950 text-sm">Module 3: Central Administrative Portal</h4>
                    <p className="mt-1 text-slate-600">
                      Enables administrative deans to enrol new students, appoint professors, configure academic departments (BCA, BSC-IT, MCA, BBA), structure syllabus credit schemas, and generate college-wide pass-rate reports.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                    <h4 className="font-bold text-emerald-950 text-sm">Module 4: Gemini AI Academic Hub</h4>
                    <p className="mt-1 text-slate-600">
                      Consists of 5 specialized academic engines: 24/7 Academic Chatbot, Concept Explainer with viva preparation, Multiple Choice Quiz Generator with auto-grading, Student Score Trend Diagnostician, and Personalized 7-Day Exam Study Schedule Generator.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: Technology Stack */}
            {activeSection === 'techstack' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-black text-slate-900">Technical Architecture &amp; Stack</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                      Frontend Layer:
                    </h4>
                    <ul className="space-y-1 text-slate-700">
                      <li><strong>React 18:</strong> Component-based reactive user interface.</li>
                      <li><strong>TypeScript:</strong> Static typing and strict interfaces (`User`, `MarkRecord`, `AttendanceRecord`).</li>
                      <li><strong>Tailwind CSS:</strong> Utility-first styling with responsive design tokens.</li>
                      <li><strong>Lucide React:</strong> Consistent visual icons.</li>
                      <li><strong>Vite:</strong> Ultra-fast dev bundling and production compilation.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                      Backend &amp; AI Layer:
                    </h4>
                    <ul className="space-y-1 text-slate-700">
                      <li><strong>Node.js &amp; Express:</strong> RESTful API server handling authentication, attendance, marks, and admin routes.</li>
                      <li><strong>@google/genai SDK:</strong> Server-side integration of Google Gemini 3.8 Flash model.</li>
                      <li><strong>Vite Express Middleware:</strong> Unified single-port deployment architecture.</li>
                      <li><strong>Academic Rule Engine:</strong> Deterministic fallback logic if AI quota is unavailable.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 6: Database Design */}
            {activeSection === 'database' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-black text-slate-900">Database Design &amp; Entities</h3>
                </div>

                <p>
                  The system implements a normalized relational entity model with primary foreign-key relationships connecting users to attendance logs, marks, assignments, and timetable periods:
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]">
                    <strong className="text-indigo-700 font-bold block mb-1">1. USERS TABLE (`users`)</strong>
                    id (PK) | name | email | loginId (Unique RollNo/StaffId) | role (student/faculty/admin) | department | semester | phone | passwordHash
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]">
                    <strong className="text-amber-700 font-bold block mb-1">2. ATTENDANCE TABLE (`attendance_records`)</strong>
                    id (PK) | studentId (FK) | subjectCode | subjectName | date | status (Present/Absent/Late) | markedBy (FK) | remarks
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]">
                    <strong className="text-emerald-700 font-bold block mb-1">3. MARKS TABLE (`mark_records`)</strong>
                    id (PK) | studentId (FK) | subjectCode | subjectName | examType | marksObtained | maxMarks | grade | remarks
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]">
                    <strong className="text-purple-700 font-bold block mb-1">4. ASSIGNMENTS TABLE (`assignments` &amp; `submissions`)</strong>
                    id (PK) | title | subjectCode | dueDate | maxMarks | facultyId (FK) || subId (PK) | assignmentId (FK) | studentId (FK) | marksAwarded | feedback
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 7: System Architecture */}
            {activeSection === 'architecture' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-black text-slate-900">3-Tier System Architecture</h3>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-3">
                  <div className="p-2 rounded bg-indigo-950/80 border border-indigo-500/40 text-center">
                    [ CLIENT TIER: React + Tailwind UI ]
                    <br />
                    <span className="text-[10px] text-indigo-300">
                      Browser client with Role-based Views (Student, Faculty, Admin)
                    </span>
                  </div>

                  <div className="text-center text-slate-400">↕ HTTP REST API Requests (JSON)</div>

                  <div className="p-2 rounded bg-purple-950/80 border border-purple-500/40 text-center">
                    [ APPLICATION SERVER TIER: Express.js on Node.js ]
                    <br />
                    <span className="text-[10px] text-purple-300">
                      Auth Routing, RBAC Validation, Academic Business Logic, Server-side Gemini SDK
                    </span>
                  </div>

                  <div className="text-center text-slate-400">↕ Internal API Calls &amp; DB Transactions</div>

                  <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                    <div className="p-2 rounded bg-emerald-950/80 border border-emerald-500/40">
                      [ DATABASE TIER ]
                      <br />
                      <span className="text-[10px] text-emerald-300">Student &amp; College Records</span>
                    </div>
                    <div className="p-2 rounded bg-amber-950/80 border border-amber-500/40">
                      [ AI CLOUD TIER ]
                      <br />
                      <span className="text-[10px] text-amber-300">Google Gemini API (gemini-2.5-flash)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 8: Testing Plan & Test Cases */}
            {activeSection === 'testing' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-black text-slate-900">Testing Plan &amp; Test Cases</h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>TC-01: Role-Based Authentication</span>
                      <span className="text-emerald-600">✓ PASSED</span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      Input valid credentials for student, faculty, and admin. System correctly validates role and displays corresponding dashboard.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>TC-02: Attendance Percentage &amp; Shortage Formula</span>
                      <span className="text-emerald-600">✓ PASSED</span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      Calculates attended/total classes. When &lt;75%, displays warning banner and calculates exact required lectures.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>TC-03: Faculty Marks Boundary Validation</span>
                      <span className="text-emerald-600">✓ PASSED</span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      Verifies that marks obtained cannot exceed max marks and cannot be negative. Updates student marksheet instantly.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>TC-04: Gemini AI Fallback Resilience</span>
                      <span className="text-emerald-600">✓ PASSED</span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      Simulates API interruption; fallback academic rule engine smoothly serves formatted quiz and explanation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 9: 15 BCA Viva Voce Q&A Guide */}
            {activeSection === 'viva' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                    Viva Voce Preparation Kit
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    15 Essential BCA Viva Questions &amp; Model Answers
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Prepared specifically for BCA examiners and project defense committees.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      q: '1. What is the core problem your project solves?',
                      a: 'It replaces error-prone paper attendance registers and disjointed notice boards with an integrated 3-role portal (Student, Faculty, Admin), providing real-time attendance shortage alerts and generative AI academic tutoring.'
                    },
                    {
                      q: '2. Why did you choose a 3-tier architecture?',
                      a: 'A 3-tier architecture separates Presentation (React), Application logic (Express.js), and Data storage. This guarantees maintainability, modular debugging, and prevents API keys from being leaked to browser clients.'
                    },
                    {
                      q: '3. What is Role-Based Access Control (RBAC) in your system?',
                      a: 'RBAC ensures each user only accesses features authorized for their role: Students can view their own marks and take quizzes, Faculty can record attendance and enter marks, while Admins govern staff and student rosters.'
                    },
                    {
                      q: '4. How is the attendance percentage calculated?',
                      a: 'Aggregate Percentage = (Total Attended Classes / Total Conducted Classes) * 100. If < 75%, our algorithm calculates needed classes using: ceil(3 * Total - 4 * Attended).'
                    },
                    {
                      q: '5. Which AI model are you using and why?',
                      a: 'We use Google Gemini 3.8 Flash via the @google/genai SDK on our server. It provides sub-second latency for academic explanations, multiple-choice quiz generation, and personalized study roadmaps.'
                    },
                    {
                      q: '6. Why are Gemini API calls made on the server instead of the React client?',
                      a: 'Security best practices dictate that private API keys must never be exposed in client-side code where users can inspect them in browser developer tools. Express proxies all AI requests securely.'
                    },
                    {
                      q: '7. What happens if the Gemini API has network issues or exceeds rate limits?',
                      a: 'We implemented a robust server-side academic fallback engine that automatically delivers structured syllabus explanations and multiple-choice quizzes, ensuring high availability during viva demonstrations.'
                    },
                    {
                      q: '8. How does the assignment submission workflow function?',
                      a: 'Faculty publishes an assignment with title, due date, and max marks. Students submit code or repo links. Faculty reviews the submission, awards marks, provides feedback, and updates the student’s internal marks.'
                    },
                    {
                      q: '9. What is the difference between client-side and server-side state in this app?',
                      a: 'React manages immediate UI states (active tabs, form inputs, modal toggles), while Express and our database store authoritative records (attendance registers, submitted grades, user credentials).'
                    },
                    {
                      q: '10. What is Vite and why use it over create-react-app?',
                      a: 'Vite uses native ES modules during development for near-instantaneous hot module updates and optimizes production builds with Rollup, resulting in smaller bundle sizes and faster load times.'
                    },
                    {
                      q: '11. How do you prevent invalid marks from being entered?',
                      a: 'We enforce boundary validation in both the UI and API: marks obtained must be a positive number and cannot exceed the defined maxMarks for that assessment (e.g. 25 or 50).'
                    },
                    {
                      q: '12. Explain the grading scale used in your Marks module.',
                      a: 'We follow standard university relative grading: 90%+ is O (Outstanding), 80-89% is A+, 70-79% is A, 60-69% is B+, 50-59% is B, 40-49% is C, and below 40% is F (Fail).'
                    },
                    {
                      q: '13. How does the AI generate personalized study plans?',
                      a: 'The server provides Gemini with the target exam, subject, and available study hours per day. Gemini returns a structured 7-day plan with specific daily topics, practical tasks, and revision strategies.'
                    },
                    {
                      q: '14. What are the key database entities?',
                      a: 'Users (Students, Faculty, Admin), Subjects (Courses and credits), Attendance Records (Dates and statuses), Mark Records (Exams and scores), and Assignments (Tasks and submissions).'
                    },
                    {
                      q: '15. What are the major future enhancements for your project?',
                      a: 'Integrating biometric / QR-code attendance scanners, automated SMS/WhatsApp alerts to guardians, online semester fee payment gateways, and multilingual voice assistance for regional languages.'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="font-bold text-slate-900 text-xs">{item.q}</p>
                      <p className="mt-1.5 text-slate-700 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 10: Future Enhancements */}
            {activeSection === 'future' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-black text-slate-900">Future Enhancements Roadmap</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <strong className="text-slate-900 block mb-1">1. Biometric &amp; QR RFID Scanner Integration</strong>
                    <p className="text-slate-600">Integrate dynamic QR codes generated in student mobile apps for contactless attendance check-in at lecture hall entrances.</p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <strong className="text-slate-900 block mb-1">2. Parent SMS &amp; WhatsApp Automated Gateway</strong>
                    <p className="text-slate-600">Automated Twilio/WhatsApp triggers dispatched whenever a student falls below 75% attendance or misses 3 consecutive lectures.</p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <strong className="text-slate-900 block mb-1">3. Online College Fee Payment Gateway</strong>
                    <p className="text-slate-600">Integration with UPI and payment gateways for semester tuition, exam hall tickets, and hostel fees with digital receipts.</p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <strong className="text-slate-900 block mb-1">4. AI Multi-Lingual Speech Tutoring</strong>
                    <p className="text-slate-600">Voice-interactive academic tutoring supporting regional languages to assist non-English medium students.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Smart College Management System • Prepared for BCA Project Evaluation
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
          >
            Close Documentation
          </button>
        </div>

      </div>
    </div>
  );
};
