import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, ArrowLeft, AlertCircle, Info, Lock, ArrowRight, Shield, CheckCircle2, ChevronLeft } from 'lucide-react';
import { DeRoteWordmark } from '../components/DeRoteWordmark';
import {
  registerLocalStudent,
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
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Status banner
  const [formAlert, setFormAlert] = useState<{
    type: 'error' | 'info';
    message: string;
  } | null>(null);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const filtered = raw.replace(/[^\d\s\-]/g, '');
    setMobileNumber(filtered);
    if (errors.mobileNumber) {
      setErrors((prev) => ({ ...prev, mobileNumber: '' }));
    }
  };

  const handleConsentComplete = (data: ConsentFormData) => {
    setConsentData(data);
    setCurrentStep('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Please enter your mobile number.';
    } else if (!isValidIndianMobile(mobileNumber)) {
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
      const result = registerLocalStudent({
        fullName: fullName.trim(),
        classGrade: selectedClass,
        schoolName: schoolName.trim(),
        phone: mobileNumber,
        password,
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
          message: `Account created successfully for ${result.student?.fullName}! Starting your questionnaire assessment...`,
        });
        setTimeout(() => {
          onNavigate('/questionnaire');
        }, 600);
      }
    } catch {
      setFormAlert({
        type: 'error',
        message: 'A local session error occurred. Please try again.',
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
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
            currentStep === 'consent'
              ? 'bg-[#0866C6] text-white shadow-xs'
              : 'bg-[#E8F3FF] text-[#0866C6]'
          }`}>
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
            <span>Privacy &amp; Consent</span>
          </div>

          <span className="text-[#64778C]/40">→</span>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
            currentStep === 'profile'
              ? 'bg-[#0866C6] text-white shadow-xs'
              : 'bg-white text-[#64778C] border border-[#E8F3FF]'
          }`}>
            <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">2</span>
            <span>Student Profile</span>
          </div>
        </div>
      </div>

      {/* STEP 1: Privacy and Consent Experience */}
      {currentStep === 'consent' && (
        <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-3 sm:px-6 py-6 sm:py-10">
          <div className="w-full max-w-2xl">
            <StudentConsentCard
              onConsentComplete={handleConsentComplete}
              onNavigate={onNavigate}
              compact={false}
            />

            {/* Quick Link to Login */}
            <div className="mt-6 text-center text-xs sm:text-sm text-[#64778C]">
              Already completed consent and have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="font-bold text-[#0866C6] underline hover:text-[#062B50] cursor-pointer"
              >
                Sign in here
              </button>
            </div>
          </div>
        </main>
      )}

      {/* STEP 2: Profile Details */}
      {currentStep === 'profile' && (
        <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-3 sm:px-6 py-6 sm:py-10">
          <div className="w-full max-w-[480px]">
            {/* Form Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-9 border border-[#E8F3FF] shadow-xl shadow-[#062B50]/5">
              {/* Back to Consent Button */}
              <button
                type="button"
                onClick={() => setCurrentStep('consent')}
                className="mb-4 inline-flex items-center gap-1 text-xs font-bold text-[#0866C6] hover:text-[#062B50] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Review / Change Consent Options</span>
              </button>

              {/* Header info */}
              <div className="mb-5 sm:mb-6 text-left">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-[#0866C6] mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#168FE5]" aria-hidden="true" />
                  Step 2 of 2: Student Profile
                </span>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#062B50]">
                  Let&apos;s get to know you.
                </h1>
                <p className="text-xs sm:text-sm text-[#64778C] mt-1.5">
                  Create your student profile to begin your reflection journey.
                </p>

                {/* Consent Verified Badge */}
                {consentData && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Consent pathway: {consentData.consentPathway === 'guardian_direct' ? 'Parent / Guardian' : 'Student (Guardian Approved)'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('consent')}
                      className="text-[11px] font-bold text-emerald-700 underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Status alert banner */}
              {formAlert && (
                <div
                  role="alert"
                  className={`mb-5 p-3.5 rounded-2xl text-xs sm:text-sm flex items-start gap-2.5 ${
                    formAlert.type === 'error'
                      ? 'bg-red-50 text-[#062B50] border border-red-200'
                      : 'bg-[#E8F3FF] text-[#062B50] border border-[#168FE5]/30'
                  }`}
                >
                  {formAlert.type === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-5 h-5 text-[#0866C6] shrink-0 mt-0.5" />
                  )}
                  <span className="leading-snug">{formAlert.message}</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
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

                {/* Mobile Number */}
                <div>
                  <label
                    htmlFor="signup-mobileNumber"
                    className="block text-xs sm:text-sm font-bold text-[#062B50] mb-1.5"
                  >
                    10-Digit Mobile Number <span className="text-red-500">*</span>
                  </label>
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
                      placeholder="9876543210"
                      disabled={isLoading}
                      className="w-full min-h-[48px] pl-13 pr-3.5 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] focus:ring-2 focus:ring-[#0866C6]/20 outline-none text-sm sm:text-base text-[#102C46] tracking-wide"
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.mobileNumber}</p>
                  )}
                </div>

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
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <span>Create student profile</span>
                    )}
                  </button>
                )}
              </form>

              {/* Link to login for existing students */}
              <div className="mt-6 pt-5 border-t border-[#E8F3FF] text-center">
                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="text-xs sm:text-sm text-[#64778C] hover:text-[#0866C6] transition-colors font-medium focus-visible:outline-2 focus-visible:outline-[#0866C6] rounded px-2 py-1 cursor-pointer"
                >
                  Already have an account?{' '}
                  <span className="font-bold text-[#0866C6] underline">Sign in</span>
                </button>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="mt-6 text-center text-xs text-[#64778C] flex flex-wrap items-center justify-center gap-3">
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
          </div>
        </main>
      )}

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
