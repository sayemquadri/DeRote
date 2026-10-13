import React, { useState, useEffect } from 'react';
import { UserCheck, Shield } from 'lucide-react';
import { DeRoteWordmark } from './DeRoteWordmark';
import {
  onLocalAuthChange,
  LocalStudentAccount,
} from '../services/localAuth';
import {
  onAdminAuthChange,
  AdminAccount,
  PRIMARY_ADMIN_UID,
} from '../services/adminService';

interface NavigationProps {
  onNavigate: (route: string) => void;
  currentRoute?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate, currentRoute = '/' }) => {
  const [activeStudent, setActiveStudent] = useState<LocalStudentAccount | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(null);

  useEffect(() => {
    const unsubStudent = onLocalAuthChange((student) => {
      setActiveStudent(student);
    });
    const unsubAdmin = onAdminAuthChange((admin) => {
      setCurrentAdmin(admin);
    });
    return () => {
      unsubStudent();
      unsubAdmin();
    };
  }, []);

  const isSuperAdmin =
    currentAdmin?.id === PRIMARY_ADMIN_UID ||
    activeStudent?.id === PRIMARY_ADMIN_UID;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E8F3FF] transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Zone */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center text-left focus-visible:outline-2 focus-visible:outline-[#0866C6] rounded-lg cursor-pointer shrink-0"
          aria-label="DeRote Student Insight - Home"
        >
          <DeRoteWordmark showDescriptor={true} size="md" />
        </button>

        {/* Action Zone: Sign in or Active Student / Admin Status */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {isSuperAdmin ? (
            <button
              onClick={() => onNavigate('/admin')}
              type="button"
              className="min-h-[38px] sm:min-h-[44px] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#0866C6] cursor-pointer shadow-xs bg-[#062B50] text-white hover:bg-[#0866C6]"
              title="Open DeRote Admin View"
            >
              <Shield className="w-4 h-4 text-[#42A5F5] shrink-0" />
              <span>Admin View</span>
            </button>
          ) : activeStudent ? (
            <button
              onClick={() => onNavigate('/login')}
              type="button"
              className="min-h-[38px] sm:min-h-[44px] px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#0866C6] cursor-pointer shadow-xs bg-[#E8F3FF] text-[#0866C6] hover:bg-[#0866C6] hover:text-white"
              title="View student profile and insights"
            >
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="max-w-[120px] sm:max-w-[180px] truncate">{activeStudent.fullName}</span>
            </button>
          ) : currentRoute !== '/login' ? (
            <>
              {/* Direct Questionnaire Assessment Link */}
              <button
                onClick={() => onNavigate('/questionnaire')}
                type="button"
                className="inline-flex items-center gap-1 min-h-[38px] sm:min-h-[40px] px-2.5 sm:px-3 py-1.5 text-xs font-bold text-[#062B50] hover:text-[#0866C6] bg-white hover:bg-[#F4F8FD] border border-[#E8F3FF] rounded-xl transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#0866C6] whitespace-nowrap"
                title="Self-Reflection Assessment"
              >
                <span>Questionnaire</span>
              </button>

              <button
                onClick={() => onNavigate('/login')}
                type="button"
                className="min-h-[38px] sm:min-h-[44px] px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-[#0866C6] hover:bg-[#062B50] rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0866C6] whitespace-nowrap"
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
