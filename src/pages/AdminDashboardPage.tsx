import React, { useState, useMemo } from 'react';
import {
  Shield,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  LogOut,
  ArrowLeft,
  BarChart3,
  BookOpen,
  Compass,
  Lightbulb,
  HeartHandshake,
  PlayCircle,
  FileText,
  Printer,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Info,
} from 'lucide-react';
import { DeRoteWordmark } from '../components/DeRoteWordmark';
import {
  getCurrentAdmin,
  signOutAdmin,
  getAllStudentAdminRecords,
  calculateCohortAnalytics,
  StudentAdminRecord,
  AdminAccount,
} from '../services/adminService';
import { QUESTION_BANK, CUSTOM_OPTION_ID } from '../data/questionnaireBank';

interface AdminDashboardPageProps {
  onNavigate: (route: string) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const [admin, setAdmin] = useState<AdminAccount | null>(() => getCurrentAdmin());
  const [activeTab, setActiveTab] = useState<'cohort' | 'roster' | 'questions'>('cohort');
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<'all' | '8' | '9' | '10'>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentAdminRecord | null>(null);

  const studentRecords = useMemo(() => {
    return getAllStudentAdminRecords();
  }, []);

  const analytics = useMemo(() => {
    return calculateCohortAnalytics(studentRecords);
  }, [studentRecords]);

  const filteredRecords = useMemo(() => {
    return studentRecords.filter((rec) => {
      const matchesSearch =
        rec.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.phone.includes(searchQuery);

      const matchesClass =
        classFilter === 'all' || rec.classGrade.includes(classFilter);

      return matchesSearch && matchesClass;
    });
  }, [studentRecords, searchQuery, classFilter]);

  const handleSignOut = () => {
    signOutAdmin();
    setAdmin(null);
    onNavigate('/login');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F4F8FD] flex flex-col text-[#102C46]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8F3FF] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <DeRoteWordmark size="sm" showDescriptor={false} />
            <div className="h-4 w-px bg-[#E8F3FF] hidden sm:block" />
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#0866C6] bg-[#E8F3FF] px-2.5 py-1 rounded-full">
              <Shield className="w-3.5 h-3.5" />
              <span>HOD & Administrator Dashboard</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {admin && (
              <div className="hidden md:flex items-center gap-2.5 bg-[#F4F8FD] border border-[#E8F3FF] px-3.5 py-1.5 rounded-full text-xs">
                <span className="w-6 h-6 rounded-full bg-[#0866C6] text-white flex items-center justify-center font-bold text-[10px]">
                  {admin.avatarText || 'AD'}
                </span>
                <div className="text-left">
                  <span className="font-bold text-[#062B50] block leading-tight">
                    {admin.fullName}
                  </span>
                  <span className="text-[10px] text-[#64778C] block leading-tight">
                    {admin.roleTitle}
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#465B72] hover:text-[#062B50] bg-white border border-[#E8F3FF] px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Print Cohort Report"
            >
              <Printer className="w-3.5 h-3.5 text-[#0866C6]" />
              <span>Print Report</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/prototype')}
              className="text-xs font-semibold text-[#0866C6] hover:text-[#062B50] bg-white border border-[#E8F3FF] px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
            >
              Student Portal
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="p-2 rounded-xl text-[#64778C] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Sign Out Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Institutional Welcome & Headline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8F3FF] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0866C6] uppercase tracking-wider mb-1">
              <span>{admin?.institution || 'DeRote Partner School Network'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#062B50] tracking-tight">
              Cohort Insight & Learning Environment Overview
            </h1>
            <p className="text-xs sm:text-sm text-[#64778C] mt-2 max-w-2xl leading-relaxed">
              Synthesized reflections from Classes 8, 9, and 10. Designed to guide pedagogical support, collaborative formats, and classroom conditions without personality labelling or numerical ranking.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch lg:self-auto bg-[#F4F8FD] p-1.5 rounded-2xl border border-[#E8F3FF]">
            <button
              type="button"
              onClick={() => setActiveTab('cohort')}
              className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'cohort'
                  ? 'bg-white text-[#0866C6] shadow-xs'
                  : 'text-[#64778C] hover:text-[#062B50]'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Cohort Trends</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('roster')}
              className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'roster'
                  ? 'bg-white text-[#0866C6] shadow-xs'
                  : 'text-[#64778C] hover:text-[#062B50]'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Student Submissions ({studentRecords.length})</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('questions')}
              className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'questions'
                  ? 'bg-white text-[#0866C6] shadow-xs'
                  : 'text-[#64778C] hover:text-[#062B50]'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Question Bank (14)</span>
              </span>
            </button>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E8F3FF] shadow-xs">
            <span className="text-[11px] font-bold text-[#64778C] uppercase tracking-wider block">
              Registered Students
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#062B50]">
                {analytics.totalStudents}
              </span>
              <span className="text-xs text-[#64778C]">enrolled</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-[#64778C] border-t border-[#F4F8FD] pt-2">
              <span>Class 8: {analytics.classBreakdown.class8}</span>
              <span>·</span>
              <span>Class 9: {analytics.classBreakdown.class9}</span>
              <span>·</span>
              <span>Class 10: {analytics.classBreakdown.class10}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8F3FF] shadow-xs">
            <span className="text-[11px] font-bold text-[#64778C] uppercase tracking-wider block">
              Completed Reflections
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                {analytics.completedAssessments}
              </span>
              <span className="text-xs text-emerald-700/80 font-semibold">
                ({analytics.completionRate}%)
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-700 border-t border-[#F4F8FD] pt-2">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Full 14-question submissions</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8F3FF] shadow-xs">
            <span className="text-[11px] font-bold text-[#64778C] uppercase tracking-wider block">
              In-Progress Working Drafts
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0866C6]">
                {analytics.inProgressAssessments}
              </span>
              <span className="text-xs text-[#64778C]">active</span>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-[#64778C] border-t border-[#F4F8FD] pt-2">
              <Clock className="w-3 h-3 text-[#0866C6]" />
              <span>Autosaved on device</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8F3FF] shadow-xs">
            <span className="text-[11px] font-bold text-[#64778C] uppercase tracking-wider block">
              Insight Themes Mapped
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#062B50]">
                6 Themes
              </span>
              <span className="text-xs text-[#64778C]">deterministic</span>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-[#64778C] border-t border-[#F4F8FD] pt-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Zero personality rankings</span>
            </div>
          </div>
        </div>

        {/* TAB 1: COHORT TRENDS & ENVIRONMENT INSIGHTS */}
        {activeTab === 'cohort' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Pedagogical Guidance Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#E8F3FF]/50 border border-[#D5E9FF] flex items-start gap-3.5 text-xs text-[#465B72]">
              <Info className="w-5 h-5 text-[#0866C6] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#062B50] font-bold block mb-0.5">
                  Institutional Guiding Principle: "Reflect, Don't Judge"
                </strong>
                <p className="leading-relaxed">
                  These aggregated findings summarize what students report regarding their learning instincts, collaboration preferences, and support conditions. Use this data to calibrate classroom instructions, project groupings, and assessment choices—never to pigeonhole individual learners.
                </p>
              </div>
            </div>

            {/* 4 Environmental Theme Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Category A: What Draws Students In */}
              <div className="bg-white p-6 rounded-3xl border border-[#E8F3FF] shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#F0F7FF] flex items-center justify-center text-[#0866C6]">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#062B50]">
                      What Draws Students In
                    </h3>
                    <p className="text-[11px] text-[#64778C]">
                      Most appealing activities chosen for year-end exhibition
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {analytics.topDrawsInActivities.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-[#062B50] truncate mr-2">
                          {item.label}
                        </span>
                        <span className="font-bold text-[#0866C6] shrink-0">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#F4F8FD] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0866C6] rounded-full"
                          style={{ width: `${Math.max(item.percentage, 10)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category E: What Helps Students Get Started */}
              <div className="bg-white p-6 rounded-3xl border border-[#E8F3FF] shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#F0F7FF] flex items-center justify-center text-[#0866C6]">
                    <PlayCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#062B50]">
                      What Helps Students Get Started
                    </h3>
                    <p className="text-[11px] text-[#64778C]">
                      Reported conditions that overcome hesitation or procrastination
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {analytics.topStarterConditions.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-[#062B50] truncate mr-2">
                          {item.label}
                        </span>
                        <span className="font-bold text-[#0866C6] shrink-0">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#F4F8FD] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.max(item.percentage, 10)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category D: What Makes Group Work Easier */}
              <div className="bg-white p-6 rounded-3xl border border-[#E8F3FF] shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#F0F7FF] flex items-center justify-center text-[#0866C6]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#062B50]">
                      What Makes Group Work Easier
                    </h3>
                    <p className="text-[11px] text-[#64778C]">
                      Team dynamics and structural factors students rely on
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {analytics.topGroupWorkConditions.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-[#062B50] truncate mr-2">
                          {item.label}
                        </span>
                        <span className="font-bold text-[#0866C6] shrink-0">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#F4F8FD] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#168FE5] rounded-full"
                          style={{ width: `${Math.max(item.percentage, 10)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category F: What Students Want Teachers to Understand */}
              <div className="bg-white p-6 rounded-3xl border border-[#E8F3FF] shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#F0F7FF] flex items-center justify-center text-[#0866C6]">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#062B50]">
                      Voice & Teacher Understanding
                    </h3>
                    <p className="text-[11px] text-[#64778C]">
                      What students indicated would help educators support them best
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {analytics.topTeacherGuidanceWishes.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-[#062B50] truncate mr-2">
                          {item.label}
                        </span>
                        <span className="font-bold text-[#0866C6] shrink-0">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#F4F8FD] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${Math.max(item.percentage, 10)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENT SUBMISSIONS ROSTER */}
        {activeTab === 'roster' && (
          <div className="bg-white rounded-3xl border border-[#E8F3FF] shadow-xs overflow-hidden animate-fadeIn">
            {/* Search and Filters Bar */}
            <div className="p-5 border-b border-[#F0F5FA] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#64778C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student or school..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8F3FF] bg-[#F4F8FD] text-xs text-[#062B50] focus:outline-none focus:ring-2 focus:ring-[#0866C6]/20 focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <span className="text-xs font-semibold text-[#64778C] mr-1 hidden sm:inline">
                  Filter Class:
                </span>
                {(['all', '8', '9', '10'] as const).map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setClassFilter(cls)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      classFilter === cls
                        ? 'bg-[#0866C6] text-white'
                        : 'bg-[#F4F8FD] text-[#64778C] hover:text-[#062B50]'
                    }`}
                  >
                    {cls === 'all' ? 'All Classes' : `Class ${cls}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFD] text-[#64778C] font-bold border-b border-[#E8F3FF]">
                  <tr>
                    <th className="py-3.5 px-6">Student Name</th>
                    <th className="py-3.5 px-4">Grade</th>
                    <th className="py-3.5 px-4">School</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Answered</th>
                    <th className="py-3.5 px-4">Top Reflected Theme</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F5FA]">
                  {filteredRecords.map((record) => {
                    const topTheme = record.insightReport.cards[0]?.heading || 'In Progress';

                    return (
                      <tr key={record.id} className="hover:bg-[#F8FAFD] transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="font-bold text-[#062B50]">{record.fullName}</div>
                          <div className="text-[11px] text-[#64778C]">{record.phone}</div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#062B50]">
                          {record.classGrade}
                        </td>
                        <td className="py-3.5 px-4 text-[#64778C] truncate max-w-xs">
                          {record.schoolName}
                        </td>
                        <td className="py-3.5 px-4">
                          {record.isSubmitted ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Completed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Draft</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#062B50]">
                          {record.answeredCount} / {record.totalQuestions}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[11px] font-medium text-[#0866C6] bg-[#E8F3FF] px-2 py-0.5 rounded-md">
                            {topTheme}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedStudent(record)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0866C6] text-white font-bold text-xs hover:bg-[#062B50] transition-colors shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Insights</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredRecords.length === 0 && (
                <div className="py-12 text-center text-xs text-[#64778C]">
                  No student records found matching "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: QUESTION BANK REVIEW */}
        {activeTab === 'questions' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white p-5 rounded-3xl border border-[#E8F3FF] shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#062B50]">
                  Locked Question Bank (Classes 8–10)
                </h3>
                <p className="text-xs text-[#64778C] mt-0.5">
                  14 standardized, non-evaluative self-reflection questions.
                </p>
              </div>
              <span className="text-xs font-bold text-[#0866C6] bg-[#E8F3FF] px-3 py-1 rounded-full">
                Version 1.0 (Locked)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {QUESTION_BANK.map((q) => (
                <div key={q.id} className="bg-white p-5 rounded-2xl border border-[#E8F3FF] text-left">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0866C6]">
                      Question {q.number} · ID {q.id}
                    </span>
                    <span className="text-[11px] text-[#64778C] font-semibold">
                      {q.type === 'single' ? 'Single Choice' : 'Multi-Select'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#062B50] mb-1.5">
                    {q.title}
                  </h4>
                  <p className="text-xs text-[#465B72] bg-[#F8FAFD] p-2.5 rounded-xl border border-[#E8F3FF] mb-3 leading-relaxed">
                    {q.prompt}
                  </p>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#64778C] uppercase tracking-wider block">
                      Options ({q.options.length}):
                    </span>
                    <div className="space-y-1">
                      {q.options.slice(0, 4).map((opt) => (
                        <div key={opt.id} className="text-[11px] text-[#062B50] flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-[#0866C6]" />
                          <span className="truncate">{opt.text}</span>
                        </div>
                      ))}
                      {q.options.length > 4 && (
                        <span className="text-[10px] text-[#64778C] italic block">
                          +{q.options.length - 4} more choices...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* STUDENT DETAIL MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-[#062B50]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedStudent(null)}
          />

          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#E8F3FF] flex flex-col z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#F0F5FA] flex items-start justify-between gap-4 bg-[#FAFCFF]">
              <div>
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#0866C6] block mb-1">
                  Student Submission Inspection
                </span>
                <h2 className="text-xl font-bold text-[#062B50]">
                  {selectedStudent.fullName}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-[#64778C]">
                  <span>{selectedStudent.classGrade}</span>
                  <span>·</span>
                  <span>{selectedStudent.schoolName}</span>
                  <span>·</span>
                  <span className="font-semibold text-emerald-600">
                    {selectedStudent.answeredCount} / {selectedStudent.totalQuestions} Questions Answered
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-xl text-[#64778C] hover:text-[#062B50] hover:bg-[#F4F8FD] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Generated Insight Cards for Student */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64778C] mb-3">
                  Reflected Student Themes ({selectedStudent.insightReport.cards.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedStudent.insightReport.cards.map((card) => (
                    <div
                      key={card.id}
                      className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E8F3FF]"
                    >
                      <h4 className="text-xs font-bold text-[#062B50] mb-1">
                        {card.heading}
                      </h4>
                      <p className="text-xs text-[#465B72] leading-relaxed mb-2">
                        {card.reflectionText}
                      </p>
                      <span className="text-[10px] text-[#0866C6] font-semibold block">
                        Traceable: {card.evidence.map((e) => `Q${e.questionNumber}`).join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exact Answers to All Questions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64778C] mb-3">
                  Original Submitted Responses (Traceable)
                </h3>
                <div className="space-y-3">
                  {QUESTION_BANK.map((question) => {
                    const ans = selectedStudent.session.answers[question.id];
                    const selectedIds = ans?.selectedOptions || [];
                    const customText = ans?.customText || '';

                    return (
                      <div
                        key={question.id}
                        className="p-3.5 rounded-xl border border-[#E8F3FF] bg-white text-xs"
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-[#0866C6]">
                            Q{question.number} ({question.id}): {question.title}
                          </span>
                          <span className="text-[#64778C]">
                            {selectedIds.length > 0 ? 'Answered' : 'Skipped'}
                          </span>
                        </div>

                        {selectedIds.length > 0 ? (
                          <div className="space-y-1 mt-1.5">
                            {selectedIds.map((optId) => {
                              if (optId === CUSTOM_OPTION_ID) {
                                return (
                                  <div
                                    key={optId}
                                    className="p-1.5 rounded-lg bg-[#F4F8FD] text-[#062B50] font-medium"
                                  >
                                    ✍️ <em>Self-written:</em> {customText}
                                  </div>
                                );
                              }
                              const opt = question.options.find((o) => o.id === optId);
                              return (
                                <div
                                  key={optId}
                                  className="p-1.5 rounded-lg bg-[#F4F8FD] text-[#062B50] font-medium"
                                >
                                  • {opt ? opt.text : optId}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-[#64778C] italic text-[11px]">
                            No option selected
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#F0F5FA] bg-[#FAFCFF] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl bg-[#0866C6] text-white font-bold text-xs hover:bg-[#062B50] transition-colors cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
