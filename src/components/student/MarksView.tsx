import React, { useState, useEffect } from 'react';
import { User, MarkRecord } from '../../types';
import { Award, TrendingUp, BookOpen, Filter, CheckCircle2, AlertCircle } from 'lucide-react';

interface MarksViewProps {
  student: User;
  studentMarks: MarkRecord[];
}

export const MarksView: React.FC<MarksViewProps> = ({ student, studentMarks }) => {
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [marksList, setMarksList] = useState<MarkRecord[]>(studentMarks);

  useEffect(() => {
    fetchMarks();
  }, [student.id]);

  const fetchMarks = async () => {
    try {
      const res = await fetch(`/api/student/${student.id}/marks`);
      const data = await res.json();
      if (data.records && data.records.length > 0) {
        setMarksList(data.records);
      }
    } catch (err) {
      console.error('Error fetching marks:', err);
    }
  };

  const filteredMarks = marksList.filter(
    (m) => selectedExam === 'all' || m.examType === selectedExam
  );

  // Compute overall percentage
  const totalObtained = filteredMarks.reduce((acc, m) => acc + m.marksObtained, 0);
  const totalMax = filteredMarks.reduce((acc, m) => acc + m.maxMarks, 0);
  const overallPercentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 85;

  // Approximate SGPA calculation (10 point scale)
  const estimatedSGPA = (overallPercentage / 9.5).toFixed(2);

  return (
    <div className="space-y-6">
      
      {/* Top Academic Performance Summary Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Examination &amp; Assessment Report
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              Semester Academic Marksheet
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Student: <strong>{student.name}</strong> ({student.loginId}) • {student.semester || '4th Semester'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-right">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Estimated SGPA</span>
              <span className="text-2xl font-black text-indigo-700">{estimatedSGPA}</span>
              <span className="text-[10px] text-slate-400 block">out of 10.0</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-right">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Average Score</span>
              <span className="text-2xl font-black text-emerald-700">{overallPercentage}%</span>
              <span className="text-[10px] text-emerald-600 font-semibold block">Grade A+</span>
            </div>
          </div>
        </div>

        {/* Visual Marks Bar Chart */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Subject Marks Breakdown</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filter Exam:</span>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Assessments</option>
                <option value="Internal 1">Internal 1 (Out of 25)</option>
                <option value="Internal 2">Internal 2 (Out of 25)</option>
                <option value="Lab Practical">Lab Practical (Out of 50)</option>
                <option value="Mid-Term Exam">Mid-Term Exam (Out of 50)</option>
              </select>
            </div>
          </div>

          {/* Graphical Bar Comparison */}
          <div className="space-y-3.5">
            {filteredMarks.map((m) => {
              const pct = Math.round((m.marksObtained / m.maxMarks) * 100);
              return (
                <div key={m.id} className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div>
                      <span className="font-bold text-slate-900">{m.subjectName}</span>
                      <span className="ml-2 text-[10px] text-indigo-600 font-medium">({m.examType})</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold">
                      <span className="text-slate-900">
                        {m.marksObtained} / {m.maxMarks}
                      </span>
                      <span className="text-indigo-600">({pct}%)</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          pct >= 85
                            ? 'bg-emerald-100 text-emerald-800'
                            : pct >= 70
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        Grade {m.grade}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        pct >= 85 ? 'bg-emerald-500' : pct >= 70 ? 'bg-indigo-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>

                  {m.remarks && (
                    <p className="text-[11px] text-slate-500 italic mt-1.5">
                      💬 Teacher remarks: "{m.remarks}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Official Marksheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Evaluation Records &amp; University Grades</h2>
          </div>
          <span className="text-xs text-slate-500">{filteredMarks.length} records listed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Subject Code</th>
                <th className="py-3 px-4">Subject Title</th>
                <th className="py-3 px-4">Exam Type</th>
                <th className="py-3 px-4">Max Marks</th>
                <th className="py-3 px-4">Marks Obtained</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMarks.map((row) => {
                const pct = Math.round((row.marksObtained / row.maxMarks) * 100);
                return (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-indigo-600">{row.subjectCode}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{row.subjectName}</td>
                    <td className="py-3 px-4 text-slate-600">{row.examType}</td>
                    <td className="py-3 px-4 font-medium">{row.maxMarks}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">{row.marksObtained}</td>
                    <td className="py-3 px-4 font-bold text-slate-700">{pct}%</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {row.grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
