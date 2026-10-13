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
  ChevronRight,
  Shield,
  Mail,
  Sparkles,
  ArrowUpRight,
  School,
  LayoutDashboard,
} from 'lucide-react';
import { DeRoteWordmark } from '../components/DeRoteWordmark';
import { Modal } from '../components/Modal';
import {
  loginLocalStudent,
  signOutLocalStudent,
  onLocalAuthChange,
  LocalStudentAccount,
  loginWithGoogle,
  completeGoogleStudentRegistration,
  sendStudentPasswordResetEmail,
  migrateStudentToRealEmail,
  isValidEmail,
} from '../services/localAuth';
import { SchoolAutocompleteInput } from '../components/SchoolAutocompleteInput';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

const CLASSES = ['8', '9', '10'];

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Active student state
  const [activeStudent, setActiveStudent] = useState<LocalStudentAccount | null>(null);

  // Field validation errors
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Status banner / general alert
  const [formAlert, setFormAlert] = useState<{
    type: 'error' | 'info' | 'success';
    message: string;
  } | null>(null);

  // Forgot password modal state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmailInput, setResetEmailInput] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  // Email migration modal state (for legacy synthetic mobile accounts)
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [migrationEmail, setMigrationEmail] = useState('');
  const [migrationPassword, setMigrationPassword] = useState('');
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  // Google profile completion modal (if new Google user)
  const [googlePendingUser, setGooglePendingUser] = useState<{
    uid: string;
    email: string;
    fullName: string;
  } | null>(null);
  const [googleClass, setGoogleClass] = useState('');
  const [googleSchool, setGoogleSchool] = useState('');
  const [googlePhone, setGooglePhone] = useState('');
  const [isGoogleCompleting, setIsGoogleCompleting] = useState(false);

  // Subscribe to local auth state
  useEffect(() => {
    const unsub = onLocalAuthChange((student) => {
      setActiveStudent(student);
    });
    return () => unsub();
  }, []);

  // Sign out handler
  const handleSignOut = async () => {
    await signOutLocalStudent();
    setActiveStudent(null);
    setFormAlert({
      type: 'info',
      message: 'Signed out successfully.',
    });
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value);
    if (identifierError) setIdentifierError(null);
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

    if (!identifier.trim()) {
      setIdentifierError('Please enter your email address or registered mobile number.');
      hasErrors = true;
    } else {
      setIdentifierError(null);
    }

    if (!password) {
      setPasswordError('Please enter your password.');
      hasErrors = true;
    } else {
      setPasswordError(null);
    }

    if (hasErrors) return;

    setIsLoading(true);

    try {
      const result = await loginLocalStudent(identifier, password);

      if (!result.success) {
        setFormAlert({
          type: 'error',
          message: result.error || 'Invalid credentials.',
        });
      } else {
        setFormAlert({
          type: 'success',
          message: `Signed in successfully as ${result.student?.fullName}! Opening dashboard...`,
        });
        setTimeout(() => {
          onNavigate('/dashboard');
        }, 500);
      }
    } catch {
      setFormAlert({
        type: 'error',
        message: 'An authentication error occurred. Please check your network connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormAlert(null);
    setIsGoogleLoading(true);

    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setFormAlert({
          type: 'error',
          message: res.error || 'Google sign-in was cancelled or failed.',
        });
      } else if (res.needsProfileCompletion && res.googleProfile) {
        setGooglePendingUser(res.googleProfile);
      } else {
        setFormAlert({
          type: 'success',
          message: `Signed in successfully with Google! Opening dashboard...`,
        });
        setTimeout(() => {
          onNavigate('/dashboard');
        }, 500);
      }
    } catch {
      setFormAlert({
        type: 'error',
        message: 'Google Sign-In failed. Please try again or use email.',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleFinishGoogleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googlePendingUser) return;
    if (!googleClass) {
      setFormAlert({ type: 'error', message: 'Please select your class grade.' });
      return;
    }
    if (!googleSchool.trim()) {
      setFormAlert({ type: 'error', message: 'Please enter your school name.' });
      return;
    }

    setIsGoogleCompleting(true);
    try {
      const res = await completeGoogleStudentRegistration({
        fullName: googlePendingUser.fullName || 'Student',
        classGrade: googleClass,
        schoolName: googleSchool.trim(),
        phone: googlePhone.trim() || undefined,
      });

      if (!res.success) {
        setFormAlert({ type: 'error', message: res.error || 'Failed to complete profile.' });
      } else {
        setGooglePendingUser(null);
        setFormAlert({
          type: 'success',
          message: 'Profile completed! Opening your student dashboard...',
        });
        setTimeout(() => {
          onNavigate('/dashboard');
        }, 500);
      }
    } catch {
      setFormAlert({ type: 'error', message: 'Error saving profile.' });
    } finally {
      setIsGoogleCompleting(false);
    }
  };

  const handleSendPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus(null);
    if (!resetEmailInput.trim()) {
      setResetStatus({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    setIsSendingReset(true);
    try {
      const res = await sendStudentPasswordResetEmail(resetEmailInput);
      if (res.success) {
        setResetStatus({
          type: 'success',
          message: res.message || 'Password reset link sent! Please check your inbox.',
        });
      } else {
        setResetStatus({
          type: 'error',
          message: res.error || 'Failed to send password reset email.',
        });
      }
    } catch {
      setResetStatus({ type: 'error', message: 'A network error occurred.' });
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleMigrateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setMigrationResult(null);

    if (!migrationEmail.trim() || !isValidEmail(migrationEmail)) {
      setMigrationResult({
        type: 'error',
        message: 'Please enter a valid personal or school email address.',
      });
      return;
    }

    setIsMigrating(true);
    try {
      const res = await migrateStudentToRealEmail(migrationEmail, migrationPassword);
      if (res.success) {
        setMigrationResult({
          type: 'success',
          message: res.message || 'Your email update request has been processed.',
        });
      } else {
        setMigrationResult({
          type: 'error',
          message: res.error || 'Failed to update email. Please try again.',
        });
      }
    } catch {
      setMigrationResult({ type: 'error', message: 'A network error occurred.' });
    } finally {
      setIsMigrating(false);
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
                Sign in with your email address and password to continue.
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
                      </div>
                      <p className="text-xs text-[#64778C] mt-0.5 break-words font-medium">
                        Class {activeStudent.classGrade} · {activeStudent.email}
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

                {/* Legacy Account Upgrade Banner */}
                {activeStudent.isSyntheticEmail && (
                  <div className="mt-3.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <strong className="block text-amber-950 font-bold">
                          Account Upgrade Available
                        </strong>
                        <p className="text-[11px] leading-relaxed">
                          Your account currently uses your mobile number. Connect your real email address to enable password resets and standard email sign-in while preserving all your saved data.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMigrationModal(true)}
                      className="mt-2.5 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      <span>Upgrade to Email Login</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

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
                    onClick={() => onNavigate('/dashboard')}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#2150D8] text-white font-bold text-xs sm:text-sm hover:bg-[#1B357F] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md text-center"
                  >
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    <span>Go to Student Dashboard</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('/questionnaire')}
                    className="w-full min-h-[40px] px-4 py-2 rounded-xl bg-white text-[#2150D8] border border-[#2150D8]/30 font-bold text-xs hover:bg-[#EBF2FE] transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-center"
                  >
                    <span>Continue 14 Questions</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('/')}
                    className="w-full min-h-[38px] px-4 py-2 rounded-xl bg-white text-[#64778C] border border-[#CBD5E1] font-semibold text-xs hover:bg-[#F5F8FD] transition-colors cursor-pointer text-center"
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
                className={`mb-5 p-3.5 rounded-2xl text-xs sm:text-sm flex flex-col gap-2 text-left ${
                  formAlert.type === 'error'
                    ? 'bg-red-50 text-[#062B50] border border-red-200'
                    : formAlert.type === 'success'
                    ? 'bg-emerald-50 text-[#062B50] border border-emerald-200'
                    : 'bg-[#E8F3FF] text-[#062B50] border border-[#168FE5]/30'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {formAlert.type === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  ) : formAlert.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-5 h-5 text-[#0866C6] shrink-0 mt-0.5" />
                  )}
                  <span className="leading-snug flex-1">{formAlert.message}</span>
                </div>
                {formAlert.type === 'error' && (
                  <div className="flex items-center gap-3 pt-1 pl-7 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => onNavigate('/signup')}
                      className="text-[#0866C6] hover:underline cursor-pointer"
                    >
                      Create an account →
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmailInput(identifier.includes('@') ? identifier : '');
                        setShowForgotPasswordModal(true);
                      }}
                      className="text-[#64778C] hover:text-[#062B50] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Google Sign-In Quick Action */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                className="w-full min-h-[46px] rounded-xl border border-[#E8F3FF] bg-white hover:bg-[#F4F8FD] text-[#062B50] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#0866C6]" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-5">
                <div className="border-t border-[#E8F3FF] w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-[#64778C] uppercase tracking-wider relative">
                  or sign in with credentials
                </span>
              </div>
            </div>

            {/* Email/Password Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
              {/* Identifier Input */}
              <div>
                <label
                  htmlFor="login-identifier"
                  className="block text-xs sm:text-sm font-bold text-[#062B50] mb-1.5"
                >
                  Email Address or Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#64778C] absolute left-3.5 pointer-events-none" />
                  <input
                    id="login-identifier"
                    type="text"
                    value={identifier}
                    onChange={handleIdentifierChange}
                    placeholder="student@example.com (or 10-digit mobile)"
                    disabled={isLoading}
                    className="w-full min-h-[48px] pl-10 pr-3.5 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] focus:ring-2 focus:ring-[#0866C6]/20 outline-none text-sm sm:text-base text-[#102C46]"
                  />
                </div>
                <p className="mt-1 text-[11px] text-[#64778C]">
                  Existing accounts may enter their registered 10-digit mobile number to sign in.
                </p>
                {identifierError && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{identifierError}</p>
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
                    onClick={() => {
                      setResetStatus(null);
                      setResetEmailInput(identifier.includes('@') ? identifier : '');
                      setShowForgotPasswordModal(true);
                    }}
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
                  <span>Sign in to Student Account</span>
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
                <span className="font-bold text-[#0866C6] underline">Register with email</span>
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

          {/* Admin link at footer */}
          <div className="mt-4 pt-4 border-t border-[#E8F3FF] flex items-center justify-center text-xs text-[#64778C]">
            <button
              type="button"
              onClick={() => onNavigate('/admin')}
              className="inline-flex items-center gap-1.5 font-bold text-[#0866C6] hover:text-[#062B50] bg-white border border-[#E8F3FF] px-3.5 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#0866C6]" />
              <span>Administrator</span>
            </button>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#062B50]/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E8F3FF] shadow-2xl text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#0866C6] uppercase tracking-wider bg-[#E8F3FF] px-2.5 py-1 rounded-full">
                Password Recovery
              </span>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(false)}
                className="text-[#64778C] hover:text-[#062B50] text-sm p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <h3 className="text-xl font-bold text-[#062B50] mb-2">
              Reset Your Password
            </h3>
            <p className="text-xs text-[#64778C] mb-4 leading-relaxed">
              Enter your verified email address to receive an official password reset link directly from Firebase Authentication.
            </p>

            {resetStatus && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
                  resetStatus.type === 'error'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {resetStatus.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <span>{resetStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSendPasswordReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#062B50] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={resetEmailInput}
                  onChange={(e) => setResetEmailInput(e.target.value)}
                  placeholder="student@example.com"
                  disabled={isSendingReset}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64778C] hover:text-[#062B50] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="px-5 py-2 rounded-xl bg-[#0866C6] hover:bg-[#062B50] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSendingReset ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending link...</span>
                    </>
                  ) : (
                    <span>Send Reset Email</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Legacy Account Email Migration Modal */}
      {showMigrationModal && activeStudent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#062B50]/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E8F3FF] shadow-2xl text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#0866C6] uppercase tracking-wider bg-[#E8F3FF] px-2.5 py-1 rounded-full">
                Safe Account Upgrade
              </span>
              <button
                type="button"
                onClick={() => setShowMigrationModal(false)}
                className="text-[#64778C] hover:text-[#062B50] text-sm p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <h3 className="text-xl font-bold text-[#062B50] mb-2">
              Connect Real Email Address
            </h3>
            <p className="text-xs text-[#64778C] mb-4 leading-relaxed">
              Your existing reflection sessions, answers, and profile will be safely preserved. Upgrading enables standard email login and password reset recovery.
            </p>

            {migrationResult && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
                  migrationResult.type === 'error'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {migrationResult.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <span>{migrationResult.message}</span>
              </div>
            )}

            <form onSubmit={handleMigrateEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#062B50] mb-1.5">
                  Your Real Email Address
                </label>
                <input
                  type="email"
                  value={migrationEmail}
                  onChange={(e) => setMigrationEmail(e.target.value)}
                  placeholder="yourname@gmail.com or school email"
                  disabled={isMigrating}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#062B50] mb-1.5">
                  Current Password (for verification)
                </label>
                <input
                  type="password"
                  value={migrationPassword}
                  onChange={(e) => setMigrationPassword(e.target.value)}
                  placeholder="Enter your current password"
                  disabled={isMigrating}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMigrationModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64778C] hover:text-[#062B50] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isMigrating}
                  className="px-5 py-2 rounded-xl bg-[#0866C6] hover:bg-[#062B50] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isMigrating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Email</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Google User Profile Completion Modal */}
      {googlePendingUser && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#062B50]/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E8F3FF] shadow-2xl text-left">
            <span className="text-xs font-bold text-[#0866C6] uppercase tracking-wider bg-[#E8F3FF] px-2.5 py-1 rounded-full inline-block mb-3">
              Complete Student Profile
            </span>
            <h3 className="text-xl font-bold text-[#062B50] mb-2">
              Welcome, {googlePendingUser.fullName}!
            </h3>
            <p className="text-xs text-[#64778C] mb-4 leading-relaxed">
              To tailor your reflection assessment ({googlePendingUser.email}), please select your Class Grade and School.
            </p>

            <form onSubmit={handleFinishGoogleProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#062B50] mb-1.5">
                  Class / Grade <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CLASSES.map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setGoogleClass(cls)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        googleClass === cls
                          ? 'bg-[#0866C6] text-white border-[#0866C6]'
                          : 'bg-white text-[#062B50] border-[#062B50]/15 hover:border-[#0866C6]'
                      }`}
                    >
                      Class {cls}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#062B50] mb-1.5">
                  School Name <span className="text-red-500">*</span>
                </label>
                <SchoolAutocompleteInput
                  id="google-schoolName"
                  value={googleSchool}
                  onChange={(val) => setGoogleSchool(val)}
                  placeholder="Type or select your school..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#062B50] mb-1.5">
                  Mobile Number <span className="text-xs text-[#64778C] font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={googlePhone}
                  onChange={(e) => setGooglePhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGoogleCompleting}
                  className="w-full py-3 rounded-xl bg-[#0866C6] hover:bg-[#062B50] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isGoogleCompleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <span>Start Questionnaire Assessment</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
