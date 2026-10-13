import React from 'react';
import { ArrowLeft, ArrowRight, Shield, CheckCircle2, AlertTriangle, Lock, Mail, Users, School } from 'lucide-react';
import { DeRoteWordmark } from '../components/DeRoteWordmark';
import { StudentConsentCard } from '../components/StudentConsentCard';
import { Footer } from '../components/Footer';

interface StudentConsentPageProps {
  onNavigate: (route: string) => void;
}

export const StudentConsentPage: React.FC<StudentConsentPageProps> = ({ onNavigate }) => {
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
              onClick={() => onNavigate('/signup')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#0866C6] hover:bg-[#062B50] rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <span>Student Registration</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
        <div className="mb-8 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F3FF] text-[#0866C6] text-xs font-bold mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Age-Appropriate Consent Framework</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#062B50] tracking-tight">
            Student &amp; Guardian Privacy &amp; Consent
          </h1>
          <p className="text-xs sm:text-sm text-[#64778C] mt-2 max-w-2xl">
            DeRote believes in clear, honest, and accessible transparency for students in Classes 8, 9, and 10 and their parents or legal guardians.
          </p>
        </div>

        {/* The Consent Component */}
        <div className="mb-10">
          <StudentConsentCard
            onNavigate={onNavigate}
            onConsentComplete={() => {
              onNavigate('/signup');
            }}
          />
        </div>

        {/* Backend Note Box */}
        <div className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#E8F3FF] text-left space-y-2 text-xs text-[#334E68]">
          <h3 className="font-bold text-[#062B50] text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#0866C6]" />
            Backend Architectural Roadmap for Real Data Collection
          </h3>
          <p>
            When Firebase is connected in the next phase, the following backend components must be configured to complete this privacy architecture:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#64778C]">
            <li><strong>Firebase Firestore Consent Collection:</strong> Store immutable, timestamped consent documents linked to student UID or mobile number.</li>
            <li><strong>Parent/Guardian Verification:</strong> Send OTP or digital verification to the parent&apos;s mobile number before recording minor student consent.</li>
            <li><strong>Audit Logging:</strong> Maintain non-repudiation records of policy version accepted, IP address, and timestamp.</li>
            <li><strong>Automated Data Deletion Engine:</strong> Secure Cloud Function to purge student data upon verified parental erasure requests.</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
