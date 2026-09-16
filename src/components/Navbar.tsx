import React, { useState } from 'react';
import { User, UserRole } from '../types';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  LogOut,
  UserCheck,
  Shield,
  Briefcase,
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenDocs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onOpenLogin,
  onSwitchRole,
  onOpenDocs,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Mid-Term Exam Schedule', text: 'Exam schedule for 4th Sem announced.', time: '10m ago', unread: true },
    { id: 2, title: 'Attendance Alert', text: 'Weekly attendance report has been compiled.', time: '2h ago', unread: true },
    { id: 3, title: 'AI Study Assistant', text: 'New quiz generated for DBMS Normalization.', time: '1d ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  SMART<span className="text-indigo-600">COLLEGE</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  AI ERP
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Smart College Management System</p>
            </div>
          </div>

          {/* Quick Viva Role Switcher for Evaluation */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-xs font-medium text-slate-500 px-2">Demo Role:</span>
            <button
              onClick={() => onSwitchRole('student')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                currentUser?.role === 'student'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Student
            </button>
            <button
              onClick={() => onSwitchRole('faculty')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                currentUser?.role === 'faculty'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Faculty
            </button>
            <button
              onClick={() => onSwitchRole('admin')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                currentUser?.role === 'admin'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Documentation & Viva Guide Button */}
            <button
              onClick={onOpenDocs}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
              title="View Project Abstract, Review 1 Report & Viva Q&A"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Viva &amp; Review 1 Docs</span>
              <span className="sm:hidden">Docs</span>
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</span>
                    <span className="text-[11px] text-indigo-600 font-medium cursor-pointer">Mark read</span>
                  </div>
                  <div className="divide-y divide-slate-100 mt-1 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="py-2 px-1 hover:bg-slate-50 rounded-lg transition-colors">
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Auth State */}
            {currentUser ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 capitalize">
                    {currentUser.role} • {currentUser.loginId}
                  </p>
                </div>
                <div className="relative group">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
                    referrerPolicy="no-referrer"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                      currentUser.role === 'admin'
                        ? 'bg-purple-500'
                        : currentUser.role === 'faculty'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
