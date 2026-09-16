import React, { useState, useEffect } from 'react';
import { User, Assignment, AssignmentSubmission } from '../../types';
import {
  FilePlus,
  FileText,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  Users,
  Send,
  Calendar,
  ExternalLink
} from 'lucide-react';

interface AssignmentManagerProps {
  faculty: User;
}

export const AssignmentManager: React.FC<AssignmentManagerProps> = ({ faculty }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'grade'>('list');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');

  // Create form state
  const [title, setTitle] = useState('');
  const [subjectCode, setSubjectCode] = useState('BCA-401');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState<number>(20);
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState('');

  // Grade form state
  const [activeSubmission, setActiveSubmission] = useState<AssignmentSubmission | null>(null);
  const [marksAwarded, setMarksAwarded] = useState<number>(18);
  const [feedback, setFeedback] = useState('');
  const [isGrading, setIsGrading] = useState(false);
  const [gradeMsg, setGradeMsg] = useState('');

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch('/api/faculty/assignments');
      const data = await res.json();
      if (data.assignments) {
        setAssignments(data.assignments);
        if (data.assignments.length > 0 && !selectedAssignmentId) {
          setSelectedAssignmentId(data.assignments[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching assignments:', err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/faculty/submissions');
      const data = await res.json();
      if (data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateMsg('');

    let subjectName = 'Database Management Systems';
    if (subjectCode === 'BCA-402') subjectName = 'Web Technology & PHP';
    else if (subjectCode === 'BCA-404') subjectName = 'Computer Networks';

    try {
      const res = await fetch('/api/faculty/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subjectCode,
          subjectName,
          dueDate: dueDate || '2025-05-15',
          maxMarks,
          description,
          facultyName: faculty.name,
          facultyId: faculty.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create assignment');

      setCreateMsg('New assignment successfully published to student portal!');
      setTitle('');
      setDescription('');
      fetchAssignments();
      setTimeout(() => {
        setCreateMsg('');
        setActiveTab('list');
      }, 1500);
    } catch (err: any) {
      setCreateMsg(err.message || 'Error creating assignment');
    } finally {
      setIsCreating(false);
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission) return;

    setIsGrading(true);
    setGradeMsg('');

    try {
      const res = await fetch('/api/faculty/assignments/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: activeSubmission.id,
          marksAwarded,
          feedback,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to grade submission');

      setGradeMsg('Score and feedback saved to student marksheet!');
      fetchSubmissions();
      setTimeout(() => {
        setActiveSubmission(null);
        setGradeMsg('');
      }, 1200);
    } catch (err: any) {
      setGradeMsg(err.message || 'Grading error');
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
            Continuous Internal Assessment
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            Assignment &amp; Coursework Evaluation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create practical tasks, verify student project submissions, and assign internal marks.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'list' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Tasks ({assignments.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'create' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Create New
          </button>
          <button
            onClick={() => setActiveTab('grade')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'grade' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Submissions ({submissions.length})
          </button>
        </div>
      </div>

      {/* 1. List Assignments */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {assignments.map((asg) => {
            const asgSubs = submissions.filter((s) => s.assignmentId === asg.id);
            return (
              <div key={asg.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-purple-50 text-purple-700">
                      {asg.subjectCode}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{asg.subjectName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>📅 Due: <strong>{asg.dueDate}</strong></span>
                    <span>🏆 Max Marks: <strong>{asg.maxMarks}</strong></span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900">{asg.title}</h3>
                <p className="text-xs text-slate-600">{asg.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">
                    Submissions received: <strong className="text-purple-700">{asgSubs.length}</strong>
                  </span>
                  <button
                    onClick={() => {
                      setSelectedAssignmentId(asg.id);
                      setActiveTab('grade');
                    }}
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl transition-colors"
                  >
                    View &amp; Grade Submissions →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Create Assignment Form */}
      {activeTab === 'create' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-4">Publish New Student Assignment</h2>

          {createMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{createMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Implement B-Tree & Hash Indexing in SQL"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="BCA-401">BCA-401: Database Management Systems</option>
                  <option value="BCA-402">BCA-402: Web Technology & PHP</option>
                  <option value="BCA-404">BCA-404: Computer Networks</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Max Score (Marks)</label>
                <input
                  type="number"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(Number(e.target.value))}
                  min={5}
                  max={100}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Problem Statement &amp; Submission Instructions *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specify what students need to produce, expected code format, test data, and submission guidelines..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <FilePlus className="w-4 h-4" />
                {isCreating ? 'Publishing...' : 'Publish to Student Portals'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Review & Grade Submissions */}
      {activeTab === 'grade' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Filter by Assignment:</span>
            <select
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Assignments</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.subjectCode}: {a.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {submissions
              .filter((s) => !selectedAssignmentId || s.assignmentId === selectedAssignmentId)
              .map((sub) => (
                <div key={sub.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{sub.studentName}</h4>
                      <span className="text-[11px] text-slate-500">
                        Roll: <strong>{sub.studentRollNo}</strong> • Submitted on {sub.submittedAt}
                      </span>
                    </div>
                    {sub.status === 'Graded' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                        Awarded: {sub.marksAwarded} Marks
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Pending Evaluation
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono text-slate-700 whitespace-pre-wrap">
                    {sub.content}
                  </div>

                  {sub.feedback && (
                    <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900">
                      <strong>Feedback:</strong> {sub.feedback}
                    </div>
                  )}

                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setActiveSubmission(sub);
                        setMarksAwarded(sub.marksAwarded || 18);
                        setFeedback(sub.feedback || 'Well structured solution.');
                      }}
                      className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      {sub.status === 'Graded' ? 'Edit Marks' : 'Evaluate & Award Marks'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {activeSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-purple-900 p-5 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                Evaluation Panel
              </span>
              <h3 className="text-base font-bold">Grade Student Submission</h3>
              <p className="text-xs text-purple-200 mt-0.5">
                {activeSubmission.studentName} ({activeSubmission.studentRollNo})
              </p>
            </div>

            <form onSubmit={handleGradeSubmission} className="p-6 space-y-4">
              {gradeMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{gradeMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Marks Awarded</label>
                <input
                  type="number"
                  value={marksAwarded}
                  onChange={(e) => setMarksAwarded(Number(e.target.value))}
                  min={0}
                  max={25}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty Feedback &amp; Suggestions</label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="e.g. Accurate implementation, clean SQL queries..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSubmission(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGrading}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  {isGrading ? 'Saving Grade...' : 'Confirm Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
