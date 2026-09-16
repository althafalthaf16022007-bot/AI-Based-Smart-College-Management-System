import React, { useState } from 'react';
import { User, AIExplanation, AIQuiz, AIStudyPlan, AIPerformanceAnalysis, AIChatMessage } from '../../types';
import {
  Sparkles,
  MessageSquare,
  Lightbulb,
  HelpCircle,
  BarChart3,
  Calendar,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Zap,
  TrendingUp,
  AlertTriangle,
  Award
} from 'lucide-react';

interface AIAcademicHubProps {
  student: User;
  initialTab?: string;
}

export const AIAcademicHub: React.FC<AIAcademicHubProps> = ({ student, initialTab = 'chat' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'explain' | 'quiz' | 'performance' | 'studyPlan'>(
    (initialTab as any) || 'chat'
  );

  // 1. AI Chat state
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: `Hello ${student.name}! I am your Smart College AI Academic Assistant powered by Gemini. 
You can ask me questions about **DBMS, Data Structures, Web Technologies, Computer Networks, Software Engineering**, or request **Viva voce exam tips**. How can I help you today?`,
      timestamp: 'Just now',
      suggestions: [
        'Explain Normalization in DBMS with examples',
        'Difference between Stack and Queue in C++',
        'What are ACID properties in database transactions?',
        'How does the 3-Way Handshake in TCP work?'
      ],
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // 2. Topic Explainer state
  const [explainTopic, setExplainTopic] = useState('Binary Search Tree Traversal');
  const [explainSubject, setExplainSubject] = useState('Data Structures & Algorithms');
  const [explanationResult, setExplanationResult] = useState<AIExplanation | null>(null);
  const [isExplainLoading, setIsExplainLoading] = useState(false);

  // 3. AI Quiz Generator & Player state
  const [quizTopic, setQuizTopic] = useState('Database Management Systems (SQL & Relational Algebra)');
  const [quizDifficulty, setQuizDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [currentQuiz, setCurrentQuiz] = useState<AIQuiz | null>(null);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: number }>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // 4. Performance Analytics state
  const [analysisResult, setAnalysisResult] = useState<AIPerformanceAnalysis | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  // 5. Personalized Study Plan state
  const [targetExam, setTargetExam] = useState('BCA 4th Semester Mid-Term Exam');
  const [studySubject, setStudySubject] = useState('Database Systems & Web Technology');
  const [dailyHours, setDailyHours] = useState(3);
  const [studyPlanResult, setStudyPlanResult] = useState<AIStudyPlan | null>(null);
  const [isStudyPlanLoading, setIsStudyPlanLoading] = useState(false);

  // --- Handlers ---

  // Handle Chat Message
  const handleSendMessage = async (msgText?: string) => {
    const textToSend = msgText || chatInput;
    if (!textToSend.trim() || isChatLoading) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!msgText) setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: chatMessages.slice(-4),
        }),
      });

      const data = await res.json();
      const botMsg: AIChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here is the academic assistance for your query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Handle Topic Explanation
  const handleGenerateExplanation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!explainTopic.trim()) return;

    setIsExplainLoading(true);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: explainTopic, subject: explainSubject }),
      });

      const data = await res.json();
      if (data.explanation) {
        setExplanationResult(data.explanation);
      }
    } catch (err) {
      console.error('Explanation error:', err);
    } finally {
      setIsExplainLoading(false);
    }
  };

  // Handle Quiz Generation
  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsQuizLoading(true);
    setUserAnswers({});
    setIsQuizSubmitted(false);

    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: quizTopic,
          difficulty: quizDifficulty,
          subject: 'Computer Applications',
        }),
      });

      const data = await res.json();
      if (data.quiz) {
        setCurrentQuiz(data.quiz);
      }
    } catch (err) {
      console.error('Quiz error:', err);
    } finally {
      setIsQuizLoading(false);
    }
  };

  // Submit Quiz & compute score
  const handleQuizOptionSelect = (qId: number, optIdx: number) => {
    if (isQuizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    if (!currentQuiz) return 0;
    let score = 0;
    currentQuiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  // Handle Performance Analysis
  const handleRunPerformanceAnalysis = async () => {
    setIsAnalysisLoading(true);
    try {
      const res = await fetch('/api/ai/analyze-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id }),
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  // Handle Study Plan Generation
  const handleGenerateStudyPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStudyPlanLoading(true);
    try {
      const res = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examName: targetExam,
          targetSubject: studySubject,
          hoursPerDay: dailyHours,
        }),
      });

      const data = await res.json();
      if (data.studyPlan) {
        setStudyPlanResult(data.studyPlan);
      }
    } catch (err) {
      console.error('Study plan error:', err);
    } finally {
      setIsStudyPlanLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl p-6 sm:p-7 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-bold tracking-wider uppercase text-indigo-200 border border-white/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-300" />
                Gemini 3.8 Flash Engine
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              AI Academic &amp; Viva Assistant Hub
            </h1>
            <p className="text-xs text-indigo-100 mt-1 max-w-xl">
              Equipped with 5 specialized AI tools to accelerate your conceptual understanding, viva confidence, and semester GPA.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/20">
            <span className="text-xs font-semibold text-white/80 px-2">Academic Profile:</span>
            <span className="px-2.5 py-1 bg-white text-indigo-950 font-extrabold text-xs rounded-xl shadow-xs">
              {student.loginId}
            </span>
          </div>
        </div>

        {/* Feature Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'chat'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            AI Academic Chat
          </button>

          <button
            onClick={() => setActiveSubTab('explain')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'explain'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Concept Explainer &amp; Viva
          </button>

          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'quiz'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            AI Quiz Generator
          </button>

          <button
            onClick={() => {
              setActiveSubTab('performance');
              if (!analysisResult) handleRunPerformanceAnalysis();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'performance'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Performance Analytics
          </button>

          <button
            onClick={() => setActiveSubTab('studyPlan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'studyPlan'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Personalized Study Plan
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. AI Academic Chatbot */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[600px] overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">BCA Subject Tutor &amp; Viva Coach</h3>
                <p className="text-[10px] text-slate-500">Ask any programming or theory question</p>
              </div>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              ● Online
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/40">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-xs whitespace-pre-line'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Suggestion prompt pills */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Suggested Viva &amp; Exam Questions:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(s)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors border border-indigo-200/60 text-left"
                          >
                            {s} →
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-2 text-right ${
                      msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    {student.name.charAt(0)}
                  </div>
                )}
              </div>
            ))}

            {isChatLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-slate-500">Gemini is synthesizing explanation...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about DBMS, C++, Web Development, OS, or Viva prep..."
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. Topic Explainer & Viva Preparation */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'explain' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              AI Concept Explainer &amp; Viva Cheat-Sheet
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Enter any technical topic or algorithm to generate an intuitive breakdown, real-life analogy, and examiner viva Q&amp;A.
            </p>

            <form onSubmit={handleGenerateExplanation} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Topic or Concept</label>
                <input
                  type="text"
                  value={explainTopic}
                  onChange={(e) => setExplainTopic(e.target.value)}
                  placeholder="e.g. Normalization 1NF to BCNF, Quicksort, ACID properties"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={explainSubject}
                  onChange={(e) => setExplainSubject(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Database Management Systems">Database Management Systems (DBMS)</option>
                  <option value="Data Structures & Algorithms">Data Structures &amp; Algorithms</option>
                  <option value="Web Technology">Web Technology &amp; Modern JS</option>
                  <option value="Software Engineering">Software Engineering &amp; Agile</option>
                  <option value="Computer Networks">Computer Networks &amp; Security</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isExplainLoading}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isExplainLoading ? 'Generating Explanation...' : 'Explain Topic with AI'}
                </button>
              </div>
            </form>
          </div>

          {explanationResult && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    Concept Analysis
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{explanationResult.topic}</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  BCA Viva Ready
                </span>
              </div>

              {/* Definition */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Summary &amp; Definition:
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">{explanationResult.summary}</p>
              </div>

              {/* Real World Analogy */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  Real-World Analogy (Easy to explain in Viva):
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed italic">
                  "{explanationResult.realWorldAnalogy}"
                </p>
              </div>

              {/* Key Bullet Points */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Key Examination Takeaways:
                </h4>
                <ul className="space-y-1.5">
                  {explanationResult.keyPoints.map((pt, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Code Snippet if applicable */}
              {explanationResult.codeSnippet && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Implementation Demonstration:
                  </h4>
                  <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto">
                    <code>{explanationResult.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Likely Viva Questions */}
              {explanationResult.vivaQuestions && explanationResult.vivaQuestions.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Expected Examiner Viva Questions:
                  </h4>
                  <div className="space-y-2.5">
                    {explanationResult.vivaQuestions.map((vq, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs">
                        <p className="font-bold text-indigo-950">Q{idx + 1}: {vq.question}</p>
                        <p className="text-indigo-800 mt-1"><strong>Ans:</strong> {vq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. AI Quiz Generator & Player */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'quiz' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              AI Multiple-Choice Practice Quiz
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Test your preparation with automatically synthesized questions tailored to your syllabus.
            </p>

            <form onSubmit={handleGenerateQuiz} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Topic</label>
                <input
                  type="text"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  placeholder="e.g. SQL Queries, Binary Trees, OSI Layers"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty Level</label>
                <select
                  value={quizDifficulty}
                  onChange={(e) => setQuizDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Beginner">Beginner (Basic Definitions)</option>
                  <option value="Intermediate">Intermediate (Standard BCA Exam)</option>
                  <option value="Advanced">Advanced (Campus Placement / GATE)</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isQuizLoading}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  {isQuizLoading ? 'Synthesizing Quiz...' : 'Generate 5 Questions Quiz'}
                </button>
              </div>
            </form>
          </div>

          {/* Active Quiz Player */}
          {currentQuiz && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    Practice Test
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{currentQuiz.topic}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    Difficulty: {currentQuiz.difficulty}
                  </span>
                  {isQuizSubmitted && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-600 text-white shadow-xs">
                      Score: {calculateScore()} / {currentQuiz.questions.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {currentQuiz.questions.map((q, qIdx) => {
                  const selectedOpt = userAnswers[q.id];
                  const isAnswered = selectedOpt !== undefined;

                  return (
                    <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900">
                          {qIdx + 1}. {q.question}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isChosen = selectedOpt === optIdx;
                          const isCorrect = q.correctIndex === optIdx;

                          let btnClasses = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50';

                          if (isQuizSubmitted) {
                            if (isCorrect) {
                              btnClasses = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                            } else if (isChosen && !isCorrect) {
                              btnClasses = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                            }
                          } else if (isChosen) {
                            btnClasses = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-1 ring-indigo-600';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleQuizOptionSelect(q.id, optIdx)}
                              className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${btnClasses}`}
                            >
                              <span>{opt}</span>
                              {isQuizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                              {isQuizSubmitted && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {isQuizSubmitted && (
                        <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900">
                          <strong>💡 Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit / Reset Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Answered: {Object.keys(userAnswers).length} of {currentQuiz.questions.length} questions
                </span>

                {!isQuizSubmitted ? (
                  <button
                    onClick={() => setIsQuizSubmitted(true)}
                    disabled={Object.keys(userAnswers).length === 0}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                  >
                    Submit Quiz &amp; Check Answers
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setUserAnswers({});
                      setIsQuizSubmitted(false);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Retake Quiz
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. AI Student Performance Analytics & Suggestions */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'performance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Automated Academic Diagnosis
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                AI Performance Analysis &amp; Topic Suggestions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Gemini analyzes your real marks and attendance logs to prescribe custom remedial actions.
              </p>
            </div>

            <button
              onClick={handleRunPerformanceAnalysis}
              disabled={isAnalysisLoading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isAnalysisLoading ? 'Re-analyzing...' : 'Refresh AI Analytics'}
            </button>
          </div>

          {analysisResult ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
              
              {/* Overall Health Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Academic Status
                </span>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xl font-extrabold text-slate-900">{analysisResult.overallHealth}</span>
                    <p className="text-xs text-indigo-600 font-semibold">{analysisResult.estimatedGrade}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Attendance Standing:</span>
                    <strong className="text-slate-900">{analysisResult.attendanceScore}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Internal Marks Average:</span>
                    <strong className="text-slate-900">{analysisResult.marksScore}%</strong>
                  </div>
                </div>
              </div>

              {/* Strong Areas & Topics to Improve (2 cols) */}
              <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                {/* Strong Areas */}
                <div>
                  <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Identified Strengths:
                  </h3>
                  <div className="space-y-1.5">
                    {analysisResult.strongAreas.map((sa, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 font-medium">
                        ✓ {sa}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Topics Needing Improvement */}
                <div>
                  <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Topics Requiring Immediate Attention:
                  </h3>
                  <div className="space-y-1.5">
                    {analysisResult.topicsNeedingImprovement.map((topic, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-100 text-xs text-rose-950 font-medium">
                        ⚠ {topic}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Concrete Action Steps */}
                <div className="pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
                    🎯 Prescribed AI Action Plan:
                  </h3>
                  <ul className="space-y-1.5">
                    {analysisResult.actionPlan.map((action, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <BarChart3 className="w-8 h-8 text-indigo-600 mx-auto mb-2 animate-bounce" />
              <p className="text-xs text-slate-500">Loading student analytics...</p>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. Personalized Study Plan Generator */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'studyPlan' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Personalized 7-Day Study Schedule Generator
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Generate a structured daily revision timetable optimized for upcoming exams.
            </p>

            <form onSubmit={handleGenerateStudyPlan} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Examination</label>
                <input
                  type="text"
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  placeholder="e.g. Mid-Term Semester Exam"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Focus Subject(s)</label>
                <input
                  type="text"
                  value={studySubject}
                  onChange={(e) => setStudySubject(e.target.value)}
                  placeholder="e.g. DBMS & C++ Data Structures"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Study Hours / Day</label>
                <select
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={2}>2 Hours / Day (Moderate)</option>
                  <option value={3}>3 Hours / Day (Standard)</option>
                  <option value={4}>4 Hours / Day (Intensive Exam Prep)</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isStudyPlanLoading}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  {isStudyPlanLoading ? 'Designing Schedule...' : 'Generate 7-Day Study Plan'}
                </button>
              </div>
            </form>
          </div>

          {studyPlanResult && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    Personalized Exam Roadmap
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{studyPlanResult.title}</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                  Target: {studyPlanResult.targetExam}
                </span>
              </div>

              {/* 7-Day Schedule Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studyPlanResult.days.map((day, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-indigo-700">{day.day}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold">
                        {day.allocatedHours} hrs
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900">{day.topicFocus}</h4>

                    <ul className="space-y-1 text-xs text-slate-600">
                      {day.tasks.map((task, tidx) => (
                        <li key={tidx} className="flex items-start gap-1.5">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-slate-100 text-[11px] text-amber-800 italic">
                      💡 {day.revisionTip}
                    </div>
                  </div>
                ))}
              </div>

              {studyPlanResult.generalAdvice && (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-xs text-purple-950">
                  <strong>⭐ Master Strategy:</strong> {studyPlanResult.generalAdvice}
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
