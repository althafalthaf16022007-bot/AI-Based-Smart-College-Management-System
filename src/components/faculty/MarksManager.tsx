import React, { useState, useEffect } from 'react';
import { User, MarkRecord } from '../../types';
import { Award, Save, Users, CheckCircle2, AlertCircle, Calculator } from 'lucide-react';

interface MarksManagerProps {
  faculty: User;
}

export const MarksManager: React.FC<MarksManagerProps> = ({ faculty }) => {
  const [students, setStudents] = useState<User[]>([]);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('BCA-401');
  const [selectedSubjectName, setSelectedSubjectName] = useState('Database Management Systems');
  const [examType, setExamType] = useState('Internal 1');
  const [maxMarks, setMaxMarks] = useState<number>(25);

  // Marks map: { [studentId: string]: number }
  const [marksMap, setMarksMap] = useState<{ [id: string]: number }>({});
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
        // Default initial marks
        const initMarks: { [id: string]: number } = {
          'std-1': 22,
          'std-2': 19,
          'std-3': 24,
          'std-4': 16,
        };
        setMarksMap(initMarks);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleSubjectChange = (code: string) => {
    setSelectedSubjectCode(code);
    if (code === 'BCA-401') setSelectedSubjectName('Database Management Systems');
    else if (code === 'BCA-402') setSelectedSubjectName('Web Technology & PHP');
    else setSelectedSubjectName('Computer Networks');
  };

  const handleExamChange = (type: string) => {
    setExamType(type);
    if (type === 'Internal 1' || type === 'Internal 2') {
      setMaxMarks(25);
    } else {
      setMaxMarks(50);
    }
  };

  const handleMarkChange = (studentId: string, val: string) => {
    const num = Number(val);
    if (isNaN(num)) return;
    if (num < 0 || num > maxMarks) return;
    setMarksMap((prev) => ({ ...prev, [studentId]: num }));
  };

  // Grade calculate helper (Standard university grading)
  const getGrade = (obtained: number, max: number) => {
    if (!max || isNaN(obtained)) return 'N/A';
    const pct = (obtained / max) * 100;
    if (pct >= 90) return 'O';
    if (pct >= 80) return 'A+';
    if (pct >= 70) return 'A';
    if (pct >= 60) return 'B+';
    if (pct >= 50) return 'B';
    if (pct >= 40) return 'C';
    return 'F';
  };

  const handleSaveMarks = async () => {
    setIsSaving(true);
    setSaveSuccess('');
    setSaveError('');

    const records = students.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      rollNo: s.loginId,
      marksObtained: marksMap[s.id] !== undefined ? marksMap[s.id] : 20,
      remarks: remarksMap[s.id] || 'Satisfactory internal performance',
    }));

    try {
      const res = await fetch('/api/faculty/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectCode: selectedSubjectCode,
          subjectName: selectedSubjectName,
          examType,
          maxMarks,
          records,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update marks');
      }

      setSaveSuccess(`Marks for ${selectedSubjectCode} (${examType}) updated successfully!`);
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err: any) {
      setSaveError(err.message || 'Error updating marks');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Configuration Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Academic Assessment Portal
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              Enter &amp; Update Student Marks
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Select assessment criteria and enter marks with live university grade calculation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs">
              Max Score: {maxMarks} Marks
            </span>
          </div>
        </div>

        {/* Form Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
            <select
              value={selectedSubjectCode}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="BCA-401">BCA-401: Database Management Systems</option>
              <option value="BCA-402">BCA-402: Web Technology & PHP</option>
              <option value="BCA-404">BCA-404: Computer Networks</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Examination / Test Type</label>
            <select
              value={examType}
              onChange={(e) => handleExamChange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Internal 1">Internal Assessment 1 (25 Marks)</option>
              <option value="Internal 2">Internal Assessment 2 (25 Marks)</option>
              <option value="Mid-Term Exam">Mid-Term Examination (50 Marks)</option>
              <option value="Lab Practical">Lab Practical Evaluation (50 Marks)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Max Marks</label>
            <input
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
              min={10}
              max={100}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Feedback alerts */}
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

      {/* Marks Entry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Student Score Entry ({selectedSubjectCode} - {examType})
            </h2>
          </div>
          <span className="text-xs text-slate-500">{students.length} students</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Marks Obtained (Max: {maxMarks})</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Remarks / Faculty Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st) => {
                const obtained = marksMap[st.id] !== undefined ? marksMap[st.id] : 20;
                const pct = Math.round((obtained / maxMarks) * 100);
                const grade = getGrade(obtained, maxMarks);

                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{st.loginId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{st.name}</td>
                    
                    {/* Marks Input */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={obtained}
                          onChange={(e) => handleMarkChange(st.id, e.target.value)}
                          min={0}
                          max={maxMarks}
                          className="w-20 px-2.5 py-1 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="text-slate-400">/ {maxMarks}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-800">{pct}%</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {grade}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="e.g. Good grasp of concepts"
                        value={remarksMap[st.id] || ''}
                        onChange={(e) => setRemarksMap({ ...remarksMap, [st.id]: e.target.value })}
                        className="w-full max-w-xs px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
          <span className="text-xs text-slate-500">
            Ensure all scores are within 0 to {maxMarks} limits before publishing.
          </span>

          <button
            onClick={handleSaveMarks}
            disabled={isSaving}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving Marks...' : 'Publish Marks to Student Portal'}
          </button>
        </div>
      </div>

    </div>
  );
};
