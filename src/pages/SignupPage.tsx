import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  AlertCircle,
  Info,
  Lock,
  ArrowRight,
  Shield,
  CheckCircle2,
  Mail,
  Phone,
} from 'lucide-react';
import { DeRoteWordmark } from '../components/DeRoteWordmark';
import {
  registerLocalStudent,
  loginWithGoogle,
  completeGoogleStudentRegistration,
  isValidEmail,
  isValidIndianMobile,
} from '../services/localAuth';
import { SchoolAutocompleteInput } from '../components/SchoolAutocompleteInput';
import { StudentConsentCard, ConsentFormData } from '../components/StudentConsentCard';
import { Footer } from '../components/Footer';

interface SignupPageProps {
  onNavigate: (route: string) => void;
}

// Exactly Classes 8, 9, and 10
const CLASSES = ['8', '9', '10'];

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  // 2-Step Flow: 'consent' -> 'profile'
  const [currentStep, setCurrentStep] = useState<'consent' | 'profile'>('consent');
  const [consentData, setConsentData] = useState<ConsentFormData | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Google Profile Completion state if new Google user
  const [googlePendingUser, setGooglePendingUser] = useState<{
    uid: string;
    email: string;
    fullName: string;
  } | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Status banner
  const [formAlert, setFormAlert] = useState<{
    type: 'error' | 'info';
    message: string;
  } | null>(null);

  const handleConsentComplete = (data: ConsentFormData) => {
    setConsentData(data);
    setCurrentStep('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const filtered = raw.replace(/[^\d\s\-]/g, '');
    setMobileNumber(filtered);
    if (errors.mobileNumber) {
      setErrors((prev) => ({ ...prev, mobileNumber: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    if (!selectedClass || !CLASSES.includes(selectedClass)) {
      newErrors.selectedClass = 'Please select your class grade (Classes 8, 9, or 10).';
    }

    if (!schoolName.trim()) {
      newErrors.schoolName = 'Please enter your school name.';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address (e.g. student@example.com).';
    }

    if (mobileNumber.trim() && !isValidIndianMobile(mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!password) {
      newErrors.password = 'Please create a password.';
    } else if (password.length < 6) {
      newErrors.password = 'Password should be at least 6 characters long.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormAlert(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerLocalStudent({
        fullName: fullName.trim(),
        classGrade: selectedClass,
        schoolName: schoolName.trim(),
        email: email.trim(),
        password,
        phone: mobileNumber.trim() || undefined,
      });

      if (!result.success) {
        setFormAlert({
          type: 'error',
          message: result.error || 'Unable to register student account. Please try again.',
        });
      } else {
        setRegistrationSuccess(true);
        setFormAlert({
          type: 'info',
          message: `Account created successfully for ${result.student?.fullName}! Opening your dashboard...`,
        });
        setTimeout(() => {
          onNavigate('/dashboard');
        }, 600);
      }
    } catch {
      setFormAlert({
        type: 'error',
        message: 'An error occurred while creating your account. Please check your network connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setFormAlert(null);
    setIsGoogleLoading(true);

    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setFormAlert({
          type: 'error',
          message: res.error || 'Google Sign-In was cancelled or failed.',
        });
      } else if (res.needsProfileCompletion && res.googleProfile) {
        // User logged in with Google, now prompt for class & school
        setGooglePendingUser(res.googleProfile);
        if (res.googleProfile.fullName && !fullName) {
          setFullName(res.googleProfile.fullName);
        }
        if (res.googleProfile.email && !email) {
          setEmail(res.googleProfile.email);
        }
        setFormAlert({
          type: 'info',
          message: 'Google account authenticated! Please complete your Class Grade and School Name below.',
        });
      } else {
        // Profile already exists
        setRegistrationSuccess(true);
        setFormAlert({
          type: 'info',
          message: `Welcome back, ${res.student?.fullName}! Opening your dashboard...`,
        });
        setTimeout(() => {
          onNavigate('/dashboard');
        }, 600);
      }
    } catch {
      setFormAlert({
        type: 'error',
        message: 'Google Sign-In failed. Please try again or register with your email address.',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleCompleteGoogleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googlePendingUser) return;

    const newErrors: { [key: string]: string } = {};
    if (!selectedClass || !CLASSES.includes(selectedClass)) {
      newErrors.selectedClass = 'Please select your class grade (Classes 8, 9, or 10).';
    }
    if (!schoolName.trim()) {
      newErrors.schoolName = 'Please enter your school name.';
    }
    if (mobileNumber.trim() && !isValidIndianMobile(mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await completeGoogleStudentRegistration({
        fullName: fullName.trim() || googlePendingUser.fullName,
        classGrade: selectedClass,
        schoolName: schoolName.trim(),
        phone: mobileNumber.trim() || undefined,
      });

      if (!res.success) {
        setFormAlert({
          type: 'error',
          message: res.error || 'Failed to complete registration.',
        });
      } else {
        setRegistrationSuccess(true);
        setFormAlert({
          type: 'info',
          message: `Account created successfully! Opening your dashboard...`,
        });
        setTimeout(() => {
          onNavigate('/dashboard');
        }, 600);
      }
    } catch {
      setFormAlert({
        type: 'error',
        message: 'Error saving profile. Please check your connection.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-w-0 w-full flex flex-col min-h-screen bg-white text-[#102C46]">
      {/* Background Decorative Blue Curves */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#E8F3FF] to-[#168FE5]/10 blur-2xl opacity-70" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-[#E8F3FF] to-[#0866C6]/10 blur-2xl opacity-60" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full bg-white/95 backdrop-blur-md border-b border-[#E8F3FF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-18 flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center text-left focus-visible:outline-2 focus-visible:outline-[#0866C6] rounded-lg cursor-pointer"
            aria-label="DeRote Student Insight - Home"
          >
            <DeRoteWordmark showDescriptor={true} size="md" />
          </button>

          <button
            onClick={() => onNavigate('/')}
            type="button"
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-[#64778C] hover:text-[#062B50] hover:bg-[#F4F8FD] transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#0866C6] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Back to home</span>
            <span className="sm:hidden">Home</span>
          </button>
        </div>
      </header>

      {/* Progress Step Indicator */}
      <div className="relative z-10 max-w-xl mx-auto w-full px-4 pt-6">
        <div className="flex items-center justify-center gap-3 text-xs font-bold">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              currentStep === 'consent'
                ? 'bg-[#0866C6] text-white shadow-xs'
                : 'bg-[#E8F3FF] text-[#0866C6]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Privacy &amp; Consent</span>
          </div>

          <span className="text-[#64778C]/40">→</span>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              currentStep === 'profile'
                ? 'bg-[#0866C6] text-white shadow-xs'
                : 'bg-white text-[#64778C] border border-[#E8F3FF]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Student Profile</span>
          </div>
        </div>
      </div>

      {/* STEP 1: Privacy and Consent Experience */}
      {currentStep === 'consent' && (
        <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-3 sm:px-6 py-6 sm:py-10">
          <StudentConsentCard
            onConsentComplete={handleConsentComplete}
            onNavigate={onNavigate}
          />
        </main>
      )}

      {/* STEP 2: Student Account & Profile Setup */}
      {currentStep === 'profile' && (
        <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-[500px]">
            {/* Main Form Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8F3FF] shadow-xl shadow-[#062B50]/5">
              {/* Back to Step 1 link */}
              <button
                type="button"
                onClick={() => {
                  setCurrentStep('consent');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#64778C] hover:text-[#062B50] mb-4 -ml-1 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Consent Notice</span>
              </button>

              {/* Header */}
              <div className="mb-6 text-left">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-[#0866C6] mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#168FE5]" />
                  Create Student Account
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#062B50]">
                  Tell us a bit about you.
                </h1>
                <p className="text-sm sm:text-[15px] text-[#64778C] mt-1.5">
                  Use your email address and password to sign in across sessions.
                </p>
              </div>

              {/* Status Alert */}
              {formAlert && (
                <div
                  role="alert"
                  className={`mb-5 p-3.5 rounded-2xl text-xs sm:text-sm flex items-start gap-2.5 text-left ${
                    formAlert.type === 'error'
                      ? 'bg-red-50 text-[#062B50] border border-red-200'
                      : 'bg-emerald-50 text-[#062B50] border border-emerald-200'
                  }`}
                >
                  {formAlert.type === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-snug">{formAlert.message}</span>
                </div>
              )}

              {/* Optional Google Sign-In Quick Action */}
              {!googlePendingUser && (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={handleGoogleSignUp}
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
                      or with email
                    </span>
                  </div>
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={googlePendingUser ? handleCompleteGoogleProfile : handleSubmit}
                className="space-y-4 text-left"
                noValidate
              >
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="signup-fullName"
                    className="block text-xs sm:text-sm font-bold text-[#062B50] mb-1.5"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="signup-fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    placeholder="e.g. Aarav Sharma"
                    disabled={isLoading}
                    className="w-full min-h-[48px] px-3.5 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] focus:ring-2 focus:ring-[#0866C6]/20 outline-none text-sm sm:text-base text-[#102C46]"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.fullName}</p>
                  )}
                </div>

                {/* Class Selection */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#062B50] mb-1.5">
                    Class / Grade <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {CLASSES.map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => {
                          setSelectedClass(cls);
                          if (errors.selectedClass) setErrors((prev) => ({ ...prev, selectedClass: '' }));
                        }}
                        className={`min-h-[46px] rounded-xl font-bold text-sm transition-all border cursor-pointer ${
                          selectedClass === cls
                            ? 'bg-[#0866C6] text-white border-[#0866C6] shadow-sm'
                            : 'bg-white text-[#062B50] border-[#062B50]/15 hover:border-[#0866C6] hover:bg-[#F4F8FD]'
                        }`}
                      >
                        Class {cls}
                      </button>
                    ))}
                  </div>
                  {errors.selectedClass && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.selectedClass}</p>
                  )}
                </div>

                {/* School Name with Autocomplete */}
                <div>
                  <label
                    htmlFor="signup-schoolName"
                    className="block text-xs sm:text-sm font-bold text-[#062B50] mb-1.5"
                  >
                    School Name <span className="text-red-500">*</span>
                  </label>
                  <SchoolAutocompleteInput
                    id="signup-schoolName"
                    value={schoolName}
                    onChange={(val) => {
                      setSchoolName(val);
                      if (errors.schoolName) setErrors((prev) => ({ ...prev, schoolName: '' }));
                    }}
                    disabled={isLoading}
                    placeholder="Type or select your school (e.g. Delhi Public School...)"
                    error={errors.schoolName}
                  />
                </div>

                {/* Real Email Address */}
                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-xs sm:text-sm font-bold text-[#062B50] mb-1.5"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-[#64778C] absolute left-3.5 pointer-events-none" />
                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      placeholder="student@example.com"
                      disabled={isLoading || Boolean(googlePendingUser)}
                      className="w-full min-h-[48px] pl-10 pr-3.5 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] focus:ring-2 focus:ring-[#0866C6]/20 outline-none text-sm sm:text-base text-[#102C46]"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>
                  )}
                </div>

                {/* Optional Mobile Number */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="signup-mobileNumber"
                      className="block text-xs sm:text-sm font-bold text-[#062B50]"
                    >
                      Mobile Number <span className="text-xs text-[#64778C] font-normal">(Optional)</span>
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-sm font-bold text-[#64778C] select-none">
                      +91
                    </span>
                    <input
                      id="signup-mobileNumber"
                      type="tel"
                      value={mobileNumber}
                      onChange={handleMobileChange}
                      maxLength={10}
                      placeholder="XXXXXXXXXX"
                      disabled={isLoading}
                      className="w-full min-h-[48px] pl-13 pr-3.5 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] focus:ring-2 focus:ring-[#0866C6]/20 outline-none text-sm sm:text-base text-[#102C46] tracking-wide"
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.mobileNumber}</p>
                  )}
                </div>

                {/* Password Fields (Only for Email Registration, not Google) */}
                {!googlePendingUser && (
                  <>
                    {/* Password */}
                    <div>
                      <label
                        htmlFor="signup-password"
                        className="block text-xs sm:text-sm font-bold text-[#062B50] mb-1.5"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                          }}
                          placeholder="Create a password (min. 6 characters)"
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
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        htmlFor="signup-confirmPassword"
                        className="block text-xs sm:text-sm font-bold text-[#062B50] mb-1.5"
                      >
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="signup-confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                          }}
                          placeholder="Confirm your password"
                          disabled={isLoading}
                          className="w-full min-h-[48px] pl-3.5 pr-12 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] focus:ring-2 focus:ring-[#0866C6]/20 outline-none text-sm sm:text-base text-[#102C46]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                          className="absolute right-0 top-0 bottom-0 min-w-[48px] flex items-center justify-center text-[#64778C] hover:text-[#062B50] cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500 font-medium">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Submit Button */}
                {registrationSuccess ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('/login')}
                    className="w-full min-h-[50px] sm:min-h-[52px] rounded-xl bg-[#0866C6] text-white font-bold text-base hover:bg-[#062B50] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#0866C6]/20 focus-visible:outline-2 focus-visible:outline-[#0866C6] cursor-pointer mt-4"
                  >
                    <span>Proceed to Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full min-h-[50px] sm:min-h-[52px] rounded-xl bg-[#0866C6] text-white font-bold text-base hover:bg-[#062B50] active:scale-[0.98] disabled:opacity-70 transition-all flex items-center justify-center gap-2 shadow-sm focus-visible:outline-2 focus-visible:outline-[#0866C6] cursor-pointer mt-4"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating account in Firebase...</span>
                      </>
                    ) : (
                      <span>{googlePendingUser ? 'Finish Google Registration' : 'Create Student Profile'}</span>
                    )}
                  </button>
                )}
              </form>

              {/* Sign in link */}
              <div className="mt-6 pt-5 border-t border-[#E8F3FF] text-center">
                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="text-xs sm:text-sm text-[#64778C] hover:text-[#0866C6] transition-colors font-medium focus-visible:outline-2 focus-visible:outline-[#0866C6] rounded px-2 py-1 cursor-pointer"
                >
                  Already registered?{' '}
                  <span className="font-bold text-[#0866C6] underline">Sign in here</span>
                </button>
              </div>
            </div>

            {/* Privacy note */}
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
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
