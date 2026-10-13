/**
 * Premium Personalised Student Dashboard for DeRote Student Insight System
 * Designed specifically for students in Classes 8, 9, and 10.
 *
 * Features:
 * - Signature Royal Blue sidebar with sculpted, curved edge that blends seamlessly into the content surface
 * - Tab navigation: Overview, Learning Reflection, Personal Tasks & Planner, Profile & Settings
 * - Customization: Classic Royal Blue, Slate Teal, and Indigo Violet accent palettes
 * - Full personal task management categorized into Schoolwork, Revision, Personal Projects, and General
 * - Integrated 14-Question Learning Reflection assessment and instant Insight Report
 * - Responsive mobile drawer and desktop sculpted layout
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Compass,
  CheckSquare,
  UserCheck,
  Settings,
  LogOut,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  Menu,
  X,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Info,
  Shield,
  HelpCircle,
  ListOrdered,
  ChevronLeft,
  Flame,
  Printer,
  Bell,
  Palette,
} from 'lucide-react';
import { DeRoteWordmark } from '../components/DeRoteWordmark';
import { CelebrationEffect, playCelebrationChime } from '../components/CelebrationEffect';
import { StudentInsightDashboard } from '../components/StudentInsightDashboard';
import { SchoolAutocompleteInput } from '../components/SchoolAutocompleteInput';
import { Modal } from '../components/Modal';
import {
  getCurrentActiveStudent,
  onLocalAuthChange,
  signOutLocalStudent,
  updateStudentProfileData,
  sendStudentPasswordResetEmail,
  LocalStudentAccount,
} from '../services/localAuth';
import {
  StudentTask,
  TaskCategory,
  TaskPriority,
  DashboardTheme,
  THEME_CONFIGS,
  TASK_CATEGORIES,
  loadStudentTasks,
  saveStudentTask,
  toggleStudentTask,
  deleteStudentTask,
  loadStudentPreferences,
  saveStudentPreferences,
} from '../services/studentDashboardService';
import {
  loadQuestionnaireSession,
  persistQuestionnaireDraft,
  submitQuestionnaireResponses,
  resetQuestionnaireSession,
  QuestionnaireSession,
  QuestionAnswerState,
  StudentProfile,
} from '../services/questionnaireService';
import {
  QUESTION_BANK,
  QuestionDefinition,
  CUSTOM_OPTION_ID,
} from '../data/questionnaireBank';
import { generateStudentInsightReport, StudentInsightReport } from '../services/insightEngine';

interface StudentDashboardPageProps {
  onNavigate: (route: string) => void;
  initialTab?: 'overview' | 'reflection' | 'tasks' | 'settings';
}

type DashboardTab = 'overview' | 'reflection' | 'tasks' | 'settings';

export function StudentDashboardPage({ onNavigate, initialTab = 'overview' }: StudentDashboardPageProps) {
  // Active student account
  const [student, setStudent] = useState<LocalStudentAccount | null>(() => getCurrentActiveStudent());
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dashboard customization theme
  const [currentTheme, setCurrentTheme] = useState<DashboardTheme>('classic');
  const theme = THEME_CONFIGS[currentTheme] || THEME_CONFIGS.classic;

  // Task Planner State
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [taskCategoryFilter, setTaskCategoryFilter] = useState<TaskCategory | 'all'>('all');
  const [taskStatusFilter, setTaskStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('Schoolwork');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('Tomorrow');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  // Questionnaire / Reflection State
  const [session, setSession] = useState<QuestionnaireSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSavingReflection, setIsSavingReflection] = useState<boolean>(false);
  const [reflectionSyncState, setReflectionSyncState] = useState<'saved' | 'saving' | 'offline'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [showQuestionDrawer, setShowQuestionDrawer] = useState<boolean>(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);
  const [validationAlert, setValidationAlert] = useState<string | null>(null);
  const [isSubmittingReflection, setIsSubmittingReflection] = useState<boolean>(false);

  // Profile Edit State
  const [editFullName, setEditFullName] = useState('');
  const [editClassGrade, setEditClassGrade] = useState('9');
  const [editSchoolName, setEditSchoolName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [resetEmailSentStatus, setResetEmailSentStatus] = useState<string | null>(null);

  // Subscribe to auth changes
  useEffect(() => {
    const unsub = onLocalAuthChange((acc) => {
      setStudent(acc);
      if (acc) {
        setEditFullName(acc.fullName);
        setEditClassGrade(acc.classGrade);
        setEditSchoolName(acc.schoolName);
      }
    });
    return () => unsub();
  }, []);

  // Sync profile edit fields when student updates
  useEffect(() => {
    if (student) {
      setEditFullName(student.fullName);
      setEditClassGrade(student.classGrade);
      setEditSchoolName(student.schoolName);
    }
  }, [student]);

  // Load preferences and tasks on student mount
  useEffect(() => {
    if (!student) return;

    loadStudentPreferences(student.id).then((prefs) => {
      if (prefs.theme) {
        setCurrentTheme(prefs.theme);
      }
    });

    loadStudentTasks(student.id, student.classGrade).then((loaded) => {
      setTasks(loaded);
    });

    // Load reflection session
    const profile: StudentProfile = {
      id: student.id,
      fullName: student.fullName,
      classGrade: student.classGrade,
      schoolName: student.schoolName,
      phone: student.phone,
    };

    loadQuestionnaireSession(profile).then(({ session: loadedSession, isAlreadySubmitted }) => {
      setSession(loadedSession);
      setCurrentIndex(loadedSession.currentQuestionIndex || 0);
      if (isAlreadySubmitted) {
        setSubmittedSuccessfully(true);
      }
    });
  }, [student?.id]);

  // Calculate questionnaire metrics
  const answeredCount = useMemo(() => {
    if (!session) return 0;
    return Object.values(session.answers).filter((a) => a.status === 'answered').length;
  }, [session]);

  const progressPercentage = useMemo(() => {
    return Math.round((answeredCount / QUESTION_BANK.length) * 100);
  }, [answeredCount]);

  const currentQuestion: QuestionDefinition = useMemo(() => {
    return QUESTION_BANK[currentIndex] || QUESTION_BANK[0];
  }, [currentIndex]);

  const currentAnswer: QuestionAnswerState = useMemo(() => {
    if (!session || !session.answers[currentQuestion.id]) {
      return { status: 'unanswered', selectedOptions: [], customText: '' };
    }
    return session.answers[currentQuestion.id];
  }, [session, currentQuestion.id]);

  // Generate insight report if completed
  const insightReport: StudentInsightReport | null = useMemo(() => {
    if (!session || !submittedSuccessfully || !student) return null;
    return generateStudentInsightReport(session, student.fullName, student.classGrade);
  }, [session, submittedSuccessfully, student]);

  // Tasks metrics
  const pendingTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => t.completed), [tasks]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchCat = taskCategoryFilter === 'all' || t.category === taskCategoryFilter;
      const matchStatus =
        taskStatusFilter === 'all' ||
        (taskStatusFilter === 'pending' && !t.completed) ||
        (taskStatusFilter === 'completed' && t.completed);
      return matchCat && matchStatus;
    });
  }, [tasks, taskCategoryFilter, taskStatusFilter]);

  // --- Handlers for Tasks ---
  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    if (!student) return;
    const nextStatus = !currentStatus;
    if (nextStatus) {
      playCelebrationChime();
    }
    const updated = await toggleStudentTask(student.id, taskId, nextStatus);
    setTasks(updated);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!student) return;
    const updated = await deleteStudentTask(student.id, taskId);
    setTasks(updated);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !newTaskTitle.trim()) return;

    const newTask: StudentTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studentId: student.id,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: newTaskPriority,
      dueDate: newTaskDueDate.trim() || 'Tomorrow',
      completed: false,
      notes: newTaskNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = await saveStudentTask(student.id, newTask);
    setTasks(updated);
    setNewTaskTitle('');
    setNewTaskNotes('');
    setShowAddTaskModal(false);
  };

  // --- Handlers for Reflection ---
  const saveReflectionDraft = async (updatedSession: QuestionnaireSession) => {
    setIsSavingReflection(true);
    setReflectionSyncState('saving');
    const result = await persistQuestionnaireDraft(updatedSession);
    setIsSavingReflection(false);
    if (result.confirmedCloudSaved) {
      setReflectionSyncState('saved');
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setReflectionSyncState('offline');
    }
  };

  const handleToggleOption = (optionId: string) => {
    if (!session || submittedSuccessfully) return;
    setValidationAlert(null);

    const question = currentQuestion;
    const prev = currentAnswer.selectedOptions;
    const isCustom = optionId === CUSTOM_OPTION_ID;
    const optionDef = question.options.find((o) => o.id === optionId);
    const isExclusive = optionDef?.isExclusive;

    let updatedSelected: string[] = [];

    if (question.type === 'single') {
      updatedSelected = [optionId];
    } else {
      if (prev.includes(optionId)) {
        updatedSelected = prev.filter((id) => id !== optionId);
      } else {
        if (isExclusive) {
          updatedSelected = [optionId];
        } else {
          const filteredPrev = prev.filter((id) => {
            const def = question.options.find((o) => o.id === id);
            return !def?.isExclusive;
          });
          const maxLimit = question.type === 'profiles' ? 2 : question.maxSelections || 3;
          if (filteredPrev.length >= maxLimit) {
            setValidationAlert(`You can select at most ${maxLimit} option${maxLimit > 1 ? 's' : ''} for this question.`);
            return;
          }
          updatedSelected = [...filteredPrev, optionId];
        }
      }
    }

    const updatedAnswer: QuestionAnswerState = {
      status: updatedSelected.length > 0 ? 'answered' : 'unanswered',
      selectedOptions: updatedSelected,
      customText: isCustom && !prev.includes(CUSTOM_OPTION_ID) ? currentAnswer.customText : currentAnswer.customText,
    };

    const updatedSession: QuestionnaireSession = {
      ...session,
      answers: {
        ...session.answers,
        [question.id]: updatedAnswer,
      },
      currentQuestionIndex: currentIndex,
      updatedAt: new Date().toISOString(),
    };

    setSession(updatedSession);
    saveReflectionDraft(updatedSession);
  };

  const handleCustomTextChange = (text: string) => {
    if (!session || submittedSuccessfully) return;
    const updatedAnswer: QuestionAnswerState = {
      ...currentAnswer,
      customText: text,
      status: currentAnswer.selectedOptions.length > 0 ? 'answered' : 'unanswered',
    };
    const updatedSession: QuestionnaireSession = {
      ...session,
      answers: {
        ...session.answers,
        [currentQuestion.id]: updatedAnswer,
      },
    };
    setSession(updatedSession);
    saveReflectionDraft(updatedSession);
  };

  const handleNext = () => {
    if (!currentQuestion.isOptional && currentAnswer.selectedOptions.length === 0) {
      setValidationAlert('Please select at least one response before continuing to the next question.');
      return;
    }
    setValidationAlert(null);
    if (currentIndex < QUESTION_BANK.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      if (session) {
        const updated = { ...session, currentQuestionIndex: nextIndex };
        setSession(updated);
        saveReflectionDraft(updated);
      }
    }
  };

  const handlePrevious = () => {
    setValidationAlert(null);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      if (session) {
        const updated = { ...session, currentQuestionIndex: prevIndex };
        setSession(updated);
        saveReflectionDraft(updated);
      }
    }
  };

  const handleSubmitAll = async () => {
    if (!session) return;
    const unans = QUESTION_BANK.filter(
      (q) => !q.isOptional && (!session.answers[q.id] || session.answers[q.id].status !== 'answered')
    );

    if (unans.length > 0) {
      setValidationAlert(`Please answer all required questions before completing. Remaining: ${unans.length}`);
      return;
    }

    setIsSubmittingReflection(true);
    const result = await submitQuestionnaireResponses(session);
    setIsSubmittingReflection(false);

    if (result.success) {
      setSubmittedSuccessfully(true);
      setShowCelebration(true);
      playCelebrationChime();
    }
  };

  const handleResetSession = async () => {
    if (!student) return;
    const newSession = await resetQuestionnaireSession({
      id: student.id,
      fullName: student.fullName,
      classGrade: student.classGrade,
      schoolName: student.schoolName,
      phone: student.phone,
    });
    setSession(newSession);
    setCurrentIndex(0);
    setSubmittedSuccessfully(false);
    setShowResetConfirmModal(false);
  };

  // --- Handlers for Theme & Profile ---
  const handleSelectTheme = async (t: DashboardTheme) => {
    setCurrentTheme(t);
    if (student) {
      await saveStudentPreferences(student.id, { theme: t });
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    if (!editFullName.trim()) {
      setProfileMessage({ type: 'error', text: 'Full name cannot be empty.' });
      return;
    }
    if (!editSchoolName.trim()) {
      setProfileMessage({ type: 'error', text: 'School name cannot be empty.' });
      return;
    }

    setIsUpdatingProfile(true);
    setProfileMessage(null);

    const res = await updateStudentProfileData(student.id, {
      fullName: editFullName.trim(),
      classGrade: editClassGrade,
      schoolName: editSchoolName.trim(),
    });

    setIsUpdatingProfile(false);
    if (res.success) {
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setProfileMessage(null), 3000);
    } else {
      setProfileMessage({ type: 'error', text: res.error || 'Failed to update profile.' });
    }
  };

  const handleSendResetPassword = async () => {
    if (!student?.email) return;
    setResetEmailSentStatus('Sending link to ' + student.email + '...');
    const res = await sendStudentPasswordResetEmail(student.email);
    if (res.success) {
      setResetEmailSentStatus('Password reset link sent to ' + student.email + '. Check your inbox.');
    } else {
      setResetEmailSentStatus(res.error || 'Failed to send password reset email.');
    }
  };

  const handleConfirmSignOut = async () => {
    await signOutLocalStudent();
    setShowSignOutModal(false);
    onNavigate('/login');
  };

  // If no student is authenticated, show prompt to sign in
  if (!student) {
    return (
      <div className="min-h-screen bg-[#F5F8FD] flex flex-col justify-between text-[#142033]">
        <header className="bg-white border-b border-[#E8F3FF] py-4 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <DeRoteWordmark size="md" />
            <button
              onClick={() => onNavigate('/login')}
              className="text-xs sm:text-sm font-bold text-[#2150D8] hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8F3FF] shadow-xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF2FE] text-[#2150D8] flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#102C46] mb-2">Student Portal Access</h1>
            <p className="text-sm text-[#64778C] mb-6 leading-relaxed">
              Please sign in to access your personalised student dashboard, task planner, and learning insights.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('/login')}
                className="w-full py-3.5 px-4 rounded-xl bg-[#2150D8] text-white font-bold text-sm hover:bg-[#1B357F] transition-colors shadow-md cursor-pointer"
              >
                Sign In to Student Account
              </button>
              <button
                onClick={() => onNavigate('/signup')}
                className="w-full py-3 px-4 rounded-xl bg-white text-[#102C46] border border-[#E8F3FF] font-semibold text-sm hover:bg-[#F5F8FD] transition-colors cursor-pointer"
              >
                Create New Student Account
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FD] flex text-[#142033] antialiased overflow-x-hidden font-sans">
      {/* ------------------------------------------------------------- */}
      {/* DESKTOP SIDEBAR WITH SIGNATURE SCULPTED CURVED TABS           */}
      {/* ------------------------------------------------------------- */}
      <aside
        className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 select-none z-20 relative transition-colors duration-300"
        style={{ backgroundColor: theme.sidebarBg }}
      >
        {/* Brand Banner at Top */}
        <div className="p-6 pb-8">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-left focus:outline-none cursor-pointer group"
            title="Return to DeRote Home"
          >
            <div className="bg-white/10 p-2 rounded-xl group-hover:bg-white/20 transition-colors">
              <DeRoteWordmark size="sm" showDescriptor={false} />
            </div>
          </button>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-white/70 bg-white/10 px-2.5 py-1 rounded-full">
              Student Space · Class {student.classGrade}
            </span>
          </div>
        </div>

        {/* Navigation Tab Links with Sculpted Curvature */}
        <nav className="flex-1 space-y-1.5 pl-3">
          {/* TAB 1: OVERVIEW */}
          <div className="relative">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-l-2xl text-sm font-bold transition-all cursor-pointer relative z-10 ${
                activeTab === 'overview'
                  ? 'bg-[#F5F8FD] shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              style={{
                color: activeTab === 'overview' ? theme.primaryColor : undefined,
              }}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              <span>Overview</span>
            </button>
            {activeTab === 'overview' && (
              <>
                {/* Top concave outer fillet */}
                <div className="absolute -top-4 right-0 w-4 h-4 bg-[#F5F8FD] pointer-events-none">
                  <div
                    className="w-full h-full rounded-br-2xl transition-colors duration-300"
                    style={{ backgroundColor: theme.sidebarBg }}
                  />
                </div>
                {/* Bottom concave outer fillet */}
                <div className="absolute -bottom-4 right-0 w-4 h-4 bg-[#F5F8FD] pointer-events-none">
                  <div
                    className="w-full h-full rounded-tr-2xl transition-colors duration-300"
                    style={{ backgroundColor: theme.sidebarBg }}
                  />
                </div>
              </>
            )}
          </div>

          {/* TAB 2: REFLECTION */}
          <div className="relative">
            <button
              onClick={() => setActiveTab('reflection')}
              className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-l-2xl text-sm font-bold transition-all cursor-pointer relative z-10 ${
                activeTab === 'reflection'
                  ? 'bg-[#F5F8FD] shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              style={{
                color: activeTab === 'reflection' ? theme.primaryColor : undefined,
              }}
            >
              <Compass className="w-5 h-5 shrink-0" />
              <div className="flex-1 flex items-center justify-between text-left">
                <span>Learning Reflection</span>
                {submittedSuccessfully ? (
                  <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.5 rounded-full">
                    Done
                  </span>
                ) : (
                  <span className="text-[10px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded-full">
                    {answeredCount}/14
                  </span>
                )}
              </div>
            </button>
            {activeTab === 'reflection' && (
              <>
                <div className="absolute -top-4 right-0 w-4 h-4 bg-[#F5F8FD] pointer-events-none">
                  <div
                    className="w-full h-full rounded-br-2xl transition-colors duration-300"
                    style={{ backgroundColor: theme.sidebarBg }}
                  />
                </div>
                <div className="absolute -bottom-4 right-0 w-4 h-4 bg-[#F5F8FD] pointer-events-none">
                  <div
                    className="w-full h-full rounded-tr-2xl transition-colors duration-300"
                    style={{ backgroundColor: theme.sidebarBg }}
                  />
                </div>
              </>
            )}
          </div>

          {/* TAB 3: TASKS & PLANNER */}
          <div className="relative">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-l-2xl text-sm font-bold transition-all cursor-pointer relative z-10 ${
                activeTab === 'tasks'
                  ? 'bg-[#F5F8FD] shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              style={{
                color: activeTab === 'tasks' ? theme.primaryColor : undefined,
              }}
            >
              <CheckSquare className="w-5 h-5 shrink-0" />
              <div className="flex-1 flex items-center justify-between text-left">
                <span>Personal Tasks</span>
                {pendingTasks.length > 0 && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: activeTab === 'tasks' ? theme.primaryColor : 'rgba(255,255,255,0.25)',
                      color: '#FFFFFF',
                    }}
                  >
                    {pendingTasks.length}
                  </span>
                )}
              </div>
            </button>
            {activeTab === 'tasks' && (
              <>
                <div className="absolute -top-4 right-0 w-4 h-4 bg-[#F5F8FD] pointer-events-none">
                  <div
                    className="w-full h-full rounded-br-2xl transition-colors duration-300"
                    style={{ backgroundColor: theme.sidebarBg }}
                  />
                </div>
                <div className="absolute -bottom-4 right-0 w-4 h-4 bg-[#F5F8FD] pointer-events-none">
                  <div
                    className="w-full h-full rounded-tr-2xl transition-colors duration-300"
                    style={{ backgroundColor: theme.sidebarBg }}
                  />
                </div>
              </>
            )}
          </div>

          {/* TAB 4: PROFILE & SETTINGS */}
          <div className="relative">
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-l-2xl text-sm font-bold transition-all cursor-pointer relative z-10 ${
                activeTab === 'settings'
                  ? 'bg-[#F5F8FD] shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              style={{
                color: activeTab === 'settings' ? theme.primaryColor : undefined,
              }}
            >
              <Settings className="w-5 h-5 shrink-0" />
              <span>Settings & Profile</span>
            </button>
            {activeTab === 'settings' && (
              <>
                <div className="absolute -top-4 right-0 w-4 h-4 bg-[#F5F8FD] pointer-events-none">
                  <div
                    className="w-full h-full rounded-br-2xl transition-colors duration-300"
                    style={{ backgroundColor: theme.sidebarBg }}
                  />
                </div>
                <div className="absolute -bottom-4 right-0 w-4 h-4 bg-[#F5F8FD] pointer-events-none">
                  <div
                    className="w-full h-full rounded-tr-2xl transition-colors duration-300"
                    style={{ backgroundColor: theme.sidebarBg }}
                  />
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Student Mini Profile & Sign Out Footer in Sidebar */}
        <div className="p-4 m-3 rounded-2xl bg-black/15 text-white/90 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-extrabold text-base shrink-0 shadow-inner">
              {student.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate text-white">{student.fullName}</p>
              <p className="text-[11px] text-white/70 truncate">{student.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowSignOutModal(true)}
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA                                            */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F5F8FD]">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E8F3FF] px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#102C46] hover:bg-[#F5F8FD] rounded-xl cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="md:hidden">
              <DeRoteWordmark size="sm" showDescriptor={false} />
            </div>

            {/* Breadcrumb / Current Tab Title on Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64778C]">Student Dashboard</span>
              <span className="text-xs text-[#CBD5E1]">/</span>
              <span className="text-sm font-extrabold text-[#102C46] capitalize">
                {activeTab === 'overview'
                  ? 'Overview'
                  : activeTab === 'reflection'
                  ? 'Learning Reflection'
                  : activeTab === 'tasks'
                  ? 'Personal Tasks & Planner'
                  : 'Profile & Settings'}
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme switcher quick dot */}
            <button
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-[#EBF2FE] hover:bg-[#DCE7FE] transition-colors cursor-pointer"
              style={{ color: theme.primaryColor }}
              title="Change theme accent"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{theme.name}</span>
            </button>

            {/* Quick Action: New Task Modal */}
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs hover:opacity-95 transition-all cursor-pointer"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Task</span>
              <span className="sm:hidden">Task</span>
            </button>

            {/* Student Avatar button */}
            <button
              onClick={() => setActiveTab('settings')}
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs cursor-pointer hover:ring-2 hover:ring-offset-1"
              style={{ backgroundColor: theme.primaryColor }}
              title="Account settings"
            >
              {student.fullName.charAt(0).toUpperCase()}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-b border-white/10 px-4 py-4 space-y-1.5 transition-all select-none"
            style={{ backgroundColor: theme.sidebarBg }}
          >
            <button
              onClick={() => {
                setActiveTab('overview');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${
                activeTab === 'overview' ? 'bg-white text-[#102C46]' : 'text-white/80'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('reflection');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold ${
                activeTab === 'reflection' ? 'bg-white text-[#102C46]' : 'text-white/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5" />
                <span>Learning Reflection</span>
              </div>
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                {answeredCount}/14
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('tasks');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold ${
                activeTab === 'tasks' ? 'bg-white text-[#102C46]' : 'text-white/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5" />
                <span>Personal Tasks</span>
              </div>
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                {pendingTasks.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${
                activeTab === 'settings' ? 'bg-white text-[#102C46]' : 'text-white/80'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings & Profile</span>
            </button>

            <div className="pt-2 border-t border-white/10 mt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowSignOutModal(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({student.fullName})</span>
              </button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 1: OVERVIEW TAB                                       */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
            {/* HERO GREETING BANNER */}
            <div
              className={`rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg bg-gradient-to-r ${theme.accentGradient}`}
            >
              {/* Background soft geometric circles */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <div className="absolute -bottom-12 right-24 w-36 h-36 rounded-full bg-white/10 blur-lg pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 backdrop-blur-xs text-white">
                      Class {student.classGrade} Academic Workspace
                    </span>
                    <span className="text-xs text-white/80 font-medium">
                      {student.schoolName}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                    Welcome back, {student.fullName.split(' ')[0]}! ✨
                  </h1>
                  <p className="text-sm sm:text-base text-white/90 mt-2 max-w-2xl leading-relaxed">
                    "Every master was once a beginner. Consistent curiosity today builds lasting clarity tomorrow."
                  </p>
                </div>

                {/* Quick Action Button */}
                <div className="shrink-0 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('reflection')}
                    className="px-5 py-3 rounded-2xl bg-white font-extrabold text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-2"
                    style={{ color: theme.primaryColor }}
                  >
                    <Compass className="w-4 h-4" />
                    <span>
                      {submittedSuccessfully ? 'View My Insight Report' : 'Resume 14 Questions'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* METRICS ROW (4 Cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {/* Card 1: Reflection Status */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8F3FF] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#64778C] uppercase tracking-wider">
                    Self-Reflection
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#EBF2FE] flex items-center justify-center text-[#2150D8]">
                    <Compass className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#102C46]">
                    {submittedSuccessfully ? '14 / 14' : `${answeredCount} / 14`}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex-1 h-1.5 bg-[#E8F3FF] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${submittedSuccessfully ? 100 : progressPercentage}%`,
                          backgroundColor: theme.primaryColor,
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#64778C]">
                      {submittedSuccessfully ? '100%' : `${progressPercentage}%`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Tasks Pending */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8F3FF] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#64778C] uppercase tracking-wider">
                    Tasks To-Do
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#102C46]">
                    {pendingTasks.length} Pending
                  </div>
                  <p className="text-[11px] text-[#64778C] mt-1 font-medium">
                    {completedTasks.length} completed this week
                  </p>
                </div>
              </div>

              {/* Card 3: Schoolwork & Revision Focus */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8F3FF] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#64778C] uppercase tracking-wider">
                    Focus Stream
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-[#7C3AED]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#102C46]">
                    Class {student.classGrade} Core
                  </div>
                  <p className="text-[11px] text-[#64778C] mt-1 font-medium">
                    Math, Science & Social Foundations
                  </p>
                </div>
              </div>

              {/* Card 4: Certified Privacy & Protection */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8F3FF] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#64778C] uppercase tracking-wider">
                    DeRote Safe
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-emerald-600">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-700">
                    Protected
                  </div>
                  <p className="text-[11px] text-[#64778C] mt-1 font-medium">
                    Strict student data encryption
                  </p>
                </div>
              </div>
            </div>

            {/* TWO COLUMN BODY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* LEFT COLUMN: 7 COLS (Reflection Journey Card & Strengths) */}
              <div className="lg:col-span-7 space-y-6">
                {/* DeRote Reflection Journey Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8F3FF] shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold"
                        style={{ backgroundColor: theme.accentBadgeBg, color: theme.accentText }}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Insight Engine · 14 Key Reflections</span>
                      </span>
                      <h2 className="text-xl font-extrabold text-[#102C46] mt-2.5">
                        {submittedSuccessfully
                          ? 'Your Cognitive Strengths Are Unlocked!'
                          : 'Discover How You Think, Learn & Excel'}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm text-[#64778C] leading-relaxed mb-6">
                    {submittedSuccessfully
                      ? 'Congratulations! Your full DeRote reflection report has synthesized your strengths across analytical inquiry, problem-solving habits, and peer synergy.'
                      : 'The 14 self-reflection questions take approximately 6 minutes. Your responses are auto-saved to Firebase so you can pause and resume anytime.'}
                  </p>

                  {/* Highlights from Report if completed */}
                  {submittedSuccessfully && insightReport ? (
                    <div className="space-y-3 mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {insightReport.cards.slice(0, 2).map((c, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-2xl bg-[#F5F8FD] border border-[#E8F3FF]"
                          >
                            <p className="text-xs font-bold text-[#102C46]">{c.heading}</p>
                            <p className="text-[11px] text-[#64778C] mt-1 line-clamp-2">
                              {c.reflectionText}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 rounded-2xl bg-[#F5F8FD] border border-[#E8F3FF]">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#102C46] mb-1.5">
                        <span>Progress: Question {currentIndex + 1} of 14</span>
                        <span>{progressPercentage}% Answered</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#E8F3FF] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progressPercentage}%`,
                            backgroundColor: theme.primaryColor,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveTab('reflection')}
                      className="px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-xs transition-all hover:opacity-95 cursor-pointer flex items-center gap-2"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <span>
                        {submittedSuccessfully ? 'Open Full Insight Report' : 'Continue 14 Questions'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {submittedSuccessfully && (
                      <button
                        onClick={() => setShowResetConfirmModal(true)}
                        className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-[#64778C] hover:text-[#102C46] font-semibold text-xs sm:text-sm hover:bg-[#F5F8FD] transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retake Assessment</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* STUDY TECHNIQUE TIP FOR CLASSES 8-10 */}
                <div className="bg-white rounded-3xl p-6 border border-[#E8F3FF] shadow-xs">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#102C46]">
                        Weekly Study Habit: Active Recall & Blurting
                      </h3>
                      <p className="text-xs text-[#64778C]">Curated for Class {student.classGrade} syllabus revision</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    Instead of simply re-reading textbook chapters, close your notes and write everything you remember on a blank sheet for 5 minutes. Then verify gaps in green ink. This doubles retention compared to passive reading!
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: 5 COLS (Personal Tasks Snapshot) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-[#E8F3FF] shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-5 h-5" style={{ color: theme.primaryColor }} />
                      <h2 className="text-base font-extrabold text-[#102C46]">Action Items & Tasks</h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('tasks')}
                      className="text-xs font-bold hover:underline cursor-pointer"
                      style={{ color: theme.primaryColor }}
                    >
                      View All ({tasks.length})
                    </button>
                  </div>

                  {/* Tasks List (Top 4) */}
                  <div className="space-y-2.5">
                    {tasks.slice(0, 4).map((task) => {
                      const catDef = TASK_CATEGORIES.find((c) => c.id === task.category);
                      return (
                        <div
                          key={task.id}
                          className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                            task.completed
                              ? 'bg-[#F8FAFC] border-slate-200 opacity-60'
                              : 'bg-white border-[#E8F3FF] hover:border-[#CBD5E1]'
                          }`}
                        >
                          <button
                            onClick={() => handleToggleTask(task.id, task.completed)}
                            className="mt-0.5 text-[#64778C] hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                            aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-[#94A3B8]" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-xs sm:text-sm font-bold text-[#102C46] truncate ${
                                task.completed ? 'line-through text-[#64778C]' : ''
                              }`}
                            >
                              {task.title}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: catDef?.badgeBg || '#F1F5F9',
                                  color: catDef?.color || '#475569',
                                }}
                              >
                                {task.category}
                              </span>
                              <span className="text-[10px] text-[#64778C] flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {task.dueDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {tasks.length === 0 && (
                      <div className="p-6 text-center text-xs text-[#64778C]">
                        No tasks yet. Click "Add Task" to plan your schoolwork!
                      </div>
                    )}
                  </div>

                  {/* Quick Task Add Bar */}
                  <button
                    onClick={() => setShowAddTaskModal(true)}
                    className="mt-4 w-full py-2.5 px-4 rounded-xl border border-dashed border-[#CBD5E1] text-xs font-bold text-[#64778C] hover:text-[#102C46] hover:bg-[#F5F8FD] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Quick Add New Task</span>
                  </button>
                </div>

                {/* Cohort Card for Class 8, 9, 10 */}
                <div className="bg-gradient-to-br from-[#EBF2FE] to-white rounded-3xl p-6 border border-[#2150D8]/20 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#2150D8] mb-2">
                    <Award className="w-4 h-4" />
                    <span>Class {student.classGrade} Academic Milestone</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-[#102C46]">
                    Build High-Order Thinking Early
                  </h3>
                  <p className="text-xs text-[#64778C] mt-1.5 leading-relaxed">
                    Classes 8, 9, and 10 represent critical foundational years. Developing self-driven reflection habits now prepares you for board exams and beyond.
                  </p>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 2: LEARNING REFLECTION TAB                            */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'reflection' && (
          <main className="flex-1 p-4 sm:p-8 max-w-5xl w-full mx-auto animate-fadeIn">
            {submittedSuccessfully && insightReport && session ? (
              /* Completed Insight Dashboard */
              <div className="space-y-6">
                {showCelebration && (
                  <CelebrationEffect onComplete={() => setShowCelebration(false)} intensity="subtle" />
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E8F3FF] shadow-xs">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      Assessment Verified · 14/14 Completed
                    </span>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-[#102C46] mt-2">
                      {student.fullName}'s Learning Insight Report
                    </h1>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowResetConfirmModal(true)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#64778C] hover:text-[#102C46] border border-[#CBD5E1] hover:bg-[#F5F8FD] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake Questions</span>
                    </button>
                  </div>
                </div>

                {/* Render the full comprehensive insight report */}
                <StudentInsightDashboard
                  report={insightReport}
                  session={session}
                  onNavigate={onNavigate}
                  onRetake={() => setShowResetConfirmModal(true)}
                />
              </div>
            ) : (
              /* Active 14-Question Interface */
              <div className="space-y-6">
                {/* Header with Save State & Question Navigator */}
                <div className="bg-white p-5 rounded-3xl border border-[#E8F3FF] shadow-xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-extrabold text-[#2150D8] bg-[#EBF2FE] px-3 py-1 rounded-full uppercase tracking-wider">
                      DeRote Self-Reflection Assessment
                    </span>
                    <h1 className="text-lg sm:text-xl font-extrabold text-[#102C46] mt-1.5">
                      14 Questions on Learning & Growth
                    </h1>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Auto-save sync status */}
                    <div className="text-xs text-[#64778C] flex items-center gap-1.5 bg-[#F5F8FD] px-3 py-1.5 rounded-full border border-[#E8F3FF]">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          reflectionSyncState === 'saved'
                            ? 'bg-emerald-500'
                            : reflectionSyncState === 'saving'
                            ? 'bg-[#2150D8] animate-pulse'
                            : 'bg-amber-500'
                        }`}
                      />
                      <span className="hidden sm:inline">
                        {reflectionSyncState === 'saving'
                          ? 'Saving to Firebase...'
                          : `Saved to Firebase (${lastSavedTime})`}
                      </span>
                    </div>

                    <button
                      onClick={() => setShowQuestionDrawer(!showQuestionDrawer)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#EBF2FE] text-[#2150D8] hover:bg-[#DCE7FE] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                      <span>Questions (14)</span>
                    </button>
                  </div>
                </div>

                {/* Question Drawer for direct jump */}
                {showQuestionDrawer && (
                  <div className="bg-white p-5 rounded-3xl border border-[#E8F3FF] shadow-sm animate-fadeIn">
                    <p className="text-xs font-bold text-[#64778C] mb-3 uppercase tracking-wider">
                      Jump to Question
                    </p>
                    <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
                      {QUESTION_BANK.map((q, idx) => {
                        const ans = session?.answers[q.id];
                        const isAns = ans?.status === 'answered';
                        const isCur = idx === currentIndex;
                        return (
                          <button
                            key={q.id}
                            onClick={() => {
                              setCurrentIndex(idx);
                              setShowQuestionDrawer(false);
                            }}
                            className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                              isCur
                                ? 'bg-[#2150D8] text-white shadow-xs'
                                : isAns
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-[#F5F8FD] text-[#64778C] hover:bg-[#E8F3FF]'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#64778C] mb-1.5">
                    <span>
                      Question {currentIndex + 1} of {QUESTION_BANK.length}
                    </span>
                    <span>
                      {answeredCount} of {QUESTION_BANK.length} answered ({progressPercentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#E8F3FF] rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${((currentIndex + 1) / QUESTION_BANK.length) * 100}%`,
                        backgroundColor: theme.primaryColor,
                      }}
                    />
                  </div>
                </div>

                {/* ACTIVE QUESTION CARD */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8F3FF] shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-extrabold"
                      style={{ backgroundColor: theme.accentBadgeBg, color: theme.accentText }}
                    >
                      Question {currentQuestion.number} of 14 · ID {currentQuestion.id}
                    </span>
                    <span className="text-xs text-[#64778C] font-semibold">
                      {currentQuestion.type === 'single'
                        ? 'Select 1 option'
                        : `Select up to ${currentQuestion.maxSelections || 'multiple'} choices`}
                      {currentQuestion.isOptional && ' (Optional)'}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#102C46]">
                    {currentQuestion.title}
                  </h2>
                  <p className="text-sm text-[#64778C] mt-2 mb-6 leading-relaxed">
                    {currentQuestion.prompt}
                  </p>

                  {/* Options List */}
                  <div className="space-y-3 mb-6">
                    {currentQuestion.options.map((opt) => {
                      const isSelected = currentAnswer.selectedOptions.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleToggleOption(opt.id)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                            isSelected
                              ? 'border-[#2150D8] bg-[#EBF2FE]'
                              : 'border-[#E8F3FF] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                              isSelected ? 'bg-[#2150D8] text-white' : 'border border-[#CBD5E1]'
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-[#102C46]">{opt.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom Option Free Text */}
                  {currentAnswer.selectedOptions.includes(CUSTOM_OPTION_ID) && (
                    <div className="mb-6 animate-fadeIn">
                      <label className="block text-xs font-bold text-[#102C46] mb-1.5">
                        Your custom thoughts:
                      </label>
                      <textarea
                        value={currentAnswer.customText || ''}
                        onChange={(e) => handleCustomTextChange(e.target.value)}
                        placeholder="Type your personal reflection here..."
                        rows={3}
                        className="w-full p-3.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2150D8]"
                      />
                    </div>
                  )}

                  {/* Validation Alert */}
                  {validationAlert && (
                    <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{validationAlert}</span>
                    </div>
                  )}

                  {/* Navigation Buttons: Previous / Next / Complete */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#E8F3FF]">
                    <button
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#64778C] hover:text-[#102C46] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    {currentIndex < QUESTION_BANK.length - 1 ? (
                      <button
                        onClick={handleNext}
                        className="px-6 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:opacity-95 cursor-pointer flex items-center gap-1.5"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        <span>Save & Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitAll}
                        disabled={isSubmittingReflection}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-700 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        {isSubmittingReflection ? (
                          <span>Submitting...</span>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Submit & Generate Report</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 3: PERSONAL TASKS & PLANNER TAB                       */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'tasks' && (
          <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
            {/* Header with Title and Add Button */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider"
                  style={{ backgroundColor: theme.accentBadgeBg, color: theme.accentText }}
                >
                  Personal Planner
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102C46] mt-2">
                  Tasks, Deadlines & Revision
                </h1>
                <p className="text-xs sm:text-sm text-[#64778C] mt-1">
                  Keep track of homework, revision sessions, projects, and general study goals for Class {student.classGrade}.
                </p>
              </div>

              <button
                onClick={() => setShowAddTaskModal(true)}
                className="px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:opacity-95 flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Plus className="w-4 h-4" />
                <span>Create New Task</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E8F3FF] shadow-xs">
              {/* Category Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setTaskCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    taskCategoryFilter === 'all'
                      ? 'bg-[#102C46] text-white'
                      : 'text-[#64778C] hover:bg-[#F5F8FD]'
                  }`}
                >
                  All ({tasks.length})
                </button>

                {TASK_CATEGORIES.map((cat) => {
                  const count = tasks.filter((t) => t.category === cat.id).length;
                  const active = taskCategoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setTaskCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? 'text-white'
                          : 'text-[#64778C] hover:bg-[#F5F8FD]'
                      }`}
                      style={{
                        backgroundColor: active ? cat.color : undefined,
                      }}
                    >
                      {cat.label} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-[#F5F8FD] p-1 rounded-xl">
                <button
                  onClick={() => setTaskStatusFilter('all')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                    taskStatusFilter === 'all' ? 'bg-white text-[#102C46] shadow-xs' : 'text-[#64778C]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTaskStatusFilter('pending')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                    taskStatusFilter === 'pending' ? 'bg-white text-[#102C46] shadow-xs' : 'text-[#64778C]'
                  }`}
                >
                  Pending ({pendingTasks.length})
                </button>
                <button
                  onClick={() => setTaskStatusFilter('completed')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                    taskStatusFilter === 'completed' ? 'bg-white text-[#102C46] shadow-xs' : 'text-[#64778C]'
                  }`}
                >
                  Done ({completedTasks.length})
                </button>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const catDef = TASK_CATEGORIES.find((c) => c.id === task.category);
                return (
                  <div
                    key={task.id}
                    className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all flex items-start justify-between gap-4 shadow-xs ${
                      task.completed
                        ? 'border-[#E2E8F0] bg-[#FAFBFD] opacity-75'
                        : 'border-[#E8F3FF] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <button
                        onClick={() => handleToggleTask(task.id, task.completed)}
                        className="mt-0.5 transition-transform active:scale-90 cursor-pointer shrink-0"
                        aria-label={task.completed ? 'Mark pending' : 'Mark done'}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#94A3B8] hover:text-[#2150D8]" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm sm:text-base font-extrabold text-[#102C46] break-words ${
                            task.completed ? 'line-through text-[#64778C]' : ''
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.notes && (
                          <p className="text-xs text-[#64778C] mt-1 break-words leading-relaxed">
                            {task.notes}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-2.5">
                          {/* Category Badge */}
                          <span
                            className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: catDef?.badgeBg || '#F1F5F9',
                              color: catDef?.color || '#475569',
                            }}
                          >
                            {task.category}
                          </span>

                          {/* Due Date */}
                          <span className="text-[11px] font-semibold text-[#64778C] flex items-center gap-1 bg-[#F5F8FD] px-2.5 py-0.5 rounded-full border border-[#E8F3FF]">
                            <Calendar className="w-3 h-3" />
                            <span>Due: {task.dueDate}</span>
                          </span>

                          {/* Priority Badge */}
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              task.priority === 'high'
                                ? 'bg-red-50 text-red-600'
                                : task.priority === 'medium'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {task.priority} Priority
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-[#94A3B8] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {filteredTasks.length === 0 && (
                <div className="bg-white rounded-3xl p-12 text-center border border-[#E8F3FF] shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF2FE] text-[#2150D8] flex items-center justify-center mx-auto mb-3">
                    <CheckSquare className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#102C46]">No tasks found</h3>
                  <p className="text-xs text-[#64778C] mt-1 max-w-sm mx-auto">
                    {taskCategoryFilter !== 'all' || taskStatusFilter !== 'all'
                      ? 'No tasks match the selected filters. Try choosing "All".'
                      : 'You have cleared all tasks! Add a new task to organize your academic week.'}
                  </p>
                  <button
                    onClick={() => setShowAddTaskModal(true)}
                    className="mt-4 px-4 py-2 rounded-xl text-white font-bold text-xs cursor-pointer shadow-xs"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Add Task Now
                  </button>
                </div>
              )}
            </div>
          </main>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 4: PROFILE & SETTINGS TAB                             */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <main className="flex-1 p-4 sm:p-8 max-w-4xl w-full mx-auto space-y-8 animate-fadeIn">
            <div>
              <span
                className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider"
                style={{ backgroundColor: theme.accentBadgeBg, color: theme.accentText }}
              >
                Settings & Personalization
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102C46] mt-2">
                Student Profile & Preferences
              </h1>
              <p className="text-xs sm:text-sm text-[#64778C] mt-1">
                Customize your visual theme, update registered school details, and manage authentication.
              </p>
            </div>

            {/* THEME PICKER (Clarifying Answers requirement: Classic Royal Blue, Slate Teal, Indigo Violet) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8F3FF] shadow-xs">
              <div className="flex items-center gap-2.5 mb-2">
                <Palette className="w-5 h-5" style={{ color: theme.primaryColor }} />
                <h2 className="text-lg font-extrabold text-[#102C46]">Dashboard Accent Themes</h2>
              </div>
              <p className="text-xs text-[#64778C] mb-6">
                Choose the visual palette for your sidebar navigation, cards, and highlight badges.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(['classic', 'teal', 'violet'] as DashboardTheme[]).map((tKey) => {
                  const cfg = THEME_CONFIGS[tKey];
                  const isSelected = currentTheme === tKey;
                  return (
                    <div
                      key={tKey}
                      onClick={() => handleSelectTheme(tKey)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#102C46] shadow-sm bg-[#F8FAFC]'
                          : 'border-[#E8F3FF] hover:border-[#CBD5E1]'
                      }`}
                    >
                      <div>
                        {/* Theme color swatch preview */}
                        <div
                          className="w-full h-12 rounded-xl mb-3 flex items-center justify-between px-3 text-white font-bold text-xs shadow-xs"
                          style={{ backgroundColor: cfg.sidebarBg }}
                        >
                          <span>{cfg.name}</span>
                          <span
                            className="w-4 h-4 rounded-full border border-white"
                            style={{ backgroundColor: cfg.primaryColor }}
                          />
                        </div>
                        <p className="text-xs font-bold text-[#102C46]">{cfg.name}</p>
                        <p className="text-[11px] text-[#64778C] mt-0.5">{cfg.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#E8F3FF] flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#64778C]">
                          {isSelected ? 'Active Theme' : 'Click to Apply'}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PROFILE DETAILS FORM */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8F3FF] shadow-xs">
              <div className="flex items-center gap-2.5 mb-2">
                <UserCheck className="w-5 h-5" style={{ color: theme.primaryColor }} />
                <h2 className="text-lg font-extrabold text-[#102C46]">Academic Profile Details</h2>
              </div>
              <p className="text-xs text-[#64778C] mb-6">
                Keep your legal name, grade, and institution up to date.
              </p>

              {profileMessage && (
                <div
                  className={`mb-6 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                    profileMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{profileMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#102C46] mb-1.5">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2150D8]"
                    />
                  </div>

                  {/* Class Grade (8, 9, 10 only) */}
                  <div>
                    <label className="block text-xs font-bold text-[#102C46] mb-1.5">
                      Academic Class (Grades 8, 9, 10)
                    </label>
                    <select
                      value={editClassGrade}
                      onChange={(e) => setEditClassGrade(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2150D8]"
                    >
                      <option value="8">Class 8</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                    </select>
                  </div>
                </div>

                {/* School Name */}
                <div>
                  <label className="block text-xs font-bold text-[#102C46] mb-1.5">
                    School / Institution
                  </label>
                  <SchoolAutocompleteInput
                    value={editSchoolName}
                    onChange={setEditSchoolName}
                    placeholder="Enter your affiliated school name..."
                  />
                </div>

                {/* Email (Read Only Identifier) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#102C46] mb-1.5">
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      value={student.email}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-slate-500 text-xs sm:text-sm cursor-not-allowed"
                    />
                    <p className="text-[11px] text-[#64778C] mt-1">
                      Primary login identifier verified via Firebase Auth.
                    </p>
                  </div>

                  {student.phone && (
                    <div>
                      <label className="block text-xs font-bold text-[#102C46] mb-1.5">
                        Contact Mobile
                      </label>
                      <input
                        type="text"
                        value={student.phone}
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-slate-500 text-xs sm:text-sm cursor-not-allowed"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="px-6 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:opacity-95 cursor-pointer"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* SECURITY & CREDENTIALS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8F3FF] shadow-xs">
              <div className="flex items-center gap-2.5 mb-2">
                <Shield className="w-5 h-5 text-[#2150D8]" />
                <h2 className="text-lg font-extrabold text-[#102C46]">Security & Sign In</h2>
              </div>
              <p className="text-xs text-[#64778C] mb-4">
                Firebase Email/Password Authentication status and credentials.
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#F5F8FD] border border-[#E8F3FF]">
                <div>
                  <p className="text-xs font-bold text-[#102C46]">Account Password</p>
                  <p className="text-[11px] text-[#64778C]">
                    Send a secure password-reset link to your registered email.
                  </p>
                  {resetEmailSentStatus && (
                    <p className="text-xs font-semibold text-[#2150D8] mt-1">
                      {resetEmailSentStatus}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSendResetPassword}
                  className="px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white text-xs font-bold text-[#102C46] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
            </div>

            {/* SIGN OUT CARD */}
            <div className="bg-red-50/50 rounded-3xl p-6 border border-red-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-red-900">Sign Out of Student Account</h3>
                <p className="text-xs text-red-700/80 mt-0.5">
                  Your tasks, reflection drafts, and preferences will remain safely stored.
                </p>
              </div>

              <button
                onClick={() => setShowSignOutModal(true)}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs sm:text-sm hover:bg-red-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </main>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD NEW TASK                                           */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        title="Create New Personal Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#102C46] mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Complete Math Chapter 4 Exercises"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2150D8]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-[#102C46] mb-1.5">
                Category
              </label>
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2150D8]"
              >
                <option value="Schoolwork">Schoolwork</option>
                <option value="Revision">Revision</option>
                <option value="Personal Projects">Personal Projects</option>
                <option value="General">General</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-[#102C46] mb-1.5">
                Priority
              </label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2150D8]"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-bold text-[#102C46] mb-1.5">
              Target Deadline / Due Date
            </label>
            <input
              type="text"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              placeholder="e.g. Tomorrow, Friday, or Oct 20"
              className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2150D8]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#102C46] mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              value={newTaskNotes}
              onChange={(e) => setNewTaskNotes(e.target.value)}
              placeholder="Add key formulas, book pages, or context..."
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2150D8]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8F3FF]">
            <button
              type="button"
              onClick={() => setShowAddTaskModal(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#64778C] hover:text-[#102C46] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:opacity-95 cursor-pointer"
              style={{ backgroundColor: theme.primaryColor }}
            >
              Save Task
            </button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: RESET ASSESSMENT CONFIRMATION                          */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={showResetConfirmModal}
        onClose={() => setShowResetConfirmModal(false)}
        title="Retake Self-Reflection Assessment?"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-[#64778C] leading-relaxed">
            This will reset your answers to the 14 reflection questions, allowing you to answer fresh. Your student profile and personal planner tasks will not be affected.
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8F3FF]">
            <button
              onClick={() => setShowResetConfirmModal(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#64778C] hover:text-[#102C46] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleResetSession}
              className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs sm:text-sm hover:bg-amber-700 transition-colors shadow-xs cursor-pointer"
            >
              Confirm Retake
            </button>
          </div>
        </div>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: SIGN OUT CONFIRMATION                                  */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        title="Sign Out of DeRote"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-[#64778C] leading-relaxed">
            Are you sure you want to sign out? Your tasks and reflection draft are securely stored in Cloud Firestore and will be restored when you sign in again.
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8F3FF]">
            <button
              onClick={() => setShowSignOutModal(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#64778C] hover:text-[#102C46] cursor-pointer"
            >
              Stay Signed In
            </button>
            <button
              onClick={handleConfirmSignOut}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs sm:text-sm hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
