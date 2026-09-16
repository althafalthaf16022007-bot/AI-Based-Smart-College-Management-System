import React, { useState } from 'react';
import { CollegeStats } from '../../types';
import {
  FileText,
  Printer,
  Download,
  Award,
  TrendingUp,
  Building,
  Users,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface AdminReportsProps {
  stats: CollegeStats | null;
}

export const AdminReports: React.FC<AdminReportsProps> = ({ stats }) => {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-2025');

  const departmentPerformance = [
    { name: 'Computer Applications (BCA)', passRate: 96.2, attendance: 85.4, facultyCount: 14 },
    { name: 'Information Technology (BSC-IT)', passRate: 94.8, attendance: 83.1, facultyCount: 12 },
    { name: 'Master of Computer Applications (MCA)', passRate: 98.1, attendance: 88.0, facultyCount: 10 },
    { name: 'Business Administration (BBA)', passRate: 91.5, attendance: 81.2, facultyCount: 16 },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
            Institutional Quality Assurance Cell (IQAC)
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            College Academic Performance Audit &amp; Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive college statistics, department evaluations, and accreditation analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedAcademicYear}
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="2024-2025">Academic Year 2024 - 2025</option>
            <option value="2023-2024">Academic Year 2023 - 2024</option>
          </select>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Official Report
          </button>
        </div>
      </div>

      {/* College Statistics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Enrolment</span>
          <p className="text-3xl font-black text-slate-900 mt-1">{stats?.totalStudents || 1240}</p>
          <span className="text-xs text-emerald-600 font-semibold">100% capacity filled</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Teaching Staff</span>
          <p className="text-3xl font-black text-slate-900 mt-1">{stats?.totalFaculty || 86}</p>
          <span className="text-xs text-indigo-600 font-semibold">Student-Faculty Ratio 14:1</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Aggregate Attendance</span>
          <p className="text-3xl font-black text-emerald-700 mt-1">
            {stats?.overallAttendancePercentage || 84.8}%
          </p>
          <span className="text-xs text-slate-500 font-medium">Compliance threshold: 75%</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Semester Pass Rate</span>
          <p className="text-3xl font-black text-purple-800 mt-1">{stats?.passPercentage || 94.2}%</p>
          <span className="text-xs text-purple-600 font-semibold">NAAC A++ Benchmark</span>
        </div>
      </div>

      {/* Department Breakdown Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-purple-700" />
            <h2 className="text-sm font-bold text-slate-900">Department Performance &amp; Faculty Audit</h2>
          </div>
          <span className="text-xs text-slate-500">AY {selectedAcademicYear}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Department Name</th>
                <th className="py-3 px-4">Pass Rate</th>
                <th className="py-3 px-4">Attendance Average</th>
                <th className="py-3 px-4">Faculty Strength</th>
                <th className="py-3 px-4">Accreditation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentPerformance.map((dp, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{dp.name}</td>
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-purple-700">{dp.passRate}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-emerald-700">{dp.attendance}%</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{dp.facultyCount} Professors</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Tier 1 Accredited
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
