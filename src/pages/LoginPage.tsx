import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  AlertCircle,
  Info,
  Lock,
  CheckCircle2,
  LogOut,
  Sparkles,
  User,
  GraduationCap,
  BookOpen,
  Award,
  ChevronRight,
  RefreshCw,
  Shield,
} from 'lucide-react';
import { DeRoteWordmark } from '../components/DeRoteWordmark';
import { Modal } from '../components/Modal';
import {
  loginLocalStudent,
  loginAsDemoStudent,
  signOutLocalStudent,
  onLocalAuthChange,
  DEMO_STUDENT_ROSTER,
  LocalStudentAccount,
  isValidIndianMobile,
} from '../services/localAuth';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState<string | null>(null);

  // Active student state
  const [activeStudent, setActiveStudent] = useState<LocalStudentAccount | null>(null);

  // Field validation errors
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Status banner / general alert
  const [formAlert, setFormAlert] = useState<{
    type: 'error' | 'info' | 'success';
    message: string;
  } | null>(null);

  // Forgot password modal
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Selected persona tab in demo selector
  const [selectedDemoId, setSelectedDemoId] = useState<string>('demo_aarav_10');

  // Subscribe to local auth state
  useEffect(() => {
    const unsub = onLocalAuthChange((student) => {
      setActiveStudent(student);
    });
    return () => unsub();
  }, []);

  // 1-Click Demo Login handler
  const handleDemoSignIn = (studentId: string = selectedDemoId) => {
    setIsDemoLoading(studentId);
    setFormAlert(null);

    setTimeout(() => {
      const student = loginAsDemoStudent(studentId);
      setIsDemoLoading(null);
      setFormAlert({
        type: 'success',
        message: `Welcome, ${student.fullName}! Starting your questionnaire assessment...`,
      });
      // Redirect directly to the questions assessment
      setTimeout(() => {
        onNavigate('/questionnaire');
      }, 400);
    }, 200);
  };

  // Pre-fill credentials into the input fields for realistic demonstration
  const handleAutoFillDemo = (student: LocalStudentAccount) => {
    setMobileNumber(student.phone);
    setPassword(student.password || 'demo123');
    setMobileError(null);
    setPasswordError(null);
    setFormAlert({
      type: 'info',
      message: `Populated credentials for ${student.fullName} (${student.classGrade}). Click "Sign in with Mobile" below to continue.`,
    });
  };

  // Sign out handler
  const handleSignOut = () => {
    signOutLocalStudent();
    setActiveStudent(null);
    setFormAlert({
      type: 'info',
      message: 'Signed out successfully.',
    });
  };

  // Clean real-time input handling for Indian phone number
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const filtered = raw.replace(/[^\d\s\-]/g, '');
    setMobileNumber(filtered);
    if (mobileError) setMobileError(null);
    if (formAlert) setFormAlert(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError(null);
    if (formAlert) setFormAlert(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasErrors = false;
    setFormAlert(null);

    // Validate mobile number
    if (!mobileNumber.trim()) {
      setMobileError('Please enter your mobile number.');
      hasErrors = true;
    } else if (!isValidIndianMobile(mobileNumber)) {
      setMobileError('Please enter a valid 10-digit Indian mobile number.');
      hasErrors = true;
    } else {
      setMobileError(null);
    }

    // Validate password
    if (!password) {
      setPasswordError('Please enter your password.');
      hasErrors = true;
    } else {
      setPasswordError(null);
    }

    if (hasErrors) {
      return;
    }

    setIsLoading(true);

    try {
      const result = loginLocalStudent(mobileNumber, password);

      if (!result.success) {
        setFormAlert({
          type: 'error',
          message: result.error || 'Invalid mobile number or password.',
        });
      } else {
        setFormAlert({
          type: 'success',
          message: `Signed in successfully as ${result.student?.fullName}! Starting questions...`,
        });
        setTimeout(() => {
          onNavigate('/questionnaire');
        }, 500);
      }
    } catch {
      setFormAlert({
        type: 'error',
        message: 'A local authentication error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FD] flex flex-col justify-between text-[#102C46]">
      {/* Top Header / Return Navigation */}
      <header className="w-full bg-white border-b border-[#E8F3FF] py-3.5 px-4 sm:px-6">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#64778C] hover:text-[#062B50] transition-colors focus-visible:outline-2 focus-visible:outline-[#0866C6] rounded-md px-1.5 py-1 -ml-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Back to Home</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="focus-visible:outline-2 focus-visible:outline-[#0866C6] rounded-md cursor-pointer"
            aria-label="DeRote Home"
          >
            <DeRoteWordmark size="sm" showDescriptor={false} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[480px]">
          {/* Card Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8F3FF] shadow-xl shadow-[#062B50]/5">
            {/* Header */}
            <div className="mb-6 text-left">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-[#0866C6] mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#168FE5]" />
                Student Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#062B50]">
                Welcome back.
              </h1>
              <p className="text-sm sm:text-[15px] text-[#64778C] mt-1.5">
                Sign in to continue your reflection journey and review insights.
              </p>
            </div>

            {/* Active Student Card */}
            {activeStudent ? (
              <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#E8F3FF] to-white border border-[#168FE5]/30 shadow-xs text-left">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#0866C6] text-white flex items-center justify-center font-extrabold text-base sm:text-lg shadow-sm shrink-0">
                      {activeStudent.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm sm:text-base font-extrabold text-[#062B50] break-words">
                          {activeStudent.fullName}
                        </span>
                        {activeStudent.isDemo && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#168FE5]/20 text-[#0866C6] whitespace-nowrap shrink-0">
                            Demo Student
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#64778C] mt-0.5 break-words font-medium">
                        {activeStudent.classGrade}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="p-1.5 sm:p-2 rounded-xl text-[#64778C] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                {/* Profile Details for signed-in student */}
                <div className="mt-3.5 pt-3 border-t border-[#168FE5]/20 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="min-w-0 flex-1">
                      <span className="text-[#64778C] block text-[11px] font-medium">Enrolled School</span>
                      <span className="font-bold text-[#062B50] break-words text-xs leading-snug">
                        {activeStudent.schoolName}
                      </span>
                    </div>
                    <div className="shrink-0 flex items-center justify-between sm:block pt-1 sm:pt-0 border-t sm:border-0 border-[#168FE5]/10">
                      <span className="text-[#64778C] block text-[11px] font-medium">Questionnaire</span>
                      <span className="font-bold text-[#0866C6] text-xs whitespace-nowrap">
                        14 Reflections
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions for Signed-in Student */}
                <div className="mt-4 pt-3 border-t border-[#168FE5]/20 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('/prototype')}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0866C6] text-white font-bold text-xs sm:text-sm hover:bg-[#062B50] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs text-center"
                  >
                    <span>Launch Questionnaire Assessment</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('/')}
                    className="w-full min-h-[40px] px-4 py-2 rounded-xl bg-white text-[#062B50] border border-[#062B50]/15 font-semibold text-xs hover:bg-[#F4F8FD] transition-colors cursor-pointer text-center"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            ) : null}

            {/* General Alert / Notification */}
            {formAlert && (
              <div
                role="alert"
                className={`mb-5 p-3.5 rounded-2xl text-xs sm:text-sm flex items-start gap-2.5 text-left ${
                  formAlert.type === 'error'
                    ? 'bg-red-50 text-[#062B50] border border-red-200'
                    : formAlert.type === 'success'
                    ? 'bg-emerald-50 text-[#062B50] border border-emerald-200'
                    : 'bg-[#E8F3FF] text-[#062B50] border border-[#168FE5]/30'
                }`}
              >
                {formAlert.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                ) : formAlert.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-[#0866C6] shrink-0 mt-0.5" />
                )}
                <span className="leading-snug">{formAlert.message}</span>
              </div>
            )}

            {/* Instant Demo Student Login Section */}
            <div className="mb-6 p-3.5 sm:p-4.5 rounded-2xl bg-[#F4F8FD] border border-[#E8F3FF] text-left">
              <div className="flex items-center justify-between mb-3 gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0866C6]">
                  <Sparkles className="w-4 h-4 text-[#0866C6] shrink-0" />
                  <span>Instant 1-Click Demo Login</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#64778C] whitespace-nowrap">
                  No credentials needed
                </span>
              </div>

              {/* Persona Selector Tabs */}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {DEMO_STUDENT_ROSTER.map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => setSelectedDemoId(demo.id)}
                    className={`p-1.5 sm:p-2 rounded-xl text-center text-xs transition-all border cursor-pointer ${
                      selectedDemoId === demo.id
                        ? 'bg-white border-[#0866C6] text-[#0866C6] font-bold shadow-xs'
                        : 'bg-transparent border-transparent text-[#64778C] hover:text-[#062B50]'
                    }`}
                  >
                    <div className="truncate font-bold text-[11px] sm:text-xs">{demo.fullName.split(' ')[0]}</div>
                    <div className="text-[10px] opacity-75">{demo.classGrade}</div>
                  </button>
                ))}
              </div>

              {/* Selected Persona Detail & Actions */}
              {(() => {
                const selected =
                  DEMO_STUDENT_ROSTER.find((d) => d.id === selectedDemoId) || DEMO_STUDENT_ROSTER[0];
                return (
                  <div>
                    <div className="bg-white p-3 rounded-xl border border-[#E8F3FF] mb-3 text-xs">
                      <div className="flex items-center justify-between font-bold text-[#062B50] mb-0.5 gap-2">
                        <span className="break-words">{selected.fullName}</span>
                        <span className="text-[#0866C6] text-[11px] shrink-0">{selected.classGrade}</span>
                      </div>
                      <p className="text-[11px] text-[#64778C] break-words mb-2 leading-tight">{selected.schoolName}</p>
                      <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#F4F8FD]">
                        <span className="text-[#64778C]">Self-Reflection Portal</span>
                        <span className="font-semibold text-[#0866C6]">
                          14 Questions
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleDemoSignIn(selected.id)}
                        disabled={isDemoLoading !== null}
                        className="w-full min-h-[42px] px-3 rounded-xl bg-[#0866C6] text-white font-bold text-xs hover:bg-[#062B50] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        {isDemoLoading === selected.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        <span>1-Click Sign In</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAutoFillDemo(selected)}
                        className="w-full min-h-[42px] px-3 rounded-xl bg-white text-[#062B50] border border-[#062B50]/15 font-semibold text-xs hover:bg-[#F4F8FD] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#64778C]" />
                        <span>Auto-fill Form</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Divider */}
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-[#E8F3FF]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-[#64778C] font-semibold">
                  or sign in with student mobile number
                </span>
              </div>
            </div>

            {/* Credentials Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
              {/* Mobile Input */}
              <div>
                <label
                  htmlFor="login-mobileNumber"
                  className="block text-xs sm:text-sm font-bold text-[#062B50] mb-1.5"
                >
                  10-Digit Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-bold text-[#64778C] select-none">
                    +91
                  </span>
                  <input
                    id="login-mobileNumber"
                    type="tel"
                    value={mobileNumber}
                    onChange={handleMobileChange}
                    maxLength={10}
                    placeholder="9876543210"
                    disabled={isLoading}
                    className="w-full min-h-[48px] pl-13 pr-3.5 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] focus:ring-2 focus:ring-[#0866C6]/20 outline-none text-sm sm:text-base text-[#102C46] tracking-wide"
                  />
                </div>
                {mobileError && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{mobileError}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-xs sm:text-sm font-bold text-[#062B50]"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-xs text-[#0866C6] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className="w-full min-h-[48px] pl-3.5 pr-12 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] focus:ring-2 focus:ring-[#0866C6]/20 outline-none text-sm sm:text-base text-[#102C46]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-0 top-0 bottom-0 min-w-[48px] flex items-center justify-center text-[#64778C] hover:text-[#062B50] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{passwordError}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[50px] rounded-xl bg-[#0866C6] text-white font-bold text-base hover:bg-[#062B50] active:scale-[0.98] disabled:opacity-70 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in with Mobile</span>
                )}
              </button>
            </form>

            {/* Registration link */}
            <div className="mt-6 pt-5 border-t border-[#E8F3FF] text-center">
              <button
                type="button"
                onClick={() => onNavigate('/signup')}
                className="text-xs sm:text-sm text-[#64778C] hover:text-[#0866C6] transition-colors font-medium focus-visible:outline-2 focus-visible:outline-[#0866C6] rounded px-2 py-1 cursor-pointer"
              >
                Don't have an account yet?{' '}
                <span className="font-bold text-[#0866C6] underline">Register here</span>
              </button>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="mt-6 text-center text-xs text-[#64778C] flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 shrink-0 text-[#0866C6]" />
            <span>Directly Managed by DeRote · Educational Self-Reflection</span>
          </div>

          {/* Legal Links */}
          <div className="mt-3 text-center text-xs text-[#64778C] flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/consent')}
              className="hover:underline text-[#0866C6]"
            >
              Consent Notice
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onNavigate('/privacy')}
              className="hover:underline text-[#0866C6]"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onNavigate('/terms')}
              className="hover:underline text-[#0866C6]"
            >
              Terms of Use
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onNavigate('/contact-privacy')}
              className="hover:underline text-[#0866C6]"
            >
              Privacy Requests
            </button>
          </div>

          {/* Admin / Educator link at footer */}
          <div className="mt-4 pt-4 border-t border-[#E8F3FF] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#64778C]">
            <span>DeRote Administrator or HOD?</span>
            <button
              type="button"
              onClick={() => onNavigate('/admin')}
              className="inline-flex items-center gap-1.5 font-bold text-[#0866C6] hover:text-[#062B50] bg-white border border-[#E8F3FF] px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#0866C6]" />
              <span>Administrator / HOD Portal</span>
            </button>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        title="Reset Student Password"
        badgeText="DeRote Support"
        description="For student privacy, passwords can be reset directly through an authorized DeRote administrator or mentor. If you are exploring the system, use the 1-Click Demo Login above (Aarav, Ananya, or Rohan with password 'demo123')."
        actionText="Back to sign in"
        onAction={() => setShowForgotPasswordModal(false)}
      />
    </div>
  );
};
