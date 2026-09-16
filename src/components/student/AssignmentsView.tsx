import React, { useState } from 'react';
import { User, Assignment, AssignmentSubmission } from '../../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Send,
  ExternalLink,
  Award,
  X
} from 'lucide-react';

interface AssignmentsViewProps {
  student: User;
  assignments: (Assignment & {
    submissionStatus: string;
    submission?: AssignmentSubmission | null;
  })[];
  onSubmissionSuccess: () => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  student,
  assignments,
  onSubmissionSuccess,
}) => {
  const [activeModalAssignment, setActiveModalAssignment] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const handleOpenSubmit = (asg: Assignment) => {
    setActiveModalAssignment(asg);
    setSubmissionContent('');
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalAssignment || !submissionContent.trim()) {
      setSubmitError('Please enter your submission text, GitHub link, or project notes.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/student/assignments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: activeModalAssignment.id,
          studentId: student.id,
          content: submissionContent.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit assignment');
      }

      setSubmitSuccess('Assignment submitted successfully to course faculty!');
      setTimeout(() => {
        setActiveModalAssignment(null);
        onSubmissionSuccess();
      }, 1200);
    } catch (err: any) {
      setSubmitError(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Continuous Internal Assessment (CIA)
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            Coursework &amp; Assignments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete and upload your practical tasks and lab reports before deadline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
            Total: {assignments.length}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold">
            Pending: {assignments.filter((a) => a.submissionStatus === 'Pending').length}
          </span>
        </div>
      </div>

      {/* Assignment List */}
      <div className="grid grid-cols-1 gap-4">
        {assignments.map((asg) => {
          const isPending = asg.submissionStatus === 'Pending';
          const isGraded = asg.submissionStatus === 'Graded';
          const isSubmitted = asg.submissionStatus === 'Submitted';

          return (
            <div
              key={asg.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-indigo-50 text-indigo-700">
                    {asg.subjectCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{asg.subjectName}</span>
                </div>

                {/* Status Badge */}
                <div>
                  {isGraded ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                      <Award className="w-3.5 h-3.5" />
                      Graded: {asg.submission?.marksAwarded} / {asg.maxMarks}
                    </span>
                  ) : isSubmitted ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Submitted (Under Review)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3.5 h-3.5" />
                      Pending Submission
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{asg.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{asg.description}</p>
              </div>

              {/* Assignment Metadata */}
              <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 text-xs gap-3">
                <div className="flex flex-wrap items-center gap-4 text-slate-500">
                  <span>📅 Due Date: <strong className="text-slate-800">{asg.dueDate}</strong></span>
                  <span>🏆 Max Marks: <strong className="text-slate-800">{asg.maxMarks} pts</strong></span>
                  <span>👨‍🏫 Faculty: <strong className="text-slate-800">{asg.facultyName}</strong></span>
                </div>

                <div>
                  {isPending ? (
                    <button
                      onClick={() => handleOpenSubmit(asg)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Submit Assignment
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenSubmit(asg)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                    >
                      {isGraded ? 'View Faculty Feedback' : 'Update Submission'}
                    </button>
                  )}
                </div>
              </div>

              {/* Display Feedback if Graded */}
              {isGraded && asg.submission?.feedback && (
                <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-900">
                  <strong>💬 Faculty Feedback:</strong> "{asg.submission.feedback}"
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {activeModalAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  {activeModalAssignment.subjectCode}
                </span>
                <h3 className="text-base font-bold">{activeModalAssignment.title}</h3>
              </div>
              <button
                onClick={() => setActiveModalAssignment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment} className="p-6 space-y-4">
              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}
              {submitSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assignment Content / Code / GitHub Link / Submission Notes *
                </label>
                <textarea
                  rows={5}
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  placeholder="Paste your code solution, GitHub repository URL, Google Drive submission link, or written answer here..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500">
                  Submitted as: <strong>{student.name}</strong> ({student.loginId})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalAssignment(null)}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? 'Uploading...' : 'Confirm Submission'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
