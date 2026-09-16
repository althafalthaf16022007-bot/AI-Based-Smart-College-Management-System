import React, { useState } from 'react';
import { User, UserRole } from '../types';
import {
  GraduationCap,
  Briefcase,
  Shield,
  X,
  Sparkles,
  ArrowRight,
  UserCheck,
  Lock,
  Mail,
  Phone,
  BookOpen,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regRoll, setRegRoll] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDept, setRegDept] = useState('Computer Applications (BCA)');
  const [regSem, setRegSem] = useState('4th Semester');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  if (!isOpen) return null;

  // Handle standard login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginId.trim() || !password.trim()) {
      setLoginError('Please enter both your Roll No/ID and Password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId: loginId.trim(),
          password: password.trim(),
          role: selectedRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setLoginError(err.message || 'Unable to connect to college server');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Login helper for examiner/viva review
  const handleQuickDemoLogin = async (role: UserRole) => {
    setIsSubmitting(true);
    setLoginError('');

    let demoId = 'BCA2024-001';
    let demoPass = 'student123';

    if (role === 'faculty') {
      demoId = 'FAC-101';
      demoPass = 'faculty123';
    } else if (role === 'admin') {
      demoId = 'ADM-001';
      demoPass = 'admin123';
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId: demoId,
          password: demoPass,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Demo login failed');
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setLoginError(err.message || 'Demo login error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle student registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regName || !regRoll || !regEmail || !regPassword) {
      setRegError('Please complete all required fields.');
      return;
    }

    if (regPassword.length < 4) {
      setRegError('Password must be at least 4 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          rollNo: regRoll,
          email: regEmail,
          department: regDept,
          semester: regSem,
          phone: regPhone,
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setRegSuccess('Student account created successfully! Signing you in...');
      setTimeout(() => {
        onLoginSuccess(data.user);
        onClose();
      }, 1000);
    } catch (err: any) {
      setRegError(err.message || 'Error creating account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 px-6 pt-6 pb-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-white/15">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-indigo-200">
              Smart College ERP Portal
            </span>
          </div>
          <h2 className="text-xl font-bold">Role-Based College Access</h2>
          <p className="text-xs text-indigo-100 mt-1">
            Sign in as Student, Faculty, or Admin to manage attendance, marks, and AI academic tools.
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-white/15 p-1 rounded-xl mt-4 max-w-xs">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'login' ? 'bg-white text-indigo-900 shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'register' ? 'bg-white text-indigo-900 shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              New Student Register
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'login' ? (
            <div>
              {/* Role Selection Pills */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Your Portal Role:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('student');
                      setLoginId('BCA2024-001');
                      setPassword('student123');
                    }}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      selectedRole === 'student'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-bold">Student</span>
                    <span className="text-[10px] text-slate-500">Roll No Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('faculty');
                      setLoginId('FAC-101');
                      setPassword('faculty123');
                    }}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      selectedRole === 'faculty'
                        ? 'border-amber-600 bg-amber-50/50 text-amber-800 ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Briefcase className="w-5 h-5 text-amber-600" />
                    <span className="text-xs font-bold">Faculty</span>
                    <span className="text-[10px] text-slate-500">Attendance & Marks</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('admin');
                      setLoginId('ADM-001');
                      setPassword('admin123');
                    }}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      selectedRole === 'admin'
                        ? 'border-purple-600 bg-purple-50/50 text-purple-800 ring-1 ring-purple-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-bold">Admin</span>
                    <span className="text-[10px] text-slate-500">Full ERP Control</span>
                  </button>
                </div>
              </div>

              {/* Login Error Notification */}
              {loginError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {selectedRole === 'student' ? 'Student Roll Number' : selectedRole === 'faculty' ? 'Faculty ID' : 'Admin ID'}
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder={selectedRole === 'student' ? 'e.g. BCA2024-001' : selectedRole === 'faculty' ? 'e.g. FAC-101' : 'e.g. ADM-001'}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Verifying Credentials...'
                  ) : (
                    <>
                      <span>Enter {selectedRole.toUpperCase()} Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick One-Click Demo Logins for Examiner */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    ⚡ Examiner / Viva 1-Click Access:
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('student')}
                    className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-left border border-indigo-200/60 transition-colors"
                  >
                    <p className="text-xs font-bold">🎓 Aarav (Student)</p>
                    <p className="text-[10px] text-indigo-500">Roll: BCA2024-001</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('faculty')}
                    className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-left border border-amber-200/60 transition-colors"
                  >
                    <p className="text-xs font-bold">👨‍🏫 Dr. Kulkarni</p>
                    <p className="text-[10px] text-amber-600">ID: FAC-101 (HOD)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin')}
                    className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 text-left border border-purple-200/60 transition-colors"
                  >
                    <p className="text-xs font-bold">🛡️ Dr. Swaminathan</p>
                    <p className="text-[10px] text-purple-600">ID: ADM-001 (Dean)</p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Student Registration Form */
            <form onSubmit={handleRegister} className="space-y-3.5">
              {regError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}
              {regSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Sameer Khan"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    value={regRoll}
                    onChange={(e) => setRegRoll(e.target.value)}
                    placeholder="e.g. BCA2024-005"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="sameer@college.edu"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department *</label>
                  <select
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Computer Applications (BCA)">Computer Applications (BCA)</option>
                    <option value="Information Technology (BSC-IT)">Information Technology (BSC-IT)</option>
                    <option value="Master of Computer Applications (MCA)">Master of Computer Applications (MCA)</option>
                    <option value="Business Administration (BBA)">Business Administration (BBA)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Semester</label>
                  <select
                    value={regSem}
                    onChange={(e) => setRegSem(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password *</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 4 characters"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Registering Student...' : 'Complete Registration & Login'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
