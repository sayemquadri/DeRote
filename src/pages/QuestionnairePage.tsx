import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Save,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Check,
  User,
  LogOut,
  ListOrdered,
  FastForward,
  Trophy,
  Award,
} from 'lucide-react';
import { DeRoteWordmark } from '../components/DeRoteWordmark';
import { CelebrationEffect, playCelebrationChime } from '../components/CelebrationEffect';
import { StudentInsightDashboard } from '../components/StudentInsightDashboard';
import { generateStudentInsightReport } from '../services/insightEngine';
import {
  QUESTION_BANK,
  QuestionDefinition,
  CUSTOM_OPTION_ID,
} from '../data/questionnaireBank';
import { Modal } from '../components/Modal';
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
  getCurrentActiveStudent,
  loginAsDemoStudent,
  DEMO_STUDENT_ROSTER,
} from '../services/localAuth';

interface QuestionnairePageProps {
  onNavigate: (route: string) => void;
}

export function QuestionnairePage({ onNavigate }: QuestionnairePageProps) {
  const [student, setStudent] = useState<StudentProfile | null>(() => {
    const current = getCurrentActiveStudent();
    if (current) {
      return {
        id: current.id,
        fullName: current.fullName,
        classGrade: current.classGrade,
        schoolName: current.schoolName,
        phone: current.phone,
      };
    }
    return null;
  });

  const [session, setSession] = useState<QuestionnaireSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [validationAlert, setValidationAlert] = useState<string | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  // Initialize or fallback to Aarav Sharma demo if not logged in
  useEffect(() => {
    if (!student) {
      // Auto-assign Aarav Sharma demo so user can immediately experience questions
      const demoAccount = loginAsDemoStudent('demo_aarav_10');
      if (demoAccount) {
        setStudent({
          id: demoAccount.id,
          fullName: demoAccount.fullName,
          classGrade: demoAccount.classGrade,
          schoolName: demoAccount.schoolName,
          phone: demoAccount.phone,
        });
      }
    }
  }, [student]);

  // Load session when student is present
  useEffect(() => {
    if (!student) return;

    loadQuestionnaireSession(student).then(({ session: loadedSession, isAlreadySubmitted }) => {
      setSession(loadedSession);
      setCurrentIndex(loadedSession.currentQuestionIndex || 0);
      if (isAlreadySubmitted) {
        setSubmittedSuccessfully(true);
      }
    });
  }, [student]);

  const currentQuestion: QuestionDefinition = useMemo(() => {
    return QUESTION_BANK[currentIndex] || QUESTION_BANK[0];
  }, [currentIndex]);

  const currentAnswer: QuestionAnswerState = useMemo(() => {
    if (!session || !session.answers[currentQuestion.id]) {
      return { status: 'unanswered', selectedOptions: [], customText: '' };
    }
    return session.answers[currentQuestion.id];
  }, [session, currentQuestion.id]);

  // Auto-save debouncer
  const saveDraft = async (updatedSession: QuestionnaireSession) => {
    setIsSaving(true);
    await persistQuestionnaireDraft(updatedSession);
    setIsSaving(false);
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  // Option selection handler
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
      // Single choice
      updatedSelected = [optionId];
    } else {
      // Multi-choice or profiles
      if (prev.includes(optionId)) {
        updatedSelected = prev.filter((id) => id !== optionId);
      } else {
        if (isExclusive) {
          // If exclusive option chosen, deselect others
          updatedSelected = [optionId];
        } else {
          // Filter out any previously selected exclusive options
          const nonExclusive = prev.filter((id) => {
            const opt = question.options.find((o) => o.id === id);
            return !opt?.isExclusive;
          });

          const max = question.maxSelections || 99;
          if (nonExclusive.length >= max) {
            setValidationAlert(`You can select at most ${max} option${max > 1 ? 's' : ''} for this question.`);
            return;
          }
          updatedSelected = [...nonExclusive, optionId];
        }
      }
    }

    const newAnswer: QuestionAnswerState = {
      ...currentAnswer,
      selectedOptions: updatedSelected,
      status: updatedSelected.length > 0 ? 'answered' : 'unanswered',
    };

    const newSession: QuestionnaireSession = {
      ...session,
      currentQuestionIndex: currentIndex,
      answers: {
        ...session.answers,
        [question.id]: newAnswer,
      },
    };

    setSession(newSession);
    saveDraft(newSession);
  };

  const handleCustomTextChange = (text: string) => {
    if (!session || submittedSuccessfully) return;

    const newAnswer: QuestionAnswerState = {
      ...currentAnswer,
      customText: text,
      // If user typed something and custom option is not selected, select it
      selectedOptions:
        text.trim() && !currentAnswer.selectedOptions.includes(CUSTOM_OPTION_ID)
          ? currentQuestion.type === 'single'
            ? [CUSTOM_OPTION_ID]
            : [...currentAnswer.selectedOptions, CUSTOM_OPTION_ID]
          : currentAnswer.selectedOptions,
      status: 'answered',
    };

    const newSession: QuestionnaireSession = {
      ...session,
      answers: {
        ...session.answers,
        [currentQuestion.id]: newAnswer,
      },
    };

    setSession(newSession);
    saveDraft(newSession);
  };

  const answeredCount = useMemo(() => {
    if (!session) return 0;
    return QUESTION_BANK.filter((q) => {
      const ans = session.answers[q.id];
      return ans && ans.status === 'answered' && ans.selectedOptions.length > 0;
    }).length;
  }, [session]);

  const progressPercentage = Math.round((answeredCount / QUESTION_BANK.length) * 100);

  const insightReport = useMemo(() => {
    if (!session) return null;
    return generateStudentInsightReport(
      session,
      student?.fullName || 'Student',
      student?.classGrade || 'Class 10'
    );
  }, [session, student]);

  const handleNext = () => {
    if (currentIndex < QUESTION_BANK.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkip = () => {
    setValidationAlert(null);
    if (currentIndex < QUESTION_BANK.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!session) return;
    setIsSubmitting(true);
    const result = await submitQuestionnaireResponses(session);
    setIsSubmitting(false);
    if (result.success) {
      setSubmittedSuccessfully(true);
      setShowCelebration(true);
      playCelebrationChime();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetSession = () => {
    setShowResetConfirmModal(true);
  };

  const executeResetSession = async () => {
    setShowResetConfirmModal(false);
    setShowDrawer(false);
    if (!student) return;

    const freshSession = await resetQuestionnaireSession(student);
    setSession(freshSession);
    setCurrentIndex(0);
    setSubmittedSuccessfully(false);
    setShowCelebration(false);
    setValidationAlert(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F8FD] flex flex-col justify-between text-[#102C46]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8F3FF] px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#64778C] hover:text-[#062B50] transition-colors rounded-lg px-2 py-1 -ml-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Portal</span>
            </button>
            <div className="h-4 w-px bg-[#E8F3FF]" />
            <DeRoteWordmark size="sm" showDescriptor={false} />
          </div>

          {/* Student Status & Save Indicator */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-[#64778C] bg-[#F4F8FD] px-3 py-1.5 rounded-full border border-[#E8F3FF]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {isSaving ? 'Saving...' : `Draft saved (${lastSavedTime})`}
              </span>
            </div>

            {student && (
              <div className="flex items-center gap-2 bg-[#E8F3FF]/70 px-3 py-1.5 rounded-full text-xs font-medium text-[#062B50]">
                <User className="w-3.5 h-3.5 text-[#0866C6]" />
                <span className="font-bold">{student.fullName}</span>
                <span className="text-[#64778C] hidden sm:inline">(Class {student.classGrade})</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowDrawer(!showDrawer)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0866C6] bg-white border border-[#0866C6]/30 px-3 py-1.5 rounded-full hover:bg-[#E8F3FF] transition-colors cursor-pointer"
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Questions (14)</span>
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="max-w-5xl mx-auto mt-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#64778C] mb-1">
            <span>
              {submittedSuccessfully
                ? 'Assessment Completed'
                : `Question ${currentIndex + 1} of ${QUESTION_BANK.length}`}
            </span>
            <span className="transition-all duration-500 ease-out">
              {submittedSuccessfully
                ? `${QUESTION_BANK.length} of ${QUESTION_BANK.length} answered (100%)`
                : `${answeredCount} of ${QUESTION_BANK.length} answered (${progressPercentage}%)`}
            </span>
          </div>
          <div className="w-full h-2 bg-[#E8F3FF] rounded-full overflow-hidden shadow-inner relative">
            <div
              className="h-full bg-gradient-to-r from-[#0866C6] to-[#168FE5] rounded-full relative overflow-hidden transition-[width] duration-700 ease-[cubic-bezier(0.34,1.1,0.64,1)]"
              style={{
                width: `${
                  submittedSuccessfully
                    ? 100
                    : ((currentIndex + 1) / QUESTION_BANK.length) * 100
                }%`,
              }}
            >
              {/* Shimmer light sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer pointer-events-none" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Questionnaire Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {submittedSuccessfully && insightReport && session ? (
          /* Student Personal Insight Dashboard */
          <div className="relative">
            {/* Celebratory Particle Shower on initial submission */}
            {showCelebration && (
              <CelebrationEffect onComplete={() => setShowCelebration(false)} intensity="subtle" />
            )}

            <StudentInsightDashboard
              report={insightReport}
              session={session}
              onNavigate={onNavigate}
              onRetake={handleResetSession}
            />
          </div>
        ) : (
          /* Active Question Card */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8F3FF] shadow-xl shadow-[#062B50]/5">
            {/* Question Badge & Title */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#E8F3FF] text-[#0866C6]">
                Question {currentQuestion.number} of 14 · ID {currentQuestion.id}
              </span>

              <span className="text-xs text-[#64778C] font-medium">
                {currentQuestion.type === 'single'
                  ? 'Choose single answer'
                  : currentQuestion.type === 'profiles'
                  ? 'Choose up to 2 classmates'
                  : `Select up to ${currentQuestion.maxSelections || 'multiple'} choices`}
                {currentQuestion.isOptional && ' (Optional)'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#062B50] tracking-tight">
              {currentQuestion.title}
            </h2>

            {/* Prompt text */}
            <p className="text-sm sm:text-base text-[#465B72] mt-3 leading-relaxed bg-[#F8FAFD] p-4 rounded-2xl border border-[#E8F3FF]">
              {currentQuestion.prompt}
            </p>

            {/* Validation alert */}
            {validationAlert && (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{validationAlert}</span>
              </div>
            )}

            {/* Options List */}
            <div className="mt-6 space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = currentAnswer.selectedOptions.includes(option.id);
                const isCustom = option.id === CUSTOM_OPTION_ID;

                return (
                  <div key={option.id} className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleToggleOption(option.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                        isSelected
                          ? 'border-[#0866C6] bg-[#F0F7FF] shadow-xs ring-1 ring-[#0866C6]'
                          : 'border-[#E8F3FF] hover:border-[#168FE5]/50 hover:bg-[#F9FBFE]'
                      }`}
                    >
                      {/* Selection Box / Indicator */}
                      <div
                        className={`w-5 h-5 rounded-${
                          currentQuestion.type === 'single' ? 'full' : 'md'
                        } mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected
                            ? 'bg-[#0866C6] border-[#0866C6] text-white'
                            : 'border-[#64778C]/40 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      {/* Option text */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {option.letterLabel && (
                            <span className="w-6 h-6 rounded-lg bg-[#0866C6] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                              {option.letterLabel}
                            </span>
                          )}
                          <span
                            className={`text-sm sm:text-[15px] ${
                              isSelected ? 'font-bold text-[#062B50]' : 'text-[#334D66]'
                            }`}
                          >
                            {option.text}
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Custom Write-In Input Field when Custom Option is active */}
                    {isCustom && isSelected && (
                      <div className="pl-9 pr-2 pt-1 pb-2">
                        <input
                          type="text"
                          value={currentAnswer.customText}
                          onChange={(e) => handleCustomTextChange(e.target.value)}
                          placeholder="Type your own answer here..."
                          className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#0866C6] bg-white focus:outline-none focus:ring-2 focus:ring-[#0866C6]/20 text-[#062B50]"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions Bar */}
            <div className="mt-8 pt-6 border-t border-[#E8F3FF] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-colors ${
                  currentIndex === 0
                    ? 'border-[#E8F3FF] text-[#64778C]/40 cursor-not-allowed'
                    : 'border-[#E8F3FF] text-[#062B50] hover:bg-[#F4F8FD] cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Skip Question Button */}
                {currentIndex < QUESTION_BANK.length - 1 && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[#64778C] hover:text-[#062B50] hover:bg-[#F4F8FD] border border-[#E8F3FF] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                    title="Skip this question and move to the next one"
                  >
                    <span>Skip question</span>
                    <FastForward className="w-3.5 h-3.5" />
                  </button>
                )}

                {currentIndex === QUESTION_BANK.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Submitting...' : 'Finish & Submit Assessment'}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0866C6] text-white font-bold text-xs sm:text-sm hover:bg-[#062B50] transition-colors shadow-sm cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Question Progress Bar Beneath Question */}
            <div className="mt-6 pt-4 border-t border-[#F0F6FD]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#64778C] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0866C6] animate-pulse" />
                  <span>Progress: Question {currentIndex + 1} of {QUESTION_BANK.length}</span>
                </span>
                <span className="text-[#0866C6] font-bold transition-all duration-500 ease-out">
                  {progressPercentage}% Completed ({answeredCount} answered)
                </span>
              </div>
              <div className="w-full h-3 bg-[#E8F3FF] rounded-full overflow-hidden p-0.5 shadow-inner relative">
                <div
                  className="h-full bg-gradient-to-r from-[#0866C6] via-[#168FE5] to-emerald-500 rounded-full relative overflow-hidden transition-[width] duration-700 ease-[cubic-bezier(0.34,1.1,0.64,1)]"
                  style={{ width: `${Math.max(5, ((currentIndex + 1) / QUESTION_BANK.length) * 100)}%` }}
                >
                  {/* Shimmer light sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer pointer-events-none" />
                </div>
              </div>
              <div className="flex justify-between items-center text-[11px] text-[#64778C] mt-1.5 font-medium">
                <span className="flex items-center gap-1 text-[#0866C6]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0866C6]" />
                  <span>Start</span>
                </span>
                <span>Optional questions can be skipped anytime</span>
                <span className="text-[#062B50] font-semibold">Question 14</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Slide-out Question Index Drawer */}
      {showDrawer && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#062B50]/40 backdrop-blur-xs flex justify-end"
          onClick={() => setShowDrawer(false)}
        >
          <div
            className="w-full max-w-sm bg-white h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8F3FF]">
                <div>
                  <h3 className="font-extrabold text-base text-[#062B50]">
                    All 14 Questions
                  </h3>
                  <p className="text-xs text-[#64778C] mt-0.5">
                    Click any question to jump directly
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDrawer(false)}
                  className="p-1.5 rounded-lg text-[#64778C] hover:text-[#062B50] hover:bg-[#F4F8FD] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {QUESTION_BANK.map((q, idx) => {
                  const ans = session?.answers[q.id];
                  const isDone = ans && ans.status === 'answered' && ans.selectedOptions.length > 0;
                  const isCurrent = idx === currentIndex;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowDrawer(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-[#0866C6] text-white font-bold shadow-xs'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-100 hover:bg-emerald-100/60'
                          : 'bg-[#F4F8FD] text-[#062B50] hover:bg-[#E8F3FF]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                            isCurrent
                              ? 'bg-white text-[#0866C6]'
                              : isDone
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white border text-[#64778C]'
                          }`}
                        >
                          {q.number}
                        </span>
                        <span className="truncate">{q.title}</span>
                      </div>
                      {isDone && !isCurrent && (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8F3FF] mt-6">
              <button
                type="button"
                onClick={handleResetSession}
                className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Answers</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Retake / Reset Questionnaire Confirmation Modal */}
      <Modal
        isOpen={showResetConfirmModal}
        onClose={() => setShowResetConfirmModal(false)}
        title="Retake Questionnaire"
        badgeText="Fresh Reflection"
        description="Are you sure you want to retake the questionnaire? This will clear your current answers and let you start fresh from Question 1."
        actionText="Yes, Restart Questionnaire"
        onAction={executeResetSession}
        cancelText="Cancel"
        onCancel={() => setShowResetConfirmModal(false)}
      >
        <div className="mt-3 p-3.5 rounded-xl bg-[#F4F8FD] border border-[#E8F3FF] text-xs text-[#465B72]">
          <p>
            Your responses will be cleared so you can take your time to reflect anew across all 14 questions without pressure.
          </p>
        </div>
      </Modal>
    </div>
  );
}
