/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { QuestionnairePage } from './pages/QuestionnairePage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfUsePage } from './pages/TermsOfUsePage';
import { ContactPrivacyPage } from './pages/ContactPrivacyPage';
import { StudentConsentPage } from './pages/StudentConsentPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import {
  getCurrentAdmin,
  onAdminAuthChange,
  AdminAccount,
} from './services/adminService';
import {
  getCurrentActiveStudent,
  onLocalAuthChange,
  LocalStudentAccount,
} from './services/localAuth';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  // Support both pathname and hash for robust routing across static and dev environments
  const getInitialRoute = (): string => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const matchRoute = (r: string) => path === r || hash === `#${r}` || hash === `#/${r.replace(/^\//, '')}`;

    if (matchRoute('/dashboard')) return '/dashboard';
    if (matchRoute('/signup')) return '/signup';
    if (matchRoute('/login')) return '/login';
    if (matchRoute('/admin')) return '/admin';
    if (matchRoute('/admin/login')) return '/admin/login';
    if (matchRoute('/privacy')) return '/privacy';
    if (matchRoute('/terms')) return '/terms';
    if (matchRoute('/contact-privacy')) return '/contact-privacy';
    if (matchRoute('/consent')) return '/consent';
    if (
      matchRoute('/prototype') ||
      matchRoute('/questionnaire')
    ) {
      return '/questionnaire';
    }
    return '/';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(() => getCurrentAdmin());
  const [activeStudent, setActiveStudent] = useState<LocalStudentAccount | null>(() => getCurrentActiveStudent());
  const [firebaseUserUid, setFirebaseUserUid] = useState<string | null>(() => auth.currentUser?.uid || null);

  useEffect(() => {
    const unsubAdmin = onAdminAuthChange((admin) => {
      setCurrentAdmin(admin);
    });
    const unsubStudent = onLocalAuthChange((student) => {
      setActiveStudent(student);
    });
    const unsubFirebase = onAuthStateChanged(auth, (user) => {
      setFirebaseUserUid(user?.uid || null);
    });
    return () => {
      unsubAdmin();
      unsubStudent();
      unsubFirebase();
    };
  }, []);

  // Determine if active user is an authorized administrator
  const isSuperAdmin =
    currentAdmin?.email === 'contact@derote.in' ||
    auth.currentUser?.email === 'contact@derote.in';

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const matchRoute = (r: string) => path === r || hash === `#${r}` || hash === `#/${r.replace(/^\//, '')}`;

      if (matchRoute('/dashboard')) {
        setCurrentRoute('/dashboard');
      } else if (matchRoute('/signup')) {
        setCurrentRoute('/signup');
      } else if (matchRoute('/login')) {
        setCurrentRoute('/login');
      } else if (matchRoute('/admin')) {
        setCurrentRoute('/admin');
      } else if (matchRoute('/admin/login')) {
        setCurrentRoute('/admin/login');
      } else if (matchRoute('/privacy')) {
        setCurrentRoute('/privacy');
      } else if (matchRoute('/terms')) {
        setCurrentRoute('/terms');
      } else if (matchRoute('/contact-privacy')) {
        setCurrentRoute('/contact-privacy');
      } else if (matchRoute('/consent')) {
        setCurrentRoute('/consent');
      } else if (
        matchRoute('/prototype') ||
        matchRoute('/questionnaire')
      ) {
        setCurrentRoute('/questionnaire');
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    try {
      window.history.pushState({}, '', route);
    } catch {
      // Fallback for strict iframe origins if pushState is restricted
      window.location.hash = route;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#102C46] font-sans antialiased">
      {/* Route: Login Page */}
      {currentRoute === '/login' && (
        <main className="flex-1 flex flex-col">
          <LoginPage onNavigate={navigateTo} />
        </main>
      )}

      {/* Route: Signup Page (Account Creation & Consent) */}
      {currentRoute === '/signup' && (
        <main className="flex-1 flex flex-col">
          <SignupPage onNavigate={navigateTo} />
        </main>
      )}

      {/* Route: Student Personal Dashboard */}
      {currentRoute === '/dashboard' && (
        <main className="flex-1 flex flex-col">
          <StudentDashboardPage onNavigate={navigateTo} />
        </main>
      )}

      {/* Route: Questionnaire Assessment Page or Admin View for Super Admin */}
      {(currentRoute === '/prototype' || currentRoute === '/questionnaire') && (
        <main className="flex-1 flex flex-col">
          {isSuperAdmin ? (
            <AdminDashboardPage onNavigate={navigateTo} />
          ) : (
            <QuestionnairePage onNavigate={navigateTo} />
          )}
        </main>
      )}

      {/* Route: Student Privacy & Consent Information Page */}
      {currentRoute === '/consent' && (
        <main className="flex-1 flex flex-col">
          <StudentConsentPage onNavigate={navigateTo} />
        </main>
      )}

      {/* Route: Privacy Policy */}
      {currentRoute === '/privacy' && (
        <main className="flex-1 flex flex-col">
          <PrivacyPolicyPage onNavigate={navigateTo} />
        </main>
      )}

      {/* Route: Terms of Use */}
      {currentRoute === '/terms' && (
        <main className="flex-1 flex flex-col">
          <TermsOfUsePage onNavigate={navigateTo} />
        </main>
      )}

      {/* Route: Contact & Privacy Requests */}
      {currentRoute === '/contact-privacy' && (
        <main className="flex-1 flex flex-col">
          <ContactPrivacyPage onNavigate={navigateTo} />
        </main>
      )}

      {/* Route: Admin Dashboard or Admin Login */}
      {currentRoute === '/admin' && (
        <main className="flex-1 flex flex-col">
          {currentAdmin || isSuperAdmin ? (
            <AdminDashboardPage onNavigate={navigateTo} />
          ) : (
            <AdminLoginPage
              onNavigate={navigateTo}
              onAdminLoginSuccess={() => {
                setCurrentAdmin(getCurrentAdmin());
                navigateTo('/admin');
              }}
            />
          )}
        </main>
      )}

      {/* Route: Explicit Admin Login */}
      {currentRoute === '/admin/login' && (
        <main className="flex-1 flex flex-col">
          {currentAdmin || isSuperAdmin ? (
            <AdminDashboardPage onNavigate={navigateTo} />
          ) : (
            <AdminLoginPage
              onNavigate={navigateTo}
              onAdminLoginSuccess={() => {
                setCurrentAdmin(getCurrentAdmin());
                navigateTo('/admin');
              }}
            />
          )}
        </main>
      )}

      {/* Route: Landing Page (Default & Fallback for root / other routes) */}
      {currentRoute !== '/dashboard' &&
        currentRoute !== '/login' &&
        currentRoute !== '/signup' &&
        currentRoute !== '/prototype' &&
        currentRoute !== '/questionnaire' &&
        currentRoute !== '/consent' &&
        currentRoute !== '/privacy' &&
        currentRoute !== '/terms' &&
        currentRoute !== '/contact-privacy' &&
        currentRoute !== '/admin' &&
        currentRoute !== '/admin/login' && (
          <>
            <Navigation onNavigate={navigateTo} currentRoute="/" />
            <main className="flex-1">
              <LandingPage onNavigate={navigateTo} />
            </main>
          </>
        )}
    </div>
  );
}
