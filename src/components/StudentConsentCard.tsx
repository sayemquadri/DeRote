import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  Users,
  School,
  Lock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  FileText,
  Sparkles,
} from 'lucide-react';

export interface ConsentFormData {
  agreedToStudentConsent: boolean;
  timestamp: string;
}

interface StudentConsentCardProps {
  onConsentComplete?: (data: ConsentFormData) => void;
  onNavigate: (route: string) => void;
  compact?: boolean;
}

interface PolicyAccordionItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  details: string[];
  linkRoute?: string;
  linkLabel?: string;
}

const POLICY_ITEMS: PolicyAccordionItem[] = [
  {
    id: 'purpose',
    title: 'Educational Self-Reflection (Not Clinical)',
    icon: BookOpen,
    summary:
      'DeRote reflects your learning preferences and interests — it is never a test, personality ranking, or psychological diagnosis.',
    details: [
      'The DeRote Student Insight System exists exclusively to help students understand their learning habits and preferences. It does NOT evaluate, diagnose, or treat any psychological, cognitive, psychiatric, or mental health conditions.',
      "Our guiding philosophy is \"Reflect, don't judge\". Answers reflect reported preferences to support thoughtful mentor guidance and positive self-awareness.",
    ],
    linkRoute: '/privacy',
    linkLabel: 'Read Full Privacy Policy',
  },
  {
    id: 'management',
    title: 'Direct DeRote Platform & School Access',
    icon: School,
    summary:
      'DeRote operates and manages this platform directly, and schools have no platform logins or access to student accounts.',
    details: [
      'DeRote is an educational coaching organization expanding online services and directly oversees all platform operations, data security, and student profiles.',
      'School institutions are not involved in this current phase and have no access to student questionnaire responses, account credentials, or student dashboards.',
    ],
  },
  {
    id: 'mentors',
    title: 'Authorised Mentors & Future School Reports',
    icon: Users,
    summary:
      'Only designated DeRote mentors review reflections, and printed reports may be shared with schools in future phases under agreements.',
    details: [
      'Only authorized DeRote mentors, academic counselors, HODs, and administrators can access student reflection reports to offer personalized guidance.',
      'Student data is strictly confidential and is never sold, traded, or used for commercial advertising.',
      'In a future school deployment phase, authorized staff may print physical report snapshots to share with participating schools under formal institutional agreements.',
    ],
  },
  {
    id: 'terms',
    title: 'Terms of Use & Student Conduct',
    icon: FileText,
    summary:
      'You agree to provide authentic responses, keep your password secure, and use the platform solely for personal educational reflection.',
    details: [
      'Students receive a personal, non-exclusive license to take the questionnaire, view insight dashboards, and print their own reflection summaries.',
      'You are responsible for maintaining the confidentiality of your mobile number and password, and using the platform respectfully and constructively.',
    ],
    linkRoute: '/terms',
    linkLabel: 'Read Terms of Use',
  },
  {
    id: 'privacy',
    title: 'Privacy Rights & Erasure Requests',
    icon: Lock,
    summary:
      'You can review your submitted responses at any time and request data correction or permanent deletion whenever you wish.',
    details: [
      'Students have the right to access their submitted data, review questionnaire answers, request corrections, or demand complete erasure of their account and responses.',
      'Privacy and data erasure requests can be submitted anytime through our Contact & Privacy Requests page.',
    ],
    linkRoute: '/contact-privacy',
    linkLabel: 'Privacy & Deletion Requests',
  },
];

export const StudentConsentCard: React.FC<StudentConsentCardProps> = ({
  onConsentComplete,
  onNavigate,
  compact = false,
}) => {
  // Accordion open/close state per item
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Single consent confirmation checkbox
  const [agreedToConsent, setAgreedToConsent] = useState(false);
  const [validationError, setValidationError] = useState('');

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggleAll = (expand: boolean) => {
    const newState: Record<string, boolean> = {};
    POLICY_ITEMS.forEach((item) => {
      newState[item.id] = expand;
    });
    setExpandedItems(newState);
  };

  const isAnyExpanded = Object.values(expandedItems).some(Boolean);

  const handleProceed = () => {
    setValidationError('');

    if (!agreedToConsent) {
      setValidationError('Please review and check the student consent box below to continue.');
      return;
    }

    if (onConsentComplete) {
      onConsentComplete({
        agreedToStudentConsent: true,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E8F3FF] shadow-xl shadow-[#062B50]/5 overflow-hidden text-left">
      {/* Header Badge & Title */}
      <div className="bg-gradient-to-r from-[#062B50] to-[#0866C6] text-white p-5 sm:px-7 sm:py-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold mb-2">
          <Shield className="w-3.5 h-3.5 text-[#E8F3FF]" />
          <span>Student Privacy &amp; Consent</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          How DeRote Protects Your Privacy
        </h2>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Simplified Accordion Section Header */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0866C6] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Key Principles &amp; Policies</span>
            </h3>

            <button
              type="button"
              onClick={() => handleToggleAll(!isAnyExpanded)}
              className="text-xs font-bold text-[#0866C6] hover:text-[#062B50] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{isAnyExpanded ? 'Collapse All' : 'Expand All'}</span>
              {isAnyExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Clean Accordion Cards */}
          <div className="space-y-2.5">
            {POLICY_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const isExpanded = !!expandedItems[item.id];

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#E8F3FF] bg-[#F8FAFD] hover:border-[#168FE5]/30 transition-all overflow-hidden"
                >
                  {/* Card Header: Clean Single-Line Row */}
                  <div
                    onClick={() => toggleItem(item.id)}
                    className="p-3 sm:p-3.5 cursor-pointer flex items-center justify-between gap-3 group select-none"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleItem(item.id);
                      }
                    }}
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center shrink-0 group-hover:bg-[#0866C6] group-hover:text-white transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>

                      <div className="min-w-0 flex-1 flex items-center gap-2">
                        <span className="text-[11px] font-extrabold text-[#0866C6] shrink-0">
                          0{index + 1}
                        </span>
                        <span className="text-xs sm:text-[13px] font-bold text-[#062B50] truncate sm:whitespace-normal">
                          {item.title}
                        </span>
                      </div>
                    </div>

                    {/* Small Expand Toggle */}
                    <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-[#0866C6] group-hover:text-[#062B50] pl-2">
                      <span className="hidden sm:inline">{isExpanded ? 'Hide' : 'Details'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Expandable Details Container */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2.5 border-t border-[#E8F3FF]/80 bg-white space-y-2 text-xs text-[#334E68] leading-relaxed">
                      <p className="font-semibold text-[#062B50]">
                        {item.summary}
                      </p>
                      {item.details.map((detail, idx) => (
                        <p key={idx}>{detail}</p>
                      ))}

                      {item.linkRoute && item.linkLabel && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate(item.linkRoute!);
                            }}
                            className="inline-flex items-center gap-1 font-bold text-[#0866C6] hover:text-[#062B50] hover:underline cursor-pointer"
                          >
                            <span>{item.linkLabel}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Unified Student Consent Confirmation (Single Checkbox) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#E8F3FF]/60 border border-[#168FE5]/25 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0866C6] shrink-0" />
            <h3 className="text-xs font-bold text-[#062B50] uppercase tracking-wider">
              Student Consent Confirmation
            </h3>
          </div>

          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#168FE5]/20 hover:border-[#0866C6] cursor-pointer transition-colors shadow-xs">
            <input
              type="checkbox"
              checked={agreedToConsent}
              onChange={(e) => {
                setAgreedToConsent(e.target.checked);
                if (validationError) setValidationError('');
              }}
              className="mt-0.5 w-4 h-4 rounded text-[#0866C6] border-[#062B50]/20 focus:ring-[#0866C6] cursor-pointer shrink-0"
            />
            <span className="text-xs text-[#102C46] leading-relaxed">
              <strong>I agree to participate in DeRote student self-reflection.</strong> I understand that this is an educational tool to explore my learning preferences (not a medical or psychological diagnosis), and I agree to the platform Privacy Policy and Terms of Use.
            </span>
          </label>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          {onConsentComplete ? (
            <button
              type="button"
              onClick={handleProceed}
              disabled={!agreedToConsent}
              className="w-full min-h-[50px] rounded-xl bg-[#0866C6] text-white font-bold text-sm hover:bg-[#062B50] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Consent &amp; Continue to Profile</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="w-full min-h-[50px] rounded-xl bg-[#0866C6] text-white font-bold text-sm hover:bg-[#062B50] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Proceed to Student Registration</span>
            </button>
          )}

          {/* Quick Links to Legal Documents */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#0866C6] pt-1">
            <button
              type="button"
              onClick={() => onNavigate('/privacy')}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Full Privacy Policy</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <span className="text-[#64778C]/40">·</span>
            <button
              type="button"
              onClick={() => onNavigate('/terms')}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Terms of Use</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <span className="text-[#64778C]/40">·</span>
            <button
              type="button"
              onClick={() => onNavigate('/contact-privacy')}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Privacy Requests</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
