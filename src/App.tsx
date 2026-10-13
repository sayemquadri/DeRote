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
import { getCurrentAdmin, onAdminAuthChange, AdminAccount } from './services/adminService';

export default function App() {
  // Support both pathname and hash for robust routing across static and dev environments
  const getInitialRoute = (): string => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === '/signup' || hash === '#/signup' || hash === '#signup') {
      return '/signup';
    }
    if (path === '/login' || hash === '#/login' || hash === '#login') {
      return '/login';
    }
    if (path === '/admin' || hash === '#/admin' || hash === '#admin') {
      return '/admin';
    }
    if (path === '/admin/login' || hash === '#/admin/login' || hash === '#admin/login') {
      return '/admin/login';
    }
    if (
      path === '/prototype' ||
      hash === '#/prototype' ||
      hash === '#prototype' ||
      path === '/questionnaire' ||
      hash === '#/questionnaire' ||
      hash === '#questionnaire'
    ) {
      return '/prototype';
    }
    return '/';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(() => getCurrentAdmin());

  useEffect(() => {
    const unsub = onAdminAuthChange((admin) => {
      setCurrentAdmin(admin);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/signup' || hash === '#/signup' || hash === '#signup') {
        setCurrentRoute('/signup');
      } else if (path === '/login' || hash === '#/login' || hash === '#login') {
        setCurrentRoute('/login');
      } else if (path === '/admin' || hash === '#/admin' || hash === '#admin') {
        setCurrentRoute('/admin');
      } else if (path === '/admin/login' || hash === '#/admin/login' || hash === '#admin/login') {
        setCurrentRoute('/admin/login');
      } else if (
        path === '/prototype' ||
        hash === '#/prototype' ||
        hash === '#prototype' ||
        path === '/questionnaire' ||
        hash === '#/questionnaire' ||
        hash === '#questionnaire'
      ) {
        setCurrentRoute('/prototype');
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

      {/* Route: Signup Page (Account Creation) */}
      {currentRoute === '/signup' && (
        <main className="flex-1 flex flex-col">
          <SignupPage onNavigate={navigateTo} />
        </main>
      )}

      {/* Route: Questionnaire Assessment Page */}
      {(currentRoute === '/prototype' || currentRoute === '/questionnaire') && (
        <main className="flex-1 flex flex-col">
          <QuestionnairePage onNavigate={navigateTo} />
        </main>
      )}

      {/* Route: Admin Dashboard or Admin Login */}
      {currentRoute === '/admin' && (
        <main className="flex-1 flex flex-col">
          {currentAdmin ? (
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
          {currentAdmin ? (
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

      {/* Route: Landing Page (Default & Fallback for any other route) */}
      {currentRoute !== '/login' &&
        currentRoute !== '/signup' &&
        currentRoute !== '/prototype' &&
        currentRoute !== '/questionnaire' &&
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
