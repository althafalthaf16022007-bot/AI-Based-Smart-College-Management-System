import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Save,
  Users,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface AttendanceManagerProps {
  faculty: User;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({ faculty }) => {
  const [students, setStudents] = useState<User[]>([]);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('BCA-401');
  const [selectedSubjectName, setSelectedSubjectName] = useState('Database Management Systems');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Attendance state: { [studentId: string]: 'Present' | 'Absent' | 'Late' }
  const [attendanceMap, setAttendanceMap] = useState<{ [id: string]: 'Present' | 'Absent' | 'Late' }>({});
  const [remarksMap, setRemarksMap] = useState<{ [id: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admin/students');
      const data = await res.json();
      if (data.students) {
        setStudents(data.students);
        // Default all to Present
        const initial: { [id: string]: 'Present' | 'Absent' | 'Late' } = {};
        data.students.forEach((s: User) => {
          initial[s.id] = 'Present';
        });
        setAttendanceMap(initial);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: 'Present' | 'Absent') => {
    const updated: { [id: string]: 'Present' | 'Absent' | 'Late' } = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
  };

  const handleSubjectChange = (code: string) => {
    setSelectedSubjectCode(code);
    if (code === 'BCA-401') setSelectedSubjectName('Database Management Systems');
    else if (code === 'BCA-402') setSelectedSubjectName('Web Technology & PHP');
    else setSelectedSubjectName('Computer Networks');
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    setSaveSuccess('');
    setSaveError('');

    const records = students.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      rollNo: s.loginId,
      status: attendanceMap[s.id] || 'Present',
      remarks: remarksMap[s.id] || '',
    }));

    try {
      const res = await fetch('/api/faculty/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectCode: selectedSubjectCode,
          subjectName: selectedSubjectName,
          date,
          records,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to record attendance');
      }

      setSaveSuccess(`Attendance for ${selectedSubjectCode} (${date}) saved successfully!`);
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err: any) {
      setSaveError(err.message || 'Error saving attendance');
    } finally {
      setIsSaving(false);
    }
  };

  // Compute stats
  const total = students.length;
  const presentCount = Object.values(attendanceMap).filter((s) => s === 'Present').length;
  const absentCount = Object.values(attendanceMap).filter((s) => s === 'Absent').length;
  const lateCount = Object.values(attendanceMap).filter((s) => s === 'Late').length;
  const attendancePct = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Control Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Faculty Lecture Register
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              Daily Student Attendance
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Faculty: <strong>{faculty.name}</strong> • Department of {faculty.department}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleMarkAll('Present')}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll('Absent')}
              className="px-3 py-1.5 text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        {/* Filter & Subject Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Subject</label>
            <select
              value={selectedSubjectCode}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="BCA-401">BCA-401: Database Management Systems</option>
              <option value="BCA-402">BCA-402: Web Technology & PHP</option>
              <option value="BCA-404">BCA-404: Computer Networks</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lecture Date</label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex items-end">
            <div className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-500">Attendance Rate:</span>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900">{presentCount} / {total}</span>
                <span className="font-black text-amber-700">({attendancePct}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Messages */}
        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}
        {saveError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}
      </div>

      {/* Student Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-700" />
            <h2 className="text-sm font-bold text-slate-900">Student Roll Call List</h2>
          </div>
          <span className="text-xs text-slate-500">{students.length} enrolled students</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Attendance Status</th>
                <th className="py-3 px-4">Remarks / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st) => {
                const currentStatus = attendanceMap[st.id] || 'Present';

                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{st.loginId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{st.name}</td>
                    
                    {/* Interactive Toggle Pills */}
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl gap-1">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'Present')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Present
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'Absent')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            currentStatus === 'Absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Absent
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'Late')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            currentStatus === 'Late'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Late
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Optional remarks..."
                        value={remarksMap[st.id] || ''}
                        onChange={(e) => setRemarksMap({ ...remarksMap, [st.id]: e.target.value })}
                        className="w-full max-w-xs px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Save Footer Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span>Present: <strong className="text-emerald-700">{presentCount}</strong></span>
            <span>Absent: <strong className="text-rose-700">{absentCount}</strong></span>
            <span>Late: <strong className="text-amber-700">{lateCount}</strong></span>
          </div>

          <button
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Submitting to College ERP...' : 'Save & Publish Attendance'}
          </button>
        </div>
      </div>

    </div>
  );
};
