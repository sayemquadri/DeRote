/**
 * Local Student Authentication Service for DeRote Student Insight System
 *
 * Runs 100% in-browser using localStorage without external backend dependencies
 * (no Supabase, no Firebase). Provides:
 * - Persistent student registration
 * - Indian phone number + password login
 * - Demo account login & roster
 * - Synchronized auth state across tabs and components
 */

import { saveLocalPrototypeStudent, clearStudentSession, StudentProfile } from './questionnaireService';

export interface LocalStudentAccount {
  id: string;
  fullName: string;
  classGrade: string;
  schoolName: string;
  phone: string;
  password?: string;
  email?: string;
  completedReflections?: number;
  totalReflections?: number;
  badge?: string;
  isDemo?: boolean;
  createdAt: string;
  lastLoginAt: string;
}

const REGISTERED_ACCOUNTS_KEY = 'derote_registered_accounts_v1';
const ACTIVE_USER_SESSION_KEY = 'derote_active_user_session_v1';
const AUTH_STATE_EVENT = 'derote_local_auth_changed';

/**
 * Normalizes Indian mobile number to last 10 digits
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function isValidIndianMobile(raw: string): boolean {
  const digits = normalizePhone(raw);
  return digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
}

/**
 * Built-in demo accounts available out-of-the-box
 */
export const DEMO_STUDENT_ROSTER: LocalStudentAccount[] = [
  {
    id: 'demo_aarav_10',
    fullName: 'Aarav Sharma',
    classGrade: 'Class 10',
    schoolName: 'Delhi Public School, R.K. Puram',
    phone: '9876543210',
    password: 'demo123',
    email: 'aarav.sharma.demo@derote.in',
    completedReflections: 3,
    totalReflections: 3,
    badge: 'Class 10 Senior Student',
    isDemo: true,
    createdAt: '2026-01-10T10:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'demo_ananya_09',
    fullName: 'Ananya Verma',
    classGrade: 'Class 9',
    schoolName: 'National Public School, Indiranagar',
    phone: '9876543211',
    password: 'demo123',
    email: 'ananya.verma.demo@derote.in',
    completedReflections: 2,
    totalReflections: 3,
    badge: 'Class 9 High School',
    isDemo: true,
    createdAt: '2026-01-12T10:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'demo_rohan_08',
    fullName: 'Rohan Mehta',
    classGrade: 'Class 8',
    schoolName: "St. Xavier's High School",
    phone: '9876543212',
    password: 'demo123',
    email: 'rohan.mehta.demo@derote.in',
    completedReflections: 1,
    totalReflections: 3,
    badge: 'Class 8 Middle School',
    isDemo: true,
    createdAt: '2026-01-15T10:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
  },
];

/**
 * Retrieves all registered accounts saved in browser localStorage
 */
export function getStoredAccounts(): LocalStudentAccount[] {
  try {
    const raw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalStudentAccount[];
  } catch {
    return [];
  }
}

/**
 * Saves all registered accounts in browser localStorage
 */
function saveStoredAccounts(accounts: LocalStudentAccount[]): void {
  try {
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.warn('Failed to store account in localStorage:', err);
  }
}

/**
 * Gets currently active session student
 */
export function getCurrentActiveStudent(): LocalStudentAccount | null {
  try {
    const raw = localStorage.getItem(ACTIVE_USER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LocalStudentAccount;
  } catch {
    return null;
  }
}

/**
 * Sets current active session student and fires change events
 */
export function setActiveStudentSession(student: LocalStudentAccount | null): void {
  try {
    if (student) {
      localStorage.setItem(ACTIVE_USER_SESSION_KEY, JSON.stringify(student));
      const profile: StudentProfile = {
        id: student.id,
        fullName: student.fullName,
        classGrade: student.classGrade,
        schoolName: student.schoolName,
        phone: student.phone,
      };
      saveLocalPrototypeStudent(profile);
    } else {
      localStorage.removeItem(ACTIVE_USER_SESSION_KEY);
      clearStudentSession();
    }
  } catch (err) {
    console.warn('Failed to save session:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(AUTH_STATE_EVENT, {
        detail: { student },
      })
    );
  }
}

/**
 * Registers a new student locally (in-memory & localStorage)
 */
export function registerLocalStudent(data: {
  fullName: string;
  classGrade: string;
  schoolName: string;
  phone: string;
  password?: string;
  email?: string;
}): { success: boolean; error?: string; student?: LocalStudentAccount } {
  const cleanPhone = normalizePhone(data.phone);

  if (!isValidIndianMobile(cleanPhone)) {
    return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
  }

  // Check demo roster conflict
  const inDemo = DEMO_STUDENT_ROSTER.find((d) => d.phone === cleanPhone);
  if (inDemo) {
    return {
      success: false,
      error: 'This mobile number is reserved for demo personas. Please use a different number.',
    };
  }

  const existing = getStoredAccounts();
  const duplicate = existing.find((a) => a.phone === cleanPhone);
  if (duplicate) {
    return {
      success: false,
      error: 'An account with this mobile number already exists. Please sign in.',
    };
  }

  const newAccount: LocalStudentAccount = {
    id: `student_local_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fullName: data.fullName.trim(),
    classGrade: data.classGrade.trim(),
    schoolName: data.schoolName.trim(),
    phone: cleanPhone,
    password: data.password || 'password123',
    email: data.email || `${cleanPhone}@student.derote.local`,
    completedReflections: 0,
    totalReflections: 3,
    badge: `Class ${data.classGrade} Student`,
    isDemo: false,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  existing.push(newAccount);
  saveStoredAccounts(existing);
  setActiveStudentSession(newAccount);

  return { success: true, student: newAccount };
}

/**
 * Signs in student using phone & password (checking registered accounts + demo roster)
 */
export function loginLocalStudent(
  phone: string,
  pass: string
): { success: boolean; error?: string; student?: LocalStudentAccount } {
  const cleanPhone = normalizePhone(phone);

  // 1. Check demo accounts first
  const demo = DEMO_STUDENT_ROSTER.find((d) => d.phone === cleanPhone && d.password === pass);
  if (demo) {
    const updated = { ...demo, lastLoginAt: new Date().toISOString() };
    setActiveStudentSession(updated);
    return { success: true, student: updated };
  }

  // 2. Check registered accounts in localStorage
  const accounts = getStoredAccounts();
  const match = accounts.find((a) => a.phone === cleanPhone && a.password === pass);
  if (match) {
    match.lastLoginAt = new Date().toISOString();
    saveStoredAccounts(accounts);
    setActiveStudentSession(match);
    return { success: true, student: match };
  }

  // Provide helpful feedback if phone exists but password wrong
  const phoneExists = accounts.some((a) => a.phone === cleanPhone) || DEMO_STUDENT_ROSTER.some((d) => d.phone === cleanPhone);
  if (phoneExists) {
    return { success: false, error: 'Incorrect password for this mobile number.' };
  }

  return {
    success: false,
    error: 'No account found with this mobile number. Please check your number or create a new account.',
  };
}

/**
 * 1-Click Login as a specific demo student
 */
export function loginAsDemoStudent(studentId: string = 'demo_aarav_10'): LocalStudentAccount {
  const target = DEMO_STUDENT_ROSTER.find((s) => s.id === studentId) || DEMO_STUDENT_ROSTER[0];
  const updated = { ...target, lastLoginAt: new Date().toISOString() };
  setActiveStudentSession(updated);
  return updated;
}

/**
 * Signs out current student
 */
export function signOutLocalStudent(): void {
  setActiveStudentSession(null);
}

/**
 * Listen for auth state changes
 */
export function onLocalAuthChange(callback: (student: LocalStudentAccount | null) => void): () => void {
  // Initial fire
  callback(getCurrentActiveStudent());

  const handler = (event: Event) => {
    const custom = event as CustomEvent<{ student: LocalStudentAccount | null }>;
    if (custom.detail !== undefined) {
      callback(custom.detail.student);
    } else {
      callback(getCurrentActiveStudent());
    }
  };

  const storageHandler = (e: StorageEvent) => {
    if (e.key === ACTIVE_USER_SESSION_KEY) {
      callback(getCurrentActiveStudent());
    }
  };

  window.addEventListener(AUTH_STATE_EVENT, handler);
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(AUTH_STATE_EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
}
