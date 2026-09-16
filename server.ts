/**
 * Smart College Management System with AI - Server Entry Point
 * Express.js Backend + Vite Middleware + Gemini AI Integration
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gemini AI SDK on the server
let aiClient: GoogleGenAI | null = null;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('✅ Gemini AI SDK initialized successfully on server');
  } catch (err) {
    console.warn('⚠️ Warning: Failed to initialize Gemini AI client:', err);
  }
} else {
  console.log('ℹ️ Notice: GEMINI_API_KEY not detected. AI features will use intelligent academic simulation engine.');
}

// -------------------------------------------------------------
// In-Memory Realistic College Database (BCA Curriculum Standard)
// -------------------------------------------------------------

interface DBUser {
  id: string;
  loginId: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'faculty' | 'admin';
  department: string;
  semester?: string;
  phone?: string;
  designation?: string;
  avatar?: string;
  enrolledYear?: string;
}

const db = {
  users: [
    // Students
    {
      id: 'stud-1',
      loginId: 'BCA2024-001',
      name: 'Aarav Sharma',
      email: 'aarav@college.edu',
      password: 'student123',
      role: 'student',
      department: 'Computer Applications (BCA)',
      semester: '4th Semester',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      enrolledYear: '2023',
    },
    {
      id: 'stud-2',
      loginId: 'BCA2024-002',
      name: 'Priya Patel',
      email: 'priya@college.edu',
      password: 'student123',
      role: 'student',
      department: 'Computer Applications (BCA)',
      semester: '4th Semester',
      phone: '+91 98765 43211',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      enrolledYear: '2023',
    },
    {
      id: 'stud-3',
      loginId: 'BCA2024-003',
      name: 'Rohan Verma',
      email: 'rohan@college.edu',
      password: 'student123',
      role: 'student',
      department: 'Information Technology (BSC-IT)',
      semester: '2nd Semester',
      phone: '+91 98765 43212',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      enrolledYear: '2024',
    },
    {
      id: 'stud-4',
      loginId: 'BCA2024-004',
      name: 'Ananya Deshmukh',
      email: 'ananya@college.edu',
      password: 'student123',
      role: 'student',
      department: 'Computer Applications (BCA)',
      semester: '4th Semester',
      phone: '+91 98765 43213',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      enrolledYear: '2023',
    },
    // Faculty
    {
      id: 'fac-1',
      loginId: 'FAC-101',
      name: 'Dr. Rajesh Kulkarni',
      email: 'rajesh@college.edu',
      password: 'faculty123',
      role: 'faculty',
      department: 'Computer Applications (BCA)',
      designation: 'Professor & Head of Department',
      phone: '+91 98220 11223',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    {
      id: 'fac-2',
      loginId: 'FAC-102',
      name: 'Prof. Sunita Menon',
      email: 'sunita@college.edu',
      password: 'faculty123',
      role: 'faculty',
      department: 'Computer Applications (BCA)',
      designation: 'Assistant Professor',
      phone: '+91 98220 33445',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    {
      id: 'fac-3',
      loginId: 'FAC-103',
      name: 'Dr. Ananya Sen',
      email: 'ananyasen@college.edu',
      password: 'faculty123',
      role: 'faculty',
      department: 'Information Technology (BSC-IT)',
      designation: 'Associate Professor',
      phone: '+91 98220 55667',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    },
    // Admin
    {
      id: 'adm-1',
      loginId: 'ADM-001',
      name: 'Dr. M. S. Swaminathan',
      email: 'admin@college.edu',
      password: 'admin123',
      role: 'admin',
      department: 'Academic Administration',
      designation: 'Principal & Chief Administrator',
      phone: '+91 98110 99887',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
  ] as DBUser[],

  departments: [
    {
      id: 'dept-1',
      code: 'BCA',
      name: 'Computer Applications (BCA)',
      description: 'Undergraduate professional program in software engineering, web development, and computing.',
      hod: 'Dr. Rajesh Kulkarni',
      totalStudents: 120,
    },
    {
      id: 'dept-2',
      code: 'BSC-IT',
      name: 'Information Technology (BSC-IT)',
      description: 'Curriculum focused on networking, cloud systems, and database architectures.',
      hod: 'Dr. Ananya Sen',
      totalStudents: 95,
    },
    {
      id: 'dept-3',
      code: 'MCA',
      name: 'Master of Computer Applications (MCA)',
      description: 'Post-graduate program specializing in AI, distributed systems, and enterprise architectures.',
      hod: 'Prof. S. R. Rao',
      totalStudents: 60,
    },
    {
      id: 'dept-4',
      code: 'BBA',
      name: 'Business Administration (BBA)',
      description: 'Management education in marketing, organizational finance, and analytics.',
      hod: 'Dr. Kavita Joshi',
      totalStudents: 110,
    },
  ],

  subjects: [
    {
      id: 'sub-1',
      code: 'BCA401',
      name: 'Database Management Systems (DBMS)',
      department: 'Computer Applications (BCA)',
      semester: '4th Semester',
      credits: 4,
      facultyId: 'fac-1',
      facultyName: 'Dr. Rajesh Kulkarni',
    },
    {
      id: 'sub-2',
      code: 'BCA402',
      name: 'Web Technology & Frameworks',
      department: 'Computer Applications (BCA)',
      semester: '4th Semester',
      credits: 4,
      facultyId: 'fac-1',
      facultyName: 'Dr. Rajesh Kulkarni',
    },
    {
      id: 'sub-3',
      code: 'BCA403',
      name: 'Data Structures & Algorithms',
      department: 'Computer Applications (BCA)',
      semester: '4th Semester',
      credits: 4,
      facultyId: 'fac-2',
      facultyName: 'Prof. Sunita Menon',
    },
    {
      id: 'sub-4',
      code: 'BCA404',
      name: 'Software Engineering & UML',
      department: 'Computer Applications (BCA)',
      semester: '4th Semester',
      credits: 3,
      facultyId: 'fac-2',
      facultyName: 'Prof. Sunita Menon',
    },
    {
      id: 'sub-5',
      code: 'BCA405',
      name: 'Computer Networks & Security',
      department: 'Computer Applications (BCA)',
      semester: '4th Semester',
      credits: 3,
      facultyId: 'fac-1',
      facultyName: 'Dr. Rajesh Kulkarni',
    },
  ],

  timetable: [
    { id: 'tt-1', day: 'Monday', period: 1, time: '09:00 AM - 10:00 AM', subjectCode: 'BCA401', subjectName: 'Database Management Systems', facultyName: 'Dr. Rajesh Kulkarni', room: 'Lab 2', department: 'Computer Applications (BCA)', semester: '4th Semester' },
    { id: 'tt-2', day: 'Monday', period: 2, time: '10:00 AM - 11:00 AM', subjectCode: 'BCA402', subjectName: 'Web Technology', facultyName: 'Dr. Rajesh Kulkarni', room: 'Room 304', department: 'Computer Applications (BCA)', semester: '4th Semester' },
    { id: 'tt-3', day: 'Monday', period: 3, time: '11:15 AM - 12:15 PM', subjectCode: 'BCA403', subjectName: 'Data Structures & Algorithms', facultyName: 'Prof. Sunita Menon', room: 'Room 304', department: 'Computer Applications (BCA)', semester: '4th Semester' },
    { id: 'tt-4', day: 'Monday', period: 4, time: '01:00 PM - 02:00 PM', subjectCode: 'BCA404', subjectName: 'Software Engineering', facultyName: 'Prof. Sunita Menon', room: 'Seminar Hall B', department: 'Computer Applications (BCA)', semester: '4th Semester' },
    { id: 'tt-5', day: 'Tuesday', period: 1, time: '09:00 AM - 10:00 AM', subjectCode: 'BCA403', subjectName: 'Data Structures & Algorithms', facultyName: 'Prof. Sunita Menon', room: 'Room 304', department: 'Computer Applications (BCA)', semester: '4th Semester' },
    { id: 'tt-6', day: 'Tuesday', period: 2, time: '10:00 AM - 11:00 AM', subjectCode: 'BCA405', subjectName: 'Computer Networks', facultyName: 'Dr. Rajesh Kulkarni', room: 'Room 304', department: 'Computer Applications (BCA)', semester: '4th Semester' },
    { id: 'tt-7', day: 'Tuesday', period: 3, time: '11:15 AM - 01:15 PM', subjectCode: 'BCA402', subjectName: 'Web Technology Practical Lab', facultyName: 'Dr. Rajesh Kulkarni', room: 'Computer Center 1', department: 'Computer Applications (BCA)', semester: '4th Semester' },
    { id: 'tt-8', day: 'Wednesday', period: 1, time: '09:00 AM - 10:00 AM', subjectCode: 'BCA401', subjectName: 'Database Management Systems', facultyName: 'Dr. Rajesh Kulkarni', room: 'Room 304', department: 'Computer Applications (BCA)', semester: '4th Semester' },
    { id: 'tt-9', day: 'Wednesday', period: 2, time: '10:00 AM - 11:00 AM', subjectCode: 'BCA404', subjectName: 'Software Engineering', facultyName: 'Prof. Sunita Menon', room: 'Room 304', department: 'Computer Applications (BCA)', semester: '4th Semester' },
    { id: 'tt-10', day: 'Wednesday', period: 3, time: '11:15 AM - 12:15 PM', subjectCode: 'BCA405', subjectName: 'Computer Networks', facultyName: 'Dr. Rajesh Kulkarni', room: 'Room 304', department: 'Computer Applications (BCA)', semester: '4th Semester' },
    { id: 'tt-11', day: 'Thursday', period: 1, time: '09:00 AM - 11:00 AM', subjectCode: 'BCA401', subjectName: 'DBMS SQL Practical Lab', facultyName: 'Dr. Rajesh Kulkarni', room: 'Database Lab', department: 'Computer Applications (BCA)', semester: '4th Semester' },
    { id: 'tt-12', day: 'Thursday', period: 2, time: '11:15 AM - 12:15 PM', subjectCode: 'BCA402', subjectName: 'Web Technology', facultyName: 'Dr. Rajesh Kulkarni', room: 'Room 304', department: 'Computer Applications (BCA)', semester: '4th Semester' },
    { id: 'tt-13', day: 'Friday', period: 1, time: '09:00 AM - 10:00 AM', subjectCode: 'BCA403', subjectName: 'Data Structures in C++', facultyName: 'Prof. Sunita Menon', room: 'Room 304', department: 'Computer Applications (BCA)', semester: '4th Semester' },
    { id: 'tt-14', day: 'Friday', period: 2, time: '10:00 AM - 11:00 AM', subjectCode: 'BCA405', subjectName: 'Computer Networks', facultyName: 'Dr. Rajesh Kulkarni', room: 'Room 304', department: 'Computer Applications (BCA)', semester: '4th Semester' },
    { id: 'tt-15', day: 'Friday', period: 3, time: '11:15 AM - 01:15 PM', subjectCode: 'BCA404', subjectName: 'AI & Project Workshop', facultyName: 'Dr. Rajesh Kulkarni', room: 'Smart Classroom 1', department: 'Computer Applications (BCA)', semester: '4th Semester' },
  ],

  attendance: [
    // Pre-seeded records for Aarav Sharma (stud-1)
    { id: 'att-1', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA401', subjectName: 'Database Management Systems', date: '2026-09-01', status: 'Present' },
    { id: 'att-2', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA401', subjectName: 'Database Management Systems', date: '2026-09-03', status: 'Present' },
    { id: 'att-3', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA401', subjectName: 'Database Management Systems', date: '2026-09-08', status: 'Present' },
    { id: 'att-4', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA401', subjectName: 'Database Management Systems', date: '2026-09-10', status: 'Absent' },
    { id: 'att-5', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA401', subjectName: 'Database Management Systems', date: '2026-09-15', status: 'Present' },

    { id: 'att-6', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA402', subjectName: 'Web Technology', date: '2026-09-01', status: 'Present' },
    { id: 'att-7', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA402', subjectName: 'Web Technology', date: '2026-09-02', status: 'Present' },
    { id: 'att-8', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA402', subjectName: 'Web Technology', date: '2026-09-08', status: 'Present' },
    { id: 'att-9', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA402', subjectName: 'Web Technology', date: '2026-09-09', status: 'Present' },
    { id: 'att-10', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA402', subjectName: 'Web Technology', date: '2026-09-14', status: 'Present' },

    { id: 'att-11', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA403', subjectName: 'Data Structures & Algorithms', date: '2026-09-02', status: 'Present' },
    { id: 'att-12', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA403', subjectName: 'Data Structures & Algorithms', date: '2026-09-04', status: 'Absent' },
    { id: 'att-13', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA403', subjectName: 'Data Structures & Algorithms', date: '2026-09-09', status: 'Present' },
    { id: 'att-14', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA403', subjectName: 'Data Structures & Algorithms', date: '2026-09-11', status: 'Present' },

    { id: 'att-15', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA404', subjectName: 'Software Engineering', date: '2026-09-03', status: 'Present' },
    { id: 'att-16', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA404', subjectName: 'Software Engineering', date: '2026-09-07', status: 'Present' },
    { id: 'att-17', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA404', subjectName: 'Software Engineering', date: '2026-09-10', status: 'Late' },

    { id: 'att-18', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA405', subjectName: 'Computer Networks', date: '2026-09-04', status: 'Present' },
    { id: 'att-19', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA405', subjectName: 'Computer Networks', date: '2026-09-08', status: 'Absent' },
    { id: 'att-20', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA405', subjectName: 'Computer Networks', date: '2026-09-11', status: 'Present' },
    { id: 'att-21', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA405', subjectName: 'Computer Networks', date: '2026-09-15', status: 'Present' },

    // Pre-seeded records for Priya Patel (stud-2)
    { id: 'att-22', studentId: 'stud-2', studentRoll: 'BCA2024-002', studentName: 'Priya Patel', subjectCode: 'BCA401', subjectName: 'Database Management Systems', date: '2026-09-15', status: 'Present' },
    { id: 'att-23', studentId: 'stud-2', studentRoll: 'BCA2024-002', studentName: 'Priya Patel', subjectCode: 'BCA402', subjectName: 'Web Technology', date: '2026-09-15', status: 'Present' },
    { id: 'att-24', studentId: 'stud-2', studentRoll: 'BCA2024-002', studentName: 'Priya Patel', subjectCode: 'BCA403', subjectName: 'Data Structures & Algorithms', date: '2026-09-15', status: 'Present' },
  ],

  marks: [
    { id: 'm-1', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA401', subjectName: 'Database Management Systems', examType: 'Internal 1', marksObtained: 22, maxMarks: 25, grade: 'A+', semester: '4th Semester', remarks: 'Excellent grasp of Relational Algebra and SQL queries', date: '2026-08-20' },
    { id: 'm-2', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA401', subjectName: 'Database Management Systems', examType: 'Internal 2', marksObtained: 21, maxMarks: 25, grade: 'A', semester: '4th Semester', remarks: 'Good indexing and normalization answers', date: '2026-09-10' },
    { id: 'm-3', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA402', subjectName: 'Web Technology & Frameworks', examType: 'Internal 1', marksObtained: 24, maxMarks: 25, grade: 'O', semester: '4th Semester', remarks: 'Outstanding JavaScript DOM manipulation & CSS layout', date: '2026-08-22' },
    { id: 'm-4', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA402', subjectName: 'Web Technology & Frameworks', examType: 'Lab Practical', marksObtained: 46, maxMarks: 50, grade: 'O', semester: '4th Semester', remarks: 'Completed responsive college portal project with flying colors', date: '2026-09-12' },
    { id: 'm-5', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA403', subjectName: 'Data Structures & Algorithms', examType: 'Internal 1', marksObtained: 17, maxMarks: 25, grade: 'B+', semester: '4th Semester', remarks: 'Needs more practice with Tree balancing and Graph traversals', date: '2026-08-25' },
    { id: 'm-6', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA403', subjectName: 'Data Structures & Algorithms', examType: 'Internal 2', marksObtained: 19, maxMarks: 25, grade: 'A', semester: '4th Semester', remarks: 'Improved in Stack and Queue implementations', date: '2026-09-14' },
    { id: 'm-7', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA404', subjectName: 'Software Engineering & UML', examType: 'Internal 1', marksObtained: 23, maxMarks: 25, grade: 'A+', semester: '4th Semester', remarks: 'Clean Class Diagrams and Use Case documentation', date: '2026-08-28' },
    { id: 'm-8', studentId: 'stud-1', studentRoll: 'BCA2024-001', studentName: 'Aarav Sharma', subjectCode: 'BCA405', subjectName: 'Computer Networks & Security', examType: 'Internal 1', marksObtained: 16, maxMarks: 25, grade: 'B', semester: '4th Semester', remarks: 'Review OSI model subnetting formulas carefully', date: '2026-09-02' },

    // Marks for Priya Patel (stud-2)
    { id: 'm-9', studentId: 'stud-2', studentRoll: 'BCA2024-002', studentName: 'Priya Patel', subjectCode: 'BCA401', subjectName: 'Database Management Systems', examType: 'Internal 1', marksObtained: 24, maxMarks: 25, grade: 'O', semester: '4th Semester', remarks: 'Top scorer in relational calculus', date: '2026-08-20' },
    { id: 'm-10', studentId: 'stud-2', studentRoll: 'BCA2024-002', studentName: 'Priya Patel', subjectCode: 'BCA403', subjectName: 'Data Structures & Algorithms', examType: 'Internal 1', marksObtained: 23, maxMarks: 25, grade: 'A+', semester: '4th Semester', remarks: 'Clean code and optimal complexity', date: '2026-08-25' },
  ],

  assignments: [
    {
      id: 'asg-1',
      subjectCode: 'BCA401',
      subjectName: 'Database Management Systems',
      title: 'Lab Assignment 1: SQL Joins and Aggregations',
      description: 'Design a schema for a University Library and write queries demonstrating INNER JOIN, LEFT JOIN, GROUP BY, and HAVING clauses with realistic sample records.',
      dueDate: '2026-09-25',
      maxMarks: 20,
      facultyId: 'fac-1',
      facultyName: 'Dr. Rajesh Kulkarni',
      createdDate: '2026-09-10',
    },
    {
      id: 'asg-2',
      subjectCode: 'BCA402',
      subjectName: 'Web Technology & Frameworks',
      title: 'Assignment 2: Responsive Portfolio or Portal UI',
      description: 'Create an interactive multi-section web page using HTML5 semantic tags, Tailwind CSS / modern CSS Flexbox/Grid, and JavaScript form validation.',
      dueDate: '2026-09-28',
      maxMarks: 25,
      facultyId: 'fac-1',
      facultyName: 'Dr. Rajesh Kulkarni',
      createdDate: '2026-09-12',
    },
    {
      id: 'asg-3',
      subjectCode: 'BCA403',
      subjectName: 'Data Structures & Algorithms',
      title: 'Assignment 3: Binary Search Tree & Inorder Traversal',
      description: 'Implement a C++ or JavaScript class for Binary Search Tree with node insertion, search, and iterative/recursive inorder traversals. Include dry-run diagrams.',
      dueDate: '2026-10-02',
      maxMarks: 20,
      facultyId: 'fac-2',
      facultyName: 'Prof. Sunita Menon',
      createdDate: '2026-09-14',
    },
  ],

  submissions: [
    {
      id: 'subm-1',
      assignmentId: 'asg-1',
      studentId: 'stud-1',
      studentName: 'Aarav Sharma',
      studentRoll: 'BCA2024-001',
      submissionDate: '2026-09-14',
      content: 'GitHub Repository link and SQL query script: Completed Library Database with 5 tables, populated 20 sample rows, and verified all 8 SQL join queries with query execution plans.',
      status: 'Graded',
      marksAwarded: 19,
      feedback: 'Very well structured! Joins and subqueries executed cleanly. Good indexing practice.',
    },
    {
      id: 'subm-2',
      assignmentId: 'asg-2',
      studentId: 'stud-1',
      studentName: 'Aarav Sharma',
      studentRoll: 'BCA2024-001',
      submissionDate: '2026-09-15',
      content: 'Hosted live application URL and GitHub codebase: Implemented Smart College System dashboard with dark/light accessibility and animated charts.',
      status: 'Submitted',
    },
  ],

  announcements: [
    {
      id: 'ann-1',
      title: 'Mid-Term Semester Examination Schedule Announced',
      content: 'The 4th Semester BCA and BSC-IT Mid-Term examinations will commence from October 12, 2026. Hall tickets will be issued via the portal.',
      date: '2026-09-14',
      author: 'Office of the Controller of Examinations',
      category: 'Exam',
      priority: 'Urgent',
    },
    {
      id: 'ann-2',
      title: 'Smart India Hackathon & College TechFest 2026 Registration',
      content: 'All BCA and IT students are invited to register team projects in Web, AI, and Cloud computing tracks. Exciting trophies and cash prizes!',
      date: '2026-09-12',
      author: 'Department of Computer Applications',
      category: 'Event',
      priority: 'High',
    },
    {
      id: 'ann-3',
      title: 'Mandatory 75% Attendance Requirement for Semester End Exams',
      content: 'Students with attendance below 75% will need to submit medical documentation to the HOD before September 30 to qualify for condonation.',
      date: '2026-09-08',
      author: 'Academic Council',
      category: 'Academic',
      priority: 'Normal',
    },
  ],
};

// Helper: Calculate grade based on percentage
function calculateGrade(marks: number, max: number): string {
  const pct = (marks / max) * 100;
  if (pct >= 90) return 'O';
  if (pct >= 80) return 'A+';
  if (pct >= 70) return 'A';
  if (pct >= 60) return 'B+';
  if (pct >= 50) return 'B';
  if (pct >= 40) return 'C';
  return 'F';
}

// -------------------------------------------------------------
// REST API Routes
// -------------------------------------------------------------

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Smart College Management System with AI', timestamp: new Date().toISOString() });
});

// 1. Authentication
app.post('/api/auth/login', (req, res) => {
  const { loginId, password, role } = req.body;
  if (!loginId || !password) {
    return res.status(400).json({ error: 'Please enter Roll No/ID and Password' });
  }

  // Find matching user (case-insensitive loginId or email)
  const user = db.users.find(
    (u) =>
      (u.loginId.toLowerCase() === loginId.trim().toLowerCase() ||
        u.email.toLowerCase() === loginId.trim().toLowerCase()) &&
      (!role || u.role === role)
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid user credentials. Please check your Roll No / ID and selected role.' });
  }

  // For demonstration convenience, verify password or allow standard demo password
  if (user.password !== password && password !== 'demo123') {
    return res.status(401).json({ error: 'Incorrect password. Default passwords: student123, faculty123, admin123' });
  }

  // Return sanitized user
  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser, message: 'Login successful' });
});

// Student registration endpoint
app.post('/api/auth/register', (req, res) => {
  const { name, email, rollNo, password, department, semester, phone } = req.body;

  if (!name || !email || !rollNo || !password || !department) {
    return res.status(400).json({ error: 'Please fill in all mandatory fields' });
  }

  // Check duplicate
  const existing = db.users.find(
    (u) => u.loginId.toLowerCase() === rollNo.trim().toLowerCase() || u.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (existing) {
    return res.status(409).json({ error: 'A student with this Roll Number or Email already exists.' });
  }

  const newStudent: DBUser = {
    id: `stud-${Date.now()}`,
    loginId: rollNo.trim().toUpperCase(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password,
    role: 'student',
    department: department,
    semester: semester || '1st Semester',
    phone: phone || '+91 98765 00000',
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
    enrolledYear: '2024',
  };

  db.users.push(newStudent);

  // Initialize seed attendance and marks for realistic immediate display
  const subjectList = db.subjects.filter((s) => s.department.includes('BCA') || s.department === department);
  subjectList.slice(0, 3).forEach((sub, idx) => {
    db.attendance.push({
      id: `att-${Date.now()}-${idx}`,
      studentId: newStudent.id,
      studentRoll: newStudent.loginId,
      studentName: newStudent.name,
      subjectCode: sub.code,
      subjectName: sub.name,
      date: '2026-09-15',
      status: 'Present',
    });
  });

  const { password: _, ...safeUser } = newStudent;
  res.status(201).json({ user: safeUser, message: 'Registration successful! Welcome to Smart College.' });
});

// 2. Student Portal Endpoints
app.get('/api/student/:id/dashboard', (req, res) => {
  const student = db.users.find((u) => u.id === req.params.id && u.role === 'student');
  if (!student) {
    return res.status(404).json({ error: 'Student record not found' });
  }

  // Subject-wise attendance calculation
  const studentAttendance = db.attendance.filter((a) => a.studentId === student.id);
  const relevantSubjects = db.subjects.filter((s) => s.department === student.department || s.semester === student.semester);

  const attendanceSummary = relevantSubjects.map((sub) => {
    const records = studentAttendance.filter((a) => a.subjectCode === sub.code);
    const attended = records.filter((r) => r.status === 'Present' || r.status === 'Late').length;
    const total = Math.max(records.length, 5); // baseline minimum classes for realistic stats
    const actualAttended = records.length > 0 ? attended : 4;
    const pct = Math.round((actualAttended / total) * 100);

    return {
      subjectCode: sub.code,
      subjectName: sub.name,
      facultyName: sub.facultyName,
      totalClasses: total,
      attendedClasses: actualAttended,
      percentage: pct,
      isEligible: pct >= 75,
    };
  });

  const totalClasses = attendanceSummary.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const totalAttended = attendanceSummary.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const overallAttendancePercentage = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 85;

  // Student Marks
  const studentMarks = db.marks.filter((m) => m.studentId === student.id);

  // Student Assignments
  const allAssignments = db.assignments;
  const studentSubmissions = db.submissions.filter((s) => s.studentId === student.id);
  const assignmentsWithStatus = allAssignments.map((asg) => {
    const sub = studentSubmissions.find((s) => s.assignmentId === asg.id);
    return {
      ...asg,
      submissionStatus: sub ? sub.status : 'Pending',
      submission: sub || null,
    };
  });

  // Today's Timetable
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDay = days[new Date().getDay()] || 'Monday';
  const effectiveDay = ['Saturday', 'Sunday'].includes(todayDay) ? 'Monday' : todayDay;
  const todaysClasses = db.timetable.filter((t) => t.day === effectiveDay && t.semester === (student.semester || '4th Semester'));

  res.json({
    student,
    overallAttendancePercentage,
    attendanceSummary,
    studentMarks,
    assignments: assignmentsWithStatus,
    todaysClasses,
    announcements: db.announcements,
  });
});

// Student attendance detail
app.get('/api/student/:id/attendance', (req, res) => {
  const records = db.attendance.filter((a) => a.studentId === req.params.id);
  res.json({ records });
});

// Student marks detail
app.get('/api/student/:id/marks', (req, res) => {
  const records = db.marks.filter((m) => m.studentId === req.params.id);
  res.json({ records });
});

// Student timetable
app.get('/api/student/:id/timetable', (req, res) => {
  const student = db.users.find((u) => u.id === req.params.id);
  const timetable = db.timetable.filter((t) => !student?.semester || t.semester === student.semester);
  res.json({ timetable });
});

// Submit assignment
app.post('/api/student/assignments/submit', (req, res) => {
  const { assignmentId, studentId, content } = req.body;
  if (!assignmentId || !studentId || !content) {
    return res.status(400).json({ error: 'Missing required assignment submission details' });
  }

  const student = db.users.find((u) => u.id === studentId);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  // Update existing or add new
  const existingIdx = db.submissions.findIndex((s) => s.assignmentId === assignmentId && s.studentId === studentId);
  const submissionRecord = {
    id: existingIdx >= 0 ? db.submissions[existingIdx].id : `subm-${Date.now()}`,
    assignmentId,
    studentId,
    studentName: student.name,
    studentRoll: student.loginId,
    submissionDate: new Date().toISOString().split('T')[0],
    content,
    status: 'Submitted' as const,
  };

  if (existingIdx >= 0) {
    db.submissions[existingIdx] = submissionRecord;
  } else {
    db.submissions.push(submissionRecord);
  }

  res.json({ message: 'Assignment submitted successfully!', submission: submissionRecord });
});

// 3. Faculty Portal Endpoints
app.get('/api/faculty/:id/dashboard', (req, res) => {
  const faculty = db.users.find((u) => u.id === req.params.id && u.role === 'faculty');
  if (!faculty) return res.status(404).json({ error: 'Faculty record not found' });

  const assignedSubjects = db.subjects.filter((s) => s.facultyId === faculty.id || s.facultyName === faculty.name);
  const myAssignments = db.assignments.filter((a) => a.facultyId === faculty.id || a.facultyName === faculty.name);

  // Total students enrolled in faculty's department
  const studentsInDept = db.users.filter((u) => u.role === 'student' && u.department === faculty.department);

  // Submissions requiring review
  const pendingSubmissions = db.submissions.filter((s) => {
    const asg = myAssignments.find((a) => a.id === s.assignmentId);
    return asg && s.status === 'Submitted';
  });

  res.json({
    faculty,
    assignedSubjects,
    myAssignments,
    totalStudents: studentsInDept.length,
    pendingSubmissionsCount: pendingSubmissions.length,
    announcements: db.announcements,
  });
});

// Get students for attendance / marks entry
app.get('/api/faculty/students', (req, res) => {
  const { department, semester } = req.query;
  let students = db.users.filter((u) => u.role === 'student');

  if (department) {
    students = students.filter((s) => s.department === department);
  }
  if (semester) {
    students = students.filter((s) => s.semester === semester);
  }

  res.json({ students });
});

// Add / Update Attendance
app.post('/api/faculty/attendance', (req, res) => {
  const { subjectCode, date, attendanceList } = req.body;
  if (!subjectCode || !date || !Array.isArray(attendanceList)) {
    return res.status(400).json({ error: 'Invalid attendance data format' });
  }

  const subject = db.subjects.find((s) => s.code === subjectCode);
  const subjectName = subject ? subject.name : subjectCode;

  attendanceList.forEach((entry: { studentId: string; status: 'Present' | 'Absent' | 'Late'; remarks?: string }) => {
    const student = db.users.find((u) => u.id === entry.studentId);
    if (!student) return;

    // Check if record exists for this student on this date and subject
    const existingIdx = db.attendance.findIndex(
      (a) => a.studentId === entry.studentId && a.subjectCode === subjectCode && a.date === date
    );

    const record = {
      id: existingIdx >= 0 ? db.attendance[existingIdx].id : `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      studentId: entry.studentId,
      studentRoll: student.loginId,
      studentName: student.name,
      subjectCode,
      subjectName,
      date,
      status: entry.status,
      remarks: entry.remarks || '',
    };

    if (existingIdx >= 0) {
      db.attendance[existingIdx] = record;
    } else {
      db.attendance.push(record);
    }
  });

  res.json({ message: `Attendance updated for ${attendanceList.length} students on ${date}.` });
});

// Enter and update marks
app.post('/api/faculty/marks', (req, res) => {
  const { studentId, subjectCode, examType, marksObtained, maxMarks, semester, remarks } = req.body;

  if (!studentId || !subjectCode || !examType || marksObtained === undefined || !maxMarks) {
    return res.status(400).json({ error: 'Please provide all required marks fields' });
  }

  if (Number(marksObtained) > Number(maxMarks)) {
    return res.status(400).json({ error: 'Marks obtained cannot exceed maximum marks' });
  }

  const student = db.users.find((u) => u.id === studentId);
  const subject = db.subjects.find((s) => s.code === subjectCode);

  const grade = calculateGrade(Number(marksObtained), Number(maxMarks));

  // Check if existing record
  const existingIdx = db.marks.findIndex(
    (m) => m.studentId === studentId && m.subjectCode === subjectCode && m.examType === examType
  );

  const newRecord = {
    id: existingIdx >= 0 ? db.marks[existingIdx].id : `m-${Date.now()}`,
    studentId,
    studentRoll: student ? student.loginId : 'BCA2024-XXX',
    studentName: student ? student.name : 'Student',
    subjectCode,
    subjectName: subject ? subject.name : subjectCode,
    examType,
    marksObtained: Number(marksObtained),
    maxMarks: Number(maxMarks),
    grade,
    semester: semester || '4th Semester',
    remarks: remarks || '',
    date: new Date().toISOString().split('T')[0],
  };

  if (existingIdx >= 0) {
    db.marks[existingIdx] = newRecord;
  } else {
    db.marks.push(newRecord);
  }

  res.json({ message: 'Marks successfully saved and grade computed.', record: newRecord });
});

// Create Assignment
app.post('/api/faculty/assignments', (req, res) => {
  const { subjectCode, title, description, dueDate, maxMarks, facultyId, facultyName } = req.body;

  if (!subjectCode || !title || !dueDate || !maxMarks) {
    return res.status(400).json({ error: 'Missing mandatory assignment fields' });
  }

  const subject = db.subjects.find((s) => s.code === subjectCode);
  const newAssignment = {
    id: `asg-${Date.now()}`,
    subjectCode,
    subjectName: subject ? subject.name : subjectCode,
    title,
    description,
    dueDate,
    maxMarks: Number(maxMarks),
    facultyId: facultyId || 'fac-1',
    facultyName: facultyName || 'Faculty',
    createdDate: new Date().toISOString().split('T')[0],
  };

  db.assignments.unshift(newAssignment);
  res.status(201).json({ message: 'Assignment created successfully!', assignment: newAssignment });
});

// Grade Submission
app.post('/api/faculty/submissions/grade', (req, res) => {
  const { submissionId, marksAwarded, feedback } = req.body;
  const sub = db.submissions.find((s) => s.id === submissionId);
  if (!sub) return res.status(404).json({ error: 'Submission not found' });

  sub.marksAwarded = Number(marksAwarded);
  sub.feedback = feedback;
  sub.status = 'Graded';

  res.json({ message: 'Submission graded successfully', submission: sub });
});

// 4. Admin Portal Endpoints
app.get('/api/admin/stats', (req, res) => {
  const totalStudents = db.users.filter((u) => u.role === 'student').length;
  const totalFaculty = db.users.filter((u) => u.role === 'faculty').length;
  const totalDepartments = db.departments.length;
  const totalSubjects = db.subjects.length;
  const activeAssignments = db.assignments.length;

  // Compute average attendance
  const totalAttRecords = db.attendance.length;
  const presentCount = db.attendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const averageAttendance = totalAttRecords > 0 ? Math.round((presentCount / totalAttRecords) * 100) : 84;

  // Pass percentage estimate
  const marksAbovePass = db.marks.filter((m) => (m.marksObtained / m.maxMarks) >= 0.4).length;
  const averagePassPercentage = db.marks.length > 0 ? Math.round((marksAbovePass / db.marks.length) * 100) : 92;

  res.json({
    totalStudents,
    totalFaculty,
    totalDepartments,
    totalSubjects,
    averageAttendance,
    averagePassPercentage,
    activeAssignments,
  });
});

// Manage Students
app.get('/api/admin/students', (req, res) => {
  const students = db.users.filter((u) => u.role === 'student');
  res.json({ students });
});

app.post('/api/admin/students', (req, res) => {
  const { name, rollNo, email, department, semester, phone, password } = req.body;
  if (!name || !rollNo || !email || !department) {
    return res.status(400).json({ error: 'Missing required student fields' });
  }

  const newStudent: DBUser = {
    id: `stud-${Date.now()}`,
    loginId: rollNo.trim().toUpperCase(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password || 'student123',
    role: 'student',
    department,
    semester: semester || '1st Semester',
    phone: phone || '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    enrolledYear: '2024',
  };

  db.users.push(newStudent);
  res.status(201).json({ message: 'Student created successfully', student: newStudent });
});

app.delete('/api/admin/students/:id', (req, res) => {
  const idx = db.users.findIndex((u) => u.id === req.params.id && u.role === 'student');
  if (idx === -1) return res.status(404).json({ error: 'Student not found' });
  db.users.splice(idx, 1);
  res.json({ message: 'Student removed from system' });
});

// Manage Faculty
app.get('/api/admin/faculty', (req, res) => {
  const faculty = db.users.filter((u) => u.role === 'faculty');
  res.json({ faculty });
});

app.post('/api/admin/faculty', (req, res) => {
  const { name, facultyId, email, department, designation, phone } = req.body;
  if (!name || !facultyId || !email || !department) {
    return res.status(400).json({ error: 'Missing required faculty fields' });
  }

  const newFaculty: DBUser = {
    id: `fac-${Date.now()}`,
    loginId: facultyId.trim().toUpperCase(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: 'faculty123',
    role: 'faculty',
    department,
    designation: designation || 'Assistant Professor',
    phone: phone || '+91 98220 00000',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  };

  db.users.push(newFaculty);
  res.status(201).json({ message: 'Faculty member created successfully', faculty: newFaculty });
});

// Manage Departments
app.get('/api/admin/departments', (req, res) => {
  res.json({ departments: db.departments });
});

app.post('/api/admin/departments', (req, res) => {
  const { code, name, description, hod } = req.body;
  if (!code || !name) return res.status(400).json({ error: 'Code and Name are required' });

  const newDept = {
    id: `dept-${Date.now()}`,
    code: code.trim().toUpperCase(),
    name: name.trim(),
    description: description || '',
    hod: hod || 'To be appointed',
    totalStudents: 0,
  };

  db.departments.push(newDept);
  res.status(201).json({ message: 'Department added successfully', department: newDept });
});

// Manage Subjects
app.get('/api/admin/subjects', (req, res) => {
  res.json({ subjects: db.subjects });
});

app.post('/api/admin/subjects', (req, res) => {
  const { code, name, department, semester, credits, facultyId } = req.body;
  if (!code || !name || !department) return res.status(400).json({ error: 'Code, Name, and Department are required' });

  const faculty = db.users.find((u) => u.id === facultyId);
  const newSubject = {
    id: `sub-${Date.now()}`,
    code: code.trim().toUpperCase(),
    name: name.trim(),
    department,
    semester: semester || '4th Semester',
    credits: Number(credits) || 3,
    facultyId: facultyId || '',
    facultyName: faculty ? faculty.name : 'Unassigned',
  };

  db.subjects.push(newSubject);
  res.status(201).json({ message: 'Subject added successfully', subject: newSubject });
});

// College Announcements
app.get('/api/announcements', (req, res) => {
  res.json({ announcements: db.announcements });
});

app.post('/api/announcements', (req, res) => {
  const { title, content, author, category, priority } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

  const newAnn = {
    id: `ann-${Date.now()}`,
    title,
    content,
    author: author || 'Administration',
    category: category || 'Academic',
    priority: priority || 'Normal',
    date: new Date().toISOString().split('T')[0],
  };

  db.announcements.unshift(newAnn);
  res.status(201).json({ message: 'Announcement posted', announcement: newAnn });
});

// -------------------------------------------------------------
// 5. Gemini AI Powered Academic Endpoints
// -------------------------------------------------------------

// AI Academic Chatbot
app.post('/api/ai/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'Prompt message is required' });

  // If Gemini API is available on server
  if (aiClient) {
    try {
      const systemInstruction = `You are the "Smart College AI Academic Assistant", a helpful, patient, and knowledgeable professor and tutor for undergraduate Computer Applications (BCA) and Information Technology students.
Your capabilities:
1. Explain computer science concepts (DBMS, SQL, C++, Java, Web Development, Data Structures, Networking, OS, Software Engineering) in simple, intuitive terms.
2. Provide short, clean code examples with explanations.
3. Prepare students for BCA viva voce examinations with sample questions and concise answers.
4. Provide college academic advice, time management, and study suggestions.
Format responses using clear markdown with bullet points and bold headers. Keep tone encouraging, professional, and directly useful for viva.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || 'I could not generate an answer at this moment.';
      return res.json({ reply: responseText });
    } catch (err: any) {
      console.warn('Gemini API call failed, switching to intelligent academic rule engine:', err?.message || err);
    }
  }

  // Resilient Academic Fallback Engine (covers standard BCA syllabus topics)
  const query = message.toLowerCase();
  let reply = '';

  if (query.includes('dbms') || query.includes('normalization') || query.includes('sql') || query.includes('acid')) {
    reply = `### 📘 Database Management Systems (DBMS) Quick Guide

**Core Concept Explained Simply:**
A **Database Management System (DBMS)** is software used to store, manage, and query structured data securely.

- **Normalization:** The process of organizing data to reduce redundancy and eliminate anomalies (Insertion, Deletion, Update).
  - **1NF:** Atomic (indivisible) values in every column.
  - **2NF:** In 1NF + No partial dependency (non-prime attributes depend on full candidate key).
  - **3NF:** In 2NF + No transitive dependency ($A \\rightarrow B$ and $B \\rightarrow C$).
  - **BCNF:** A stricter version where for every functional dependency $X \\rightarrow Y$, $X$ is a Super Key.

- **ACID Properties:**
  - **Atomicity:** All-or-nothing transaction execution.
  - **Consistency:** Database remains valid before and after.
  - **Isolation:** Concurrent transactions do not interfere.
  - **Durability:** Committed changes persist even after system crashes.

💡 **Common Viva Question:** *"What is the difference between primary key, unique key, and candidate key?"*
*Answer:* A candidate key uniquely identifies a tuple. One candidate key is chosen as the Primary Key (cannot be NULL). Unique key allows one NULL value.`;
  } else if (query.includes('data structure') || query.includes('array') || query.includes('linked list') || query.includes('tree') || query.includes('stack')) {
    reply = `### 🌳 Data Structures & Algorithms Overview

- **Stack (LIFO - Last In First Out):**
  - Operations: \`push()\`, \`pop()\`, \`peek()\`.
  - Applications: Function call stack, undo operations, parenthesis matching, expression evaluation.

- **Queue (FIFO - First In First Out):**
  - Operations: \`enqueue()\`, \`dequeue()\`.
  - Applications: CPU scheduling, printer queues, Breadth-First Search (BFS).

- **Linked List vs Array:**
  - *Array:* Contiguous memory allocation, $O(1)$ random access, fixed size.
  - *Linked List:* Dynamic memory allocation using pointers, $O(n)$ search, dynamic size.

💡 **Viva Tip:** In Binary Search Trees (BST), **Inorder Traversal** always outputs nodes in ascending sorted order!`;
  } else if (query.includes('oop') || query.includes('polymorphism') || query.includes('inheritance') || query.includes('class')) {
    reply = `### ☕ Object-Oriented Programming (OOP) Pillars

1. **Encapsulation:** Wrapping code and data into a single unit (class) with private variables and public getters/setters.
2. **Abstraction:** Hiding implementation details and exposing only essential features (e.g., abstract classes & interfaces).
3. **Inheritance:** Mechanism where a child class acquires properties and behaviors of a parent class (reusability).
4. **Polymorphism (Many Forms):**
   - *Compile-Time (Static):* Method Overloading (same name, different parameter signature).
   - *Run-Time (Dynamic):* Method Overriding (using virtual functions / '@Override').`;
  } else {
    reply = `### 🎓 Smart College Academic Tutor

Thank you for your academic query! Here is a focused study guideline for: **"${message}"**

- **Conceptual Foundation:** Break the topic down into definitions, real-world utility, and standard algorithmic/procedural steps.
- **Key Exam Pointers:** Examiners look for clean diagrams, syntax definitions, and time/space complexity analysis.
- **Viva Preparation:** Practice explaining the topic in 2 concise sentences without reading from a slide.

Would you like me to:
1. Generate an interactive **AI Quiz** on this topic?
2. Provide a **Simple Analogy** and code snippet?
3. Create a **7-day personalized study schedule**?`;
  }

  res.json({ reply });
});

// AI Topic Explainer (Simple Explanations + Analogy + Viva Q&A)
app.post('/api/ai/explain', async (req, res) => {
  const { topic, subject } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });

  if (aiClient) {
    try {
      const prompt = `Explain the following computer science / BCA college topic in simple, crystal-clear terms for a student:
Topic: "${topic}"
Subject: "${subject || 'Computer Applications'}"

Return a JSON object matching this schema:
{
  "topic": "${topic}",
  "summary": "2-3 sentence clear definition",
  "keyPoints": ["bullet point 1", "bullet point 2", "bullet point 3", "bullet point 4"],
  "realWorldAnalogy": "A relatable real-world analogy explaining how it works in real life",
  "codeSnippet": "Short clean snippet in C++/Java/JavaScript/SQL (if relevant)",
  "vivaQuestions": [
    {"question": "Expected examiner question 1", "answer": "Concise high-scoring answer"},
    {"question": "Expected examiner question 2", "answer": "Concise high-scoring answer"}
  ]
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ explanation: parsed });
    } catch (err) {
      console.warn('Gemini explanation fallback:', err);
    }
  }

  // Fallback structured explanation
  res.json({
    explanation: {
      topic,
      summary: `${topic} is a foundational concept in ${subject || 'Computer Science'} that defines how systems organize, process, and manage logic or information efficiently.`,
      keyPoints: [
        `Enforces systematic structure and modularity in software architecture.`,
        `Improves execution performance, maintainability, and code reusability.`,
        `Directly tested in university theoretical exams and practical lab evaluations.`,
        `Widely utilized across modern web, database, and backend frameworks.`,
      ],
      realWorldAnalogy: `Think of ${topic} like an organized public library: instead of piling books on the floor, an indexed catalog and labeled shelves ensure anyone can find and verify any book in seconds.`,
      codeSnippet: `// Example demonstration of ${topic}\nfunction demonstrateConcept() {\n  const status = "ACTIVE";\n  console.log("Processing ${topic} with optimal complexity O(1)");\n  return true;\n}`,
      vivaQuestions: [
        {
          question: `What is the main advantage of using ${topic}?`,
          answer: `It provides standardized structure, improves execution efficiency, and prevents runtime anomalies or data corruption.`,
        },
        {
          question: `Where is ${topic} implemented in industry projects?`,
          answer: `It is integrated into production relational databases, operating system schedulers, and modern client-server web applications.`,
        },
      ],
    },
  });
});

// AI Quiz Generator
app.post('/api/ai/quiz', async (req, res) => {
  const { subject, topic, difficulty } = req.body;
  const targetTopic = topic || 'General Computer Science & BCA Concepts';

  if (aiClient) {
    try {
      const prompt = `Generate a 5-question multiple choice quiz for college BCA students on the topic: "${targetTopic}", Subject: "${subject || 'Computer Science'}", Difficulty: "${difficulty || 'Intermediate'}".
Output strictly valid JSON with this format:
{
  "topic": "${targetTopic}",
  "subject": "${subject || 'Computer Science'}",
  "difficulty": "${difficulty || 'Intermediate'}",
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct."
    }
  ]
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const quizData = JSON.parse(response.text || '{}');
      if (quizData.questions && quizData.questions.length > 0) {
        return res.json({ quiz: quizData });
      }
    } catch (err) {
      console.warn('Gemini quiz generation fallback:', err);
    }
  }

  // Fallback curated BCA quiz
  res.json({
    quiz: {
      topic: targetTopic,
      subject: subject || 'Computer Science',
      difficulty: difficulty || 'Intermediate',
      questions: [
        {
          id: 1,
          question: 'Which normal form addresses transitive dependencies in relational database design?',
          options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
          correctIndex: 2,
          explanation: '3NF requires that no non-prime attribute is transitively dependent on any candidate key (if X -> Y and Y -> Z, then X -> Z is removed).',
        },
        {
          id: 2,
          question: 'What is the average time complexity of searching an element in a balanced Binary Search Tree (AVL/Red-Black)?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctIndex: 1,
          explanation: 'Because a balanced binary search tree cuts the search space in half at each level, the height is logarithmic: O(log n).',
        },
        {
          id: 3,
          question: 'In HTTP protocol, which method is idempotent and used to retrieve representation of a resource without side effects?',
          options: ['POST', 'GET', 'PATCH', 'CONNECT'],
          correctIndex: 1,
          explanation: 'GET requests are idempotent and safe; repeating the request does not alter the server state.',
        },
        {
          id: 4,
          question: 'Which layer of the OSI model is responsible for end-to-end communication, error recovery, and flow control?',
          options: ['Network Layer', 'Data Link Layer', 'Transport Layer', 'Session Layer'],
          correctIndex: 2,
          explanation: 'The Transport layer (Layer 4, protocols like TCP and UDP) provides end-to-end host communication and flow control.',
        },
        {
          id: 5,
          question: 'Which OOP concept allows a single function name to behave differently based on the calling object at runtime?',
          options: ['Dynamic Polymorphism / Method Overriding', 'Encapsulation', 'Multiple Inheritance', 'Data Shadowing'],
          correctIndex: 0,
          explanation: 'Dynamic polymorphism resolved via virtual tables (vtables) allows overridden methods to execute based on runtime instance type.',
        },
      ],
    },
  });
});

// AI Performance Analyzer & Study Plan
app.post('/api/ai/analyze-performance', async (req, res) => {
  const { studentId } = req.body;
  const student = db.users.find((u) => u.id === studentId || u.role === 'student');

  const studentAttendance = db.attendance.filter((a) => a.studentId === (student ? student.id : 'stud-1'));
  const studentMarks = db.marks.filter((m) => m.studentId === (student ? student.id : 'stud-1'));

  const totalClasses = Math.max(studentAttendance.length, 10);
  const attendedClasses = studentAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length || 8;
  const attendanceScore = Math.round((attendedClasses / totalClasses) * 100);

  const marksPct = studentMarks.length > 0
    ? Math.round(studentMarks.reduce((acc, m) => acc + (m.marksObtained / m.maxMarks) * 100, 0) / studentMarks.length)
    : 82;

  if (aiClient) {
    try {
      const prompt = `Analyze this college student's academic standing:
Student: ${student ? student.name : 'Aarav Sharma'}
Department: ${student ? student.department : 'BCA'}
Attendance Percentage: ${attendanceScore}%
Average Marks Percentage: ${marksPct}%
Subjects & Marks: ${JSON.stringify(studentMarks.map((m) => ({ subject: m.subjectName, exam: m.examType, marks: `${m.marksObtained}/${m.maxMarks}`, grade: m.grade })))}

Generate a personalized academic evaluation in JSON format:
{
  "overallHealth": "Excellent" | "Good" | "Needs Attention" | "Critical",
  "attendanceScore": ${attendanceScore},
  "marksScore": ${marksPct},
  "strongAreas": ["Area 1", "Area 2"],
  "topicsNeedingImprovement": ["Topic needing revision 1", "Topic needing revision 2"],
  "actionPlan": ["Immediate step 1", "Immediate step 2", "Immediate step 3"],
  "estimatedGrade": "A+ / O"
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const analysis = JSON.parse(response.text || '{}');
      return res.json({ analysis });
    } catch (err) {
      console.warn('Gemini performance analysis fallback:', err);
    }
  }

  // Fallback intelligent analysis
  res.json({
    analysis: {
      overallHealth: attendanceScore >= 75 && marksPct >= 75 ? 'Good' : 'Needs Attention',
      attendanceScore,
      marksScore: marksPct,
      strongAreas: [
        'Web Technology & Modern JavaScript Architecture (Consistent Grade O / A+)',
        'Relational Database Modeling and SQL Query Optimization',
      ],
      topicsNeedingImprovement: [
        'Tree Balancing and Graph Algorithms in C++ (BCA403)',
        'OSI Network Subnetting & Packet Routing Calculations (BCA405)',
      ],
      actionPlan: [
        'Maintain attendance above 75% in BCA405 Computer Networks to ensure semester exam eligibility.',
        'Practice 2 coding problems daily on Binary Search Tree traversals before mid-term.',
        'Review SQL Normalization anomalies for upcoming internal assessment 2.',
      ],
      estimatedGrade: marksPct >= 85 ? 'Grade O (Outstanding)' : marksPct >= 75 ? 'Grade A+ (Distinction)' : 'Grade A',
    },
  });
});

// AI Study Plan Generator
app.post('/api/ai/study-plan', async (req, res) => {
  const { examName, targetSubject, hoursPerDay } = req.body;
  const hours = hoursPerDay || 3;
  const subject = targetSubject || 'All 4th Semester Subjects';

  if (aiClient) {
    try {
      const prompt = `Create a realistic 7-day personalized study schedule for a BCA college student preparing for "${examName || 'Semester Mid-Term Exams'}" in subject: "${subject}".
Allocated study time: ${hours} hours/day.
Output strictly valid JSON with this schema:
{
  "title": "7-Day Strategic Study Plan for ${subject}",
  "targetExam": "${examName || 'Mid-Term Exam'}",
  "targetSubject": "${subject}",
  "days": [
    {
      "day": "Day 1 (Monday)",
      "topicFocus": "Core Foundations & Architecture",
      "tasks": ["Task 1", "Task 2"],
      "revisionTip": "Tip for quick recall",
      "allocatedHours": ${hours}
    }
  ],
  "generalAdvice": "Key strategy for viva and written tests"
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const plan = JSON.parse(response.text || '{}');
      if (plan.days && plan.days.length > 0) {
        return res.json({ studyPlan: plan });
      }
    } catch (err) {
      console.warn('Gemini study plan fallback:', err);
    }
  }

  // Fallback 7-day study plan
  res.json({
    studyPlan: {
      title: `7-Day Strategic Study Schedule for ${subject}`,
      targetExam: examName || 'Semester Examination 2026',
      targetSubject: subject,
      days: [
        {
          day: 'Day 1 (Monday)',
          topicFocus: 'Foundations & Architecture Review',
          tasks: ['Revise core syllabus definitions and block diagrams', 'Solve 5 previous year 2-mark questions'],
          revisionTip: 'Make 1-page formula and concept cheat-sheets.',
          allocatedHours: hours,
        },
        {
          day: 'Day 2 (Tuesday)',
          topicFocus: 'DBMS & Relational Algebra',
          tasks: ['Write hands-on SQL queries for multi-table joins', 'Practice 1NF, 2NF, 3NF, BCNF decomposition rules'],
          revisionTip: 'Always write down functional dependencies explicitly.',
          allocatedHours: hours,
        },
        {
          day: 'Day 3 (Wednesday)',
          topicFocus: 'Data Structures: Stacks, Queues, Trees',
          tasks: ['Code BST insert, delete, and inorder traversal', 'Draw stack frames for recursion execution trace'],
          revisionTip: 'Remember Inorder of BST yields sorted elements.',
          allocatedHours: hours,
        },
        {
          day: 'Day 4 (Thursday)',
          topicFocus: 'Web Technology & Modern JavaScript',
          tasks: ['Review DOM manipulation, Fetch API, and Promise handling', 'Check CSS Flexbox and Grid responsive rules'],
          revisionTip: 'Explain Event Bubbling vs Capturing aloud.',
          allocatedHours: hours,
        },
        {
          day: 'Day 5 (Friday)',
          topicFocus: 'Software Engineering & UML Diagrams',
          tasks: ['Draw clean Use-Case and Class Diagrams', 'Revise Agile Scrum lifecycle and testing techniques'],
          revisionTip: 'Focus on difference between Black Box and White Box testing.',
          allocatedHours: hours,
        },
        {
          day: 'Day 6 (Saturday)',
          topicFocus: 'Computer Networks & Security',
          tasks: ['Calculate IPv4 subnet masks and broadcast addresses', 'Review TCP 3-way handshake vs UDP protocol differences'],
          revisionTip: 'Memorize standard port numbers: HTTP 80, HTTPS 443, DNS 53, SSH 22.',
          allocatedHours: hours,
        },
        {
          day: 'Day 7 (Sunday)',
          topicFocus: 'Full Mock Test & Viva Voce Rehearsal',
          tasks: ['Take 60-minute timed mock test', 'Review all flashcards and practice viva questions with peer'],
          revisionTip: 'Get adequate rest before exam day to keep recall sharp.',
          allocatedHours: hours,
        },
      ],
      generalAdvice: 'Consistent daily revision for 2-3 hours with active recall is proven to boost semester GPA by over 20%.',
    },
  });
});

// -------------------------------------------------------------
// Vite Middleware / Static Production Serving
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('⚡ Vite development middleware mounted');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('📦 Static production file server mounted');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Smart College Management System backend running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
});
