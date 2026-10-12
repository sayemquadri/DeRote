import React, { useState } from 'react';
import {
  Compass,
  Lightbulb,
  GitFork,
  Users,
  PlayCircle,
  HeartHandshake,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ArrowLeft,
  Printer,
  Sparkles,
  Info,
  BookOpen,
} from 'lucide-react';
import { DeRoteWordmark } from './DeRoteWordmark';
import {
  InsightCard,
  StudentInsightReport,
} from '../services/insightEngine';
import { QuestionnaireSession } from '../services/questionnaireService';
import { QUESTION_BANK, CUSTOM_OPTION_ID } from '../data/questionnaireBank';

interface StudentInsightDashboardProps {
  report: StudentInsightReport;
  session: QuestionnaireSession;
  onNavigate: (route: string) => void;
  onRetake: () => void;
}

export function StudentInsightDashboard({
  report,
  session,
  onNavigate,
  onRetake,
}: StudentInsightDashboardProps) {
  const [showAllResponses, setShowAllResponses] = useState(false);
  const [expandedCardEvidence, setExpandedCardEvidence] = useState<Record<string, boolean>>({});

  const toggleEvidence = (cardId: string) => {
    setExpandedCardEvidence((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Icon mapping
  const renderCardIcon = (iconName: InsightCard['iconName']) => {
    const iconClass = 'w-5 h-5 text-[#0866C6]';
    switch (iconName) {
      case 'Compass':
        return <Compass className={iconClass} />;
      case 'Lightbulb':
        return <Lightbulb className={iconClass} />;
      case 'GitFork':
        return <GitFork className={iconClass} />;
      case 'Users':
        return <Users className={iconClass} />;
      case 'PlayCircle':
        return <PlayCircle className={iconClass} />;
      case 'HeartHandshake':
        return <HeartHandshake className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 animate-fadeIn">
      {/* Top Identity & Action Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          type="button"
          onClick={() => onNavigate('/login')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#64778C] hover:text-[#062B50] transition-colors rounded-lg px-2.5 py-1.5 bg-white border border-[#E8F3FF] shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Student Portal</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#465B72] hover:text-[#062B50] bg-white border border-[#E8F3FF] px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Save or Print Snapshot"
          >
            <Printer className="w-3.5 h-3.5 text-[#0866C6]" />
            <span className="hidden sm:inline">Print / Save</span>
          </button>
        </div>
      </div>

      {/* Main Insight Card Container */}
      <div className="bg-white rounded-3xl border border-[#E8F3FF] shadow-lg shadow-[#062B50]/5 overflow-hidden">
        {/* Top DeRote blue accent bar */}
        <div className="h-2 bg-gradient-to-r from-[#0866C6] via-[#168FE5] to-[#42A5F5]" />

        {/* Dashboard Header Section */}
        <div className="p-6 sm:p-10 border-b border-[#F0F5FA] text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <DeRoteWordmark size="md" showDescriptor={false} />

            <div className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#E8F3FF] text-[#0866C6] self-center sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0866C6]" />
              <span>{report.studentName} · {report.classGrade}</span>
            </div>
          </div>

          <div className="max-w-2xl mt-4">
            {/* Small section label */}
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#0866C6] block mb-1">
              YOUR INSIGHT
            </span>

            {/* Main heading */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#062B50] tracking-tight">
              A little more about you.
            </h1>

            {/* Supporting text */}
            <p className="text-sm sm:text-base text-[#465B72] mt-2.5 leading-relaxed">
              Your answers offer a glimpse of what matters to you and how you approach different situations. They don't define everything you are.
            </p>
          </div>
        </div>

        {/* Insight Cards Grid: 3 or 4 Compact Cards */}
        <div className="p-6 sm:p-10 bg-[#FAFCFF]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0866C6]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#64778C]">
                Themes From Your Responses
              </h2>
            </div>
            <span className="text-xs text-[#64778C]">
              {report.cards.length} theme{report.cards.length > 1 ? 's' : ''} reflected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {report.cards.map((card) => {
              const isEvidenceExpanded = !!expandedCardEvidence[card.id];

              return (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8F3FF] shadow-xs hover:border-[#168FE5]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Card Header with Icon and Title */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F0F7FF] border border-[#E8F3FF] flex items-center justify-center shrink-0">
                        {renderCardIcon(card.iconName)}
                      </div>
                      <h3 className="text-base font-bold text-[#062B50] leading-snug">
                        {card.heading}
                      </h3>
                    </div>

                    {/* Concise Reflection Sentence */}
                    <p className="text-sm text-[#465B72] leading-relaxed mb-4">
                      {card.reflectionText}
                    </p>
                  </div>

                  {/* Traceability: Internal references to answers supporting observation */}
                  <div className="pt-3 border-t border-[#F0F5FA]">
                    <button
                      type="button"
                      onClick={() => toggleEvidence(card.id)}
                      className="w-full flex items-center justify-between text-[11px] font-semibold text-[#0866C6] hover:text-[#062B50] transition-colors py-1 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 shrink-0" />
                        <span>Based on your answers ({card.evidence.map((e) => `Q${e.questionNumber}`).join(', ')})</span>
                      </span>
                      {isEvidenceExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                      )}
                    </button>

                    {isEvidenceExpanded && (
                      <div className="mt-2.5 space-y-2 text-xs bg-[#F8FAFD] p-3 rounded-xl border border-[#E8F3FF] text-left animate-fadeIn">
                        {card.evidence.map((ev) => (
                          <div key={ev.questionId} className="space-y-1">
                            <span className="font-bold text-[#062B50] block text-[11px]">
                              Q{ev.questionNumber}: {ev.questionTitle}
                            </span>
                            <ul className="list-disc list-inside text-[11px] text-[#465B72] space-y-0.5">
                              {ev.selectedOptionTexts.map((text, idx) => (
                                <li key={idx} className="leading-tight">
                                  {text}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Philosophy Note Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-[#E8F3FF]/40 border border-[#D5E9FF] flex items-start gap-3 text-xs text-[#465B72]">
            <Info className="w-4 h-4 text-[#0866C6] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Reflect, don't judge:</strong> This snapshot is intended to help you recognise how you like to work, what environments support you, and what catches your curiosity. It does not rank, compare, or label your abilities.
            </p>
          </div>
        </div>

        {/* Review Submitted Answers Section (Original Responses Preserved) */}
        <div className="p-6 sm:p-10 border-t border-[#F0F5FA] bg-white">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base font-bold text-[#062B50]">
                Your Submitted Responses
              </h3>
              <p className="text-xs text-[#64778C] mt-0.5">
                Review each question and the exact choices you selected.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAllResponses(!showAllResponses)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0866C6] bg-[#F4F8FD] border border-[#E8F3FF] hover:bg-[#E8F3FF] px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{showAllResponses ? 'Hide Answers' : 'Review All Answers (14)'}</span>
              {showAllResponses ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {showAllResponses && (
            <div className="mt-6 space-y-4 animate-fadeIn">
              {QUESTION_BANK.map((question) => {
                const answer = session.answers[question.id];
                const selectedIds = answer?.selectedOptions || [];
                const customText = answer?.customText || '';

                return (
                  <div
                    key={question.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFD] border border-[#E8F3FF] text-left"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0866C6]">
                        Question {question.number} · {question.id}
                      </span>
                      <span className="text-[11px] text-[#64778C]">
                        {selectedIds.length > 0 ? 'Answered' : 'Skipped'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#062B50] mb-1">
                      {question.title}
                    </h4>
                    <p className="text-xs text-[#64778C] mb-3 leading-relaxed">
                      {question.prompt}
                    </p>

                    {selectedIds.length > 0 ? (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-[#465B72] block">
                          Your Selected Choice(s):
                        </span>
                        <div className="space-y-1">
                          {selectedIds.map((optId) => {
                            if (optId === CUSTOM_OPTION_ID) {
                              return (
                                <div
                                  key={optId}
                                  className="text-xs bg-white px-3 py-1.5 rounded-lg border border-[#E8F3FF] text-[#062B50] font-medium"
                                >
                                  ✍️ <em>Self-written:</em> {customText || '(Custom option selected)'}
                                </div>
                              );
                            }
                            const option = question.options.find((o) => o.id === optId);
                            return (
                              <div
                                key={optId}
                                className="text-xs bg-white px-3 py-1.5 rounded-lg border border-[#E8F3FF] text-[#062B50] font-medium flex items-center gap-2"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0866C6]" />
                                <span>{option ? option.text : optId}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs italic text-[#64778C]">
                        No option was selected for this question.
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 sm:p-8 bg-[#F4F8FD] border-t border-[#E8F3FF] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onRetake}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E8F3FF] text-xs sm:text-sm font-semibold text-[#64778C] hover:text-[#062B50] hover:bg-white/80 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0866C6] text-white text-xs sm:text-sm font-bold hover:bg-[#062B50] transition-colors shadow-xs cursor-pointer"
          >
            <span>Return to Student Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
