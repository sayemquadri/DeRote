import React from 'react';
import { ArrowLeft, FileText, AlertTriangle, Shield, CheckCircle2, Lock, HelpCircle } from 'lucide-react';
import { DeRoteWordmark } from '../components/DeRoteWordmark';
import { Footer } from '../components/Footer';

interface TermsOfUsePageProps {
  onNavigate: (route: string) => void;
}

export const TermsOfUsePage: React.FC<TermsOfUsePageProps> = ({ onNavigate }) => {
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
              onClick={() => onNavigate('/privacy')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0866C6] hover:bg-[#E8F3FF] border border-[#168FE5]/30 rounded-xl transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
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

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Draft Notice Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
              Draft Document — For DeRote Administrative & Legal Counsel Review Prior to Launch
            </p>
            <p className="text-amber-800 leading-relaxed">
              These Terms of Use govern student and guardian use of the DeRote Student Insight System. Sections enclosed in brackets <code className="bg-amber-100/80 px-1.5 py-0.5 rounded text-amber-900 font-mono text-[11px]">[LIKE THIS]</code> are business and legal placeholders that DeRote must finalize prior to commercial launch.
            </p>
          </div>
        </div>

        {/* Title Zone */}
        <div className="border-b border-[#E8F3FF] pb-6 mb-8 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F3FF] text-[#0866C6] text-xs font-bold mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Platform Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#062B50] tracking-tight">
            Terms of Use
          </h1>
          <p className="text-xs sm:text-sm text-[#64778C] mt-2 flex flex-wrap items-center gap-3">
            <span>Version: 1.0 (Pre-Launch Draft)</span>
            <span>·</span>
            <span>Classes 8, 9 & 10</span>
            <span>·</span>
            <span>Last Updated: October 2026</span>
          </p>
        </div>

        {/* Terms Body */}
        <div className="space-y-8 text-left text-sm sm:text-base leading-relaxed text-[#102C46]">
          {/* Section 1 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">1</span>
              Acceptance of Terms & Eligibility
            </h2>
            <div className="space-y-3 text-[#334E68] text-xs sm:text-sm">
              <p>
                By creating an account, accessing the questionnaire, or viewing student insights on the <strong>DeRote Student Insight System</strong> (the &quot;Platform&quot;), you agree to be bound by these Terms of Use and our accompanying Privacy Policy.
              </p>
              <p>
                <strong>Eligibility:</strong> The Platform is designed specifically for students enrolled in <strong>Classes 8, 9, and 10</strong>. Because students in these grades are minors under 18 years of age, access requires the knowledge and consent of a parent or legal guardian, or must be undertaken directly by a parent/guardian on behalf of their child.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">2</span>
              Educational Purpose & Strict Non-Medical / Non-Psychological Disclaimer
            </h2>
            <div className="space-y-3 text-[#334E68] text-xs sm:text-sm">
              <p>
                The Platform provides an educational self-reflection framework. Its primary objective is to help students reflect on their learning preferences, problem-solving habits, and academic motivation factors through guided self-reported questions.
              </p>
              <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 text-red-950 font-medium">
                <span className="font-bold text-red-700 block mb-1">IMPORTANT DISCLAIMER: STRICTLY NON-CLINICAL & NON-DIAGNOSTIC</span>
                <p className="leading-relaxed">
                  The DeRote Student Insight System is <strong>NOT a medical, psychiatric, psychological, or diagnostic tool</strong>. Under no circumstances should the questions, rubrics, scores, or insight descriptions generated by the Platform be interpreted as medical advice, psychiatric diagnosis, psychological evaluation, or assessment of mental health or special educational needs.
                </p>
                <p className="mt-2 text-xs text-red-800">
                  If a student or parent requires clinical evaluation or psychological support, they should consult licensed medical and psychological professionals. DeRote does not provide healthcare or clinical diagnostic services.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">3</span>
              Platform Management & Absence of Direct School Access
            </h2>
            <div className="space-y-3 text-[#334E68] text-xs sm:text-sm">
              <p>
                The Platform is owned, operated, and maintained directly by <strong>[DeRote Legal Entity Name]</strong>.
              </p>
              <p>
                <strong>Current Non-Involvement of Schools:</strong> Schools and school administrations are not involved in the current phase of the Platform. Schools do not have access to student accounts, digital records, or questionnaire responses.
              </p>
              <p>
                <strong>Future Institutional Deployments:</strong> In a future phase, DeRote may enter into arrangements with schools. Under such arrangements, an authorized DeRote HOD or representative may print student reports and provide them to a school in accordance with applicable permissions and agreements.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">4</span>
              Account Security & User Responsibilities
            </h2>
            <div className="space-y-3 text-[#334E68] text-xs sm:text-sm">
              <p>When using the Platform, you agree to:</p>
              <ul className="list-disc pl-5 space-y-1 text-[#334E68]">
                <li>Provide accurate, genuine, and truthful self-reflection responses.</li>
                <li>Keep your mobile number and password confidential and not share credentials with unauthorized individuals.</li>
                <li>Notify DeRote immediately if you suspect unauthorized access to your student profile.</li>
              </ul>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1 text-[#334E68]">
                <li>Impersonate another student or provide false telephone credentials.</li>
                <li>Attempt to reverse-engineer, decompile, scrape, or extract questionnaire items or proprietary algorithms.</li>
                <li>Use automated bots, crawlers, or exploits against the Platform.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">5</span>
              Intellectual Property Rights
            </h2>
            <div className="space-y-3 text-[#334E68] text-xs sm:text-sm">
              <p>
                All rights, titles, and interests in the Platform—including but not limited to the <strong>DeRote</strong> name, trademarks, logos, question bank, rubric algorithms, visual assets, text descriptions, and report formats—are the exclusive intellectual property of <strong>[DeRote Legal Entity Name]</strong>.
              </p>
              <p>
                Students and parents/guardians receive a limited, revocable, non-exclusive license to take the questionnaire, view generated insights, and print personal reports for individual educational self-reflection.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">6</span>
              Limitation of Liability & Educational Disclaimers
            </h2>
            <div className="space-y-3 text-[#334E68] text-xs sm:text-sm">
              <p>
                The Platform and its insight reports are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis for educational enrichment. DeRote makes no guarantees that questionnaire completion or insight recommendations will ensure specific academic grades, competitive examination ranks, or institutional admissions.
              </p>
              <p>
                To the maximum extent permitted by applicable law, DeRote and its officers, directors, mentors, and staff shall not be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use the Platform.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">7</span>
              Governing Law, Jurisdiction & Dispute Resolution
            </h2>
            <div className="space-y-3 text-[#334E68] text-xs sm:text-sm">
              <p>
                These Terms of Use shall be governed by and construed in accordance with the laws of <strong>[Country / Jurisdiction, e.g., India]</strong>.
              </p>
              <p>
                Any dispute, claim, or controversy arising out of or relating to these Terms or the Platform shall be subject to the exclusive jurisdiction of the competent courts located in <strong>[City, State, e.g., New Delhi, India]</strong>.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8F3FF] shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center text-xs font-extrabold">8</span>
              Contact & Inquiries
            </h2>
            <p className="text-xs sm:text-sm text-[#334E68]">
              For any legal notices, questions about these Terms, or general inquiries, please contact:
            </p>
            <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#E8F3FF] text-xs sm:text-sm text-[#062B50] space-y-1.5 font-medium mt-3">
              <p><strong>Entity:</strong> [DeRote Legal Entity Name]</p>
              <p><strong>Address:</strong> [DeRote Corporate Address]</p>
              <p><strong>Email:</strong> [legal@derote.in / privacy@derote.in / To Be Confirmed]</p>
              <p><strong>Phone:</strong> [DeRote Administrative Support Phone]</p>
            </div>
          </section>
        </div>

        {/* Action button bar */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#E8F3FF]">
          <button
            onClick={() => onNavigate('/privacy')}
            className="px-4 py-2.5 rounded-xl bg-white text-[#062B50] font-bold text-xs sm:text-sm hover:bg-[#F4F8FD] border border-[#E8F3FF] transition-colors cursor-pointer"
          >
            &larr; Read Privacy Policy
          </button>
          <button
            onClick={() => onNavigate('/contact-privacy')}
            className="px-4 py-2.5 rounded-xl bg-[#0866C6] text-white font-bold text-xs sm:text-sm hover:bg-[#062B50] transition-colors cursor-pointer shadow-xs"
          >
            Contact &amp; Privacy Requests &rarr;
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
