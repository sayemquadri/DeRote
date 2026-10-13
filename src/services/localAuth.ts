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

import { saveActiveStudentProfile, clearStudentSession, StudentProfile } from './questionnaireService';

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
 * Student roster
 */
export const DEMO_STUDENT_ROSTER: LocalStudentAccount[] = [];

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
      saveActiveStudentProfile(profile);
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
 * Signs in student using phone & password (checking registered accounts)
 */
export function loginLocalStudent(
  phone: string,
  pass: string
): { success: boolean; error?: string; student?: LocalStudentAccount } {
  const cleanPhone = normalizePhone(phone);

  // Check registered accounts in localStorage
  const accounts = getStoredAccounts();
  const match = accounts.find((a) => a.phone === cleanPhone && a.password === pass);
  if (match) {
    match.lastLoginAt = new Date().toISOString();
    saveStoredAccounts(accounts);
    setActiveStudentSession(match);
    return { success: true, student: match };
  }

  // Provide helpful feedback if phone exists but password wrong
  const phoneExists = accounts.some((a) => a.phone === cleanPhone);
  if (phoneExists) {
    return { success: false, error: 'Incorrect password for this mobile number.' };
  }

  return {
    success: false,
    error: 'No account found with this mobile number. Please check your number or create a new account.',
  };
}

/**
 * Fallback helper for legacy compatibility
 */
export function loginAsDemoStudent(_studentId?: string): LocalStudentAccount | null {
  return null;
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
