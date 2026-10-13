import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  Users,
  School,
  Lock,
  Mail,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export interface ConsentFormData {
  consentPathway: 'student_with_guardian' | 'guardian_direct';
  guardianName: string;
  guardianPhone: string;
  agreedToPurpose: boolean;
  agreedToNoSchoolAccess: boolean;
  agreedToDeRoteAccessAndFuturePrinting: boolean;
  agreedToGuardianConsent: boolean;
}

interface StudentConsentCardProps {
  onConsentComplete?: (data: ConsentFormData) => void;
  onNavigate: (route: string) => void;
  compact?: boolean;
}

export const StudentConsentCard: React.FC<StudentConsentCardProps> = ({
  onConsentComplete,
  onNavigate,
  compact = false,
}) => {
  const [pathway, setPathway] = useState<'student_with_guardian' | 'guardian_direct'>('student_with_guardian');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');

  // Checkbox acknowledgements (not just a single unchecked box)
  const [ackPurpose, setAckPurpose] = useState(false);
  const [ackNoSchoolAccess, setAckNoSchoolAccess] = useState(false);
  const [ackDeRoteAccess, setAckDeRoteAccess] = useState(false);
  const [ackGuardian, setAckGuardian] = useState(false);

  // Expandable details section
  const [showFullNotice, setShowFullNotice] = useState(!compact);
  const [validationError, setValidationError] = useState('');

  const allChecked = ackPurpose && ackNoSchoolAccess && ackDeRoteAccess && ackGuardian;
  const guardianFieldsValid = pathway === 'guardian_direct' ? (guardianName.trim().length > 0 && guardianPhone.trim().length >= 10) : true;

  const handleProceed = () => {
    setValidationError('');

    if (!allChecked) {
      setValidationError('Please review and check all four acknowledgement points below to proceed.');
      return;
    }

    if (pathway === 'guardian_direct' && !guardianFieldsValid) {
      setValidationError('Please provide the parent or guardian full name and a valid 10-digit mobile number.');
      return;
    }

    if (onConsentComplete) {
      onConsentComplete({
        consentPathway: pathway,
        guardianName: guardianName.trim(),
        guardianPhone: guardianPhone.trim(),
        agreedToPurpose: ackPurpose,
        agreedToNoSchoolAccess: ackNoSchoolAccess,
        agreedToDeRoteAccessAndFuturePrinting: ackDeRoteAccess,
        agreedToGuardianConsent: ackGuardian,
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E8F3FF] shadow-xl shadow-[#062B50]/5 overflow-hidden text-left">
      {/* Header Badge & Title */}
      <div className="bg-gradient-to-r from-[#062B50] to-[#0866C6] text-white p-5 sm:p-7">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold mb-2.5">
          <Shield className="w-3.5 h-3.5 text-[#E8F3FF]" />
          <span>Student &amp; Guardian Privacy Notice</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          How DeRote Protects Student Data
        </h2>
        <p className="text-xs sm:text-sm text-[#E8F3FF]/90 mt-1.5 leading-relaxed max-w-xl">
          Designed for students in Classes 8, 9, and 10 and their parents/guardians. Please read how your information is handled before proceeding.
        </p>
      </div>

      {/* Backend Status Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-5 sm:px-7 py-3 text-amber-900 text-xs flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
            Preview Architecture Notice (Firebase Disconnected)
          </p>
          <p className="text-amber-800 leading-snug">
            Firebase is not connected in this phase. This interface demonstrates the student and guardian consent flow. In production, legally adequate consent records will be cryptographically logged to Firebase Firestore with verified timestamps and parent/guardian audit trails.
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* The 8 Core DeRote Privacy Principles */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0866C6] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>What You Need to Know (8 Key Principles)</span>
            </h3>
            {compact && (
              <button
                type="button"
                onClick={() => setShowFullNotice(!showFullNotice)}
                className="text-xs font-bold text-[#0866C6] hover:text-[#062B50] flex items-center gap-1 cursor-pointer"
              >
                <span>{showFullNotice ? 'Collapse Details' : 'Expand Details'}</span>
                {showFullNotice ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>

          {showFullNotice && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-[#334E68]">
              {/* Item 1 */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E8F3FF]">
                <div className="flex items-center gap-2 mb-1 text-[#062B50] font-bold">
                  <span className="w-5 h-5 rounded-full bg-[#0866C6] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>DeRote Operates &amp; Manages the Platform</span>
                </div>
                <p>
                  DeRote is an educational coaching organization expanding online services. DeRote manages this platform and its data directly.
                </p>
              </div>

              {/* Item 2 */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E8F3FF]">
                <div className="flex items-center gap-2 mb-1 text-[#062B50] font-bold">
                  <span className="w-5 h-5 rounded-full bg-[#0866C6] text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Educational Self-Reflection (Not Clinical)</span>
                </div>
                <p>
                  The platform helps students reflect on learning habits and preferences. It is <strong>NOT a medical, psychological, or diagnostic tool</strong>.
                </p>
              </div>

              {/* Item 3 */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E8F3FF]">
                <div className="flex items-center gap-2 mb-1 text-[#062B50] font-bold">
                  <span className="w-5 h-5 rounded-full bg-[#0866C6] text-white flex items-center justify-center text-[10px]">3</span>
                  <span>What We Collect &amp; Why</span>
                </div>
                <p>
                  We collect student name, class (8, 9, 10), school name, mobile number for login, and questionnaire choices to generate your personal reflection report.
                </p>
              </div>

              {/* Item 4 */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E8F3FF]">
                <div className="flex items-center gap-2 mb-1 text-[#062B50] font-bold">
                  <span className="w-5 h-5 rounded-full bg-[#0866C6] text-white flex items-center justify-center text-[10px]">4</span>
                  <span>How Reports Are Used</span>
                </div>
                <p>
                  Reports provide personalized study insights and discussion starters for mentors. Data is never sold, traded, or used for advertising.
                </p>
              </div>

              {/* Item 5 */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E8F3FF]">
                <div className="flex items-center gap-2 mb-1 text-[#062B50] font-bold">
                  <span className="w-5 h-5 rounded-full bg-[#0866C6] text-white flex items-center justify-center text-[10px]">5</span>
                  <span>Authorised Personnel Access Only</span>
                </div>
                <p>
                  Only designated DeRote mentors, academic counselors, HODs, and administrators may access student profile records.
                </p>
              </div>

              {/* Item 6 */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center gap-2 mb-1 text-amber-950 font-bold">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">6</span>
                  <span>Schools Do Not Have Direct Access</span>
                </div>
                <p className="text-amber-900">
                  Schools are not involved in this current phase and have no platform logins or access to student accounts.
                </p>
              </div>

              {/* Item 7 */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E8F3FF]">
                <div className="flex items-center gap-2 mb-1 text-[#062B50] font-bold">
                  <span className="w-5 h-5 rounded-full bg-[#0866C6] text-white flex items-center justify-center text-[10px]">7</span>
                  <span>Future School Printing Notice</span>
                </div>
                <p>
                  In a future school deployment phase, an authorized DeRote HOD may print student reports to share with a school under applicable agreements.
                </p>
              </div>

              {/* Item 8 */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E8F3FF]">
                <div className="flex items-center gap-2 mb-1 text-[#062B50] font-bold">
                  <span className="w-5 h-5 rounded-full bg-[#0866C6] text-white flex items-center justify-center text-[10px]">8</span>
                  <span>Contact &amp; Privacy Requests</span>
                </div>
                <p>
                  Students and guardians can request data copies, corrections, or complete deletion anytime via our Contact &amp; Privacy Requests page.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Age-Appropriate Pathway Selection */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F8FD] border border-[#E8F3FF]">
          <label className="block text-xs font-bold text-[#062B50] uppercase tracking-wider mb-2">
            Select Your Consent Pathway (Minors Under 18)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setPathway('student_with_guardian')}
              className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                pathway === 'student_with_guardian'
                  ? 'bg-white border-[#0866C6] ring-2 ring-[#0866C6]/20 shadow-xs'
                  : 'bg-white/60 border-[#E8F3FF] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  pathway === 'student_with_guardian' ? 'border-[#0866C6] bg-[#0866C6]' : 'border-[#64778C]'
                }`}>
                  {pathway === 'student_with_guardian' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                <span className="font-bold text-xs sm:text-sm text-[#062B50]">Student Pathway</span>
              </div>
              <p className="text-[11px] text-[#64778C] mt-1 pl-6">
                I am a student in Class 8, 9, or 10. My parent/guardian knows about and approves my participation.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPathway('guardian_direct')}
              className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                pathway === 'guardian_direct'
                  ? 'bg-white border-[#0866C6] ring-2 ring-[#0866C6]/20 shadow-xs'
                  : 'bg-white/60 border-[#E8F3FF] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  pathway === 'guardian_direct' ? 'border-[#0866C6] bg-[#0866C6]' : 'border-[#64778C]'
                }`}>
                  {pathway === 'guardian_direct' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                <span className="font-bold text-xs sm:text-sm text-[#062B50]">Parent / Guardian Pathway</span>
              </div>
              <p className="text-[11px] text-[#64778C] mt-1 pl-6">
                I am a parent or legal guardian registering and providing consent on behalf of my child.
              </p>
            </button>
          </div>

          {/* Additional Parent Details if Guardian Pathway */}
          {pathway === 'guardian_direct' && (
            <div className="mt-4 pt-4 border-t border-[#E8F3FF] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#062B50] mb-1">
                  Parent / Guardian Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#062B50]/15 bg-white text-xs sm:text-sm outline-none focus:border-[#0866C6]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#062B50] mb-1">
                  Guardian Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value.replace(/[^\d]/g, ''))}
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#062B50]/15 bg-white text-xs sm:text-sm outline-none focus:border-[#0866C6]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Clear, Honest Checklist Acknowledgements */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-[#062B50] uppercase tracking-wider">
            Mandatory Acknowledgements
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E8F3FF] hover:bg-[#F8FAFD] cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={ackPurpose}
              onChange={(e) => setAckPurpose(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#0866C6] border-[#062B50]/20 focus:ring-[#0866C6] cursor-pointer"
            />
            <span className="text-xs text-[#334E68] leading-snug">
              <strong>Educational Purpose:</strong> I understand that DeRote operates this platform for self-reflection and that it is <strong>not a medical, psychological, or diagnostic tool</strong>.
            </span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E8F3FF] hover:bg-[#F8FAFD] cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={ackNoSchoolAccess}
              onChange={(e) => setAckNoSchoolAccess(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#0866C6] border-[#062B50]/20 focus:ring-[#0866C6] cursor-pointer"
            />
            <span className="text-xs text-[#334E68] leading-snug">
              <strong>Direct DeRote Management:</strong> I understand that schools do not currently have direct access to student accounts or data.
            </span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E8F3FF] hover:bg-[#F8FAFD] cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={ackDeRoteAccess}
              onChange={(e) => setAckDeRoteAccess(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#0866C6] border-[#062B50]/20 focus:ring-[#0866C6] cursor-pointer"
            />
            <span className="text-xs text-[#334E68] leading-snug">
              <strong>Authorised Access &amp; Future Printing:</strong> I understand that authorized DeRote personnel (mentors, HODs) may access data, and in a future school deployment, reports may be printed under applicable permissions.
            </span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E8F3FF] hover:bg-[#F8FAFD] cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={ackGuardian}
              onChange={(e) => setAckGuardian(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#0866C6] border-[#062B50]/20 focus:ring-[#0866C6] cursor-pointer"
            />
            <span className="text-xs text-[#334E68] leading-snug">
              <strong>Guardian Awareness &amp; Rights:</strong> I confirm {pathway === 'guardian_direct' ? 'I am the parent/guardian providing lawful consent' : 'parent/guardian awareness and consent for this minor student'}, and note that we can request data deletion or contact DeRote at any time.
            </span>
          </label>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {onConsentComplete ? (
            <button
              type="button"
              onClick={handleProceed}
              disabled={!allChecked}
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

          {/* Quick links to full policies */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#0866C6] pt-1">
            <button
              type="button"
              onClick={() => onNavigate('/privacy')}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Read Full Privacy Policy</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <span className="text-[#64778C]/40">·</span>
            <button
              type="button"
              onClick={() => onNavigate('/terms')}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Read Terms of Use</span>
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
