import React, { useState, useEffect } from 'react';
import { Subject, Department } from '../../types';
import {
  Building,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Award,
  Layers,
  Sparkles,
  Users
} from 'lucide-react';

export const DepartmentSubjectManager: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([
    { id: 'dept-1', name: 'Computer Applications (BCA)', code: 'BCA', hod: 'Dr. Rajesh Kulkarni', totalStudents: 240 },
    { id: 'dept-2', name: 'Information Technology (BSC-IT)', code: 'BSCIT', hod: 'Prof. Anjali Mehta', totalStudents: 180 },
    { id: 'dept-3', name: 'Master of Computer Applications (MCA)', code: 'MCA', hod: 'Dr. Ramesh Chandra', totalStudents: 120 },
    { id: 'dept-4', name: 'Business Administration (BBA)', code: 'BBA', hod: 'Dr. Sunita Rao', totalStudents: 300 },
  ]);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);

  // Subject Form
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [dept, setDept] = useState('Computer Applications (BCA)');
  const [sem, setSem] = useState('4th Semester');
  const [credits, setCredits] = useState(4);
  const [facultyName, setFacultyName] = useState('Dr. Rajesh Kulkarni');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/admin/subjects');
      const data = await res.json();
      if (data.subjects) {
        setSubjects(data.subjects);
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      code,
      name,
      department: dept,
      semester: sem,
      credits,
      facultyId: 'fac-1',
      facultyName,
    };
    setSubjects([...subjects, newSub]);
    setCode('');
    setName('');
    setIsAddSubjectOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Academic Council &amp; Curriculum Board
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            Departments &amp; Syllabus Curriculum
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Define academic streams, semester syllabus subjects, and UGC/AICTE credit allocations.
          </p>
        </div>

        <button
          onClick={() => setIsAddSubjectOpen(true)}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Course / Subject
        </button>
      </div>

      {/* College Departments Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Building className="w-4 h-4 text-emerald-700" />
          Academic Departments
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((d) => (
            <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-emerald-50 text-emerald-800">
                  {d.code}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{d.totalStudents} Students</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">{d.name}</h3>
              <p className="text-[11px] text-slate-500">HOD: <strong className="text-slate-700">{d.hod}</strong></p>
            </div>
          ))}
        </div>
      </div>

      {/* Subjects Curriculum Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900">Curriculum Subjects &amp; Credit Structure</h2>
          </div>
          <span className="text-xs text-slate-500">{subjects.length} active courses</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Subject Code</th>
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-4">Department &amp; Sem</th>
                <th className="py-3 px-4">Credits</th>
                <th className="py-3 px-4">Faculty In-Charge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">{sub.code}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{sub.name}</td>
                  <td className="py-3 px-4">
                    <span className="text-slate-800 font-medium">{sub.department}</span>
                    <span className="block text-[11px] text-slate-400">{sub.semester}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {sub.credits} Credits
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    👨‍🏫 {sub.facultyName || 'Department Faculty'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subject Modal */}
      {isAddSubjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-emerald-800 p-5 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                Curriculum Registry
              </span>
              <h3 className="text-base font-bold">Add Course / Subject</h3>
            </div>

            <form onSubmit={handleAddSubject} className="p-6 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. BCA-405"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Credits</label>
                  <input
                    type="number"
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    min={1}
                    max={6}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Title *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence & Machine Learning"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Computer Applications (BCA)">BCA</option>
                    <option value="Information Technology (BSC-IT)">BSC-IT</option>
                    <option value="Master of Computer Applications (MCA)">MCA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={sem}
                    onChange={(e) => setSem(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="1st Semester">1st Sem</option>
                    <option value="2nd Semester">2nd Sem</option>
                    <option value="3rd Semester">3rd Sem</option>
                    <option value="4th Semester">4th Sem</option>
                    <option value="5th Semester">5th Sem</option>
                    <option value="6th Semester">6th Sem</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Faculty In-Charge</label>
                <input
                  type="text"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
