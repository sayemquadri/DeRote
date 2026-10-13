import React, { useState } from 'react';
import {
  Shield,
  ArrowLeft,
  Lock,
  Mail,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Building2,
  Users,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { DeRoteWordmark } from '../components/DeRoteWordmark';
import {
  loginAdmin,
  loginAsDemoAdmin,
  DEMO_ADMIN_ACCOUNT,
} from '../services/adminService';

interface AdminLoginPageProps {
  onNavigate: (route: string) => void;
  onAdminLoginSuccess?: () => void;
}

export function AdminLoginPage({
  onNavigate,
  onAdminLoginSuccess,
}: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorAlert, setErrorAlert] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorAlert(null);

    if (!email.trim() || !password) {
      setErrorAlert('Please enter your institutional admin email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = loginAdmin(email, password);
      setIsLoading(false);
      if (res.success) {
        if (onAdminLoginSuccess) onAdminLoginSuccess();
        onNavigate('/admin');
      } else {
        setErrorAlert(res.error || 'Authentication failed. Please verify credentials.');
      }
    }, 150);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginAsDemoAdmin();
      setIsLoading(false);
      if (onAdminLoginSuccess) onAdminLoginSuccess();
      onNavigate('/admin');
    }, 150);
  };

  const handleFillDemoCredentials = () => {
    setEmail('admin@derote.in');
    setPassword('admin123');
    setErrorAlert(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F8FD] flex flex-col justify-between text-[#102C46]">
      {/* Header */}
      <header className="bg-white border-b border-[#E8F3FF] px-3 sm:px-8 py-2.5 sm:py-3.5 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#64778C] hover:text-[#062B50] transition-colors rounded-lg px-2 sm:px-2.5 py-1.5 hover:bg-[#F4F8FD] cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
            <div className="h-4 w-px bg-[#E8F3FF] hidden sm:block" />
            <DeRoteWordmark size="sm" showDescriptor={false} />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="text-xs font-semibold text-[#0866C6] hover:text-[#062B50] px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#E8F3FF] bg-white shadow-xs cursor-pointer whitespace-nowrap"
            >
              Student Portal
            </button>
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 max-w-lg w-full mx-auto px-3 sm:px-4 py-8 sm:py-16 flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-5 sm:p-10 border border-[#E8F3FF] shadow-xl shadow-[#062B50]/5 relative overflow-hidden">
          {/* Top Blue Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0866C6] via-[#168FE5] to-[#42A5F5]" />

          {/* Badge & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#E8F3FF] text-[#0866C6] mb-3 shadow-inner">
              <Shield className="w-6 h-6" />
            </div>

            <div className="mb-1">
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#0866C6] bg-[#E8F3FF] px-2.5 py-0.5 rounded-full">
                Institutional Administration
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#062B50] tracking-tight">
              Educator & HOD Portal
            </h1>
            <p className="text-xs sm:text-sm text-[#64778C] mt-2 leading-relaxed">
              Access cohort insights, class-level reflection themes, and student response records.
            </p>
          </div>

          {/* 1-Click Demo Admin Card */}
          <div className="mb-6 p-4 rounded-2xl bg-[#F0F7FF] border border-[#D5E9FF] text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0866C6]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Click Instant Demo Login</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Pre-configured
              </span>
            </div>

            <p className="text-xs text-[#465B72] mb-3">
              Explore with <strong>{DEMO_ADMIN_ACCOUNT.fullName}</strong> ({DEMO_ADMIN_ACCOUNT.roleTitle}).
            </p>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0866C6] text-white font-bold text-xs hover:bg-[#062B50] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Launch Demo Admin Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5 ml-auto" />
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8F3FF]" />
            </div>
            <span className="relative bg-white px-3 text-xs font-semibold text-[#64778C]">
              or sign in with credentials
            </span>
          </div>

          {/* Error Alert */}
          {errorAlert && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorAlert}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-[#062B50] mb-1.5">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64778C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@derote.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5E9FF] bg-white text-xs text-[#062B50] placeholder-[#64778C]/60 focus:outline-none focus:ring-2 focus:ring-[#0866C6]/30 focus:border-[#0866C6] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#062B50]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleFillDemoCredentials}
                  className="text-[11px] font-semibold text-[#0866C6] hover:text-[#062B50] hover:underline cursor-pointer"
                >
                  Auto-fill demo credentials
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64778C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5E9FF] bg-white text-xs text-[#062B50] placeholder-[#64778C]/60 focus:outline-none focus:ring-2 focus:ring-[#0866C6]/30 focus:border-[#0866C6] transition-all"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#64778C] mt-1">
                <span>Demo user: admin@derote.in</span>
                <span>Demo pass: admin123</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#062B50] text-white font-bold text-xs hover:bg-[#0866C6] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>{isLoading ? 'Verifying...' : 'Sign In as Administrator'}</span>
            </button>
          </form>

          {/* Operational Note */}
          <div className="mt-6 pt-4 border-t border-[#F0F5FA] flex items-center justify-center gap-2 text-[11px] text-[#64778C]">
            <Building2 className="w-3.5 h-3.5 text-[#0866C6]" />
            <span>DeRote Academic Leadership &amp; Department Heads (HODs)</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8F3FF] bg-white py-4 px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64778C] max-w-6xl mx-auto w-full gap-2">
        <span>DeRote Student Insight System · Authorized Administrator Access</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/consent')}
            className="hover:underline text-[#0866C6] cursor-pointer"
          >
            Consent Notice
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onNavigate('/privacy')}
            className="hover:underline text-[#0866C6] cursor-pointer"
          >
            Privacy Policy
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onNavigate('/terms')}
            className="hover:underline text-[#0866C6] cursor-pointer"
          >
            Terms of Use
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onNavigate('/contact-privacy')}
            className="hover:underline text-[#0866C6] cursor-pointer"
          >
            Privacy Requests
          </button>
        </div>
      </footer>
    </div>
  );
}
