import React, { useState } from 'react';
import { User } from '../../types';
import {
  FileText,
  Download,
  Printer,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  BarChart3
} from 'lucide-react';

interface FacultyReportsProps {
  faculty: User;
}

export const FacultyReports: React.FC<FacultyReportsProps> = ({ faculty }) => {
  const [selectedSubject, setSelectedSubject] = useState('BCA-401');

  const attendanceRiskStudents = [
    { roll: 'BCA2024-004', name: 'Vikram Singh', attendance: 68, risk: 'High', classesMissed: 7 },
    { roll: 'BCA2024-007', name: 'Divya Ramesh', attendance: 71, risk: 'Moderate', classesMissed: 6 },
    { roll: 'BCA2024-012', name: 'Rahul Nair', attendance: 65, risk: 'High', classesMissed: 8 },
  ];

  const gradeDistribution = [
    { grade: 'O (Outstanding 90%+)', count: 8, pct: 20 },
    { grade: 'A+ (Excellent 80-89%)', count: 18, pct: 45 },
    { grade: 'A (Very Good 70-79%)', count: 10, pct: 25 },
    { grade: 'B+ (Good 60-69%)', count: 4, pct: 10 },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Faculty Academic Analytics
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            Student Performance &amp; Attendance Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate continuous evaluation analytics and review attendance shortages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="BCA-401">BCA-401: DBMS</option>
            <option value="BCA-402">BCA-402: Web Technology</option>
          </select>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Subject Pass Rate</span>
          <p className="text-2xl font-black text-slate-900 mt-1">97.5%</p>
          <span className="text-xs text-emerald-600 font-semibold">39 of 40 students passing</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Average Internal Score</span>
          <p className="text-2xl font-black text-slate-900 mt-1">21.8 / 25</p>
          <span className="text-xs text-indigo-600 font-semibold">87.2% class average</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Attendance Shortage</span>
          <p className="text-2xl font-black text-rose-600 mt-1">3 Students</p>
          <span className="text-xs text-rose-600 font-semibold">Below 75% threshold</span>
        </div>
      </div>

      {/* Attendance Shortage Risk Warning Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-amber-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Students at Risk of Exam Ineligibility (&lt; 75% Attendance)
            </h2>
          </div>
          <span className="text-xs text-amber-800 font-bold">Action Required</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Attendance %</th>
                <th className="py-3 px-4">Lectures Missed</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceRiskStudents.map((st, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{st.roll}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{st.name}</td>
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-rose-600">{st.attendance}%</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{st.classesMissed} classes</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      {st.risk}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => alert(`Notice drafted for ${st.name} (${st.roll})`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                    >
                      Send Warning Notice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Distribution Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-600" />
          Internal Assessment Grade Distribution
        </h3>

        <div className="space-y-3">
          {gradeDistribution.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">{item.grade}</span>
                <span className="font-extrabold text-slate-900">
                  {item.count} students ({item.pct}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
