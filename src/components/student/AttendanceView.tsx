import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord, StudentAttendanceSummary } from '../../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Filter,
  ArrowUpRight,
  Calculator,
  Search
} from 'lucide-react';

interface AttendanceViewProps {
  student: User;
  overallAttendancePercentage: number;
  attendanceSummary: StudentAttendanceSummary[];
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  student,
  overallAttendancePercentage,
  attendanceSummary,
}) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, [student.id]);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/student/${student.id}/attendance`);
      const data = await res.json();
      if (data.records) {
        setRecords(data.records);
      }
    } catch (err) {
      console.error('Error fetching student attendance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter records
  const filteredRecords = records.filter((r) => {
    const matchSubject = selectedSubject === 'all' || r.subjectCode === selectedSubject;
    const matchStatus = selectedStatus === 'all' || r.status === selectedStatus;
    return matchSubject && matchStatus;
  });

  // BCA Student Formula: Calculate classes required to reach 75% if below
  const calculateNeededClasses = (attended: number, total: number) => {
    if (total === 0) return 0;
    const currentPct = (attended / total) * 100;
    if (currentPct >= 75) return 0;
    // Formula: (attended + x) / (total + x) >= 0.75 => attended + x >= 0.75*total + 0.75*x => 0.25*x >= 0.75*total - attended => x = (3*total - 4*attended)
    const needed = Math.ceil(3 * total - 4 * attended);
    return Math.max(needed, 1);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Stat Cards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Attendance Tracking</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              Attendance Record &amp; Eligibility
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Roll No: <strong>{student.loginId}</strong> • Department of {student.department}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500">Aggregate Attendance</span>
              <p className="text-2xl font-black text-slate-900 leading-tight">{overallAttendancePercentage}%</p>
            </div>
            <div
              className={`p-3 rounded-2xl ${
                overallAttendancePercentage >= 75
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-rose-50 text-rose-600 border border-rose-200'
              }`}
            >
              {overallAttendancePercentage >= 75 ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>
          </div>
        </div>

        {/* Subject Breakdown Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {attendanceSummary.map((sub) => {
            const needed = calculateNeededClasses(sub.attendedClasses, sub.totalClasses);
            return (
              <div
                key={sub.subjectCode}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-xs transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                      {sub.subjectCode}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{sub.subjectName}</h3>
                  </div>
                  <span
                    className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                      sub.percentage >= 75
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {sub.percentage}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${
                      sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5">
                  <span>Attended: {sub.attendedClasses} of {sub.totalClasses}</span>
                  {sub.percentage >= 75 ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                      ✓ Exam Eligible
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold flex items-center gap-0.5">
                      Need {needed} more class{needed > 1 ? 'es' : ''}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date-wise Detailed Attendance History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Lecture-Wise Attendance Log</h2>
            <span className="text-xs text-slate-500">({filteredRecords.length} records)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Subjects</option>
              {attendanceSummary.map((s) => (
                <option key={s.subjectCode} value={s.subjectCode}>
                  {s.subjectCode}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Subject Code</th>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No attendance records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{rec.date}</td>
                    <td className="py-3 px-4 font-bold text-indigo-700">{rec.subjectCode}</td>
                    <td className="py-3 px-4 text-slate-800">{rec.subjectName}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          rec.status === 'Present'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rec.status === 'Late'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {rec.status === 'Present' && <CheckCircle2 className="w-3 h-3" />}
                        {rec.status === 'Late' && <Clock className="w-3 h-3" />}
                        {rec.status === 'Absent' && <XCircle className="w-3 h-3" />}
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 italic">{rec.remarks || 'Regular lecture'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
