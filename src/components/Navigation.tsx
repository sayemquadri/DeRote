import React, { useState, useEffect } from 'react';
import { UserCheck, Sparkles } from 'lucide-react';
import { DeRoteWordmark } from './DeRoteWordmark';
import {
  onLocalAuthChange,
  loginAsDemoStudent,
  LocalStudentAccount,
} from '../services/localAuth';

interface NavigationProps {
  onNavigate: (route: string) => void;
  currentRoute?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate, currentRoute = '/' }) => {
  const [activeStudent, setActiveStudent] = useState<LocalStudentAccount | null>(null);

  useEffect(() => {
    const unsub = onLocalAuthChange((student) => {
      setActiveStudent(student);
    });
    return () => unsub();
  }, []);

  const handleQuickDemoClick = () => {
    loginAsDemoStudent('demo_aarav_10');
    onNavigate('/questionnaire');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E8F3FF] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-18 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center text-left focus-visible:outline-2 focus-visible:outline-[#0866C6] rounded-lg cursor-pointer"
          aria-label="DeRote Student Insight - Home"
        >
          <DeRoteWordmark showDescriptor={true} size="md" />
        </button>

        {/* Action Zone: Sign in, Demo Login, or Active Student Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {activeStudent ? (
            <button
              onClick={() => onNavigate('/login')}
              type="button"
              className={`min-h-[40px] sm:min-h-[44px] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#0866C6] cursor-pointer shadow-xs ${
                activeStudent.isDemo
                  ? 'bg-[#E8F3FF] text-[#0866C6] border border-[#168FE5]/30 hover:bg-[#0866C6] hover:text-white'
                  : 'bg-[#E8F3FF] text-[#0866C6] hover:bg-[#0866C6] hover:text-white'
              }`}
              title="View student profile and insights"
            >
              {activeStudent.isDemo ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#168FE5] animate-pulse" />
                  <span className="max-w-[120px] sm:max-w-[150px] truncate">{activeStudent.fullName}</span>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-[#168FE5]/15 text-[#0866C6]">
                    Demo
                  </span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span className="max-w-[120px] sm:max-w-[150px] truncate">{activeStudent.fullName}</span>
                </>
              )}
            </button>
          ) : currentRoute !== '/login' ? (
            <>
              {/* Direct Questionnaire Assessment Link */}
              <button
                onClick={() => onNavigate('/prototype')}
                type="button"
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 text-xs font-bold text-[#062B50] hover:text-[#0866C6] bg-white hover:bg-[#F4F8FD] border border-[#E8F3FF] rounded-xl transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#0866C6]"
                title="View and take the 14 locked assessment questions"
              >
                <span>Questions (14)</span>
              </button>

              {/* Quick Demo Login CTA in Navbar */}
              <button
                onClick={handleQuickDemoClick}
                type="button"
                className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 text-xs font-bold text-[#0866C6] bg-[#E8F3FF] hover:bg-[#168FE5]/20 border border-[#168FE5]/30 rounded-xl transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#0866C6]"
                title="1-Click Demo Login as Aarav Sharma (Class 10)"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0866C6]" />
                <span>Demo Login</span>
              </button>

              <button
                onClick={() => onNavigate('/login')}
                type="button"
                className="min-h-[40px] sm:min-h-[44px] px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#0866C6] hover:bg-[#062B50] rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0866C6]"
              >
                Sign in
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};
