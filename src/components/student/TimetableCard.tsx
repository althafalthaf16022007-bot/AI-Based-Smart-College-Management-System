import React, { useState } from 'react';
import { User, TimetableSlot } from '../../types';
import { Calendar, Clock, MapPin, UserCheck, BookOpen } from 'lucide-react';

interface TimetableCardProps {
  student: User;
  timetable: TimetableSlot[];
}

export const TimetableCard: React.FC<TimetableCardProps> = ({ student, timetable }) => {
  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  const currentDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
    new Date().getDay()
  ] as any;
  const initialDay = days.includes(currentDayName) ? currentDayName : 'Monday';

  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>(
    initialDay
  );

  const daySchedule = timetable.filter((t) => t.day === selectedDay);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Academic Schedule
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              Weekly Class Timetable
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Semester: <strong>{student.semester || '4th Semester'}</strong> • Department of {student.department}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Total Lectures:</span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-xs">
              {timetable.length} periods / week
            </span>
          </div>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center gap-2 pt-5 overflow-x-auto pb-1">
          {days.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = currentDayName === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{day}</span>
                {isToday && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? 'bg-amber-300' : 'bg-indigo-600'
                    }`}
                    title="Today"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule Slots Timeline / Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            Schedule for {selectedDay}
          </h2>
          <span className="text-xs text-slate-500">{daySchedule.length} classes planned</span>
        </div>

        {daySchedule.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-400 text-xs">
            No lectures scheduled on this day.
          </div>
        ) : (
          <div className="space-y-3">
            {daySchedule
              .sort((a, b) => a.period - b.period)
              .map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Period</span>
                      <span className="text-sm font-black text-indigo-700 leading-none">{slot.period}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{slot.subjectName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                          {slot.subjectCode}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                          {slot.facultyName}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          {slot.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      {slot.time}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

    </div>
  );
};
