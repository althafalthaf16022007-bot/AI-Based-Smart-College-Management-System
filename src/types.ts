/**
 * Smart College Management System with AI - Type Definitions
 * Designed for BCA College Project Architecture
 */

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  loginId: string; // Roll No for student, Faculty ID for faculty, Admin ID for admin
  name: string;
  email: string;
  role: UserRole;
  department: string;
  semester?: string; // For students
  phone?: string;
  designation?: string; // For faculty / admin
  avatar?: string;
  enrolledYear?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  hod: string;
  totalStudents: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: string;
  credits: number;
  facultyId: string;
  facultyName: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentRoll: string;
  studentName: string;
  subjectCode: string;
  subjectName: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
}

export interface StudentAttendanceSummary {
  subjectCode: string;
  subjectName: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  isEligible: boolean; // >= 75%
}

export type ExamType = 'Internal 1' | 'Internal 2' | 'Mid-Term Exam' | 'Lab Practical' | 'Semester Final';

export interface MarkRecord {
  id: string;
  studentId: string;
  studentRoll: string;
  studentName: string;
  subjectCode: string;
  subjectName: string;
  examType: ExamType;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  semester: string;
  remarks?: string;
  date: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number;
  time: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  room: string;
  department: string;
  semester: string;
}

export interface Assignment {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  facultyId: string;
  facultyName: string;
  createdDate: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  submissionDate: string;
  content: string;
  status: 'Submitted' | 'Graded' | 'Pending';
  marksAwarded?: number;
  feedback?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  category: 'Academic' | 'Exam' | 'Event' | 'Placement' | 'Notice';
  priority: 'High' | 'Normal' | 'Urgent';
}

export interface CollegeStats {
  totalStudents: number;
  totalFaculty: number;
  totalDepartments: number;
  totalSubjects: number;
  averageAttendance: number;
  averagePassPercentage: number;
  activeAssignments: number;
}

// AI Feature Types
export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export interface AIExplanation {
  topic: string;
  summary: string;
  keyPoints: string[];
  realWorldAnalogy: string;
  codeSnippet?: string;
  vivaQuestions: { question: string; answer: string }[];
}

export interface AIQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AIQuiz {
  topic: string;
  subject: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: AIQuizQuestion[];
}

export interface AIStudyPlanDay {
  day: string;
  topicFocus: string;
  tasks: string[];
  revisionTip: string;
  allocatedHours: number;
}

export interface AIStudyPlan {
  title: string;
  targetExam: string;
  targetSubject: string;
  days: AIStudyPlanDay[];
  generalAdvice: string;
}

export interface AIPerformanceAnalysis {
  overallHealth: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical';
  attendanceScore: number;
  marksScore: number;
  strongAreas: string[];
  topicsNeedingImprovement: string[];
  actionPlan: string[];
  estimatedGrade: string;
}
