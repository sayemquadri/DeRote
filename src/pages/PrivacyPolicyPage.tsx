import React from 'react';
import { ArrowLeft, Shield, Mail, Lock, Users, School, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { DeRoteWordmark } from '../components/DeRoteWordmark';
import { Footer } from '../components/Footer';

interface PrivacyPolicyPageProps {
  onNavigate: (route: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#102C46]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8F3FF] px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center text-left focus-visible:outline-2 focus-visible:outline-[#0866C6] rounded-lg cursor-pointer"
            aria-label="DeRote Home"
          >
            <DeRoteWordmark showDescriptor={true} size="md" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/consent')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0866C6] hover:bg-[#E8F3FF] border border-[#168FE5]/30 rounded-xl transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Consent Notice</span>
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-[#64778C] hover:text-[#062B50] hover:bg-[#F4F8FD] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Document Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Title Zone */}
        <div className="border-b border-[#E8F3FF] pb-6 mb-8 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F3FF] text-[#0866C6] text-xs font-bold mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Student Data Protection Policy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#062B50] tracking-tight">
            DeRote Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#64778C] mt-2 flex flex-wrap items-center gap-3">
            <span>Version: 1.0 (Official Release)</span>
            <span>·</span>
            <span>Applicable to: Classes 8, 9 & 10</span>
            <span>·</span>
            <span>Effective: October 2026</span>
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 text-left text-sm sm:text-base leading-relaxed text-[#102C46]">
          {/* Section 1 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">1</span>
              Platform Operator & Scope of Operations
            </h2>
            <div className="space-y-3 text-[#334E68] text-xs sm:text-sm">
              <p>
                The <strong>DeRote Student Insight System</strong> is developed, operated, and maintained directly by <strong>[DeRote Registered Entity Legal Name, e.g., DeRote Learning Solutions Private Limited]</strong> (&quot;DeRote&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), a coaching-centre organization expanding its services online.
              </p>
              <div className="p-3.5 rounded-xl bg-[#F4F8FD] border border-[#E8F3FF] text-[#062B50] font-medium">
                <strong>Direct Management Notice:</strong> DeRote directly manages the platform and its data. School institutions are not involved in the current phase of the platform. Schools do not have direct access to student accounts, questionnaires, or student profiles.
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">2</span>
              Intended Educational Purpose & Explicit Non-Clinical Disclaimer
            </h2>
            <div className="space-y-3 text-[#334E68] text-xs sm:text-sm">
              <p>
                The platform is designed exclusively for students enrolled in <strong>Classes 8, 9, and 10</strong> to help them reflect on their personal study preferences, problem-solving tendencies, motivations, and future academic interests through a structured self-reflective questionnaire.
              </p>
              <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 text-red-950 font-medium">
                <span className="font-bold text-red-700 block mb-1">STRICT DISCLAIMER: NOT A MEDICAL OR PSYCHOLOGICAL TOOL</span>
                The DeRote Student Insight System is <strong>strictly an educational self-reflection aid</strong>. It is <strong>NOT</strong> a medical, psychiatric, psychological, diagnostic, or clinical assessment tool. It does not diagnose learning disabilities, mental health conditions, personality disorders, or medical needs. Questionnaire responses and generated insights are intended purely to stimulate positive self-awareness and constructive guidance between students, parents/guardians, and DeRote mentors.
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">3</span>
              Information We Collect & Why
            </h2>
            <p className="text-xs sm:text-sm text-[#334E68] mb-3">
              We collect only the minimal information strictly necessary to provide the student reflection experience:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#E8F3FF]">
                <strong className="text-[#062B50] block mb-1 font-bold">Student Full Name</strong>
                <p className="text-[#64778C]">Used to personalize the reflection report and address the student during mentorship sessions.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#E8F3FF]">
                <strong className="text-[#062B50] block mb-1 font-bold">Class / Grade (Classes 8, 9, 10)</strong>
                <p className="text-[#64778C]">Used to contextualize developmental stage and calibrate age-appropriate insight rubrics.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#E8F3FF]">
                <strong className="text-[#062B50] block mb-1 font-bold">School Name</strong>
                <p className="text-[#64778C]">Self-reported institution name used for cohort context and future institutional reporting arrangements.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#E8F3FF]">
                <strong className="text-[#062B50] block mb-1 font-bold">Mobile Number & Password</strong>
                <p className="text-[#64778C]">Used solely for student account identification, authentication, and session retrieval.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#E8F3FF] md:col-span-2">
                <strong className="text-[#062B50] block mb-1 font-bold">Questionnaire Responses & Generated Reports</strong>
                <p className="text-[#64778C]">Answers provided across 14 reflection items, including study approach, focus style, group interaction preferences, and motivation factors. Synthesized into reflective dimension profiles.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">4</span>
              How Information and Reports Are Used
            </h2>
            <div className="space-y-3 text-[#334E68] text-xs sm:text-sm">
              <p>Student information and generated reports are used exclusively for:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#334E68]">
                <li>Generating the student&apos;s personal reflective insight dashboard and summary report.</li>
                <li>Assisting authorized DeRote mentors and counselors in offering relevant study guidance.</li>
                <li>Helping students and their parents/guardians initiate productive discussions regarding learning preferences.</li>
              </ul>
              <div className="p-3.5 rounded-xl bg-[#E8F3FF]/60 border border-[#168FE5]/30 text-[#062B50] font-medium">
                <strong>What We Do NOT Do:</strong> We do not sell, rent, commercialize, or trade student personal data. We do not use student data for third-party targeted behavioral advertising. We do not score students for formal academic grades or school rankings.
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">5</span>
              Who May Access Student Information
            </h2>
            <div className="space-y-3 text-[#334E68] text-xs sm:text-sm">
              <p>Access to student records is strictly restricted to:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#F8FAFD] border border-[#E8F3FF]">
                  <strong className="text-[#062B50] block font-bold">1. Authorized DeRote Mentors &amp; Administrators</strong>
                  <p className="text-[#64778C] text-xs mt-1">Designated academic staff and administrators who conduct review sessions or provide coaching guidance.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFD] border border-[#E8F3FF]">
                  <strong className="text-[#062B50] block font-bold">2. System Administrators</strong>
                  <p className="text-[#64778C] text-xs mt-1">Authorized technical personnel responsible for system integrity, security maintenance, and bug fixes.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">6</span>
              School Arrangements: Current Status & Future Institutional Phase
            </h2>
            <div className="space-y-3 text-[#334E68] text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-medium">
                <strong>Current Phase:</strong> Schools do not have logins, administrative access, database credentials, or direct visibility into student data on this platform.
              </div>
              <p>
                <strong>Future Institutional Deployment:</strong> In a future phase, DeRote may partner with recognized school institutions. Under such future arrangements:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#334E68]">
                <li>An authorized DeRote admin or representative may print student insight reports and provide them to the school.</li>
                <li>Such sharing will only take place under formal institutional agreements and applicable student/guardian permissions.</li>
                <li>Schools will not receive unmonitored digital access without prior notice and valid operational agreements.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">7</span>
              Minors & Parent/Guardian Consent Pathways
            </h2>
            <div className="space-y-3 text-[#334E68] text-xs sm:text-sm">
              <p>
                Students participating in the DeRote Student Insight System are typically in Classes 8, 9, or 10 and are minors under 18 years of age.
              </p>
              <p>
                Because student checkboxes alone do not satisfy all applicable legal criteria for minors, DeRote requires that students undertake this questionnaire with the knowledge and consent of their parent or legal guardian. DeRote provides a dedicated Parent/Guardian consent pathway on the registration and consent screens.
              </p>
              <p>
                Parents and legal guardians retain the absolute right at all times to review their child&apos;s information, request amendments, or demand complete deletion of their child&apos;s records.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">8</span>
              Data Retention, Storage & Record Protection
            </h2>
            <div className="space-y-3 text-[#334E68] text-xs sm:text-sm">
              <p>
                Student responses and reflection profiles are retained to support student self-review, school cohort synthesis, and guidance continuity:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#334E68]">
                <li>Student profiles and questionnaire results are retained for the active academic cycle corresponding to Classes 8 through 10, or up to <strong>24 months</strong> following questionnaire completion, after which records are archived or securely purged.</li>
                <li>Consent records are stored with audit trails for regulatory compliance verification.</li>
              </ul>
            </div>
          </section>

          {/* Section 9 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">9</span>
              Your Rights: Access, Correction & Deletion Requests
            </h2>
            <div className="space-y-3 text-[#334E68] text-xs sm:text-sm">
              <p>
                Students and their parents/guardians possess the following rights regarding their personal data:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#334E68]">
                <li><strong>Right of Access:</strong> Request a copy of all information held by DeRote concerning the student.</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate names, school names, or contact details.</li>
                <li><strong>Right to Erasure (Deletion):</strong> Request that DeRote permanently delete the student account, answers, and generated insight reports.</li>
                <li><strong>Right to Withdraw Consent:</strong> Revoke consent at any time, halting any further processing or report printing.</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-[#E8F3FF]">
                <button
                  type="button"
                  onClick={() => onNavigate('/contact-privacy')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0866C6] text-white font-bold text-xs sm:text-sm hover:bg-[#062B50] transition-colors cursor-pointer shadow-xs"
                >
                  <Mail className="w-4 h-4" />
                  <span>Submit a Privacy or Deletion Request</span>
                </button>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">10</span>
              Contact Information & Grievance Redressal
            </h2>
            <p className="text-xs sm:text-sm text-[#334E68] mb-3">
              For any questions, requests, complaints, or feedback regarding student privacy, please contact the DeRote Privacy Officer:
            </p>
            <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#E8F3FF] space-y-2 text-xs sm:text-sm font-medium text-[#062B50]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-[#E8F3FF]">
                <span className="text-[#64778C]">Operating Entity:</span>
                <span className="font-bold text-[#062B50]">DeRote Education Technologies Private Limited</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-[#E8F3FF]">
                <span className="text-[#64778C]">Registered Office Address:</span>
                <span className="font-bold text-[#062B50]">Hyderabad, Telangana, India</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-[#E8F3FF]">
                <span className="text-[#64778C]">Grievance Officer:</span>
                <span className="font-bold text-[#062B50]">Grievance Redressal Officer, DeRote</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-[#E8F3FF]">
                <span className="text-[#64778C]">Dedicated Privacy Email:</span>
                <span className="font-bold text-[#0866C6]">contact@derote.in</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1">
                <span className="text-[#64778C]">Support Helpline:</span>
                <span className="font-bold text-[#062B50]">Assistance available via contact@derote.in</span>
              </div>
            </div>
            <p className="text-xs text-[#64778C] mt-3">
              We endeavor to acknowledge privacy requests within <strong>48 hours</strong> and conclude formal resolution within <strong>30 days</strong>.
            </p>
          </section>
        </div>

        {/* Action button bar */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#E8F3FF]">
          <button
            onClick={() => onNavigate('/consent')}
            className="px-4 py-2.5 rounded-xl bg-[#E8F3FF] text-[#0866C6] font-bold text-xs sm:text-sm hover:bg-[#168FE5]/20 border border-[#168FE5]/30 transition-colors cursor-pointer"
          >
            Review Student Consent &amp; Privacy
          </button>
          <button
            onClick={() => onNavigate('/terms')}
            className="px-4 py-2.5 rounded-xl bg-white text-[#062B50] font-bold text-xs sm:text-sm hover:bg-[#F4F8FD] border border-[#E8F3FF] transition-colors cursor-pointer"
          >
            Read Terms of Use &rarr;
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
